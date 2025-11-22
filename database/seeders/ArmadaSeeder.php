<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ArmadaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('armada')->insert([
            // ========== ANGKUTAN / ANGKUT BARANG ==========
            [
                'no_plat' => 'B 1001 ZUL',
                'jenis_kendaraan' => 'CDD Bak',
                'kapasitas' => '19 Orang',
                'harga_sewa_per_hari' => 800000,
                'status_ketersediaan' => 'Tersedia',
                'layanan' => 'Angkutan',
                'gambar' => 'cdd bak.jpeg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'no_plat' => 'B 2002 TRANS',
                'jenis_kendaraan' => 'Fuso Standar',
                'kapasitas' => '4 Ton',
                'harga_sewa_per_hari' => 1200000,
                'status_ketersediaan' => 'Tersedia',
                'layanan' => 'Angkutan',
                'gambar' => 'fuso standar.jpeg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'no_plat' => 'B 2003 TRANS',
                'jenis_kendaraan' => 'Fuso Long',
                'kapasitas' => '6 Ton',
                'harga_sewa_per_hari' => 1400000,
                'status_ketersediaan' => 'Tersedia',
                'layanan' => 'Angkutan',
                'gambar' => 'fuso long.jpeg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // ========== SAMPAH / ANGKUT SAMPAH ==========
            [
                'no_plat' => 'B 3003 EBK',
                'jenis_kendaraan' => 'Engkel Bak',
                'kapasitas' => '5 Ton',
                'harga_sewa_per_hari' => 550000,
                'status_ketersediaan' => 'Tersedia',
                'layanan' => 'Sampah',
                'gambar' => 'engkel bak.jpeg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'no_plat' => 'B 4004 EBX',
                'jenis_kendaraan' => 'Engkel Bok',
                'kapasitas' => '3 Ton',
                'harga_sewa_per_hari' => 500000,
                'status_ketersediaan' => 'Tersedia',
                'layanan' => 'Sampah',
                'gambar' => 'engkel bok.jpeg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // ========== RENTAL / SEWA KENDARAAN ==========
            [
                'no_plat' => 'B 5005 RENTAL',
                'jenis_kendaraan' => 'Avanza',
                'kapasitas' => '7 Orang',
                'harga_sewa_per_hari' => 450000,
                'status_ketersediaan' => 'Tersedia',
                'layanan' => 'Rental',
                'gambar' => 'avanza.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'no_plat' => 'B 6006 ZULZI',
                'jenis_kendaraan' => 'Innova',
                'kapasitas' => '8 Orang',
                'harga_sewa_per_hari' => 750000,
                'status_ketersediaan' => 'Tersedia',
                'layanan' => 'Rental',
                'gambar' => 'innova.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

