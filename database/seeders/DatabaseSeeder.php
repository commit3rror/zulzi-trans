<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // Pastikan urutannya benar
            LayananSeeder::class, // Data Layanan (Agar dropdown Armada muncul)
            PenggunaSeeder::class, // Data Pengguna Dummy (Baru)
            SupirSeeder::class,
            UlasanSeeder::class,
        ]);
    }
}