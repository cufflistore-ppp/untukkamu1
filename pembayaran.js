document.addEventListener('DOMContentLoaded', async () => {
  const user = await getCurrentUser();
  if (!user) {
    showToast('Silakan login terlebih dahulu', 'warning');
    setTimeout(() => navigateTo('login.html'), 1200);
    return;
  }

  const nominal = parseInt(sessionStorage.getItem('uk_topup_nominal'), 10);
  if (!nominal || nominal < 2000) {
    showToast('Nominal tidak valid', 'error');
    setTimeout(() => navigateTo('topup.html'), 1200);
    return;
  }

  document.getElementById('displayNominal').textContent = formatRupiah(nominal);

  let selectedFile = null;

  const uploadArea = document.getElementById('buktiUploadArea');
  const fileInput = document.getElementById('buktiFile');
  const preview = document.getElementById('buktiPreview');
  const previewImg = document.getElementById('buktiPreviewImg');
  const submitBtn = document.getElementById('submitBuktiBtn');

  uploadArea.addEventListener('click', () => fileInput.click());
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--primary)';
  });
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = 'var(--border)';
  });
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--border)';
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) handleFile(fileInput.files[0]);
  });

  function handleFile(file) {
    if (!file.type.startsWith('image/')) {
      showToast('File harus berupa gambar', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran maksimal 5MB', 'error');
      return;
    }
    selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      preview.style.display = 'block';
      submitBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  }

  submitBtn.addEventListener('click', async () => {
    if (!selectedFile || !db) return;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengupload...';

    try {
      // Upload ke ImgBB
      const buktiUrl = await uploadToImgBB(selectedFile);

      // Simpan ke Firestore topups
      await db.collection('topups').add({
        userId: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        nominal: nominal,
        buktiUrl: buktiUrl,
        status: 'PENDING',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      showToast('Bukti TF berhasil diupload ke sistem! Admin akan konfirmasi di panel. Tidak perlu WhatsApp.', 'success');
      const formCard = document.getElementById('buktiFormCard');
      const okCard = document.getElementById('buktiSuccessCard');
      if (formCard) formCard.classList.add('hidden');
      if (okCard) okCard.classList.remove('hidden');
      sessionStorage.removeItem('uk_topup_nominal');
      setTimeout(() => navigateTo('riwayat.html'), 1500);
      setTimeout(() => navigateTo('profile.html'), 1500);
    } catch (err) {
      console.error(err);
      showToast('Gagal mengirim bukti: ' + (err.message || 'Coba lagi'), 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Bukti Transfer';
    }
  });
});
