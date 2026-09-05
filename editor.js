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

  // Musik status UI
  const track = typeof getMusicForTemplate === 'function'
    ? getMusicForTemplate(project.templateId || 'untuk-kamu')
    : null;
  const musicStatus = document.getElementById('musicStatus');
  const unlockMusicBtn = document.getElementById('unlockMusicBtn');
  const musicTrackInfo = document.getElementById('musicTrackInfo');

  function refreshMusicUI() {
    if (!musicStatus || !unlockMusicBtn) return;
    if (project.musicEnabled) {
      musicStatus.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#34d399;"></i> Musik aktif. Saat link dibuka, lagu bisa langsung bunyi.';
      unlockMusicBtn.classList.add('hidden');
      if (musicTrackInfo && track) {
        musicTrackInfo.classList.remove('hidden');
        musicTrackInfo.textContent = 'Lagu: ' + track.title;
      }
    } else {
      musicStatus.innerHTML = 'Musik belum aktif. Bayar <strong>Rp500</strong> agar lagu otomatis tersedia di link yang dibagikan.';
      unlockMusicBtn.classList.remove('hidden');
      if (musicTrackInfo) musicTrackInfo.classList.add('hidden');
    }
  }
  refreshMusicUI();

  if (unlockMusicBtn) {
    unlockMusicBtn.addEventListener('click', async () => {
      if (!project.id) {
        showToast('Simpan project dulu di mode online, lalu unlock musik', 'warning');
        return;
      }
      if (!confirm('Aktifkan musik untuk project ini seharga Rp500?')) return;
      unlockMusicBtn.disabled = true;
      unlockMusicBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
      const res = await unlockProjectMusic(project.id, user.uid);
      if (res.success) {
        project.musicEnabled = true;
        showToast(res.already ? 'Musik sudah aktif' : 'Musik berhasil diaktifkan!', 'success');
        refreshMusicUI();
      } else {
        showToast(res.error || 'Gagal unlock musik', 'error');
        if ((res.error || '').includes('Saldo')) {
          setTimeout(() => navigateTo('topup.html'), 1200);
        }
      }
      unlockMusicBtn.disabled = false;
      unlockMusicBtn.innerHTML = '<i class="fa-solid fa-unlock"></i> Aktifkan Musik — Rp500';
    });
  }
  

  // ===== Kode Akses (PIN) =====
  const pinInput = document.getElementById('accessPinInput');
  const savePinBtn = document.getElementById('savePinBtn');
  const clearPinBtn = document.getElementById('clearPinBtn');
  const currentPinValue = document.getElementById('currentPinValue');

  function refreshPinUI() {
    if (!currentPinValue) return;
    const code = project.accessCode || '';
    if (code) {
      currentPinValue.textContent = code;
      currentPinValue.style.letterSpacing = '0.15em';
    } else {
      currentPinValue.textContent = 'Belum diset (terbuka)';
      currentPinValue.style.letterSpacing = 'normal';
    }
    if (pinInput && code) pinInput.value = code;
  }
  refreshPinUI();

  async function saveAccessCode(newCode) {
    if (!project.id || !db) {
      showToast('Mode online diperlukan untuk menyimpan kode', 'warning');
      return false;
    }
    try {
      await db.collection('projects').doc(project.id).update({
        accessCode: newCode,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      project.accessCode = newCode;
      refreshPinUI();
      return true;
    } catch (e) {
      showToast(e.message || 'Gagal menyimpan kode', 'error');
      return false;
    }
  }

  if (savePinBtn) {
    savePinBtn.addEventListener('click', async () => {
      const raw = (pinInput.value || '').trim();
      if (!/^\d{4,12}$/.test(raw)) {
        showToast('Kode harus 4–12 digit angka', 'error');
        return;
      }
      savePinBtn.disabled = true;
      const ok = await saveAccessCode(raw);
      if (ok) showToast('Kode akses disimpan', 'success');
      savePinBtn.disabled = false;
    });
  }

  if (clearPinBtn) {
    clearPinBtn.addEventListener('click', async () => {
      if (!project.accessCode) {
        showToast('Belum ada kode yang diset', 'info');
        return;
      }
      if (!confirm('Hapus kode akses? Link akan terbuka tanpa kode.')) return;
      clearPinBtn.disabled = true;
      const ok = await saveAccessCode('');
      if (ok) {
        if (pinInput) pinInput.value = '';
        showToast('Kode dihapus. Project terbuka untuk semua.', 'success');
      }
      clearPinBtn.disabled = false;
    });
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
    
    // Foto via sessionStorage biar URL tidak terlalu panjang
    if (photoDataUrl) {
      try {
        sessionStorage.setItem('uk_photo_preview', photoDataUrl);
        qs.set('photoKey', 'uk_photo_preview');
      } catch(e) {
        // fallback kalau sessionStorage penuh
        if (photoDataUrl.length < 2000) qs.set('photo', photoDataUrl);
      }
    }
    
    const activeSwatch = document.querySelector('.color-swatch.active');
    if (activeSwatch && activeSwatch.dataset.color) {
      qs.set('color', activeSwatch.dataset.color);
    }
    
    if (!project.isFree) qs.set('hideBranding', '1');
    if (project.musicEnabled && track) {
      qs.set('music', '1');
      qs.set('musicUrl', track.url);
    }
    
    const templateId = project.templateId || 'untuk-kamu';
    document.getElementById('previewFrame').src = `${templateId}.html?${qs.toString()}`;
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
    
    const activeSwatch = document.querySelector('.color-swatch.active');
    const themeColor = activeSwatch ? (activeSwatch.dataset.color || activeSwatch.style.backgroundColor || '') : '';
    
    const newData = {
      title: document.getElementById('editTitle').value,
      name: document.getElementById('editName').value,
      message: document.getElementById('editMessage').value,
      photo: photoDataUrl || null,
      themeColor: themeColor || null
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
