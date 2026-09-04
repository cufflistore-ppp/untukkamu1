document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireAuth();
  if (!user) return;
  
  const grid = document.getElementById('projectsGrid');
  const empty = document.getElementById('emptyProjects');
  
  if (!db) {
    empty.classList.remove('hidden');
    empty.querySelector('p').textContent = 'Konfigurasi Firebase untuk memuat proyek.';
    return;
  }
  
  try {
    const snap = await db.collection('projects')
      .where('ownerId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .get();
    
    if (snap.empty) {
      empty.classList.remove('hidden');
      return;
    }
    
    empty.classList.add('hidden');
    
    grid.innerHTML = snap.docs.map(doc => {
      const p = doc.data();
      const isFree = p.isFree !== false && (p.maxEdits >= 999 || p.price === 0);
      const editsUsed = p.editsUsed || 0;
      const maxEdits = p.maxEdits || (isFree ? 999 : 2);
      const canEdit = editsUsed < maxEdits;
      const created = p.createdAt ? new Date(p.createdAt.seconds * 1000).toLocaleDateString('id-ID') : '-';
      
      return `
        <div class="card template-card card-glow">
          <div class="template-thumb">
            <img src="${p.thumbnail || 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400'}" alt="${p.name}" loading="lazy">
            <span class="template-badge ${isFree ? 'badge-free' : 'badge-paid'}">
              ${isFree ? 'Gratis' : 'Berbayar'}
            </span>
          </div>
          <div class="template-body">
            <h3 class="template-name">${p.name || 'Tanpa Nama'}</h3>
            <p class="template-desc">
              Template: ${p.templateName || '-'}<br>
              Kode: <span class="project-code">${p.code}</span><br>
              Edit: ${editsUsed}/${maxEdits === 999 ? '∞' : maxEdits} · ${created}
            </p>
            <div class="template-actions" style="flex-wrap: wrap;">
              <a href="p.html?code=${p.code}" class="btn btn-secondary btn-sm" target="_blank">
                <i class="fa-solid fa-eye"></i> Preview
              </a>
              ${canEdit ? `
                <a href="editor.html?code=${p.code}" class="btn btn-primary btn-sm" data-nav>
                  <i class="fa-solid fa-pen"></i> Edit
                </a>
              ` : `
                <button class="btn btn-secondary btn-sm" disabled>
                  <i class="fa-solid fa-lock"></i> Terkunci
                </button>
              `}
              <button class="btn btn-outline btn-sm copy-link" data-code="${p.code}">
                <i class="fa-solid fa-link"></i> Salin
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    // Copy link handlers
    grid.querySelectorAll('.copy-link').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.code;
        const url = `${window.location.origin}/p.html?code=${code}`;
        navigator.clipboard.writeText(url).then(() => {
          showToast('Link berhasil disalin!', 'success');
        }).catch(() => {
          showToast('Gagal menyalin link', 'error');
        });
      });
    });
    
    // Nav handlers
    grid.querySelectorAll('[data-nav]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(link.getAttribute('href'));
      });
    });
    
  } catch (e) {
    console.error(e);
    empty.classList.remove('hidden');
    empty.querySelector('p').textContent = 'Gagal memuat proyek. Pastikan index Firestore sudah dibuat.';
  }
});
