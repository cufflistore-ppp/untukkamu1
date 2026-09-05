document.addEventListener('DOMContentLoaded', async () => {
  const user = await getCurrentUser();
  
  if (!user || user.email !== ADMIN_EMAIL) {
    document.getElementById('accessDenied').classList.remove('hidden');
    hideLoader();
    return;
  }
  
  document.getElementById('adminContent').classList.remove('hidden');
  
  // Tabs
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => {
        t.classList.remove('active', 'btn-primary');
        t.classList.add('btn-secondary');
      });
      tab.classList.add('active', 'btn-primary');
      tab.classList.remove('btn-secondary');
      
      ['topups', 'users', 'templates', 'projects'].forEach(id => {
        document.getElementById('tab-' + id).classList.add('hidden');
      });
      document.getElementById('tab-' + tab.dataset.tab).classList.remove('hidden');
    });
  });
  
  loadTopups();
  loadUsers();
  loadProjects();
  
  // Balance modal
  let selectedUserId = null;
  window._selectedUserId = null;
  
  document.getElementById('closeBalanceModal').addEventListener('click', () => {
    document.getElementById('balanceModal').classList.remove('open');
  });
  
  document.getElementById('confirmAddBalance').addEventListener('click', async () => {
    const amount = parseInt(document.getElementById('balanceAmount').value, 10);
    const uid = window._selectedUserId;
    if (!amount || amount <= 0 || !uid) return;
    
    if (!db) {
      showToast('Firebase belum dikonfigurasi', 'warning');
      return;
    }
    
    try {
      await db.runTransaction(async (tx) => {
        const ref = db.collection('users').doc(uid);
        const doc = await tx.get(ref);
        const current = doc.data().balance || 0;
        tx.update(ref, { balance: current + amount });
        
        const histRef = db.collection('balance_history').doc();
        tx.set(histRef, {
          userId: uid,
          amount: amount,
          type: 'admin_add',
          adminEmail: user.email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });
      
      showToast('Saldo berhasil ditambah ' + formatRupiah(amount), 'success');
      document.getElementById('balanceModal').classList.remove('open');
      loadUsers();
    } catch (e) {
      showToast('Gagal menambah saldo', 'error');
    }
  });
});

