// Firebase Configuration
// Ganti nilai di bawah dengan konfigurasi Firebase project Anda sendiri
// Dapatkan dari Firebase Console > Project Settings > General > Your apps

const firebaseConfig = {
  apiKey: "AIzaSyDXE1aOJSap2o9tvoRBR4XVvetPT43Cjts",
  authDomain: "untukkamu-751db.firebaseapp.com",
  projectId: "untukkamu-751db",
  storageBucket: "untukkamu-751db.firebasestorage.app",
  messagingSenderId: "400239721256",
  appId: "1:400239721256:web:8a2b87d6fe68054f4e6e1d",
  measurementId: "G-KMGH71TFSQ"
};

// ===== ImgBB API Key (mudah diganti di sini) =====
const IMGBB_API_KEY = "8b13b584cdf42031718bc034eefcef14";

// Initialize Firebase (using compat for simpler multi-page setup)
// CATATAN: Tidak pakai Firebase Storage (Spark plan). Semua upload gambar via ImgBB.
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
}

// Export references
const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;
const db = typeof firebase !== 'undefined' ? firebase.firestore() : null;

// Admin email (server-side validation still required via Firestore Rules)
const ADMIN_EMAIL = "untukkamuu521@gmail.com";

// Theme persistence
function initTheme() {
  const saved = localStorage.getItem('uk_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('uk_theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const icons = document.querySelectorAll('.theme-toggle i');
  icons.forEach(icon => {
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  });
}

// Page loader
function showLoader() {
  const loader = document.getElementById('page-loader');
  if (loader) {
    loader.classList.remove('hidden');
  }
}

function hideLoader() {
  const loader = document.getElementById('page-loader');
  if (loader) {
    loader.classList.add('hidden');
  }
}

// Navigation with loader
function navigateTo(url) {
  showLoader();
  setTimeout(() => {
    window.location.href = url;
  }, 350);
}

// Toast notification
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const icons = {
    success: 'fa-check',
    error: 'fa-xmark',
    warning: 'fa-circle-info',
    info: 'fa-circle-info'
  };
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${icons[type] || icons.info}"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Format Rupiah
function formatRupiah(num) {
  return 'Rp' + Number(num || 0).toLocaleString('id-ID');
}

// Generate random project code
function generateProjectCode(length = 7) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ===== ImgBB Upload Helper =====
async function uploadToImgBB(fileOrBase64) {
  if (!IMGBB_API_KEY) throw new Error('IMGBB_API_KEY belum diset');
  const formData = new FormData();
  if (typeof fileOrBase64 === 'string') {
    const pure = fileOrBase64.replace(/^data:image\/\w+;base64,/, '');
    formData.append('image', pure);
  } else {
    formData.append('image', fileOrBase64);
  }
  const res = await fetch('https://api.imgbb.com/1/upload?key=' + IMGBB_API_KEY, {
    method: 'POST',
    body: formData
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error((json.error && json.error.message) || 'Upload ImgBB gagal');
  }
  return json.data.url;
}

function enhanceTopBar() {
  const bar = document.querySelector('.top-bar');
  if (!bar) return;
  if (bar.querySelector('.top-bar-right')) return;

  const existingToggle = bar.querySelector('.theme-toggle');
  const right = document.createElement('div');
  right.className = 'top-bar-right';
  right.innerHTML = `
    <div class="top-bar-balance">
      <span class="user-balance">Rp0</span>
      <button type="button" class="topup-plus-btn" title="Top up" aria-label="Top up">
        <i class="fa-solid fa-plus"></i>
      </button>
    </div>
    <button class="theme-toggle" aria-label="Ganti tema"><i class="fa-solid fa-moon"></i></button>
    <div class="more-menu-wrap">
      <button type="button" class="more-menu-btn" aria-label="Menu lain">
        <span></span><span></span><span></span>
      </button>
      <div class="more-dropdown">
        <a href="lapor-bug.html" data-nav><i class="fa-solid fa-bug"></i> Lapor Bug</a>
        <a href="https://wruntukkamu.vercel.app" target="_blank" rel="noopener"><i class="fa-solid fa-shield-halved"></i> Website resmi</a>
        <a href="riwayat.html" data-nav><i class="fa-solid fa-clock-rotate-left"></i> Riwayat</a>
        <a href="admin.html" class="admin-only hidden" data-nav><i class="fa-solid fa-gear"></i> Admin Panel</a>
      </div>
    </div>
  `;
  if (existingToggle) existingToggle.remove();
  bar.appendChild(right);

  const plus = right.querySelector('.topup-plus-btn');
  if (plus) plus.addEventListener('click', () => navigateTo('topup.html'));

  const moreBtn = right.querySelector('.more-menu-btn');
  const drop = right.querySelector('.more-dropdown');
  if (moreBtn && drop) {
    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      drop.classList.toggle('open');
    });
    document.addEventListener('click', () => drop.classList.remove('open'));
  }

  right.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.getAttribute('href'));
    });
  });

  updateThemeIcon(document.documentElement.getAttribute('data-theme') || 'light');
}

// Init on every page
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  enhanceTopBar();
  hideLoader();
  setTimeout(hideLoader, 1200);
  window.addEventListener('load', hideLoader);
  
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });
  
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const icon = toggle.querySelector('i');
      if (icon) {
        icon.className = mobileMenu.classList.contains('open') 
          ? 'fa-solid fa-xmark' 
          : 'fa-solid fa-bars';
      }
    });
  }
  
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.getAttribute('href'));
    });
  });
});
