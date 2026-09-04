# 𝓤𝓷𝓽𝓾𝓴 𝓚𝓪𝓶𝓾

Platform marketplace / template builder untuk membuat project digital personal yang dapat dibagikan melalui link.

## Fitur Utama

- Login / Register / Google Login (Firebase Auth)
- Katalog template gratis & berbayar
- Editor project (teks, foto, warna)
- Sistem saldo internal + Top Up QRIS
- Admin panel (hanya `raffliraffli649@gmail.com`)
- Project publik via kode unik (`p.html?code=XXXX`)
- Dark / Light mode
- Fully responsive
- Loading animation antar halaman
- Font Awesome icons (tanpa emoji)

## Struktur File

```
├── index.html          # Beranda
├── login.html
├── register.html
├── template.html       # Katalog template
├── detail.html         # Detail template
├── editor.html         # Editor project
├── proyek.html         # Proyek Saya
├── p.html              # Public project viewer
├── profile.html        # Akun Saya
├── topup.html          # Top Up saldo
├── about.html
├── admin.html          # Admin Panel
├── css/style.css       # Satu file CSS untuk seluruh website
├── js/
│   ├── firebase-config.js
│   ├── auth.js
│   ├── index.js
│   ├── login.js
│   ├── register.js
│   ├── templates.js
│   ├── detail.js
│   ├── projects.js
│   ├── editor.js
│   ├── public-project.js
│   ├── profile.js
│   ├── topup.js
│   └── admin.js
└── templates/
    ├── untuk-kamu/index.html
    ├── nembak/index.html
    ├── ulang-tahun/   (tambahkan sendiri)
    └── undangan/      (tambahkan sendiri)
```

## Setup Firebase

1. Buat project di [Firebase Console](https://console.firebase.google.com)
2. Aktifkan **Authentication** → Email/Password + Google
3. Buat **Firestore Database**
4. Aktifkan **Storage**
5. Salin konfigurasi web ke `js/firebase-config.js`

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

6. **Firestore Indexes** yang dibutuhkan:
   - Collection `projects`: `ownerId` ASC + `createdAt` DESC
   - Collection `projects`: `code` ASC
   - Collection `topups`: `createdAt` DESC

7. **Firestore Security Rules** (contoh dasar — sesuaikan):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && request.auth.token.email == 'raffliraffli649@gmail.com';
    }
    
    match /users/{userId} {
      allow read: if request.auth != null && (request.auth.uid == userId || isAdmin());
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if isAdmin(); // saldo hanya diubah lewat backend/admin
    }
    
    match /projects/{projectId} {
      allow read: if true; // public by code
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.ownerId == request.auth.uid;
    }
    
    match /templates/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /topups/{id} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && (resource.data.userId == request.auth.uid || isAdmin());
      allow update: if isAdmin();
    }
    
    match /purchases/{id} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if false; // hanya via Cloud Function
    }
    
    match /balance_history/{id} {
      allow read: if request.auth != null && (resource.data.userId == request.auth.uid || isAdmin());
      allow write: if false;
    }
  }
}
```

## Cloud Functions (Disarankan untuk Produksi)

Proses berikut **wajib** dipindah ke Cloud Functions agar aman:

- Pembelian template (cek harga asli + potong saldo + buat project) — gunakan Transaction
- Approval top up + penambahan saldo
- Admin tambah/kurangi saldo
- Validasi batas edit project berbayar
- Generate kode project unik

Jangan percaya harga/nominal yang dikirim dari frontend.

## QRIS

Ganti gambar QRIS di `topup.html` dengan QRIS milik admin:

```html
<img src="path/ke/qris-anda.png" alt="QRIS" class="qris-img">
```

## Deploy

Frontend bisa di-host di:
- Vercel
- Netlify
- Firebase Hosting
- GitHub Pages

```bash
# Contoh Vercel
vercel --prod
```

## Catatan Penting

- Admin hanya untuk email: `raffliraffli649@gmail.com`
- Validasi admin dilakukan di client **dan** harus diulang di server (Security Rules / Cloud Functions)
- Project gratis: edit unlimited + branding kecil di bawah
- Project berbayar: max 2 edit + tanpa branding
- Top up min Rp2.000 — max Rp1.000.000
- Semua warna identitas: Biru muda + Pink + Ungu dengan gradient & glow

## Mode Demo

Tanpa konfigurasi Firebase, website tetap bisa dibuka dan dinavigasi. Fitur auth, saldo, dan penyimpanan project memerlukan Firebase yang sudah dikonfigurasi.
