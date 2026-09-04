document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireAuth();
  if (!user) return;
  
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const templateParam = params.get('template') || 'untuk-kamu';
  
  if (!code) {
    showToast('Kode project tidak ditemukan', 'error');
    navigateTo('proyek.html');
    return;
  }
  
  let project = null;
  let photoDataUrl = null;
  
  // Load project
  if (db) {
    try {
      const snap = await db.collection('projects').where('code', '==', code).where('ownerId', '==', user.uid).limit(1).get();
      if (!snap.empty) {
        project = { id: snap.docs[0].id, ...snap.docs[0].data() };
      }
    } catch (e) {
      console.error(e);
    }
  }
  
  // Demo mode
  if (!project) {
    project = {
      code,
      templateId: templateParam,
      isFree: true,
      maxEdits: 999,
      editsUsed: 0,
      data: {
        title: 'Untuk Kamu',
        name: 'Seseorang yang spesial',
        message: 'Terima kasih sudah menjadi bagian dari hidupku.'
      }
    };
  }
  
  // Check edit limit
  const maxEdits = project.maxEdits || (project.isFree ? 999 : 2);
  const editsUsed = project.editsUsed || 0;
  
  if (editsUsed >= maxEdits) {
    showToast('Project terkunci. Batas edit sudah tercapai.', 'warning');
    document.getElementById('saveBtn').disabled = true;
    document.getElementById('saveBtn').innerHTML = '<i class="fa-solid fa-lock"></i> Terkunci';
  }
  
  document.getElementById('editCounter').textContent = 
    maxEdits >= 999 ? 'Edit tanpa batas' : `Edit: ${editsUsed}/${maxEdits}`;
  
  // Fill form
  const data = project.data || {};
  document.getElementById('editTitle').value = data.title || '';
  document.getElementById('editName').value = data.name || data.recipient || '';
  document.getElementById('editMessage').value = data.message || '';
  if (data.photo) {
    photoDataUrl = data.photo;
    document.getElementById('photoPreview').src = data.photo;
    document.getElementById('photoPreviewBox').classList.remove('hidden');
  }
  
  // Live preview
  function updatePreview() {
    const title = document.getElementById('editTitle').value;
    const name = document.getElementById('editName').value;
    const message = document.getElementById('editMessage').value;
    
    const qs = new URLSearchParams();
    if (title) qs.set('title', title);
    if (name) qs.set(project.templateId === 'nembak' ? 'name' : 'recipient', name);
    if (message) qs.set('message', message);
    if (photoDataUrl) qs.set('photo', photoDataUrl);
    if (!project.isFree) qs.set('hideBranding', '1');
    
    const templateId = project.templateId || 'untuk-kamu';
    document.getElementById('previewFrame').src = `templates/${templateId}/index.html?${qs.toString()}`;
  }
  
  ['editTitle', 'editName', 'editMessage'].forEach(id => {
    document.getElementById(id).addEventListener('input', updatePreview);
  });
  
  // Photo handling
  document.getElementById('editPhoto').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Compress
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 800;
        let w = img.width, h = img.height;
        if (w > maxSize || h > maxSize) {
          if (w > h) { h = h * maxSize / w; w = maxSize; }
          else { w = w * maxSize / h; h = maxSize; }
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        photoDataUrl = canvas.toDataURL('image/jpeg', 0.75);
        document.getElementById('photoPreview').src = photoDataUrl;
        document.getElementById('photoPreviewBox').classList.remove('hidden');
        updatePreview();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
  
  document.getElementById('removePhoto').addEventListener('click', () => {
    photoDataUrl = null;
    document.getElementById('editPhoto').value = '';
    document.getElementById('photoPreviewBox').classList.add('hidden');
    updatePreview();
  });
  
  // Color swatches
  document.querySelectorAll('.color-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
    });
  });
  
  // Preview button
  document.getElementById('previewBtn').addEventListener('click', () => {
    window.open(`p.html?code=${code}`, '_blank');
  });
  
  // Save
  document.getElementById('saveBtn').addEventListener('click', async () => {
    if (editsUsed >= maxEdits) {
      showToast('Batas edit sudah tercapai', 'error');
      return;
    }
    
    const btn = document.getElementById('saveBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';
    
    const newData = {
      title: document.getElementById('editTitle').value,
      name: document.getElementById('editName').value,
      message: document.getElementById('editMessage').value,
      photo: photoDataUrl || null
    };
    
    if (!db || !project.id) {
      showToast('Mode demo: Perubahan disimpan sementara', 'info');
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Simpan';
      return;
    }
    
    try {
      // Server-side edit limit check should be in Cloud Function
      // This is client-side structure
      await db.collection('projects').doc(project.id).update({
        data: newData,
        editsUsed: firebase.firestore.FieldValue.increment(1),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      showToast('Project berhasil disimpan!', 'success');
      document.getElementById('editCounter').textContent = 
        maxEdits >= 999 ? 'Edit tanpa batas' : `Edit: ${editsUsed + 1}/${maxEdits}`;
      
      if (editsUsed + 1 >= maxEdits) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-lock"></i> Terkunci';
      } else {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Simpan';
      }
    } catch (e) {
      console.error(e);
      showToast('Gagal menyimpan', 'error');
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Simpan';
    }
  });
  
  // Initial preview
  updatePreview();
});
