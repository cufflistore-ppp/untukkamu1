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
  },
  {
    id: 'cinta-romantis',
    name: 'Cinta Romantis',
    description: 'Template percintaan elegan dengan foto pasangan, pesan hati, dan aksen merah muda.',
    price: 5000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    category: 'romance',
    maxEdits: 2,
    active: true,
    featured: true,
    features: ['Foto', 'Nama', 'Pesan cinta', 'Warna tema', 'Animasi soft']
  },
  {
    id: 'valentine',
    name: 'Valentine',
    description: 'Ucapan Valentine manis dengan hati, foto, dan pesan spesial.',
    price: 5000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'romance',
    maxEdits: 2,
    active: true,
    featured: true,
    features: ['Foto', 'Nama', 'Pesan', 'Tema valentine', 'Warna tema']
  },
  {
    id: 'anniversary',
    name: 'Anniversary',
    description: 'Rayakan hari jadi hubungan dengan template elegan dan musik lembut.',
    price: 8000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80',
    category: 'romance',
    maxEdits: 2,
    active: true,
    featured: false,
    features: ['Foto', 'Nama pasangan', 'Pesan', 'Tanggal anniversary', 'Warna tema']
  },
  {
    id: 'wisuda',
    name: 'Wisuda',
    description: 'Ucapan selamat wisuda dengan foto, pesan motivasi, dan aksen emas.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
    category: 'celebration',
    maxEdits: 999,
    active: true,
    featured: true,
    features: ['Foto', 'Nama', 'Pesan', 'Tahun lulus', 'Warna tema']
  },
  {
    id: 'maaf',
    name: 'Permintaan Maaf',
    description: 'Surat maaf yang tulus untuk memperbaiki hubungan.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1455390580327-9a4658c1d3d5?w=600&q=80',
    category: 'letter',
    maxEdits: 999,
    active: true,
    featured: false,
    features: ['Judul', 'Pesan maaf', 'Nama', 'Warna lembut']
  },
  {
    id: 'terima-kasih',
    name: 'Terima Kasih',
    description: 'Ucapan terima kasih elegan untuk orang spesial di hidupmu.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Pesan terima kasih', 'Warna tema']
  },
  {
    id: 'untuk-pacar',
    name: 'Untuk Pacar',
    description: 'Pesan manis spesial hanya untuk pacarmu.',
    price: 5000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    category: 'romance',
    maxEdits: 2,
    active: true,
    featured: true,
    features: ['Foto', 'Nama', 'Pesan cinta', 'Warna']
  },
  {
    id: 'pesan-cinta',
    name: 'Pesan Cinta',
    description: 'Surat cinta digital yang romantis dan elegan.',
    price: 5000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    category: 'romance',
    maxEdits: 2,
    active: true,
    featured: false,
    features: ['Foto', 'Judul', 'Pesan', 'Warna']
  },
  {
    id: 'rindu',
    name: 'Rindu',
    description: 'Sampaikan rasa rindu untuk orang yang jauh.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    category: 'romance',
    maxEdits: 999,
    active: true,
    featured: true,
    features: ['Foto', 'Nama', 'Pesan rindu', 'Warna']
  },
  {
    id: 'jadian',
    name: 'Hari Jadian',
    description: 'Rayakan tanggal jadian kalian berdua.',
    price: 8000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    category: 'romance',
    maxEdits: 2,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Tanggal', 'Pesan', 'Warna']
  },
  {
    id: 'ldt',
    name: 'Long Distance',
    description: 'Untuk pasangan LDR yang tetap setia.',
    price: 5000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    category: 'romance',
    maxEdits: 2,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'good-night',
    name: 'Selamat Malam',
    description: 'Ucapan selamat malam manis sebelum tidur.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    category: 'romance',
    maxEdits: 999,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'good-morning',
    name: 'Selamat Pagi',
    description: 'Sapa pagi yang hangat untuk orang spesial.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    category: 'romance',
    maxEdits: 999,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'proposal',
    name: 'Proposal',
    description: 'Pernyataan perasaan / ajakan serius yang berkesan.',
    price: 10000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    category: 'romance',
    maxEdits: 2,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Pesan', 'Tombol', 'Warna']
  },
  {
    id: 'untuk-sahabat',
    name: 'Untuk Sahabat',
    description: 'Untuk sahabat yang selalu ada di sisi.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: true,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'bestie',
    name: 'Bestie',
    description: 'Spesial buat bestie yang paling ngerti kamu.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: true,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'bestod',
    name: 'Bestod / Bros',
    description: 'Buat bestod / sobat cowok yang solid.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'teman-sekolah',
    name: 'Teman Sekolah',
    description: 'Nostalgia & ucapan untuk teman sekolah.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'teman-kerja',
    name: 'Teman Kerja',
    description: 'Apresiasi untuk rekan kerja yang suportif.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'circle',
    name: 'Circle / Geng',
    description: 'Buat circle sahabat yang solid banget.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'teman-jauh',
    name: 'Teman Jauh',
    description: 'Untuk teman yang jauh secara jarak, dekat di hati.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'teman-baru',
    name: 'Teman Baru',
    description: 'Sambutan hangat untuk teman baru.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'selamat-ulang-tahun-sahabat',
    name: 'Ultah Sahabat',
    description: 'Ulang tahun spesial buat sahabat/bestie.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 999,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'selamat-ulang-tahun-pacar',
    name: 'Ultah Pacar',
    description: 'Ulang tahun romantis untuk pacar.',
    price: 5000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 2,
    active: true,
    featured: true,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'selamat-wisuda-sahabat',
    name: 'Wisuda Sahabat',
    description: 'Ucapan wisuda untuk sahabat yang berjuang.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 999,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'semangat',
    name: 'Semangat!',
    description: 'Dorongan semangat untuk orang yang kamu sayang.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'bangga',
    name: 'Aku Bangga',
    description: 'Sampaikan rasa bangga pada seseorang.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'dukungan',
    name: 'Dukungan',
    description: 'Pesan dukungan di masa sulit.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'miss-you',
    name: 'Miss You',
    description: 'Sampaikan \'kangen\' dengan cara manis.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    category: 'romance',
    maxEdits: 999,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'just-because',
    name: 'Just Because',
    description: 'Kirim sesuatu manis tanpa alasan khusus.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'salam-kenal',
    name: 'Salam Kenal',
    description: 'Perkenalan manis untuk orang yang baru dikenal.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'teman-lama',
    name: 'Teman Lama',
    description: 'Reuni perasaan untuk teman lama.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'crush',
    name: 'Untuk Crush',
    description: 'Pesan lembut untuk orang yang kamu sukai diam-diam.',
    price: 5000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    category: 'romance',
    maxEdits: 2,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'mantan-baik',
    name: 'Damai dengan Masa Lalu',
    description: 'Pesan dewasa untuk menutup bab lama dengan baik.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1455390580327-9a4658c1d3d5?w=600&q=80',
    category: 'letter',
    maxEdits: 999,
    active: true,
    featured: false,
    features: ['Judul', 'Pesan', 'Nama', 'Warna']
  },
  {
    id: 'keluarga',
    name: 'Untuk Keluarga',
    description: 'Pesan hangat untuk keluarga tercinta.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'orang-tua',
    name: 'Untuk Orang Tua',
    description: 'Ucapan syukur untuk ayah/ibu.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'anniversary-100hari',
    name: 'Anniversary 100Hari',
    description: 'Template Anniversary 100Hari — cocok dibagikan lewat link.',
    price: 3000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    category: 'romance',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'anniversary-1bln',
    name: 'Anniversary 1Bln',
    description: 'Template Anniversary 1Bln — cocok dibagikan lewat link.',
    price: 3000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    category: 'romance',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'anniversary-1th',
    name: 'Anniversary 1Th',
    description: 'Template Anniversary 1Th — cocok dibagikan lewat link.',
    price: 3000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    category: 'romance',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'api-semangat',
    name: 'Api Semangat',
    description: 'Template Api Semangat — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'bangun-pagi',
    name: 'Bangun Pagi',
    description: 'Template Bangun Pagi — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'best-friend-day',
    name: 'Best Friend Day',
    description: 'Template Best Friend Day — cocok dibagikan lewat link.',
    price: 2000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    category: 'friendship',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'bintang-harapan',
    name: 'Bintang Harapan',
    description: 'Template Bintang Harapan — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'bros-day',
    name: 'Bros Day',
    description: 'Template Bros Day — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    category: 'friendship',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'bulan-bintang',
    name: 'Bulan Bintang',
    description: 'Template Bulan Bintang — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'catatan-kecil',
    name: 'Catatan Kecil',
    description: 'Template Catatan Kecil — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'circle-day',
    name: 'Circle Day',
    description: 'Template Circle Day — cocok dibagikan lewat link.',
    price: 2000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    category: 'friendship',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'curhat-partner',
    name: 'Curhat Partner',
    description: 'Template Curhat Partner — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'diet-semangat',
    name: 'Diet Semangat',
    description: 'Template Diet Semangat — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'doa-untukmu',
    name: 'Doa Untukmu',
    description: 'Template Doa Untukmu — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1455390580327-9a4658c1d3d5?w=600&q=80',
    category: 'letter',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'foto-kita',
    name: 'Foto Kita',
    description: 'Template Foto Kita — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'foto-polaroid-2',
    name: 'Foto Polaroid 2',
    description: 'Template Foto Polaroid 2 — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'gaming-bareng',
    name: 'Gaming Bareng',
    description: 'Template Gaming Bareng — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'get-well-soon',
    name: 'Get Well Soon',
    description: 'Template Get Well Soon — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'guru-favorit',
    name: 'Guru Favorit',
    description: 'Template Guru Favorit — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'halloween',
    name: 'Halloween',
    description: 'Template Halloween — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&q=80',
    category: 'holiday',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'hari-anak',
    name: 'Hari Anak',
    description: 'Template Hari Anak — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&q=80',
    category: 'family',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'hari-ayah-premium',
    name: 'Hari Ayah Premium',
    description: 'Template premium Hari Ayah Premium: foto + video + pesan personal.',
    price: 18000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: true,
    features: ['Foto', 'Video', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'hari-ayah',
    name: 'Hari Ayah',
    description: 'Template Hari Ayah — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&q=80',
    category: 'family',
    maxEdits: 999,
    active: true,
    featured: true,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'hari-batik',
    name: 'Hari Batik',
    description: 'Template Hari Batik — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&q=80',
    category: 'holiday',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'hari-bumi',
    name: 'Hari Bumi',
    description: 'Template Hari Bumi — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'hari-cinta',
    name: 'Hari Cinta',
    description: 'Template Hari Cinta — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    category: 'romance',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'hari-guru-premium',
    name: 'Hari Guru Premium',
    description: 'Template premium Hari Guru Premium: foto + video + pesan personal.',
    price: 18000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: true,
    features: ['Foto', 'Video', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'hari-guru',
    name: 'Hari Guru',
    description: 'Template Hari Guru — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 999,
    active: true,
    featured: true,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'hari-ibu-premium',
    name: 'Hari Ibu Premium',
    description: 'Template premium Hari Ibu Premium: foto + video + pesan personal.',
    price: 18000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: true,
    features: ['Foto', 'Video', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'hari-ibu',
    name: 'Hari Ibu',
    description: 'Template Hari Ibu — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&q=80',
    category: 'family',
    maxEdits: 999,
    active: true,
    featured: true,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'hari-kakek-nenek',
    name: 'Hari Kakek Nenek',
    description: 'Template Hari Kakek Nenek — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&q=80',
    category: 'family',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'hari-kartini',
    name: 'Hari Kartini',
    description: 'Template Hari Kartini — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&q=80',
    category: 'holiday',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'hari-keluarga',
    name: 'Hari Keluarga',
    description: 'Template Hari Keluarga — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&q=80',
    category: 'family',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'hari-kemerdekaan',
    name: 'Hari Kemerdekaan',
    description: 'Template Hari Kemerdekaan — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&q=80',
    category: 'holiday',
    maxEdits: 999,
    active: true,
    featured: true,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'hari-kesehatan-mental',
    name: 'Hari Kesehatan Mental',
    description: 'Template Hari Kesehatan Mental — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'hari-pahlawan',
    name: 'Hari Pahlawan',
    description: 'Template Hari Pahlawan — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&q=80',
    category: 'holiday',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'hari-pendidikan',
    name: 'Hari Pendidikan',
    description: 'Template Hari Pendidikan — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'hari-perempuan',
    name: 'Hari Perempuan',
    description: 'Template Hari Perempuan — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'hari-pria',
    name: 'Hari Pria',
    description: 'Template Hari Pria — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'hari-sahabat-premium',
    name: 'Hari Sahabat Premium',
    description: 'Template premium Hari Sahabat Premium: foto + video + pesan personal.',
    price: 18000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: true,
    features: ['Foto', 'Video', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'hari-sahabat',
    name: 'Hari Sahabat',
    description: 'Template Hari Sahabat — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    category: 'friendship',
    maxEdits: 999,
    active: true,
    featured: true,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'hari-siswa',
    name: 'Hari Siswa',
    description: 'Template Hari Siswa — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'hari-sumpah-pemuda',
    name: 'Hari Sumpah Pemuda',
    description: 'Template Hari Sumpah Pemuda — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&q=80',
    category: 'holiday',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'hari-teman',
    name: 'Hari Teman',
    description: 'Template Hari Teman — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    category: 'friendship',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'hujan-dan-kamu',
    name: 'Hujan Dan Kamu',
    description: 'Template Hujan Dan Kamu — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'idul-adha',
    name: 'Idul Adha',
    description: 'Template Idul Adha — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&q=80',
    category: 'holiday',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'idul-fitri',
    name: 'Idul Fitri',
    description: 'Template Idul Fitri — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&q=80',
    category: 'holiday',
    maxEdits: 999,
    active: true,
    featured: true,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'imlek',
    name: 'Imlek',
    description: 'Template Imlek — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&q=80',
    category: 'holiday',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'jalan-santai',
    name: 'Jalan Santai',
    description: 'Template Jalan Santai — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'janji-kita',
    name: 'Janji Kita',
    description: 'Template Janji Kita — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'jumat-berkah',
    name: 'Jumat Berkah',
    description: 'Template Jumat Berkah — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'kangen-banget',
    name: 'Kangen Banget',
    description: 'Template Kangen Banget — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'kenangan-kita',
    name: 'Kenangan Kita',
    description: 'Template Kenangan Kita — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'kenangan-sekolah',
    name: 'Kenangan Sekolah',
    description: 'Template Kenangan Sekolah — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'kopi-pagi',
    name: 'Kopi Pagi',
    description: 'Template Kopi Pagi — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'lagu-kita',
    name: 'Lagu Kita',
    description: 'Template Lagu Kita — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'liburan-impian',
    name: 'Liburan Impian',
    description: 'Template Liburan Impian — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&q=80',
    category: 'family',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'maaf-sayang',
    name: 'Maaf Sayang',
    description: 'Template Maaf Sayang — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    category: 'romance',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'maaf-teman',
    name: 'Maaf Teman',
    description: 'Template Maaf Teman — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    category: 'friendship',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'makasih-sayang',
    name: 'Makasih Sayang',
    description: 'Template Makasih Sayang — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    category: 'romance',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'malam-sayang',
    name: 'Malam Sayang',
    description: 'Template Malam Sayang — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    category: 'romance',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'malam-tenang',
    name: 'Malam Tenang',
    description: 'Template Malam Tenang — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'masak-bareng',
    name: 'Masak Bareng',
    description: 'Template Masak Bareng — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'musim-baru',
    name: 'Musim Baru',
    description: 'Template Musim Baru — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'natal-premium',
    name: 'Natal Premium',
    description: 'Template premium Natal Premium: foto + video + pesan personal.',
    price: 20000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: true,
    features: ['Foto', 'Video', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'natal',
    name: 'Natal',
    description: 'Template Natal — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&q=80',
    category: 'holiday',
    maxEdits: 999,
    active: true,
    featured: true,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'nonton-bareng',
    name: 'Nonton Bareng',
    description: 'Template Nonton Bareng — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'nyepi',
    name: 'Nyepi',
    description: 'Template Nyepi — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&q=80',
    category: 'holiday',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'olahraga-yuk',
    name: 'Olahraga Yuk',
    description: 'Template Olahraga Yuk — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'ospek-welcome',
    name: 'Ospek Welcome',
    description: 'Template Ospek Welcome — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'pagi-produktif',
    name: 'Pagi Produktif',
    description: 'Template Pagi Produktif — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'pagi-sayang',
    name: 'Pagi Sayang',
    description: 'Template Pagi Sayang — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    category: 'romance',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'pelangi-kita',
    name: 'Pelangi Kita',
    description: 'Template Pelangi Kita — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'pelukan-maya',
    name: 'Pelukan Maya',
    description: 'Template Pelukan Maya — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'pesan-pendek',
    name: 'Pesan Pendek',
    description: 'Template Pesan Pendek — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1455390580327-9a4658c1d3d5?w=600&q=80',
    category: 'letter',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'pindah-kota',
    name: 'Pindah Kota',
    description: 'Template Pindah Kota — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'polaroid-kenangan',
    name: 'Polaroid Kenangan',
    description: 'Template Polaroid Kenangan — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'puisi-pendek',
    name: 'Puisi Pendek',
    description: 'Template Puisi Pendek — cocok dibagikan lewat link.',
    price: 2000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1455390580327-9a4658c1d3d5?w=600&q=80',
    category: 'letter',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'quote-untukmu',
    name: 'Quote Untukmu',
    description: 'Template Quote Untukmu — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1455390580327-9a4658c1d3d5?w=600&q=80',
    category: 'letter',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'sahabat-sejatiku',
    name: 'Sahabat Sejatiku',
    description: 'Template Sahabat Sejatiku — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    category: 'friendship',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'selamat-kerja-baru',
    name: 'Selamat Kerja Baru',
    description: 'Template Selamat Kerja Baru — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'selamat-lulus',
    name: 'Selamat Lulus',
    description: 'Template Selamat Lulus — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'selamat-promosi',
    name: 'Selamat Promosi',
    description: 'Template Selamat Promosi — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'selamat-tidur',
    name: 'Selamat Tidur',
    description: 'Template Selamat Tidur — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'self-love',
    name: 'Self Love',
    description: 'Template Self Love — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'semangat-sayang',
    name: 'Semangat Sayang',
    description: 'Template Semangat Sayang — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    category: 'romance',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'semangat-ujian',
    name: 'Semangat Ujian',
    description: 'Template Semangat Ujian — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'senin-semangat',
    name: 'Senin Semangat',
    description: 'Template Senin Semangat — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'senyummu',
    name: 'Senyummu',
    description: 'Template Senyummu — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'stiker-pesan',
    name: 'Stiker Pesan',
    description: 'Template Stiker Pesan — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1455390580327-9a4658c1d3d5?w=600&q=80',
    category: 'letter',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'surat-malam',
    name: 'Surat Malam',
    description: 'Template Surat Malam — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1455390580327-9a4658c1d3d5?w=600&q=80',
    category: 'letter',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'surat-pacar',
    name: 'Surat Pacar',
    description: 'Template Surat Pacar — cocok dibagikan lewat link.',
    price: 2000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    category: 'romance',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'surat-pagi',
    name: 'Surat Pagi',
    description: 'Template Surat Pagi — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1455390580327-9a4658c1d3d5?w=600&q=80',
    category: 'letter',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'surat-perpisahan',
    name: 'Surat Perpisahan',
    description: 'Template Surat Perpisahan — cocok dibagikan lewat link.',
    price: 2000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1455390580327-9a4658c1d3d5?w=600&q=80',
    category: 'letter',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'surat-rahasia',
    name: 'Surat Rahasia',
    description: 'Template Surat Rahasia — cocok dibagikan lewat link.',
    price: 2000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1455390580327-9a4658c1d3d5?w=600&q=80',
    category: 'letter',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'surat-reuni',
    name: 'Surat Reuni',
    description: 'Template Surat Reuni — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1455390580327-9a4658c1d3d5?w=600&q=80',
    category: 'letter',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'tahun-baru-premium',
    name: 'Tahun Baru Premium',
    description: 'Template premium Tahun Baru Premium: foto + video + pesan personal.',
    price: 20000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: true,
    features: ['Foto', 'Video', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'tahun-baru',
    name: 'Tahun Baru',
    description: 'Template Tahun Baru — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&q=80',
    category: 'holiday',
    maxEdits: 999,
    active: true,
    featured: true,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'tawa-kita',
    name: 'Tawa Kita',
    description: 'Template Tawa Kita — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'teman-sekelas',
    name: 'Teman Sekelas',
    description: 'Template Teman Sekelas — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    category: 'friendship',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'teman-seperjuangan',
    name: 'Teman Seperjuangan',
    description: 'Template Teman Seperjuangan — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    category: 'friendship',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'terima-kasih-teman',
    name: 'Terima Kasih Teman',
    description: 'Template Terima Kasih Teman — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    category: 'friendship',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'thanksgiving',
    name: 'Thanksgiving',
    description: 'Template Thanksgiving — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&q=80',
    category: 'holiday',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'tiket-kenangan',
    name: 'Tiket Kenangan',
    description: 'Template Tiket Kenangan — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'ulang-tahun-bestie-fun',
    name: 'Ulang Tahun Bestie Fun',
    description: 'Template Ulang Tahun Bestie Fun — cocok dibagikan lewat link.',
    price: 2000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    category: 'friendship',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'undangan-ngopi',
    name: 'Undangan Ngopi',
    description: 'Template Undangan Ngopi — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'undangan-nongkrong',
    name: 'Undangan Nongkrong',
    description: 'Template Undangan Nongkrong — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'untuk-adik',
    name: 'Untuk Adik',
    description: 'Template Untuk Adik — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'untuk-dirimu',
    name: 'Untuk Dirimu',
    description: 'Template Untuk Dirimu — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'untuk-kakak',
    name: 'Untuk Kakak',
    description: 'Template Untuk Kakak — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'untuk-mentor',
    name: 'Untuk Mentor',
    description: 'Template Untuk Mentor — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'untuk-partner-bisnis',
    name: 'Untuk Partner Bisnis',
    description: 'Template Untuk Partner Bisnis — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'untuk-sepupu',
    name: 'Untuk Sepupu',
    description: 'Template Untuk Sepupu — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&q=80',
    category: 'family',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'untuk-tetangga',
    name: 'Untuk Tetangga',
    description: 'Template Untuk Tetangga — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'valentine-free',
    name: 'Valentine Free',
    description: 'Template Valentine Free — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    category: 'romance',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'video-cinta',
    name: 'Video Cinta Premium',
    description: 'Template premium Video Cinta Premium: foto + video + pesan personal.',
    price: 18000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: true,
    features: ['Foto', 'Video', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'video-keluarga',
    name: 'Video Keluarga',
    description: 'Template premium Video Keluarga: foto + video + pesan personal.',
    price: 18000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: true,
    features: ['Foto', 'Video', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'video-kenangan',
    name: 'Video Kenangan',
    description: 'Template premium Video Kenangan: foto + video + pesan personal.',
    price: 18000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: true,
    features: ['Foto', 'Video', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'video-proposal',
    name: 'Video Proposal Premium',
    description: 'Template premium Video Proposal Premium: foto + video + pesan personal.',
    price: 25000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: true,
    features: ['Foto', 'Video', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'video-sahabat',
    name: 'Video Sahabat',
    description: 'Template premium Video Sahabat: foto + video + pesan personal.',
    price: 18000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: true,
    features: ['Foto', 'Video', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'video-tahun-baru',
    name: 'Video Tahun Baru',
    description: 'Template premium Video Tahun Baru: foto + video + pesan personal.',
    price: 20000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: true,
    features: ['Foto', 'Video', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'video-ultah',
    name: 'Video Ultah',
    description: 'Template premium Video Ultah: foto + video + pesan personal.',
    price: 18000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: true,
    features: ['Foto', 'Video', 'Nama', 'Pesan', 'Warna']
  },
  {
    id: 'waisak',
    name: 'Waisak',
    description: 'Template Waisak — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&q=80',
    category: 'holiday',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'weekend-bareng',
    name: 'Weekend Bareng',
    description: 'Template Weekend Bareng — cocok dibagikan lewat link.',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80',
    category: 'personal',
    maxEdits: 999,
    active: true,
    featured: false,
    hasVideo: false,
    features: ['Foto', 'Nama', 'Pesan', 'Warna tema']
  },
  {
    id: 'wisuda-premium',
    name: 'Wisuda Premium',
    description: 'Template premium Wisuda Premium: foto + video + pesan personal.',
    price: 18000,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1464349153735-7db55fd30e4e?w=600&q=80',
    category: 'celebration',
    maxEdits: 2,
    active: true,
    featured: false,
    hasVideo: true,
    features: ['Foto', 'Video', 'Nama', 'Pesan', 'Warna']
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
