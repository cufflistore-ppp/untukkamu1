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
  let photoDataUrl = null; // legacy single
  let photoList = []; // multi-foto (max dari template)
  let maxPhotos = 1;
  
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
  maxPhotos = project.maxPhotos || (data.photos && data.photos.length > 1 ? data.photos.length : 1) || 1;
  // deteksi template album dari id
  const tid = project.templateId || '';
  if (/album|polaroid|strip|squad|timeline|family-album/.test(tid)) {
    const m = tid.match(/(\d)/);
    if (m) maxPhotos = Math.max(maxPhotos, parseInt(m[1], 10));
    if (/album-5|polaroid-5|squad|family-album/.test(tid)) maxPhotos = Math.max(maxPhotos, 5);
    if (/album-3|polaroid-3/.test(tid)) maxPhotos = Math.max(maxPhotos, 3);
    if (/strip|timeline|ultah-album/.test(tid)) maxPhotos = Math.max(maxPhotos, 4);
  }
  const limitLabel = document.getElementById('photoLimitLabel');
  if (limitLabel) limitLabel.textContent = '(maks ' + maxPhotos + ')';

  function renderPhotoPreviews() {
    const box = document.getElementById('photoPreviewBox');
    const grid = document.getElementById('photoPreviewGrid');
    if (!box || !grid) return;
    if (!photoList.length) {
      box.classList.add('hidden');
      grid.innerHTML = '';
      return;
    }
    box.classList.remove('hidden');
    grid.innerHTML = photoList.map((src, i) =>
      '<div style="position:relative;">' +
      '<img src="' + src + '" style="width:72px;height:72px;object-fit:cover;border-radius:10px;border:1px solid var(--border-color);">' +
      '<button type="button" class="btn btn-danger btn-sm remove-one-photo" data-i="' + i + '" style="position:absolute;top:-6px;right:-6px;padding:0.15rem 0.35rem;font-size:0.7rem;border-radius:50%;"><i class="fa-solid fa-xmark"></i></button>' +
      '</div>'
    ).join('');
    grid.querySelectorAll('.remove-one-photo').forEach(btn => {
      btn.addEventListener('click', () => {
        photoList.splice(parseInt(btn.dataset.i, 10), 1);
        photoDataUrl = photoList[0] || null;
        renderPhotoPreviews();
        updatePreview();
      });
    });
  }

  if (Array.isArray(data.photos) && data.photos.length) {
    photoList = data.photos.slice(0, maxPhotos);
    photoDataUrl = photoList[0] || null;
    renderPhotoPreviews();
  } else if (data.photo) {
    photoDataUrl = data.photo;
    photoList = [data.photo];
    renderPhotoPreviews();
  }

  // Video field untuk template premium (hasVideo / harga tinggi)
  const videoSection = document.getElementById('videoSection');
  const videoInput = document.getElementById('editVideoUrl');
  const isVideoTpl = !!(project.hasVideo || (project.price && project.price >= 15000) || /video|premium/i.test(project.templateId || ''));
  if (videoSection && isVideoTpl) {
    videoSection.classList.remove('hidden');
    if (videoInput && data.videoUrl) videoInput.value = data.videoUrl;
  }
  if (videoInput) videoInput.addEventListener('input', updatePreview);

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

  function playMusicPayAnimation(success) {
    if (!unlockMusicBtn) return;
    unlockMusicBtn.classList.add('paying');
    const colors = ['#f472b6', '#a78bfa', '#38bdf8', '#fbbf24', '#34d399'];
    const rect = unlockMusicBtn.getBoundingClientRect();
    for (let i = 0; i < 18; i++) {
      const el = document.createElement('span');
      el.className = 'uk-confetti-piece';
      el.style.left = (rect.left + rect.width / 2 + (Math.random() * 60 - 30)) + 'px';
      el.style.top = (rect.top + window.scrollY) + 'px';
      el.style.background = colors[i % colors.length];
      el.style.animationDelay = (Math.random() * 0.25) + 's';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1100);
    }
    if (success) {
      setTimeout(() => {
        unlockMusicBtn.classList.remove('paying');
        unlockMusicBtn.classList.add('success-pop');
        unlockMusicBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Musik Aktif!';
      }, 400);
    }
  }

  if (unlockMusicBtn) {
    unlockMusicBtn.addEventListener('click', async () => {
      if (!project.id) {
        showToast('Simpan project dulu di mode online, lalu unlock musik', 'warning');
        return;
      }
      if (!confirm('Aktifkan musik untuk project ini seharga Rp500?')) return;
      unlockMusicBtn.disabled = true;
      unlockMusicBtn.classList.add('paying');
      unlockMusicBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
      const res = await unlockProjectMusic(project.id, user.uid);
      if (res.success) {
        project.musicEnabled = true;
        playMusicPayAnimation(true);
        showToast(res.already ? 'Musik sudah aktif' : 'Musik berhasil diaktifkan!', 'success');
        setTimeout(refreshMusicUI, 900);
      } else {
        unlockMusicBtn.classList.remove('paying');
        showToast(res.error || 'Gagal unlock musik', 'error');
        if ((res.error || '').includes('Saldo')) {
          setTimeout(() => navigateTo('topup.html'), 1200);
        }
        unlockMusicBtn.disabled = false;
        unlockMusicBtn.innerHTML = '<i class="fa-solid fa-unlock"></i> Aktifkan Musik — Rp500';
      }
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
    
    // Foto (single + multi) via sessionStorage
    if (photoList.length > 1) {
      try {
        sessionStorage.setItem('uk_photos_preview', JSON.stringify(photoList));
        qs.set('photosKey', 'uk_photos_preview');
        sessionStorage.setItem('uk_photo_preview', photoList[0]);
        qs.set('photoKey', 'uk_photo_preview');
      } catch(e) {}
    } else if (photoList.length === 1 || photoDataUrl) {
      const one = photoList[0] || photoDataUrl;
      try {
        sessionStorage.setItem('uk_photo_preview', one);
        qs.set('photoKey', 'uk_photo_preview');
      } catch(e) {
        if (one && one.length < 2000) qs.set('photo', one);
      }
    }
    
    const hexEl = document.getElementById('colorHex');
    const pickerEl = document.getElementById('colorPicker');
    const activeSwatch = document.querySelector('.color-swatch.active');
    const themeColor = (hexEl && hexEl.value) || (pickerEl && pickerEl.value) || (activeSwatch && activeSwatch.dataset.color) || '';
    if (themeColor) qs.set('color', themeColor);

    const vidEl = document.getElementById('editVideoUrl');
    if (vidEl && vidEl.value.trim()) qs.set('video', vidEl.value.trim());
    
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
  function compressImageFile(file) {
    return new Promise((resolve, reject) => {
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
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.75));
        };
        img.onerror = reject;
        img.src = ev.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  document.getElementById('editPhoto').addEventListener('change', async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const room = Math.max(0, maxPhotos - photoList.length);
    if (room <= 0) {
      showToast('Maksimal ' + maxPhotos + ' foto untuk template ini', 'warning');
      e.target.value = '';
      return;
    }
    const take = files.slice(0, room);
    for (const file of take) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const dataUrl = await compressImageFile(file);
        photoList.push(dataUrl);
      } catch (err) {
        console.warn(err);
      }
    }
    photoDataUrl = photoList[0] || null;
    renderPhotoPreviews();
    updatePreview();
    e.target.value = '';
  });
  
  document.getElementById('removePhoto').addEventListener('click', () => {
    photoDataUrl = null;
    photoList = [];
    document.getElementById('editPhoto').value = '';
    renderPhotoPreviews();
    updatePreview();
  });
  
  function setThemeColor(hex) {
    if (!hex) return;
    if (!hex.startsWith('#')) hex = '#' + hex;
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex) && !/^#[0-9A-Fa-f]{3}$/.test(hex)) return;
    const picker = document.getElementById('colorPicker');
    const hexInput = document.getElementById('colorHex');
    if (picker) picker.value = hex.length === 4
      ? '#' + hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3]
      : hex;
    if (hexInput) hexInput.value = picker ? picker.value : hex;
    document.querySelectorAll('.color-swatch').forEach(s => {
      s.classList.toggle('active', (s.dataset.color || '').toLowerCase() === (picker ? picker.value : hex).toLowerCase());
    });
    updatePreview();
  }

  if (data.themeColor) setThemeColor(data.themeColor);

  document.querySelectorAll('.color-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      setThemeColor(sw.dataset.color);
    });
  });

  const colorPicker = document.getElementById('colorPicker');
  const colorHex = document.getElementById('colorHex');
  if (colorPicker) {
    colorPicker.addEventListener('input', () => setThemeColor(colorPicker.value));
  }
  if (colorHex) {
    colorHex.addEventListener('change', () => setThemeColor(colorHex.value.trim()));
    colorHex.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') setThemeColor(colorHex.value.trim());
    });
  }
  
  const previewBtn = document.getElementById('previewBtn');
  if (previewBtn) {
    previewBtn.addEventListener('click', () => {
      window.open(`p.html?code=${code}`, '_blank');
    });
  }

  const copyLinkBtn = document.getElementById('copyLinkBtn');
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', async () => {
      const link = location.origin + location.pathname.replace(/[^/]*$/, '') + 'p.html?code=' + code;
      try {
        await navigator.clipboard.writeText(link);
        showToast('Link berhasil disalin!', 'success');
      } catch (e) {
        prompt('Salin link ini:', link);
      }
    });
  }
  
  // Save
  document.getElementById('saveBtn').addEventListener('click', async () => {
    if (editsUsed >= maxEdits) {
      showToast('Batas edit sudah tercapai', 'error');
      return;
    }
    
    const btn = document.getElementById('saveBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';
    
    const hexEl = document.getElementById('colorHex');
    const pickerEl = document.getElementById('colorPicker');
    const activeSwatch = document.querySelector('.color-swatch.active');
    const themeColor = (hexEl && hexEl.value) || (pickerEl && pickerEl.value) || (activeSwatch && activeSwatch.dataset.color) || '';
    
    const vidEl = document.getElementById('editVideoUrl');
        const newData = {
      title: document.getElementById('editTitle').value,
      name: document.getElementById('editName').value,
      message: document.getElementById('editMessage').value,
      photo: (photoList[0] || photoDataUrl || null),
      photos: photoList.slice(0, maxPhotos),
      themeColor: themeColor || null,
      videoUrl: (document.getElementById('editVideoUrl') && document.getElementById('editVideoUrl').value.trim()) || null
    };
    
    if (!db || !project.id) {
      showToast('Mode demo: Perubahan disimpan sementara', 'info');
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Simpan';
      return;
    }
    
    try {
      // Upload semua foto ke ImgBB jika masih data URL
      if (newData.photos && newData.photos.length) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Upload foto...';
        const uploaded = [];
        for (let i = 0; i < newData.photos.length; i++) {
          let p = newData.photos[i];
          if (typeof p === 'string' && p.startsWith('data:')) {
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Upload foto ' + (i+1) + '/' + newData.photos.length;
            p = await uploadToImgBB(p);
          }
          uploaded.push(p);
        }
        newData.photos = uploaded;
        newData.photo = uploaded[0] || null;
      } else if (newData.photo && typeof newData.photo === 'string' && newData.photo.startsWith('data:')) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Upload foto...';
        newData.photo = await uploadToImgBB(newData.photo);
        newData.photos = [newData.photo];
      }
      
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
