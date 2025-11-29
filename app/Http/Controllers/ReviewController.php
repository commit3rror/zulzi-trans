<?php

namespace App\Http\Controllers;

use App\Models\Ulasan; 
use App\Models\Pemesanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class ReviewController extends Controller
{
    public function getPublicReviews()
    {
        try {
            $ulasan = Ulasan::with('pengguna') 
                            ->where('is_displayed', true)  // Filter hanya review yang ditampilkan
                            ->latest('tgl_ulasan') 
                            ->limit(5)            
                            ->get();

            return response()->json([
                'status' => 'success',
                'data' => $ulasan,
                'count' => $ulasan->count()
            ]);
        } catch (\Exception $e) {
            // Jika kolom belum ada, return empty array
            return response()->json([
                'status' => 'success',
                'data' => [],
                'message' => 'Kolom is_displayed mungkin belum di-migrate. Jalankan: php artisan migrate'
            ]);
        }
    }

    public function getReviewTarget($id_pemesanan)
    {
        $pemesanan = Pemesanan::with(['armada', 'supir', 'pengguna'])
            ->find($id_pemesanan);

        if (!$pemesanan) {
            // FALLBACK: Jika pemesanan tidak ada (karena tim lain belum selesai),
            // ambil mock data dari ulasan terbaru dengan id_pemesanan yang sama
            $ulasan = Ulasan::where('id_pemesanan', $id_pemesanan)
                ->with('armada')
                ->first();
            
            if ($ulasan && $ulasan->armada) {
                return response()->json([
                    'status' => 'success',
                    'data' => [
                        'id_pemesanan' => $id_pemesanan,
                        'id_armada' => $ulasan->id_armada,
                        'kode_pesanan' => 'ZT-2025-' . str_pad($id_pemesanan, 6, '0', STR_PAD_LEFT),
                        'tgl_selesai_formatted' => Carbon::parse($ulasan->tgl_ulasan)->translatedFormat('d F Y'),
                        'jam_selesai' => '13:30 WIB',
                        'rute' => 'Jakarta → Bandung',
                        'total_biaya' => '1.200.000',
                        'nama_armada' => $ulasan->armada->jenis_kendaraan ?? 'Armada Tidak Dikenal',
                        'nama_supir' => 'Supir Professional',
                        'foto_armada' => null,
                    ]
                ]);
            }
            
            // DEFAULT MOCK: Jika tidak ada ulasan sebelumnya, return mock data generik
            return response()->json([
                'status' => 'success',
                'data' => [
                    'id_pemesanan' => $id_pemesanan,
                    'id_armada' => 1,
                    'kode_pesanan' => 'ZT-2025-' . str_pad($id_pemesanan, 6, '0', STR_PAD_LEFT),
                    'tgl_selesai_formatted' => Carbon::now()->translatedFormat('d F Y'),
                    'jam_selesai' => '13:30 WIB',
                    'rute' => 'Jakarta → Bandung',
                    'total_biaya' => '1.200.000',
                    'nama_armada' => 'Isuzu Elf Long',
                    'nama_supir' => 'Supir Professional',
                    'foto_armada' => null,
                ]
            ]);
        }

        $data = [
            'id_pemesanan' => $pemesanan->id_pemesanan,
            'id_armada' => $pemesanan->id_armada,
            'id_pengguna' => $pemesanan->id_pengguna,
            'kode_pesanan' => 'ZT-2025-' . str_pad($pemesanan->id_pemesanan, 6, '0', STR_PAD_LEFT),
            'tgl_selesai_formatted' => Carbon::parse($pemesanan->tgl_selesai)->translatedFormat('d F Y'),
            'jam_selesai' => '13:30 WIB',
            'rute' => $pemesanan->lokasi_jemput . ' → ' . $pemesanan->lokasi_tujuan,
            'total_biaya' => number_format($pemesanan->total_biaya, 0, ',', '.'),
            
            // PENTING: Menggunakan jenis_kendaraan karena kolom nama_armada tidak ada di tabel
            'nama_armada' => $pemesanan->armada ? $pemesanan->armada->jenis_kendaraan : 'Armada Tidak Dikenal',
            
            'nama_supir' => $pemesanan->supir ? $pemesanan->supir->nama : 'Supir Tidak Dikenal',
            'foto_armada' => null,
        ];

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_pemesanan' => 'required|integer',
            'id_armada' => 'required|exists:armada,id_armada',
            'rating_driver' => 'required|integer|min:1|max:5',
            'rating_kendaraan' => 'required|integer|min:1|max:5',
            'rating_pelayanan' => 'required|integer|min:1|max:5',
            'komentar' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        try {
            // TEST MODE: Allow any user to submit review (akan di-restrict saat integration)
            // Create ulasan tanpa constraint pemesanan - gunakan default user ID 1 untuk testing
            $ulasan = Ulasan::create([
                'id_pengguna' => 1,
                'id_armada' => $request->id_armada,
                'id_pemesanan' => $request->id_pemesanan,
                'rating_driver' => $request->rating_driver,
                'rating_kendaraan' => $request->rating_kendaraan,
                'rating_pelayanan' => $request->rating_pelayanan,
                'komentar' => $request->komentar,
                'tgl_ulasan' => now(),
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Ulasan berhasil dikirim!',
                'data' => $ulasan
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal menyimpan ulasan: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $ulasan = Ulasan::with(['pemesanan.armada', 'pengguna'])
                ->find($id);

            if (!$ulasan) {
                return response()->json(['status' => 'error', 'message' => 'Ulasan tidak ditemukan'], 404);
            }

            // TEST MODE: Allow anyone to view ulasan for demo
            return response()->json([
                'status' => 'success',
                'data' => $ulasan
            ]);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal mengambil ulasan: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $ulasan = Ulasan::find($id);

            if (!$ulasan) {
                return response()->json(['status' => 'error', 'message' => 'Ulasan tidak ditemukan'], 404);
            }

            // TEST MODE: Allow anyone to delete ulasan for demo
            $ulasan->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Ulasan berhasil dihapus!'
            ]);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal menghapus ulasan: ' . $e->getMessage()], 500);
        }
    }
}