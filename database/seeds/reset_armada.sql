-- RESET DATA ARMADA (DELETE EXISTING)
DELETE FROM armada;

-- INSERT DATA BARU DENGAN MAPPING YANG BENAR
-- ========== ANGKUTAN / ANGKUT BARANG ==========
INSERT INTO armada (no_plat, jenis_kendaraan, kapasitas, harga_sewa_per_hari, status_ketersediaan, layanan, gambar, created_at, updated_at) 
VALUES ('B 1001 ZUL', 'CDD', '19 Orang', 800000, 'Tersedia', 'Angkutan', 'cdd.jpg', NOW(), NOW());

INSERT INTO armada (no_plat, jenis_kendaraan, kapasitas, harga_sewa_per_hari, status_ketersediaan, layanan, gambar, created_at, updated_at) 
VALUES ('B 2002 TRANS', 'Fuso', '4 Ton', 1200000, 'Tersedia', 'Angkutan', 'fuso.jpg', NOW(), NOW());

-- ========== SAMPAH / ANGKUT SAMPAH ==========
INSERT INTO armada (no_plat, jenis_kendaraan, kapasitas, harga_sewa_per_hari, status_ketersediaan, layanan, gambar, created_at, updated_at) 
VALUES ('B 3003 EBK', 'Engkel Bak', '5 Ton', 550000, 'Tersedia', 'Sampah', 'engkel_bak.jpg', NOW(), NOW());

INSERT INTO armada (no_plat, jenis_kendaraan, kapasitas, harga_sewa_per_hari, status_ketersediaan, layanan, gambar, created_at, updated_at) 
VALUES ('B 4004 EBX', 'Engkel Bok', '3 Ton', 500000, 'Tersedia', 'Sampah', 'engkel_bok.jpg', NOW(), NOW());

-- ========== RENTAL / SEWA KENDARAAN ==========
INSERT INTO armada (no_plat, jenis_kendaraan, kapasitas, harga_sewa_per_hari, status_ketersediaan, layanan, gambar, created_at, updated_at) 
VALUES ('B 5005 RENTAL', 'Avanza', '7 Orang', 450000, 'Tersedia', 'Rental', 'avanza.jpg', NOW(), NOW());

INSERT INTO armada (no_plat, jenis_kendaraan, kapasitas, harga_sewa_per_hari, status_ketersediaan, layanan, gambar, created_at, updated_at) 
VALUES ('B 6006 ZULZI', 'Innova', '8 Orang', 750000, 'Tersedia', 'Rental', 'innova.jpg', NOW(), NOW());
