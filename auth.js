// Authentication helpers

function getCurrentUser() {
  return new Promise((resolve) => {
    if (!auth) {
      resolve(null);
      return;
    }
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    });
  });
}

async function requireAuth(redirectTo = 'login.html') {
  const user = await getCurrentUser();
  if (!user) {
    showToast('Silakan login terlebih dahulu', 'warning');
    navigateTo(redirectTo);
    return null;
  }
  return user;
}

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    navigateTo('login.html');
    return null;
  }
  
  if ((user.email || '').trim().toLowerCase() !== (ADMIN_EMAIL || '').trim().toLowerCase()) {
    showToast('Akses ditolak. Hanya admin yang diizinkan.', 'error');
    navigateTo('index.html');
    return null;
  }
  
  return user;
}

async function getUserProfile(uid) {
  if (!db) return null;
  try {
    const doc = await db.collection('users').doc(uid).get();
    if (doc.exists) return { id: doc.id, ...doc.data() };
    return null;
  } catch (e) {
    console.error('getUserProfile error:', e);
    return null;
  }
}

async function createUserProfile(user) {
  if (!db || !user) return;
  try {
    const ref = db.collection('users').doc(user.uid);
    const snap = await ref.get();
    if (!snap.exists) {
      await ref.set({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'User'),
        photoURL: user.photoURL || '',
        balance: 0,
        projectCount: 0,
        purchaseCount: 0,
        role: ((user.email||'').trim().toLowerCase() === (ADMIN_EMAIL||'').trim().toLowerCase()) ? 'admin' : 'user',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  } catch (e) {
    console.error('createUserProfile error:', e);
  }
}

async function loginWithEmail(email, password) {
  try {
    const result = await auth.signInWithEmailAndPassword(email, password);
    await createUserProfile(result.user);
    return { success: true, user: result.user };
  } catch (e) {
    return { success: false, error: mapAuthError(e.code) };
  }
}

async function registerWithEmail(email, password, displayName) {
  try {
    const result = await auth.createUserWithEmailAndPassword(email, password);
    if (displayName) {
      await result.user.updateProfile({ displayName });
    }
    await createUserProfile(result.user);
    return { success: true, user: result.user };
  } catch (e) {
    return { success: false, error: mapAuthError(e.code) };
  }
}

async function loginWithGoogle() {
  try {
    if (!auth) {
      return { success: false, error: 'Firebase Auth belum siap. Refresh halaman.' };
    }

    try {
      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    } catch (pe) {
      console.warn('setPersistence', pe);
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    // Client ID terdaftar di firebase-config.js (GOOGLE_CLIENT_ID)
    if (typeof GOOGLE_CLIENT_ID !== 'undefined' && GOOGLE_CLIENT_ID) {
      try { provider.setCustomParameters(Object.assign({ prompt: 'select_account' }, {})); } catch (e) {}
    }
    provider.setCustomParameters({ prompt: 'select_account' });
    provider.addScope('email');
    provider.addScope('profile');

    try { sessionStorage.setItem('uk_after_login', 'index.html'); } catch (e) {}
    try { sessionStorage.setItem('uk_google_pending', '1'); } catch (e) {}

    // 1) Coba popup dulu (lebih andal di Chrome Android & desktop)
    try {
      const result = await auth.signInWithPopup(provider);
      if (result && result.user) {
        await createUserProfile(result.user);
        try { sessionStorage.removeItem('uk_google_pending'); } catch (e) {}
        return { success: true, user: result.user };
      }
    } catch (popupErr) {
      console.warn('Popup login gagal, coba redirect:', popupErr && popupErr.code, popupErr);
      // unauthorized-domain / operation-not-allowed → jangan redirect, tampilkan error
      if (popupErr && (popupErr.code === 'auth/unauthorized-domain' || popupErr.code === 'auth/operation-not-allowed' || popupErr.code === 'auth/invalid-api-key')) {
        return { success: false, error: mapAuthError(popupErr.code) };
      }
      // popup ditutup user
      if (popupErr && popupErr.code === 'auth/popup-closed-by-user') {
        return { success: false, error: mapAuthError(popupErr.code) };
      }
    }

    // 2) Fallback redirect (iOS / browser ketat)
    await auth.signInWithRedirect(provider);
    return { success: true, redirect: true };
  } catch (e) {
    console.error('Google login error:', e);
    return { success: false, error: mapAuthError(e.code) || e.message || String(e) };
  }
}

// Handle redirect result (setelah Google login di mobile)
async function handleRedirectResult() {
  if (!auth) return null;
  try {
    const result = await auth.getRedirectResult();
    if (result && result.user) {
      await createUserProfile(result.user);
      return result.user;
    }
  } catch (e) {
    console.error('Redirect result error:', e);
    // Tampilkan error domain jika ada
    if (e && e.code === 'auth/unauthorized-domain') {
      if (typeof showToast === 'function') {
        showToast('Domain belum diizinkan di Firebase Console (Authorized domains).', 'error');
      }
    }
  }

  // Fallback: kadang getRedirectResult kosong tapi session sudah ada
  try {
    const user = await new Promise((resolve) => {
      const unsub = auth.onAuthStateChanged(u => {
        unsub();
        resolve(u || null);
      });
      setTimeout(() => { try { unsub(); } catch (_) {} resolve(null); }, 2500);
    });
    if (user) {
      await createUserProfile(user);
      return user;
    }
  } catch (e) {}
  return null;
}

async function logout() {
  try {
    await auth.signOut();
    try { localStorage.removeItem('uk_authed'); } catch (e) {}
    showToast('Berhasil keluar', 'success');
    navigateTo('login.html');
  } catch (e) {
    showToast('Gagal keluar', 'error');
  }
}

function mapAuthError(code) {
  const map = {
    'auth/user-not-found': 'Email tidak terdaftar',
    'auth/wrong-password': 'Password salah',
    'auth/email-already-in-use': 'Email sudah digunakan',
    'auth/weak-password': 'Password terlalu lemah (min 6 karakter)',
    'auth/invalid-email': 'Format email tidak valid',
    'auth/popup-closed-by-user': 'Login dibatalkan',
    'auth/network-request-failed': 'Koneksi gagal. Coba lagi.',
    'auth/too-many-requests': 'Terlalu banyak percobaan. Coba nanti.',
    'auth/account-exists-with-different-credential': 'Akun sudah terdaftar dengan metode lain',
    'auth/popup-blocked': 'Popup diblokir browser. Izinkan popup atau coba lagi.',
    'auth/cancelled-popup-request': 'Login dibatalkan',
    'auth/operation-not-allowed': 'Login Google belum diaktifkan di Firebase Console → Authentication → Sign-in method → Google',
    'auth/unauthorized-domain': 'Domain website belum diizinkan. Tambahkan domain Vercel di Firebase Console → Authentication → Settings → Authorized domains',
    'auth/internal-error': 'Error internal Firebase. Cek Authorized domains & Google provider.',
    'auth/invalid-api-key': 'API key Firebase salah',
    'auth/network-request-failed': 'Koneksi gagal. Coba lagi.'
  };
  return map[code] || 'Terjadi kesalahan. Coba lagi.';
}

// Update navbar based on auth state
function initAuthUI() {
  if (!auth) return;
  
  auth.onAuthStateChanged(async (user) => {
    const authButtons = document.querySelectorAll('.auth-guest');
    const userButtons = document.querySelectorAll('.auth-user');
    const adminLinks = document.querySelectorAll('.admin-only');
    
    if (user) {
      try { localStorage.setItem('uk_authed', '1'); } catch (e) {}
      authButtons.forEach(el => el.classList.add('hidden'));
      userButtons.forEach(el => el.classList.remove('hidden'));
      
      const nameEls = document.querySelectorAll('.user-display-name');
      nameEls.forEach(el => el.textContent = user.displayName || user.email);
      
      // Admin check — case-insensitive
      const emailNorm = (user.email || '').trim().toLowerCase();
      const adminNorm = (ADMIN_EMAIL || '').trim().toLowerCase();
      if (emailNorm === adminNorm) {
        adminLinks.forEach(el => {
          el.classList.remove('hidden');
          el.style.setProperty('display', 'inline-flex', 'important');
        });
      } else {
        adminLinks.forEach(el => {
          el.classList.add('hidden');
        });
      }
      
      // Balance real-time (update otomatis saat admin approve top up)
      try {
        if (window._balanceUnsub) { window._balanceUnsub(); window._balanceUnsub = null; }
        if (db) {
          window._balanceUnsub = db.collection('users').doc(user.uid).onSnapshot(snap => {
            const bal = snap.exists ? (snap.data().balance || 0) : 0;
            document.querySelectorAll('.user-balance').forEach(el => {
              el.textContent = formatRupiah(bal);
            });
          }, err => console.warn('balance listener', err));
        } else {
          const profile = await getUserProfile(user.uid);
          if (profile) {
            document.querySelectorAll('.user-balance').forEach(el => {
              el.textContent = formatRupiah(profile.balance || 0);
            });
          }
        }
      } catch (e) {}
    } else {
      if (window._balanceUnsub) { window._balanceUnsub(); window._balanceUnsub = null; }
      authButtons.forEach(el => el.classList.remove('hidden'));
      userButtons.forEach(el => el.classList.add('hidden'));
      adminLinks.forEach(el => el.classList.add('hidden'));
    }
  });
}

document.addEventListener('DOMContentLoaded', initAuthUI);
