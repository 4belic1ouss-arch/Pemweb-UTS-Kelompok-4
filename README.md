# Aplikasi Pemesanan Paket Katering

UTS Pemrograman Web - Express, EJS (SSR), MySQL, arsitektur MVC.

## Cara menjalankan

1. Impor database: `mysql -u root -p < database.sql`
2. Salin `.env.example` menjadi `.env`, lalu isi `DB_USER` dan `DB_PASSWORD`.
3. Pasang dependensi: `npm install`
4. Jalankan: `npm run dev` (atau `npm start`), lalu buka http://localhost:3000

## Struktur proyek

- `config/` koneksi MySQL (connection pool)
- `controllers/` logika tiap modul
- `models/` query SQL (prepared statement)
- `routes/` pemetaan URL
- `views/` tampilan EJS (`partials/` untuk header, navbar, footer)
- `public/` CSS dan gambar
- `docs/` ERD
- `database.sql` skema tabel dan data sampel

## Pembagian modul

| Anggota | Modul | Tugas tambahan |
|---|---|---|
| 1 | CRUD Menu | ERD dan database.sql |
| 2 | CRUD Paket | Koneksi MySQL dan konfigurasi Express |
| 3 | CRUD Pelanggan | Dashboard dan EJS partials |
| 4 | CRUD Pemesanan | Gabung routes, uji aplikasi, koordinasi GitHub |

## Aturan tim

- Branch per modul: `feat/menu`, `feat/paket`, `feat/pelanggan`, `feat/pemesanan`.
- Pesan commit memakai Conventional Commits, contoh: `feat(menu): add create form`.
- Semua query SQL memakai `?` (prepared statement). Setelah POST selalu `res.redirect()`.
- Jangan commit `.env` dan `node_modules/`.
- File `routes/paketRoutes.js`, `pelangganRoutes.js`, dan `pemesananRoutes.js` masih kerangka sementara. Pemilik modul menggantinya dengan route aslinya.