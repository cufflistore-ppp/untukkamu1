document.addEventListener('DOMContentLoaded', async () => {
  // Handle Google redirect result
  try {
    const redirectedUser = await handleRedirectResult();
    if (redirectedUser) {
      showToast('Berhasil masuk!', 'success');
      navigateTo('profile.html');
      return;
    }
  } catch (e) {}

  const user = await getCurrentUser();
  if (user) {
    navigateTo('profile.html');
    return;
  }
  
  const form = document.getElementById('registerForm');
  const errorEl = document.getElementById('registerError');
  const registerBtn = document.getElementById('registerBtn');
  const googleBtn = document.getElementById('googleRegisterBtn');
  
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.classList.remove('show');
    
    const displayName = document.getElementById('displayName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    
    if (password !== passwordConfirm) {
      errorEl.textContent = 'Password tidak cocok';
      errorEl.classList.add('show');
      return;
    }
    
    if (password.length < 6) {
      errorEl.textContent = 'Password minimal 6 karakter';
      errorEl.classList.add('show');
      return;
    }
    
    registerBtn.disabled = true;
    registerBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
    
    const result = await registerWithEmail(email, password, displayName);
    
    if (result.success) {
      showToast('Pendaftaran berhasil!', 'success');
      navigateTo('profile.html');
    } else {
      errorEl.textContent = result.error;
      errorEl.classList.add('show');
      registerBtn.disabled = false;
      registerBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Daftar';
    }
  });
  
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      googleBtn.disabled = true;
      googleBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
      
      const result = await loginWithGoogle();
      
      if (result.success) {
        if (result.redirect) {
          showToast('Mengarahkan ke Google...', 'info');
        } else {
          showToast('Berhasil daftar dengan Google!', 'success');
          navigateTo('profile.html');
        }
      } else {
        showToast(result.error || 'Gagal daftar dengan Google', 'error');
        googleBtn.disabled = false;
        googleBtn.innerHTML = '<i class="fa-brands fa-google"></i> Daftar dengan Google';
      }
    });
  }
});