async function loadTopups() {
  const tbody = document.getElementById('topupsTable');
  const cardsEl = document.getElementById('pendingTopupsCards');
  if (!db) {
    if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Firebase belum dikonfigurasi</td></tr>';
    if (cardsEl) cardsEl.innerHTML = '<p style="color:var(--text-muted);">Firebase belum dikonfigurasi</p>';
    return;
  }
  
  try {
    const snap = await db.collection('topups').orderBy('createdAt', 'desc').limit(50).get();
    if (snap.empty) {
      if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: var(--text-muted);">Belum ada permintaan</td></tr>';
      if (cardsEl) cardsEl.innerHTML = '<p style="color:var(--text-muted);">Belum ada yang menunggu konfirmasi</p>';
      return;
    }
    
    const docs = snap.docs;
    const pending = docs.filter(d => (d.data().status || '') === 'PENDING');
    
    // ===== Kartu PENDING (satu klik konfirmasi) =====
    if (cardsEl) {
      if (pending.length === 0) {
        cardsEl.innerHTML = '<p style="color:var(--text-muted);padding:0.5rem 0;">Tidak ada top up yang menunggu. Semua sudah diproses.</p>';
      } else {
        cardsEl.innerHTML = pending.map(doc => {
          const t = doc.data();
          const time = t.createdAt ? new Date(t.createdAt.seconds * 1000).toLocaleString('id-ID') : '-';
          const bukti = t.buktiUrl || t.proofURL || '';
          const email = t.email || '-';
          const nominal = t.nominal || 0;
          return `
            <div class="card" style="padding:1rem;margin-bottom:0.75rem;border:1.5px solid var(--pink);">
              <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-start;">
                <div style="flex:1;min-width:180px;">
                  <div style="font-size:0.8rem;color:var(--text-muted);">Email user</div>
                  <div style="font-weight:600;word-break:break-all;">${email}</div>
                  <div style="margin-top:0.5rem;font-size:0.8rem;color:var(--text-muted);">Nominal top up</div>
                  <div style="font-size:1.35rem;font-weight:700;color:var(--pink);">${formatRupiah(nominal)}</div>
                  <div style="margin-top:0.35rem;font-size:0.8rem;color:var(--text-muted);">${time}</div>
                  <div style="margin-top:0.35rem;"><span class="status-badge status-pending">PENDING</span></div>
                </div>
                ${bukti ? `
                <div style="flex-shrink:0;">
                  <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.25rem;">Bukti TF</div>
                  <a href="${bukti}" target="_blank" rel="noopener">
                    <img src="${bukti}" alt="Bukti" style="width:100px;height:100px;object-fit:cover;border-radius:10px;border:1px solid var(--border);">
                  </a>
                </div>` : '<div style="color:var(--text-muted);font-size:0.85rem;">Belum ada bukti</div>'}
                <div style="display:flex;flex-direction:column;gap:0.4rem;min-width:140px;">
                  <button class="btn btn-primary btn-sm approve-btn" data-id="${doc.id}" data-uid="${t.userId || ''}" data-nominal="${nominal}" data-email="${email}" style="width:100%;">
                    <i class="fa-solid fa-check"></i> Konfirmasi &amp; Tambah Saldo
                  </button>
                  <button class="btn btn-danger btn-sm reject-btn" data-id="${doc.id}" style="width:100%;">
                    <i class="fa-solid fa-xmark"></i> Tolak
                  </button>
                </div>
              </div>
            </div>`;
        }).join('');
      }
    }
    
    // ===== Tabel riwayat =====
    if (tbody) {
      tbody.innerHTML = docs.map(doc => {
        const t = doc.data();
        const time = t.createdAt ? new Date(t.createdAt.seconds * 1000).toLocaleString('id-ID') : '-';
        const status = t.status || 'PENDING';
        const statusClass = status === 'PENDING' ? 'status-pending' : status === 'APPROVED' ? 'status-approved' : 'status-rejected';
        const bukti = t.buktiUrl || t.proofURL || '';
        let aksi = '';
        if (status === 'PENDING') {
          aksi = '<button class="btn btn-primary btn-sm approve-btn" data-id="' + doc.id + '" data-uid="' + (t.userId||'') + '" data-nominal="' + (t.nominal||0) + '" data-email="' + (t.email||'') + '"><i class="fa-solid fa-check"></i></button> ' +
                 '<button class="btn btn-danger btn-sm reject-btn" data-id="' + doc.id + '"><i class="fa-solid fa-xmark"></i></button> ';
        }
        if (bukti) {
          aksi += '<a href="' + bukti + '" target="_blank" class="btn btn-secondary btn-sm"><i class="fa-solid fa-image"></i></a>';
        }
        if (!aksi) aksi = '-';
        return '<tr>' +
          '<td style="word-break:break-all;font-size:0.85rem;">' + (t.email || '-') + '</td>' +
          '<td>' + formatRupiah(t.nominal) + '</td>' +
          '<td><span class="status-badge ' + statusClass + '">' + status + '</span></td>' +
          '<td style="font-size:0.8rem;">' + time + '</td>' +
          '<td>' + aksi + '</td></tr>';
      }).join('');
    }
    
    // ===== Event: Approve (tambah saldo + ubah status) =====
    document.querySelectorAll('.approve-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const uid = btn.dataset.uid;
        const nominal = parseInt(btn.dataset.nominal, 10);
        const email = btn.dataset.email || '';
        if (!id || !uid || !nominal) {
          showToast('Data top up tidak lengkap', 'error');
          return;
        }
        if (!confirm('Konfirmasi top up?\n\nEmail: ' + email + '\nNominal: ' + formatRupiah(nominal) + '\n\nSaldo user akan ditambah dan status jadi APPROVED.')) return;
        
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        
        try {
          await db.runTransaction(async (tx) => {
            const topupRef = db.collection('topups').doc(id);
            const userRef = db.collection('users').doc(uid);
            
            const topupDoc = await tx.get(topupRef);
            if (!topupDoc.exists) throw new Error('Data top up tidak ditemukan');
            if (topupDoc.data().status !== 'PENDING') throw new Error('Sudah diproses sebelumnya');
            
            const userDoc = await tx.get(userRef);
            if (!userDoc.exists) throw new Error('User tidak ditemukan di database');
            const balance = (userDoc.data().balance || 0);
            
            tx.update(topupRef, {
              status: 'APPROVED',
              reviewedAt: firebase.firestore.FieldValue.serverTimestamp(),
              reviewedBy: ADMIN_EMAIL
            });
            
            tx.update(userRef, { balance: balance + nominal });
            
            const histRef = db.collection('balance_history').doc();
            tx.set(histRef, {
              userId: uid,
              email: email,
              amount: nominal,
              type: 'topup_approved',
              topupId: id,
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
          });
          
          showToast('Berhasil! Saldo ' + email + ' +' + formatRupiah(nominal), 'success');
          loadTopups();
          loadUsers();
        } catch (e) {
          console.error(e);
          showToast(e.message || 'Gagal menyetujui', 'error');
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Konfirmasi';
        }
      });
    });
    
    // ===== Event: Reject =====
    document.querySelectorAll('.reject-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Tolak permintaan top up ini?')) return;
        try {
          await db.collection('topups').doc(btn.dataset.id).update({
            status: 'REJECTED',
            reviewedAt: firebase.firestore.FieldValue.serverTimestamp(),
            reviewedBy: ADMIN_EMAIL
          });
          showToast('Top up ditolak', 'info');
          loadTopups();
        } catch (e) {
          showToast('Gagal menolak', 'error');
        }
      });
    });
    
  } catch (e) {
    console.error(e);
    if (tbody) tbody.innerHTML = '<tr><td colspan="5">Error: ' + e.message + '</td></tr>';
    if (cardsEl) cardsEl.innerHTML = '<p style="color:#ef4444;">Error: ' + e.message + '</p>';
  }
}

