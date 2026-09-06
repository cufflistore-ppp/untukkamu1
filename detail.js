// Reuse sample templates
const SAMPLE_TEMPLATES = {
  'cinta-romantis': {
    id: 'cinta-romantis', name: 'Cinta Romantis',
    description: 'Template percintaan elegan dengan foto, pesan hati, dan aksen merah muda.',
    price: 5000, isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80',
    maxEdits: 2, features: ['Foto', 'Nama', 'Pesan cinta', 'Warna tema', 'Animasi soft']
  },
  'valentine': {
    id: 'valentine', name: 'Valentine',
    description: 'Ucapan Valentine manis dengan hati, foto, dan pesan spesial.',
    price: 5000, isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80',
    maxEdits: 2, features: ['Foto', 'Nama', 'Pesan', 'Tema valentine', 'Warna tema']
  },
  'anniversary': {
    id: 'anniversary', name: 'Anniversary',
    description: 'Rayakan hari jadi hubungan dengan template elegan.',
    price: 8000, isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
    maxEdits: 2, features: ['Foto', 'Nama pasangan', 'Pesan', 'Warna tema']
  },
  'wisuda': {
    id: 'wisuda', name: 'Wisuda',
    description: 'Ucapan selamat wisuda dengan foto dan pesan motivasi.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  'maaf': {
    id: 'maaf', name: 'Permintaan Maaf',
    description: 'Surat maaf yang tulus untuk memperbaiki hubungan.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1455390580327-9a4658c1d3d5?w=800&q=80',
    maxEdits: 999, features: ['Judul', 'Pesan maaf', 'Nama', 'Warna lembut']
  },
  'terima-kasih': {
    id: 'terima-kasih', name: 'Terima Kasih',
    description: 'Ucapan terima kasih elegan untuk orang spesial.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80',
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan terima kasih', 'Warna tema']
  },
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
  },
  'untuk-pacar': {
    id: 'untuk-pacar', name: 'Untuk Pacar',
    description: 'Pesan manis spesial hanya untuk pacarmu.',
    price: 5000, isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 2, features: ['Foto', 'Nama', 'Pesan cinta', 'Warna']
  },
  'pesan-cinta': {
    id: 'pesan-cinta', name: 'Pesan Cinta',
    description: 'Surat cinta digital yang romantis dan elegan.',
    price: 5000, isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 2, features: ['Foto', 'Judul', 'Pesan', 'Warna']
  },
  'rindu': {
    id: 'rindu', name: 'Rindu',
    description: 'Sampaikan rasa rindu untuk orang yang jauh.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan rindu', 'Warna']
  },
  'jadian': {
    id: 'jadian', name: 'Hari Jadian',
    description: 'Rayakan tanggal jadian kalian berdua.',
    price: 8000, isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 2, features: ['Foto', 'Nama', 'Tanggal', 'Pesan', 'Warna']
  },
  'ldt': {
    id: 'ldt', name: 'Long Distance',
    description: 'Untuk pasangan LDR yang tetap setia.',
    price: 5000, isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 2, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  'good-night': {
    id: 'good-night', name: 'Selamat Malam',
    description: 'Ucapan selamat malam manis sebelum tidur.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  'good-morning': {
    id: 'good-morning', name: 'Selamat Pagi',
    description: 'Sapa pagi yang hangat untuk orang spesial.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  'proposal': {
    id: 'proposal', name: 'Proposal',
    description: 'Pernyataan perasaan / ajakan serius yang berkesan.',
    price: 10000, isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 2, features: ['Foto', 'Nama', 'Pesan', 'Tombol', 'Warna']
  },
  'untuk-sahabat': {
    id: 'untuk-sahabat', name: 'Untuk Sahabat',
    description: 'Untuk sahabat yang selalu ada di sisi.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  'bestie': {
    id: 'bestie', name: 'Bestie',
    description: 'Spesial buat bestie yang paling ngerti kamu.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  'bestod': {
    id: 'bestod', name: 'Bestod / Bros',
    description: 'Buat bestod / sobat cowok yang solid.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  'teman-sekolah': {
    id: 'teman-sekolah', name: 'Teman Sekolah',
    description: 'Nostalgia & ucapan untuk teman sekolah.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  'teman-kerja': {
    id: 'teman-kerja', name: 'Teman Kerja',
    description: 'Apresiasi untuk rekan kerja yang suportif.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  'circle': {
    id: 'circle', name: 'Circle / Geng',
    description: 'Buat circle sahabat yang solid banget.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  'teman-jauh': {
    id: 'teman-jauh', name: 'Teman Jauh',
    description: 'Untuk teman yang jauh secara jarak, dekat di hati.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  'teman-baru': {
    id: 'teman-baru', name: 'Teman Baru',
    description: 'Sambutan hangat untuk teman baru.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  'selamat-ulang-tahun-sahabat': {
    id: 'selamat-ulang-tahun-sahabat', name: 'Ultah Sahabat',
    description: 'Ulang tahun spesial buat sahabat/bestie.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  'selamat-ulang-tahun-pacar': {
    id: 'selamat-ulang-tahun-pacar', name: 'Ultah Pacar',
    description: 'Ulang tahun romantis untuk pacar.',
    price: 5000, isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 2, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  'selamat-wisuda-sahabat': {
    id: 'selamat-wisuda-sahabat', name: 'Wisuda Sahabat',
    description: 'Ucapan wisuda untuk sahabat yang berjuang.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  'semangat': {
    id: 'semangat', name: 'Semangat!',
    description: 'Dorongan semangat untuk orang yang kamu sayang.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  'bangga': {
    id: 'bangga', name: 'Aku Bangga',
    description: 'Sampaikan rasa bangga pada seseorang.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  'dukungan': {
    id: 'dukungan', name: 'Dukungan',
    description: 'Pesan dukungan di masa sulit.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  'miss-you': {
    id: 'miss-you', name: 'Miss You',
    description: 'Sampaikan \'kangen\' dengan cara manis.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  'just-because': {
    id: 'just-because', name: 'Just Because',
    description: 'Kirim sesuatu manis tanpa alasan khusus.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  'salam-kenal': {
    id: 'salam-kenal', name: 'Salam Kenal',
    description: 'Perkenalan manis untuk orang yang baru dikenal.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  'teman-lama': {
    id: 'teman-lama', name: 'Teman Lama',
    description: 'Reuni perasaan untuk teman lama.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  'crush': {
    id: 'crush', name: 'Untuk Crush',
    description: 'Pesan lembut untuk orang yang kamu sukai diam-diam.',
    price: 5000, isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 2, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  'mantan-baik': {
    id: 'mantan-baik', name: 'Damai dengan Masa Lalu',
    description: 'Pesan dewasa untuk menutup bab lama dengan baik.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1455390580327-9a4658c1d3d5?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 999, features: ['Judul', 'Pesan', 'Nama', 'Warna']
  },
  'keluarga': {
    id: 'keluarga', name: 'Untuk Keluarga',
    description: 'Pesan hangat untuk keluarga tercinta.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  'orang-tua': {
    id: 'orang-tua', name: 'Untuk Orang Tua',
    description: 'Ucapan syukur untuk ayah/ibu.',
    price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80'.replace('w=600','w=800'),
    maxEdits: 999, features: ['Foto', 'Nama', 'Pesan', 'Warna']
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  
  let fromDb = null;
  if (typeof getProducts === 'function') {
    try {
      const list = await getProducts();
      fromDb = (list || []).find(p => p.id === id) || null;
    } catch (e) {}
  }

  if (!id || (!SAMPLE_TEMPLATES[id] && !fromDb)) {
    document.getElementById('detailContent').innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <i class="fa-solid fa-circle-info"></i>
        <h3>Template tidak ditemukan</h3>
        <a href="template.html" class="btn btn-primary mt-2" data-nav>Kembali ke Katalog</a>
      </div>
    `;
    return;
  }
  
  const t = SAMPLE_TEMPLATES[id] || fromDb;
  if (!Array.isArray(t.features)) t.features = t.features ? String(t.features).split(',').map(s => s.trim()) : [];
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
