// Nomor WhatsApp admin (format internasional tanpa +)
// GANTI dengan nomor WhatsApp kamu
const ADMIN_WA = '628xxxxxxxxxx'; // <-- isi nomor WA admin di sini

document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireAuth();
  if (!user) return;
  
  // Load balance
  const profile = await getUserProfile(user.uid);
  if (profile) {
    document.querySelectorAll('.user-balance').forEach(el => {
      el.textContent = formatRupiah(profile.balance || 0);
    });
  }
  
  const nominalInput = document.getElementById('nominal');
  const errorEl = document.getElementById('nominalError');
  const waBtn = document.getElementById('waConfirmBtn');
  
  function validateNominal() {
    const val = parseInt(nominalInput.value, 10);
    errorEl.classList.remove('show');
    
    if (!val || isNaN(val)) {
      waBtn.disabled = true;
      return false;
    }
    
    if (val < 2000) {
      errorEl.innerHTML = '<i class="fa-solid fa-circle-info"></i> Saldo minimal isi Rp2.000';
      errorEl.classList.add('show');
      waBtn.disabled = true;
      return false;
    }
    
    if (val > 1000000) {
      errorEl.innerHTML = '<i class="fa-solid fa-circle-info"></i> Saldo maksimal isi Rp1.000.000';
      errorEl.classList.add('show');
      waBtn.disabled = true;
      return false;
    }
    
    waBtn.disabled = false;
    return true;
  }
  
  nominalInput.addEventListener('input', validateNominal);
  
  waBtn.addEventListener('click', async () => {
    if (!validateNominal()) return;
    
    const nominal = parseInt(nominalInput.value, 10);
    const email = user.email || '-';
    const name = user.displayName || email;
    
    // Simpan request topup ke Firestore (status PENDING, tanpa bukti)
    if (db) {
      try {
        await db.collection('topups').add({
          userId: user.uid,
          email: email,
          nominal: nominal,
          proofURL: null,
          status: 'PENDING',
          method: 'whatsapp',
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          reviewedAt: null,
          reviewedBy: null
        });
      } catch (e) {
        console.error('Gagal simpan topup:', e);
      }
    }
    
    // Buat pesan WhatsApp
    const pesan =
`Halo Admin Untuk Kamu

Saya ingin top up saldo:

Nama: ${name}
Email: ${email}
Nominal: ${formatRupiah(nominal)}

Berikut bukti transfernya (kirim foto).
Mohon diproses, terima kasih.`;
    
    const waUrl = 'https://wa.me/' + ADMIN_WA + '?text=' + encodeURIComponent(pesan);
    
    showToast('Membuka WhatsApp...', 'info');
    window.open(waUrl, '_blank');
  });
});
