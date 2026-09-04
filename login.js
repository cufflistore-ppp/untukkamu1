document.addEventListener('DOMContentLoaded', async () => {
  // Redirect if already logged in
  const user = await getCurrentUser();
  if (user) {
    navigateTo('profile.html');
    return;
  }
  
  const form = document.getElementById('loginForm');
  const errorEl = document.getElementById('loginError');
  const loginBtn = document.getElementById('loginBtn');
  const googleBtn = document.getElementById('googleLoginBtn');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.classList.remove('show');
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    const result = await loginWithEmail(email, password);
    
    if (result.success) {
      showToast('Berhasil masuk!', 'success');
      navigateTo('profile.html');
    } else {
      errorEl.textContent = result.error;
      errorEl.classList.add('show');
      loginBtn.disabled = false;
      loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Masuk';
    }
  });
  
  googleBtn.addEventListener('click', async () => {
    googleBtn.disabled = true;
    googleBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
    
    const result = await loginWithGoogle();
    
    if (result.success) {
      showToast('Berhasil masuk dengan Google!', 'success');
      navigateTo('profile.html');
    } else {
      showToast(result.error, 'error');
      googleBtn.disabled = false;
      googleBtn.innerHTML = '<i class="fa-brands fa-google"></i> Masuk dengan Google';
    }
  });
});
