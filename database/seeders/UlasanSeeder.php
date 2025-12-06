<?php

namespace Database\Seeders;

use App\Models\Ulasan;
use App\Models\User;
use App\Models\Armada;
use App\Models\Layanan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UlasanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Seeder ini membuat test data untuk ulasan tanpa bergantung pada database pemesanan
     * (karena pemesanan masih dikerjakan oleh tim lain)
     */
    public function run(): void
    {
        // 1. PASTIKAN DATA PENGGUNA (CUSTOMERS) ADA
        $customer1 = User::firstOrCreate(
            ['email' => 'andi.wijaya@mail.com'],
            [
                'role_pengguna' => 'Customer',
                'nama' => 'Andi Wijaya',
                'password' => Hash::make('password123'),
                'no_telepon' => '081111111111',
                'tgl_daftar' => Carbon::now(),
                'email_verified_at' => Carbon::now(),
            ]
        );
        
        $customer2 = User::firstOrCreate(
            ['email' => 'siti.nurhaliza@mail.com'],
            [
                'role_pengguna' => 'Customer',
                'nama' => 'Siti Nurhaliza',
                'password' => Hash::make('password123'),
                'no_telepon' => '081222222222',
                'tgl_daftar' => Carbon::now(),
                'email_verified_at' => Carbon::now(),
            ]
        );
        
        $customer3 = User::firstOrCreate(
            ['email' => 'dewi.lestari@mail.com'],
            [
                'role_pengguna' => 'Customer',
                'nama' => 'Dewi Lestari',
                'password' => Hash::make('password123'),
                'no_telepon' => '081333333333',
                'tgl_daftar' => Carbon::now(),
                'email_verified_at' => Carbon::now(),
            ]
        );

        // 2. PASTIKAN DATA ARMADA ADA (untuk relasi)
        $armada1 = Armada::firstOrCreate(
            ['no_plat' => 'B 1001 ZUL'],
            [
                'jenis_kendaraan' => 'Isuzu Elf Long',
                'kapasitas' => '19 Orang',
                'harga_sewa_per_hari' => 800000.00,
                'gambar' => 'elf-long.jpg',
            ]
        );

        $armada2 = Armada::firstOrCreate(
            ['no_plat' => 'B 2002 ZUL'],
            [
                'jenis_kendaraan' => 'Fuso Standar',
                'kapasitas' => '4 Ton',
                'harga_sewa_per_hari' => 1200000.00,
                'gambar' => 'fuso standar.jpeg',
            ]
        );

        // 3. BUAT DATA ULASAN UNTUK TESTING
        // Ulasan ini menggunakan ID yang arbitrary (tidak harus ada di tabel pemesanan)
        // Nanti saat tim lain integrate, akan disesuaikan dengan real pemesanan IDs
        
        $reviews = [
            // Ulasan 1: Rating Sempurna - Ditampilkan dengan respons admin
            [
                'id_pengguna' => $customer1->id_pengguna,
                'id_armada' => $armada1->id_armada,
                'id_pemesanan' => 1, // Mock ID - akan di-update nanti
                'rating_driver' => 5, 
                'rating_kendaraan' => 5, 
                'rating_pelayanan' => 5,
                'komentar' => 'Pelayanan sangat memuaskan! Supir ramah, armada bersih dan terawat. Harga juga terjangkau. Sangat direkomendasikan untuk rental mobil ke seluruh keluarga!',
                'tanggapan_admin' => 'Terima kasih Andi atas kepercayaan Anda kepada Zulzi Trans! Kami senang Anda puas dengan layanan kami. Semoga pada kesempatan berikutnya kita dapat melayani Anda lagi!', 
                'is_displayed' => true, 
                'tgl_ulasan' => Carbon::now()->subDays(5),
            ],
            
            // Ulasan 2: Rating Tinggi - Ditampilkan tanpa respons
            [
                'id_pengguna' => $customer2->id_pengguna,
                'id_armada' => $armada2->id_armada,
                'id_pemesanan' => 2,
                'rating_driver' => 5, 
                'rating_kendaraan' => 4, 
                'rating_pelayanan' => 5,
                'komentar' => 'Pengalaman yang sangat baik menggunakan jasa angkutan Zulzi Trans! Pengemudi sangat profesional, barang sampai dengan aman dan cepat. Top banget!',
                'tanggapan_admin' => null, 
                'is_displayed' => true, 
                'tgl_ulasan' => Carbon::now()->subDays(10),
            ],
            
            // Ulasan 3: Rating Sedang - Belum ditampilkan
            [
                'id_pengguna' => $customer3->id_pengguna,
                'id_armada' => $armada1->id_armada,
                'id_pemesanan' => 3,
                'rating_driver' => 4, 
                'rating_kendaraan' => 3, 
                'rating_pelayanan' => 4,
                'komentar' => 'Layanan lumayan, tapi ada beberapa hal yang perlu diperbaiki. Armada agak bising saat dikendarai.',
                'tanggapan_admin' => null, 
                'is_displayed' => false, 
                'tgl_ulasan' => Carbon::now()->subDays(15),
            ],
            
            // Ulasan 4: Rating Rendah - Untuk testing delete
            [
                'id_pengguna' => $customer1->id_pengguna,
                'id_armada' => $armada2->id_armada,
                'id_pemesanan' => 4,
                'rating_driver' => 3, 
                'rating_kendaraan' => 2, 
                'rating_pelayanan' => 3,
                'komentar' => 'Pelayanan kurang memuaskan. Ada beberapa masalah dengan kendaraan dan pengemudi tidak responsif.',
                'tanggapan_admin' => null, 
                'is_displayed' => false, 
                'tgl_ulasan' => Carbon::now()->subDays(20),
            ],

            // Ulasan 5: Rating Sempurna - Ditampilkan dengan respons beda
            [
                'id_pengguna' => $customer2->id_pengguna,
                'id_armada' => $armada1->id_armada,
                'id_pemesanan' => 5,
                'rating_driver' => 5, 
                'rating_kendaraan' => 5, 
                'rating_pelayanan' => 5,
                'komentar' => 'Luar biasa! Pelayanan dari awal booking hingga selesai perjalanan sangat memuaskan. Akan saya rekomendasikan ke teman-teman saya!',
                'tanggapan_admin' => 'Terima kasih telah memilih Zulzi Trans! Kami sangat menghargai kepuasan pelanggan seperti Anda. Tunggu kedatangan Anda berikutnya!', 
                'is_displayed' => true, 
                'tgl_ulasan' => Carbon::now()->subDays(3),
            ],
        ];

        foreach ($reviews as $review) {
            Ulasan::updateOrCreate(
                [
                    'id_pengguna' => $review['id_pengguna'], 
                    'id_pemesanan' => $review['id_pemesanan']
                ],
                $review
            );
        }

        echo "✅ UlasanSeeder: " . count($reviews) . " ulasan test berhasil dibuat!\n";
        echo "📝 Catatan: Data ini menggunakan mock id_pemesanan.\n";
        echo "   Saat tim lain selesai database pemesanan, update id_pemesanan dengan real IDs.\n";
    }
}