async function loadUsers() {
  const tbody = document.getElementById('usersTable');
  if (!db) return;
  
  try {
    const snap = await db.collection('users').orderBy('createdAt', 'desc').limit(100).get();
    if (snap.empty) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Belum ada user</td></tr>';
      return;
    }
    
    tbody.innerHTML = snap.docs.map(doc => {
      const u = doc.data();
      return '<tr>' +
        '<td>' + (u.displayName || '-') + '</td>' +
        '<td>' + u.email + '</td>' +
        '<td>' + formatRupiah(u.balance || 0) + '</td>' +
        '<td>' + (u.projectCount || 0) + '</td>' +
        '<td><button class="btn btn-primary btn-sm add-balance-btn" data-uid="' + doc.id + '" data-email="' + u.email + '"><i class="fa-solid fa-plus"></i> Saldo</button></td>' +
        '</tr>';
    }).join('');
    
    tbody.querySelectorAll('.add-balance-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window._selectedUserId = btn.dataset.uid;
        document.getElementById('balanceUserEmail').value = btn.dataset.email;
        document.getElementById('balanceAmount').value = '';
        document.getElementById('balanceModal').classList.add('open');
      });
    });
    
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="5">Error: ' + e.message + '</td></tr>';
  }
}

async function loadProjects() {
  const tbody = document.getElementById('projectsTable');
  if (!db) return;
  
  try {
    const snap = await db.collection('projects').orderBy('createdAt', 'desc').limit(50).get();
    if (snap.empty) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Belum ada project</td></tr>';
      return;
    }
    
    tbody.innerHTML = snap.docs.map(doc => {
      const p = doc.data();
      return '<tr>' +
        '<td><span class="project-code">' + p.code + '</span></td>' +
        '<td>' + (p.name || '-') + '</td>' +
        '<td>' + (p.ownerEmail || '-') + '</td>' +
        '<td>' + (p.templateName || p.templateId) + '</td>' +
        '<td>' + (p.editsUsed || 0) + '/' + (p.maxEdits >= 999 ? '∞' : p.maxEdits) + '</td>' +
        '</tr>';
    }).join('');
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="5">Error: ' + e.message + '</td></tr>';
  }
}

