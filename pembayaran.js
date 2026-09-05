// Nomor WhatsApp admin (format internasional tanpa +)
// GANTI dengan nomor WhatsApp kamu yang aktif
const ADMIN_WA = '628xxxxxxxxxx'; // <-- GANTI NOMOR INI

document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireAuth();
  if (!user) return;
  
  // Ambil nominal dari sessionStorage
  const nominal = parseInt(sessionStorage.getItem('uk_topup_nominal'), 10);
  
  if (!nominal || isNaN(nominal) || nominal < 2000) {
    showToast('Nominal tidak valid. Silakan isi ulang.', 'warning');
    setTimeout(() => navigateTo('topup.html'), 1200);
    return;
  }
  
  // Tampilkan nominal
  document.getElementById('displayNominal').textContent = formatRupiah(nominal);
  
  const waBtn = document.getElementById('waConfirmBtn');
  
  waBtn.addEventListener('click', async () => {
    const email = user.email || '-';
    const name = user.displayName || email;
    
    // Simpan request topup ke Firestore
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
