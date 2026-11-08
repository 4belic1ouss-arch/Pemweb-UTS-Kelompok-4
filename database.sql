-- ============================================================
-- database.sql - Aplikasi Pemesanan Paket Katering (UTS Pemrograman Web)
-- Struktur 5 tabel: pelanggan, menu, paket, paket_menu, pemesanan
-- ============================================================
-- BAGIAN 1: DDL (struktur tabel)
-- Untuk draw.io: salin dari "CREATE TABLE pelanggan" sampai akhir
-- "CREATE TABLE pemesanan", lalu tempel di Arrange > Insert > Advanced > SQL.
-- ============================================================

DROP DATABASE IF EXISTS katering_db;
CREATE DATABASE katering_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE katering_db;

CREATE TABLE pelanggan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  no_hp VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  alamat TEXT
);

CREATE TABLE menu (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_menu VARCHAR(100) NOT NULL,
  kategori ENUM('Makanan','Minuman') NOT NULL,
  harga DECIMAL(10,2) NOT NULL,
  deskripsi TEXT,
  stok INT NOT NULL DEFAULT 0,
  gambar VARCHAR(255)
);

CREATE TABLE paket (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_paket VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  harga DECIMAL(10,2) NOT NULL,
  kapasitas INT NOT NULL,
  tersedia TINYINT(1) NOT NULL DEFAULT 1,
  gambar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE paket_menu (
  paket_id INT NOT NULL,
  menu_id INT NOT NULL,
  jumlah INT NOT NULL DEFAULT 1,
  PRIMARY KEY (paket_id, menu_id),
  FOREIGN KEY (paket_id) REFERENCES paket(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_id) REFERENCES menu(id) ON DELETE RESTRICT
);

CREATE TABLE pemesanan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pelanggan_id INT NOT NULL,
  paket_id INT NOT NULL,
  jumlah_paket INT NOT NULL DEFAULT 1,
  tanggal_pemesanan DATE NOT NULL,
  tanggal_pengiriman DATE NOT NULL,
  total_harga DECIMAL(12,2) NOT NULL DEFAULT 0,
  status ENUM('diproses','dikirim','selesai','batal') NOT NULL DEFAULT 'diproses',
  FOREIGN KEY (pelanggan_id) REFERENCES pelanggan(id) ON DELETE RESTRICT,
  FOREIGN KEY (paket_id) REFERENCES paket(id) ON DELETE RESTRICT
);

-- ============================================================
-- BAGIAN 2: DML (data sampel)
-- ============================================================

INSERT INTO pelanggan (nama, no_hp, email, alamat) VALUES
('Ni Made Ayu', '081234567801', 'ayu@example.com', 'Jl. Sunset Road No. 12, Denpasar'),
('Kadek Putra', '081234567802', 'kadek@example.com', 'Jl. Imam Bonjol No. 45, Denpasar'),
('Wayan Sari', '081234567803', 'sari@example.com', 'Jl. Teuku Umar No. 7, Denpasar'),
('Komang Dewi', '081234567804', 'dewi@example.com', 'Jl. Gatot Subroto No. 21, Denpasar'),
('Gede Arta', '081234567805', 'arta@example.com', 'Jl. Raya Kuta No. 88, Badung');

-- Harga per porsi diatur agar jumlah menu dalam 1 paket = harga paket per orang
-- (Hemat 25.000, Reguler 35.000, Premium 50.000)
INSERT INTO menu (nama_menu, kategori, harga, deskripsi, stok, gambar) VALUES
('Nasi Putih', 'Makanan', 5000, 'Nasi putih hangat', 500, 'nasi-putih.jpg'),
('Ayam Goreng', 'Makanan', 12000, 'Ayam goreng bumbu kuning', 300, 'ayam-goreng.jpg'),
('Tumis Sayuran', 'Makanan', 5000, 'Tumis sayuran segar', 300, 'tumis-sayuran.jpg'),
('Sambal dan Kerupuk', 'Makanan', 3000, 'Sambal dan kerupuk pelengkap', 500, 'sambal-kerupuk.jpg'),
('Ayam Bakar', 'Makanan', 14000, 'Ayam bakar bumbu manis', 200, 'ayam-bakar.jpg'),
('Telur Balado', 'Makanan', 6000, 'Telur rebus dengan sambal balado', 300, 'telur-balado.jpg'),
('Buah Potong', 'Makanan', 5000, 'Aneka buah potong segar', 200, 'buah-potong.jpg'),
('Rendang', 'Makanan', 16000, 'Rendang daging sapi', 150, 'rendang.jpg'),
('Capcay', 'Makanan', 6000, 'Capcay sayuran kuah kental', 150, 'capcay.jpg'),
('Buah dan Puding', 'Makanan', 5000, 'Buah potong dan puding', 150, 'buah-puding.jpg');

-- harga paket = harga per orang x kapasitas (orang)
-- Hemat   : Rp25.000/orang x 10  =   250.000
-- Reguler : Rp35.000/orang x 25  =   875.000
-- Premium : Rp50.000/orang x 100 = 5.000.000
INSERT INTO paket (nama_paket, deskripsi, harga, kapasitas, gambar) VALUES
('Paket Hemat', 'Ekonomis (Rp25.000/orang): nasi putih, ayam goreng, tumis sayuran, sambal dan kerupuk', 250000, 10, 'paket-hemat.jpg'),
('Paket Reguler', 'Menengah (Rp35.000/orang): nasi putih, ayam bakar, telur balado, tumis sayuran, buah potong', 875000, 25, 'paket-reguler.jpg'),
('Paket Premium', 'Eksklusif (Rp50.000/orang): nasi putih, rendang, ayam goreng, telur balado, capcay, buah dan puding', 5000000, 100, 'paket-premium.jpg');

-- Kolom jumlah = banyaknya menu tersebut di dalam satu paket (1 porsi per orang, jadi jumlah = kapasitas paket)
-- menu_id: 1 Nasi Putih, 2 Ayam Goreng, 3 Tumis Sayuran, 4 Sambal dan Kerupuk, 5 Ayam Bakar,
--          6 Telur Balado, 7 Buah Potong, 8 Rendang, 9 Capcay, 10 Buah dan Puding
INSERT INTO paket_menu (paket_id, menu_id, jumlah) VALUES
(1, 1, 10), (1, 2, 10), (1, 3, 10), (1, 4, 10),
(2, 1, 25), (2, 5, 25), (2, 6, 25), (2, 3, 25), (2, 7, 25),
(3, 1, 100), (3, 8, 100), (3, 2, 100), (3, 6, 100), (3, 9, 100), (3, 10, 100);

-- total_harga = harga paket x jumlah_paket
INSERT INTO pemesanan (pelanggan_id, paket_id, jumlah_paket, tanggal_pemesanan, tanggal_pengiriman, total_harga, status) VALUES
(1, 1, 1, '2026-11-01', '2026-11-05', 250000, 'selesai'),
(2, 2, 2, '2026-11-03', '2026-11-08', 1750000, 'dikirim'),
(3, 3, 1, '2026-11-05', '2026-11-15', 5000000, 'diproses'),
(4, 1, 3, '2026-11-06', '2026-11-10', 750000, 'diproses'),
(5, 2, 1, '2026-11-07', '2026-11-12', 875000, 'batal');