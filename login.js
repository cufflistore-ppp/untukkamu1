document.addEventListener('DOMContentLoaded', async () => {
  // Tampilkan error auth terakhir (jika ada)
  try {
    const err = sessionStorage.getItem('uk_auth_err');
    if (err) {
      sessionStorage.removeItem('uk_auth_err');
      const [code, msg] = err.split('|');
      const box = document.getElementById('loginError') || document.getElementById('registerError');
      if (box) {
        box.textContent = (code ? code + ': ' : '') + (msg || 'Login Google gagal');
        box.classList.add('show');
      }
      if (typeof showToast === 'function') showToast(msg || 'Login Google gagal', 'error');
    }
  } catch (e) {}

  // Always hide loader
  if (typeof hideLoader === 'function') hideLoader();
  setTimeout(() => {
    const l = document.getElementById('page-loader');
    if (l) l.classList.add('hidden');
  }, 400);

  // Handle Google redirect result + cek session (penting di mobile)
  try {
    const redirectedUser = await handleRedirectResult();
    if (redirectedUser) {
      showToast('Berhasil masuk!', 'success');
      navigateTo('index.html');
      return;
    }
  } catch (e) {
    console.warn('Redirect handle error:', e);
  }

  try {
    const user = await Promise.race([
      getCurrentUser(),
      new Promise(r => setTimeout(() => r(null), 4000))
    ]);
    if (user) {
      navigateTo('index.html');
      return;
    }
  } catch (e) {
    console.warn('Auth check failed:', e);
  }
  
  const form = document.getElementById('loginForm');
  const errorEl = document.getElementById('loginError');
  const loginBtn = document.getElementById('loginBtn');
  const googleBtn = document.getElementById('googleLoginBtn');
  
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.classList.remove('show');
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    try {
      const result = await loginWithEmail(email, password);
      if (result.success) {
        showToast('Berhasil masuk!', 'success');
        navigateTo('index.html');
      } else {
        errorEl.textContent = result.error || 'Gagal masuk';
        errorEl.classList.add('show');
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Masuk';
      }
    } catch (err) {
      errorEl.textContent = 'Terjadi kesalahan. Coba lagi.';
      errorEl.classList.add('show');
      loginBtn.disabled = false;
      loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Masuk';
    }
  });
  
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      googleBtn.disabled = true;
      googleBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
      try {
        const result = await loginWithGoogle();
        if (result.success) {
          if (result.redirect) {
            // Mobile: akan redirect, biarkan
            showToast('Mengarahkan ke Google...', 'info');
          } else {
            showToast('Berhasil masuk!', 'success');
            navigateTo('index.html');
          }
        } else {
          showToast(result.error || 'Gagal masuk dengan Google', 'error');
          googleBtn.disabled = false;
          googleBtn.innerHTML = '<i class="fa-brands fa-google"></i> Masuk dengan Google';
        }
      } catch (e) {
        showToast('Gagal masuk dengan Google', 'error');
        googleBtn.disabled = false;
        googleBtn.innerHTML = '<i class="fa-brands fa-google"></i> Masuk dengan Google';
      }
    });
  }
});
