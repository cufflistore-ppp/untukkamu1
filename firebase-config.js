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

// Initialize Firebase (using compat for simpler multi-page setup)
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
}

// Export references
const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;
const db = typeof firebase !== 'undefined' ? firebase.firestore() : null;
const storage = typeof firebase !== 'undefined' ? firebase.storage() : null;

// Admin email (server-side validation still required)
const ADMIN_EMAIL = "raffliraffli649@gmail.com";

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
    setTimeout(() => loader.classList.add('hidden'), 300);
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
  return 'Rp' + Number(num).toLocaleString('id-ID');
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

// Init on every page
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  hideLoader();
  
  // Theme toggle buttons
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });
  
  // Mobile menu
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
  
  // Nav links with loader
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.getAttribute('href'));
    });
  });
});
