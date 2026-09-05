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
  
  if (user.email !== ADMIN_EMAIL) {
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
        role: user.email === ADMIN_EMAIL ? 'admin' : 'user',
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
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    // Deteksi mobile → pakai redirect (lebih stabil)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      await auth.signInWithRedirect(provider);
      return { success: true, redirect: true };
    } else {
      const result = await auth.signInWithPopup(provider);
      await createUserProfile(result.user);
      return { success: true, user: result.user };
    }
  } catch (e) {
    console.error('Google login error:', e);
    return { success: false, error: mapAuthError(e.code) || e.message };
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
  }
  return null;
}

async function logout() {
  try {
    await auth.signOut();
    showToast('Berhasil keluar', 'success');
    navigateTo('index.html');
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
    'auth/operation-not-allowed': 'Login Google belum diaktifkan di Firebase Console'
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
      
      // Balance
      try {
        const profile = await getUserProfile(user.uid);
        if (profile) {
          const balEls = document.querySelectorAll('.user-balance');
          balEls.forEach(el => el.textContent = formatRupiah(profile.balance || 0));
        }
      } catch (e) {}
    } else {
      authButtons.forEach(el => el.classList.remove('hidden'));
      userButtons.forEach(el => el.classList.add('hidden'));
      adminLinks.forEach(el => el.classList.add('hidden'));
    }
  });
}

document.addEventListener('DOMContentLoaded', initAuthUI);
