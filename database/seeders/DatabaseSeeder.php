<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Panggil seeder Layanan dan Armada secara berurutan
            LayananSeeder::class,
            ArmadaSeeder::class,
        ]);
    }
}