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
  if (!db) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Firebase belum dikonfigurasi</td></tr>';
    return;
  }
  
  try {
    const snap = await db.collection('topups').orderBy('createdAt', 'desc').limit(50).get();
    if (snap.empty) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: var(--text-muted);">Belum ada permintaan</td></tr>';
      return;
    }
    
    tbody.innerHTML = snap.docs.map(doc => {
      const t = doc.data();
      const time = t.createdAt ? new Date(t.createdAt.seconds * 1000).toLocaleString('id-ID') : '-';
      const statusClass = t.status === 'PENDING' ? 'status-pending' : t.status === 'APPROVED' ? 'status-approved' : 'status-rejected';
      
      return '<tr>' +
        '<td>' + (t.email || '-') + '</td>' +
        '<td>' + formatRupiah(t.nominal) + '</td>' +
        '<td><span class="status-badge ' + statusClass + '">' + t.status + '</span></td>' +
        '<td>' + time + '</td>' +
        '<td>' +
          (t.status === 'PENDING' ?
            '<button class="btn btn-primary btn-sm approve-btn" data-id="' + doc.id + '" data-uid="' + t.userId + '" data-nominal="' + t.nominal + '"><i class="fa-solid fa-check"></i></button> ' +
            '<button class="btn btn-danger btn-sm reject-btn" data-id="' + doc.id + '"><i class="fa-solid fa-xmark"></i></button> ' +
            (t.proofURL ? '<a href="' + t.proofURL + '" target="_blank" class="btn btn-secondary btn-sm"><i class="fa-solid fa-image"></i></a>' : '')
          : '-') +
        '</td></tr>';
    }).join('');
    
    tbody.querySelectorAll('.approve-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const uid = btn.dataset.uid;
        const nominal = parseInt(btn.dataset.nominal, 10);
        
        try {
          await db.runTransaction(async (tx) => {
            const topupRef = db.collection('topups').doc(id);
            const userRef = db.collection('users').doc(uid);
            
            const topupDoc = await tx.get(topupRef);
            if (topupDoc.data().status !== 'PENDING') throw new Error('Sudah diproses');
            
            const userDoc = await tx.get(userRef);
            const balance = userDoc.data().balance || 0;
            
            tx.update(topupRef, {
              status: 'APPROVED',
              reviewedAt: firebase.firestore.FieldValue.serverTimestamp(),
              reviewedBy: ADMIN_EMAIL
            });
            
            tx.update(userRef, { balance: balance + nominal });
            
            const histRef = db.collection('balance_history').doc();
            tx.set(histRef, {
              userId: uid,
              amount: nominal,
              type: 'topup_approved',
              topupId: id,
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
          });
          
          showToast('Top up disetujui!', 'success');
          loadTopups();
          loadUsers();
        } catch (e) {
          showToast(e.message || 'Gagal menyetujui', 'error');
        }
      });
    });
    
    tbody.querySelectorAll('.reject-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
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
    tbody.innerHTML = '<tr><td colspan="5">Error: ' + e.message + '</td></tr>';
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
