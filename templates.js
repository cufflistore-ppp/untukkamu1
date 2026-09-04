// Sample templates (will be replaced by Firestore data when configured)
const SAMPLE_TEMPLATES = [
  {
    id: 'untuk-kamu',
    name: 'Untuk Kamu',
    description: 'Template personal elegan dengan foto, pesan, nama penerima, dan animasi lembut.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    features: ['Foto', 'Judul', 'Nama penerima', 'Pesan', 'Warna tema', 'Animasi']
  },
  {
    id: 'ulang-tahun',
    name: 'Ulang Tahun',
    description: 'Ucapan ulang tahun interaktif dengan confetti, foto, dan pesan personal.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 999,
    active: true,
    features: ['Foto', 'Nama', 'Pesan', 'Animasi confetti', 'Warna tema']
  },
  {
    id: 'nembak',
    name: 'Nembak',
    description: 'Template interaktif playful untuk menyatakan perasaan. Ada tombol Ya/Tidak yang lucu.',
    price: 5000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    category: 'romance',
    maxEdits: 2,
    active: true,
    features: ['Foto', 'Nama', 'Pesan', 'Tombol interaktif', 'Animasi', 'Background']
  },
  {
    id: 'undangan',
    name: 'Undangan',
    description: 'Undangan digital elegan untuk acara spesial. Cocok untuk pernikahan, gathering, dll.',
    price: 10000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80',
    category: 'invitation',
    maxEdits: 2,
    active: true,
    features: ['Foto', 'Nama acara', 'Tanggal & waktu', 'Lokasi', 'Pesan', 'RSVP']
  },
  {
    id: 'surat',
    name: 'Surat',
    description: 'Surat digital klasik dengan desain kertas, cocok untuk pesan panjang dan bermakna.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1455390580327-9a4658c1d3d5?w=600&q=80',
    category: 'letter',
    maxEdits: 999,
    active: true,
    features: ['Judul', 'Isi surat', 'Pengirim', 'Penerima', 'Warna kertas']
  }
];

document.addEventListener('DOMContentLoaded', async () => {
  let templates = SAMPLE_TEMPLATES;
  
  // Try load from Firestore
  if (db) {
    try {
      const snap = await db.collection('templates').where('active', '==', true).get();
      if (!snap.empty) {
        templates = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.log('Using sample templates (Firestore not configured)');
    }
  }
  
  renderTemplates(templates);
  
  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active', 'btn-primary');
        b.classList.add('btn-secondary');
      });
      btn.classList.add('active', 'btn-primary');
      btn.classList.remove('btn-secondary');
      
      const filter = btn.dataset.filter;
      let filtered = templates;
      if (filter === 'free') filtered = templates.filter(t => t.isFree || t.price === 0);
      if (filter === 'paid') filtered = templates.filter(t => !t.isFree && t.price > 0);
      renderTemplates(filtered);
    });
  });
});

function renderTemplates(list) {
  const grid = document.getElementById('templateGrid');
  const empty = document.getElementById('emptyTemplates');
  
  if (!list.length) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  
  empty.classList.add('hidden');
  grid.innerHTML = list.map(t => `
    <div class="card template-card card-glow" data-id="${t.id}">
      <div class="template-thumb">
        <img src="${t.thumbnail}" alt="${t.name}" loading="lazy">
        <span class="template-badge ${t.isFree || t.price === 0 ? 'badge-free' : 'badge-paid'}">
          ${t.isFree || t.price === 0 ? 'Gratis' : 'Berbayar'}
        </span>
      </div>
      <div class="template-body">
        <h3 class="template-name">${t.name}</h3>
        <p class="template-desc">${t.description}</p>
        <div class="template-meta">
          <span class="template-price">${t.isFree || t.price === 0 ? 'Gratis' : formatRupiah(t.price)}</span>
        </div>
        <div class="template-actions">
          <a href="detail.html?id=${t.id}" class="btn btn-secondary btn-sm" data-nav>
            <i class="fa-solid fa-eye"></i> Detail
          </a>
          <a href="detail.html?id=${t.id}" class="btn btn-primary btn-sm" data-nav>
            <i class="fa-solid fa-${t.isFree || t.price === 0 ? 'plus' : 'cart-shopping'}"></i>
            ${t.isFree || t.price === 0 ? 'Gunakan' : 'Beli'}
          </a>
        </div>
      </div>
    </div>
  `).join('');
  
  // Re-attach nav handlers
  grid.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.getAttribute('href'));
    });
  });
}