/* ========== Produk / Template (products.js) ========== */

async function loadAdminProducts() {
  const el = document.getElementById('adminTemplates');
  if (!el) return;

  const list = await getProducts();
  if (!list.length) {
    el.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1;">Belum ada produk. Isi form di atas atau klik Seed Default.</p>';
    return;
  }

  el.innerHTML = list.map(p => `
    <article class="card template-card">
      <div class="template-thumb">
        <span class="template-badge ${p.isFree || p.price === 0 ? 'badge-free' : 'badge-paid'}">
          ${p.isFree || p.price === 0 ? 'Gratis' : 'Berbayar'}
        </span>
        <img src="${p.thumbnail || 'logo.jpg'}" alt="${p.name}">
      </div>
      <div class="template-body">
        <h3 class="template-name">${p.name}</h3>
        <p class="template-desc">${p.description || ''}</p>
        <div class="template-meta">
          <span class="template-price">${p.isFree || p.price === 0 ? 'Gratis' : formatRupiah(p.price)}</span>
          ${p.featured ? '<span style="font-size:0.75rem;color:var(--pink);">Beranda</span>' : ''}
        </div>
        <button class="btn btn-secondary btn-sm w-full deactivate-product" data-id="${p.id}">
          <i class="fa-solid fa-eye-slash"></i> Nonaktifkan
        </button>
      </div>
    </article>
  `).join('');

  el.querySelectorAll('.deactivate-product').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Nonaktifkan produk ini?')) return;
      const res = await deactivateProduct(btn.dataset.id);
      if (res.success) {
        showToast('Produk dinonaktifkan', 'success');
        loadAdminProducts();
      } else {
        showToast(res.error || 'Gagal', 'error');
      }
    });
  });
}

function initProductAdmin() {
  const form = document.getElementById('addProductForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('saveProductBtn');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';

      const res = await addProduct({
        name: document.getElementById('productName').value,
        description: document.getElementById('productDesc').value,
        price: document.getElementById('productPrice').value,
        thumbnail: document.getElementById('productThumb').value,
        category: document.getElementById('productCategory').value,
        features: document.getElementById('productFeatures').value,
        featured: document.getElementById('productFeatured').checked
      });

      if (res.success) {
        showToast('Produk ditambahkan: ' + res.id, 'success');
        form.reset();
        loadAdminProducts();
      } else {
        showToast(res.error || 'Gagal menyimpan', 'error');
      }
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-plus"></i> Simpan Produk';
    });
  }

  const seedBtn = document.getElementById('seedProductsBtn');
  if (seedBtn) {
    seedBtn.addEventListener('click', async () => {
      if (!confirm('Seed 5 produk default ke Firestore?')) return;
      seedBtn.disabled = true;
      const res = await seedDefaultProducts();
      if (res.success) {
        showToast('Berhasil seed ' + res.count + ' produk', 'success');
        loadAdminProducts();
      } else {
        showToast(res.error || 'Gagal seed', 'error');
      }
      seedBtn.disabled = false;
    });
  }

  // Load when templates tab opened
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.dataset.tab === 'templates') loadAdminProducts();
    });
  });
}

// Hook into existing admin init if possible
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initProductAdmin, 500);
});
