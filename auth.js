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
  
  // Client-side check (server-side must also enforce)
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
  if (!db) return;
  const ref = db.collection('users').doc(user.uid);
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL || '',
      balance: 0,
      projectCount: 0,
      role: user.email === ADMIN_EMAIL ? 'admin' : 'user',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
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
    const result = await auth.signInWithPopup(provider);
    await createUserProfile(result.user);
    return { success: true, user: result.user };
  } catch (e) {
    return { success: false, error: mapAuthError(e.code) };
  }
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
    'auth/too-many-requests': 'Terlalu banyak percobaan. Coba nanti.'
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
      
      // Update profile display
      const nameEls = document.querySelectorAll('.user-display-name');
      nameEls.forEach(el => el.textContent = user.displayName || user.email);
      
      // Admin check
      if (user.email === ADMIN_EMAIL) {
        adminLinks.forEach(el => el.classList.remove('hidden'));
      } else {
        adminLinks.forEach(el => el.classList.add('hidden'));
      }
      
      // Balance
      const profile = await getUserProfile(user.uid);
      if (profile) {
        const balEls = document.querySelectorAll('.user-balance');
        balEls.forEach(el => el.textContent = formatRupiah(profile.balance || 0));
      }
    } else {
      authButtons.forEach(el => el.classList.remove('hidden'));
      userButtons.forEach(el => el.classList.add('hidden'));
      adminLinks.forEach(el => el.classList.add('hidden'));
    }
  });
}

document.addEventListener('DOMContentLoaded', initAuthUI);
