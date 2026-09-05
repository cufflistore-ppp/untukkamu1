document.addEventListener('DOMContentLoaded', async () => {
  const guestView = document.getElementById('guestView');
  const userView = document.getElementById('userView');
  
  const user = await getCurrentUser();
  
  if (!user) {
    guestView.classList.remove('hidden');
    return;
  }
  
  userView.classList.remove('hidden');
  
  // Fill profile
  document.getElementById('userName').textContent = user.displayName || 'User';
  document.getElementById('userEmail').textContent = user.email;
  
  const avatar = document.getElementById('userAvatar');
  avatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=c4b5fd&color=fff&size=180`;
  
  // ===== ADMIN BUTTON — paksa tampil jika email cocok =====
  const email = (user.email || '').trim().toLowerCase();
  const adminEmail = (typeof ADMIN_EMAIL !== 'undefined' ? ADMIN_EMAIL : 'raffliraffli649@gmail.com').trim().toLowerCase();
  
  const adminBtn = document.querySelector('a.admin-only, .admin-only');
  if (adminBtn) {
    if (email === adminEmail) {
      adminBtn.classList.remove('hidden');
      adminBtn.style.setProperty('display', 'inline-flex', 'important');
      console.log('[Admin] Tombol Admin ditampilkan untuk', user.email);
    } else {
      adminBtn.classList.add('hidden');
      adminBtn.style.setProperty('display', 'none', 'important');
    }
  }
  
  // Load profile data
  const profile = await getUserProfile(user.uid);
  if (profile) {
    document.querySelectorAll('.user-balance').forEach(el => {
      el.textContent = formatRupiah(profile.balance || 0);
    });
    document.getElementById('projectCount').textContent = profile.projectCount || 0;
    if (document.getElementById('purchaseCount')) {
      document.getElementById('purchaseCount').textContent = profile.purchaseCount || 0;
    }
  }
  
  // Logout
  document.getElementById('logoutBtn').addEventListener('click', logout);
  
  // Load recent projects
  if (db) {
    try {
      const snap = await db.collection('projects')
        .where('ownerId', '==', user.uid)
        .limit(6)
        .get();
      
      const container = document.getElementById('recentProjects');
      if (!snap.empty) {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        docs.sort((a, b) => {
          const ta = a.createdAt?.seconds || 0;
          const tb = b.createdAt?.seconds || 0;
          return tb - ta;
        });
        
        container.innerHTML = docs.slice(0, 3).map(p => {
          return `
            <div class="card template-card">
              <div class="template-thumb">
                <img src="${p.thumbnail || 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400'}" alt="${p.name}" loading="lazy">
              </div>
              <div class="template-body">
                <h3 class="template-name">${p.name || 'Tanpa Nama'}</h3>
                <p class="template-desc">Kode: <span class="project-code">${p.code}</span></p>
                <div class="template-actions">
                  <a href="p.html?code=${p.code}" class="btn btn-secondary btn-sm" target="_blank"><i class="fa-solid fa-eye"></i> Lihat</a>
                  <a href="editor.html?code=${p.code}" class="btn btn-primary btn-sm" data-nav><i class="fa-solid fa-pen"></i> Edit</a>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    } catch (e) {
      console.log('Projects load error:', e.message);
    }
  }
});
