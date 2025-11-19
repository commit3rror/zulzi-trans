<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Armada;

class ArmadaSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                // HAPUS 'nama_armada' dan 'model' agar tidak error SQL
                'no_plat' => 'B 7281 WDA',
                'layanan' => 'Travel',
                'jenis_kendaraan' => 'Isuzu Elf Long', // Info nama dipindah ke sini
                'kapasitas' => '19 Kursi',
                'harga_sewa_per_hari' => 1500000,
                'status_ketersediaan' => 'Tersedia',
            ],
            [
                'no_plat' => 'D 1920 ABZ',
                'layanan' => 'Travel',
                'jenis_kendaraan' => 'Toyota Hiace Commuter',
                'kapasitas' => '15 Kursi',
                'harga_sewa_per_hari' => 1800000,
                'status_ketersediaan' => 'Tersedia',
            ],
            [
                'no_plat' => 'B 9921 TXA',
                'layanan' => 'Angkut Barang',
                'jenis_kendaraan' => 'Mitsubishi Fuso Box',
                'kapasitas' => '4 Ton',
                'harga_sewa_per_hari' => 2500000,
                'status_ketersediaan' => 'Tersedia',
            ],
            [
                'no_plat' => 'F 8123 SS',
                'layanan' => 'Angkut Sampah',
                'jenis_kendaraan' => 'Daihatsu Gran Max',
                'kapasitas' => '1.5 Ton',
                'harga_sewa_per_hari' => 500000,
                'status_ketersediaan' => 'Digunakan',
            ],
        ];

        foreach ($data as $item) {
            Armada::firstOrCreate(
                ['no_plat' => $item['no_plat']], 
                $item
            );
        }
    }
}