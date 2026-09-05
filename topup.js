// Nomor WhatsApp admin (format internasional tanpa +)
// GANTI dengan nomor WhatsApp kamu yang aktif
const ADMIN_WA = '628xxxxxxxxxx'; // <-- GANTI NOMOR INI

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
  const lanjutBtn = document.getElementById('lanjutBayarBtn');
  
  function validateNominal() {
    const val = parseInt(nominalInput.value, 10);
    errorEl.classList.remove('show');
    
    if (!val || isNaN(val)) {
      lanjutBtn.disabled = true;
      return false;
    }
    
    if (val < 2000) {
      errorEl.innerHTML = '<i class="fa-solid fa-circle-info"></i> Minimal Rp2.000';
      errorEl.classList.add('show');
      lanjutBtn.disabled = true;
      return false;
    }
    
    if (val > 1000000) {
      errorEl.innerHTML = '<i class="fa-solid fa-circle-info"></i> Maksimal Rp1.000.000';
      errorEl.classList.add('show');
      lanjutBtn.disabled = true;
      return false;
    }
    
    lanjutBtn.disabled = false;
    return true;
  }
  
  nominalInput.addEventListener('input', validateNominal);
  
  // Quick amount buttons
  document.querySelectorAll('.quick-amount').forEach(btn => {
    btn.addEventListener('click', () => {
      nominalInput.value = btn.dataset.amount;
      validateNominal();
    });
  });
  
  lanjutBtn.addEventListener('click', () => {
    if (!validateNominal()) return;
    const nominal = parseInt(nominalInput.value, 10);
    // Simpan nominal ke sessionStorage lalu pindah ke halaman pembayaran
    sessionStorage.setItem('uk_topup_nominal', nominal);
    navigateTo('pembayaran.html');
  });
});
