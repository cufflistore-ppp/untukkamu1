# Untuk Kamu — Platform Template Digital Personal

Marketplace template digital (nembak, ulang tahun, wisuda, dll) dengan sistem saldo internal, top up QRIS + upload bukti, panel admin, editor tema, dan link shareable.

## Fitur Utama (sesuai spesifikasi)

- Login Google (Firebase Auth)
- Katalog template gratis & berbayar
- Editor project (teks, foto, warna) + live preview
- Sistem saldo real-time + Top Up QRIS + upload bukti TF (tanpa WhatsApp)
- Panel Admin **hanya** untuk `untukkamuu521@gmail.com`
  - Isi saldo user
  - Lihat bukti TF (gambar)
  - Galeri foto project
  - Riwayat top up
- PIN protection untuk link project
- Dark / Light mode
- Fully responsive (mobile-first)
- Upload gambar via **ImgBB** (tidak pakai Firebase Storage — sesuai Spark plan)
- Open Graph meta untuk share link

## Konfigurasi Penting

### ImgBB API Key
Di `firebase-config.js`:
```js
const IMGBB_API_KEY = "8b13b584cdf42031718bc034eefcef14";
```
Ganti jika perlu.

### Firebase
Sudah terisi project `untukkamu-751db`. Pastikan:
1. Authentication → Google enabled
2. Firestore aktif
3. Security Rules sesuai `firestore.rules` (admin email hard-coded)

### Logo & QRIS
- `logo.jpg` — logo resmi Untuk Kamu
- `qris.jpg` — QRIS admin untuk top up

## Struktur

Multi-page HTML + JS:
- `index.html` — Beranda
- `template.html` — Katalog
- `editor.html` — Editor project
- `p.html` — Public viewer (dengan PIN)
- `proyek.html` — Proyek Saya
- `topup.html` + `pembayaran.html` — Top up flow (QRIS + upload bukti)
- `admin.html` — Panel Admin
- `profile.html`, `about.html`, dll.

## Deploy

Bisa di-host di Vercel / Netlify / Firebase Hosting / GitHub Pages.

```bash
# Contoh
vercel --prod
```

## Catatan Keamanan

- Validasi admin & potongan saldo **wajib** di Firestore Rules / Cloud Functions (jangan hanya frontend).
- Spark plan: tidak ada Cloud Functions gratis unlimited — gunakan Rules ketat.
- Foto disimpan sebagai URL ImgBB di Firestore, bukan binary.

© 2026 Untuk Kamu
