<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LayananSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('layanan')->insert([
            ['id_layanan' => 1, 'nama_layanan' => 'Rental Mobil'],
            ['id_layanan' => 2, 'nama_layanan' => 'Angkut Barang'],
            ['id_layanan' => 3, 'nama_layanan' => 'Angkut Sampah'],
        ]);
    }
}