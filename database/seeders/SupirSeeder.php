<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Supir;

class SupirSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'nama' => 'Ahmad Junaedi',
                'no_telepon' => '081234560001',
                'no_sim' => 'A-123456789001',
                'status_supir' => 'Tersedia',
            ],
            [
                'nama' => 'Bambang Pamungkas',
                'no_telepon' => '081234560002',
                'no_sim' => 'B1-123456789002',
                'status_supir' => 'Bertugas',
            ],
        ];

        foreach ($data as $item) {
            Supir::firstOrCreate(
                ['no_sim' => $item['no_sim']], 
                $item
            );
        }
    }
}