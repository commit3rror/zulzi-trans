<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pemesanan;
use App\Models\User;
use App\Models\Armada;
use App\Models\Layanan;
use App\Models\Supir;
use Faker\Factory as Faker;

class PemesananSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $users = User::all();
        $armadas = Armada::all();
        $layanans = Layanan::all();
        $supirs = Supir::all();

        if ($users->count() === 0 || $layanans->count() === 0) {
            $this->command->warn("Seeder Pemesanan: Pastikan tabel User dan Layanan sudah ada data.");
            return;
        }

        // Contoh membuat 20 data pemesanan
        for ($i = 0; $i < 20; $i++) {
            Pemesanan::create([
                'id_pengguna' => $users->random()->id_pengguna,
                'id_armada' => $armadas->isNotEmpty() ? $armadas->random()->id_armada : null,
                'id_layanan' => $layanans->random()->id_layanan,
                'id_supir' => $supirs->isNotEmpty() ? $supirs->random()->id_supir : null,
                'tgl_pesan' => $faker->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
                'tgl_mulai' => $faker->dateTimeBetween('now', '+1 month')->format('Y-m-d'),
                'tgl_selesai' => $faker->dateTimeBetween('+1 month', '+2 month')->format('Y-m-d'),
                'lokasi_jemput' => $faker->address,
                'lokasi_tujuan' => $faker->address,
                'total_biaya' => $faker->randomFloat(2, 500000, 5000000),
                'status_pemesanan' => $faker->randomElement(['PENDING','CONFIRM','CANCEL']),
                'deskripsi_barang' => $faker->optional()->sentence,
                'est_berat_ton' => $faker->optional()->randomFloat(1, 0.1, 10),
                'foto_barang' => $faker->optional()->imageUrl(200, 200, 'transport'),
                'jumlah_orang' => $faker->optional()->numberBetween(1, 10),
                'lama_rental' => $faker->optional()->numberBetween(1, 30),
            ]);
        }
    }
}
