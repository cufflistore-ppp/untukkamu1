// Reuse sample templates
const SAMPLE_TEMPLATES = {
  'untuk-kamu': {
    id: 'untuk-kamu', name: 'Untuk Kamu',
    description: 'Template personal elegan dengan foto, pesan, nama penerima, dan animasi lembut. Cocok untuk memberikan sesuatu yang spesial.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80',
    maxEdits: 999, features: ['Foto / Logo', 'Judul', 'Nama penerima', 'Pesan panjang', 'Warna tema', 'Background', 'Animasi']
  },
  'ulang-tahun': {
    id: 'ulang-tahun', name: 'Ulang Tahun',
    description: 'Ucapan ulang tahun interaktif dengan confetti, foto, dan pesan personal yang meriah.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=800&q=80',
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan', 'Animasi confetti', 'Warna tema']
  },
  'nembak': {
    id: 'nembak', name: 'Nembak',
    description: 'Template interaktif playful untuk menyatakan perasaan. Ada tombol Ya/Tidak yang lucu dan animasi menarik.',
    price: 5000, isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80',
    maxEdits: 2, features: ['Foto', 'Nama', 'Pesan', 'Tombol interaktif Ya/Tidak', 'Animasi', 'Background']
  },
  'undangan': {
    id: 'undangan', name: 'Undangan',
    description: 'Undangan digital elegan untuk acara spesial. Cocok untuk pernikahan, gathering, dan acara lainnya.',
    price: 10000, isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
    maxEdits: 2, features: ['Foto', 'Nama acara', 'Tanggal & waktu', 'Lokasi', 'Pesan', 'RSVP']
  },
  'surat': {
    id: 'surat', name: 'Surat',
    description: 'Surat digital klasik dengan desain kertas, cocok untuk pesan panjang dan bermakna.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1455390580327-9a4658c1d3d5?w=800&q=80',
    maxEdits: 999, features: ['Judul', 'Isi surat', 'Pengirim', 'Penerima', 'Warna kertas']
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  
  if (!id || !SAMPLE_TEMPLATES[id]) {
    document.getElementById('detailContent').innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <i class="fa-solid fa-circle-info"></i>
        <h3>Template tidak ditemukan</h3>
        <a href="template.html" class="btn btn-primary mt-2" data-nav>Kembali ke Katalog</a>
      </div>
    `;
    return;
  }
  
  const t = SAMPLE_TEMPLATES[id];
  const isFree = t.isFree || t.price === 0;
  
  document.getElementById('detailContent').innerHTML = `
    <div>
      <div class="card" style="overflow: hidden;">
        <img src="${t.thumbnail}" alt="${t.name}" style="width: 100%; aspect-ratio: 16/10; object-fit: cover;">
      </div>
    </div>
    <div>
      <span class="template-badge ${isFree ? 'badge-free' : 'badge-paid'}" style="position: static; display: inline-block; margin-bottom: 0.8rem;">
        ${isFree ? 'Gratis' : 'Berbayar'}
      </span>
      <h1 style="margin-bottom: 0.5rem;">${t.name}</h1>
      <p style="margin-bottom: 1.2rem;">${t.description}</p>
      
      <div class="mb-2">
        <span class="template-price" style="font-size: 1.5rem;">${isFree ? 'Gratis' : formatRupiah(t.price)}</span>
      </div>
      
      <h3 class="mb-1">Fitur</h3>
      <ul style="margin-bottom: 1.5rem;">
        ${t.features.map(f => `<li style="padding: 0.3rem 0; color: var(--text-secondary);"><i class="fa-solid fa-check" style="color: #10b981; margin-right: 0.5rem;"></i>${f}</li>`).join('')}
      </ul>
      
      ${!isFree ? `<p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;"><i class="fa-solid fa-circle-info"></i> Maksimal ${t.maxEdits} kali edit setelah pembelian.</p>` : ''}
      
      <div class="flex gap-1 flex-wrap">
        <button class="btn btn-primary" id="useBtn">
          <i class="fa-solid fa-${isFree ? 'plus' : 'cart-shopping'}"></i>
          ${isFree ? 'Gunakan Template' : 'Beli & Gunakan'}
        </button>
        <a href="${id}.html" class="btn btn-secondary" target="_blank">
          <i class="fa-solid fa-eye"></i> Preview
        </a>
      </div>
    </div>
  `;
  
  // Responsive fix
  const style = document.createElement('style');
  style.textContent = `@media(max-width:768px){ #detailContent { grid-template-columns: 1fr !important; } }`;
  document.head.appendChild(style);
  
  document.getElementById('useBtn').addEventListener('click', async () => {
    const user = await getCurrentUser();
    if (!user) {
      showToast('Silakan login terlebih dahulu', 'warning');
      navigateTo('login.html');
      return;
    }
    
    // Pastikan profil user ada
    await createUserProfile(user);
    
    if (isFree) {
      await createProject(user, t);
    } else {
      await purchaseTemplate(user, t);
    }
  });
});

async function createProject(user, template) {
  const code = generateProjectCode();
  
  if (!db) {
    showToast('Mode demo: Project dibuat', 'info');
    setTimeout(() => navigateTo(`editor.html?code=${code}&template=${template.id}`), 800);
    return;
  }
  
  try {
    // Cek kode unik
    const existing = await db.collection('projects').where('code', '==', code).get();
    if (!existing.empty) {
      return createProject(user, template); // retry
    }
    
    // Buat project dulu
    await db.collection('projects').add({
      code,
      ownerId: user.uid,
      ownerEmail: user.email,
      templateId: template.id,
      templateName: template.name,
      name: template.name + ' - ' + (user.displayName || 'Project'),
      isFree: true,
      price: 0,
      maxEdits: 999,
      editsUsed: 0,
      data: {},
      musicEnabled: false,
      accessCode: '',
      thumbnail: template.thumbnail,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    // Update projectCount (sekarang rules sudah mengizinkan)
    try {
      await db.collection('users').doc(user.uid).update({
        projectCount: firebase.firestore.FieldValue.increment(1),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (updErr) {
      console.warn('Update projectCount gagal (tidak kritis):', updErr.message);
    }
    
    showToast('Project berhasil dibuat!', 'success');
    navigateTo(`editor.html?code=${code}`);
  } catch (e) {
    console.error('createProject error:', e);
    showToast('Gagal membuat project: ' + (e.message || 'Coba lagi'), 'error');
  }
}

async function purchaseTemplate(user, template) {
  if (!db) {
    showToast('Konfigurasi Firebase untuk pembelian', 'warning');
    return;
  }
  
  try {
    const profile = await getUserProfile(user.uid);
    if (!profile || (profile.balance || 0) < template.price) {
      showToast('Saldo tidak mencukupi. Silakan top up terlebih dahulu.', 'error');
      setTimeout(() => navigateTo('topup.html'), 1500);
      return;
    }
    
    const code = generateProjectCode();
    
    await db.runTransaction(async (tx) => {
      const userRef = db.collection('users').doc(user.uid);
      const userDoc = await tx.get(userRef);
      const balance = userDoc.data().balance || 0;
      
      if (balance < template.price) throw new Error('Saldo tidak cukup');
      
      tx.update(userRef, {
        balance: balance - template.price,
        projectCount: firebase.firestore.FieldValue.increment(1),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      const projectRef = db.collection('projects').doc();
      tx.set(projectRef, {
        code,
        ownerId: user.uid,
        ownerEmail: user.email,
        templateId: template.id,
        templateName: template.name,
        name: template.name + ' - ' + (user.displayName || 'Project'),
        isFree: false,
        price: template.price,
        maxEdits: 2,
        editsUsed: 0,
        data: {},
        musicEnabled: false,
        accessCode: '',
        thumbnail: template.thumbnail,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      const purchaseRef = db.collection('purchases').doc();
      tx.set(purchaseRef, {
        userId: user.uid,
        templateId: template.id,
        projectCode: code,
        amount: template.price,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    });
    
    showToast('Pembelian berhasil! Project dibuat.', 'success');
    navigateTo(`editor.html?code=${code}`);
    
  } catch (e) {
    console.error(e);
    showToast(e.message || 'Gagal membeli template', 'error');
  }
}
