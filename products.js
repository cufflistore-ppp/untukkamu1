/**
 * products.js
 * Khusus mengelola data produk/template
 * - Beranda (rekomendasi)
 * - Katalog template
 * - Admin: tambah / edit / nonaktifkan produk
 */

const DEFAULT_PRODUCTS = [
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
    featured: true,
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
    featured: true,
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
    featured: true,
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
    featured: false,
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
    featured: false,
    features: ['Judul', 'Isi surat', 'Pengirim', 'Penerima', 'Warna kertas']
  }
];

/** Ambil semua produk aktif (Firestore → fallback default) */
async function getProducts() {
  if (typeof db !== 'undefined' && db) {
    try {
      const snap = await db.collection('templates').where('active', '==', true).get();
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.log('products.js: pakai data default', e.message);
    }
  }
  return DEFAULT_PRODUCTS.filter(p => p.active);
}

/** Produk untuk beranda (featured saja, max 6) */
async function getFeaturedProducts(limit = 6) {
  const all = await getProducts();
  const featured = all.filter(p => p.featured !== false);
  return (featured.length ? featured : all).slice(0, limit);
}

/** Satu produk by id */
async function getProductById(id) {
  if (typeof db !== 'undefined' && db) {
    try {
      const doc = await db.collection('templates').doc(id).get();
      if (doc.exists) return { id: doc.id, ...doc.data() };
    } catch (e) {}
  }
  return DEFAULT_PRODUCTS.find(p => p.id === id) || null;
}

/** Render card HTML untuk satu produk */
function renderProductCard(p) {
  const priceLabel = (p.isFree || p.price === 0)
    ? '<span class="template-price">Gratis</span>'
    : `<span class="template-price">${typeof formatRupiah === 'function' ? formatRupiah(p.price) : 'Rp' + p.price}</span>`;

  const badge = (p.isFree || p.price === 0)
    ? '<span class="template-badge badge-free">Gratis</span>'
    : '<span class="template-badge badge-paid">Berbayar</span>';

  const actionBtn = (p.isFree || p.price === 0)
    ? `<a href="detail.html?id=${p.id}" class="btn btn-primary btn-sm w-full" data-nav><i class="fa-solid fa-plus"></i> Gunakan</a>`
    : `<a href="detail.html?id=${p.id}" class="btn btn-primary btn-sm w-full" data-nav><i class="fa-solid fa-cart-shopping"></i> Beli</a>`;

  return `
    <article class="card template-card">
      <div class="template-thumb">
        ${badge}
        <img src="${p.thumbnail || 'logo.jpg'}" alt="${p.name}" loading="lazy">
      </div>
      <div class="template-body">
        <h3 class="template-name">${p.name}</h3>
        <p class="template-desc">${p.description || ''}</p>
        <div class="template-meta">
          ${priceLabel}
        </div>
        <div class="flex gap-1" style="flex-direction:column;gap:0.4rem;">
          <a href="${p.id}.html" class="btn btn-secondary btn-sm w-full" target="_blank">
            <i class="fa-solid fa-eye"></i> Preview
          </a>
          ${actionBtn}
        </div>
      </div>
    </article>
  `;
}

/** Render ke container (beranda / katalog) */
async function renderProductsTo(containerId, options = {}) {
  const el = document.getElementById(containerId);
  if (!el) return;

  el.innerHTML = '<div class="text-center" style="grid-column:1/-1;padding:2rem;"><i class="fa-solid fa-spinner fa-spin"></i></div>';

  let list = options.featuredOnly
    ? await getFeaturedProducts(options.limit || 6)
    : await getProducts();

  if (options.filter === 'free') list = list.filter(p => p.isFree || p.price === 0);
  if (options.filter === 'paid') list = list.filter(p => !p.isFree && p.price > 0);

  if (!list.length) {
    el.innerHTML = '<p class="text-center" style="grid-column:1/-1;color:var(--text-secondary);">Belum ada produk.</p>';
    return;
  }

  el.innerHTML = list.map(renderProductCard).join('');
}

/* ========== ADMIN: Tambah produk ========== */

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/** Tambah produk baru ke Firestore (admin only) */
async function addProduct(data) {
  if (!db) return { success: false, error: 'Firestore belum siap' };

  const id = data.id || slugify(data.name);
  if (!id) return { success: false, error: 'Nama produk wajib diisi' };

  const payload = {
    name: data.name.trim(),
    description: (data.description || '').trim(),
    price: Number(data.price) || 0,
    isFree: Number(data.price) === 0,
    thumbnail: (data.thumbnail || '').trim() || 'logo.jpg',
    category: data.category || 'personal',
    maxEdits: Number(data.price) === 0 ? 999 : 2,
    active: data.active !== false,
    featured: !!data.featured,
    features: Array.isArray(data.features)
      ? data.features
      : String(data.features || '').split(',').map(s => s.trim()).filter(Boolean),
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    await db.collection('templates').doc(id).set(payload, { merge: true });
    return { success: true, id };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/** Nonaktifkan produk */
async function deactivateProduct(id) {
  if (!db) return { success: false, error: 'Firestore belum siap' };
  try {
    await db.collection('templates').doc(id).update({ active: false });
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/** Seed produk default ke Firestore (sekali saja, admin) */
async function seedDefaultProducts() {
  if (!db) return { success: false, error: 'Firestore belum siap' };
  try {
    const batch = db.batch();
    DEFAULT_PRODUCTS.forEach(p => {
      const ref = db.collection('templates').doc(p.id);
      batch.set(ref, { ...p, createdAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
    });
    await batch.commit();
    return { success: true, count: DEFAULT_PRODUCTS.length };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
