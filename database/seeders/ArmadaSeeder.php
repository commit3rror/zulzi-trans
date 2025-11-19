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
        // Pastikan tabel layanan sudah ada dan diisi (LayananSeeder)
        
        DB::table('armada')->insert([
            // ID 1 dan 2 digunakan di Form Rental
            ['id_armada' => 1, 'no_plat' => 'B 1000 ZU', 'jenis_kendaraan' => 'Mobil Passanger', 'model' => 'Avanza', 'kapasitas' => '4 Orang', 'harga_sewa_per_hari' => 300000.00, 'status_ketersediaan' => 'Tersedia'],
            ['id_armada' => 2, 'no_plat' => 'B 2000 ZU', 'jenis_kendaraan' => 'Mobil Passanger', 'model' => 'Innova Reborn', 'kapasitas' => '6 Orang', 'harga_sewa_per_hari' => 450000.00, 'status_ketersediaan' => 'Tersedia'],
            
            // ID 3, 4, 5 digunakan di Form Angkut Barang/Sampah
            ['id_armada' => 3, 'no_plat' => 'B 3000 ZU', 'jenis_kendaraan' => 'Truk', 'model' => 'Engkel Box', 'kapasitas' => '2 Ton', 'harga_sewa_per_hari' => 700000.00, 'status_ketersediaan' => 'Tersedia'],
            ['id_armada' => 4, 'no_plat' => 'B 4000 ZU', 'jenis_kendaraan' => 'Pickup', 'model' => 'L300 Bak', 'kapasitas' => '1.5 Ton', 'harga_sewa_per_hari' => 500000.00, 'status_ketersediaan' => 'Tersedia'],
            ['id_armada' => 5, 'no_plat' => 'B 5000 ZU', 'jenis_kendaraan' => 'Dump Truck', 'model' => 'Fuso', 'kapasitas' => '5 Ton', 'harga_sewa_per_hari' => 1200000.00, 'status_ketersediaan' => 'Tersedia'],
        ]);
    }
}