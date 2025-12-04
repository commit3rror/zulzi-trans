<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pemesanan;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB; // Untuk getArmadaList

class PemesananController extends Controller
{
    /**
     * 1. STORE: Menyimpan Pesanan Baru dari User
     */
    public function store(Request $request)
    {
        // Validasi Input
        $validator = Validator::make($request->all(), [
            'layanan' => 'required|in:Sewa Kendaraan,Angkut Barang, Angkut Sampah',
            'tgl_mulai' => 'required|date',
            'lokasi_jemput' => 'required|string',
            // id_armada kita buat nullable agar admin yang menentukan nanti
            'lama_rental' => 'nullable|integer',
            'foto_barang' => 'nullable|file|image|max:10240',
            'foto_sampah' => 'nullable|file|image|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Tentukan ID Layanan
        $layananId = match($request->layanan) {
            'Sewa Kendaraan' => 3,
            'Angkut Barang' => 1,
            'Angkut Sampah' => 2,
            default => 1,
        };

        // Logic Deskripsi (Info spesifik per layanan)
        $deskripsi = "";
        if ($request->layanan === 'Sewa Kendaraan') {
            $jumlah = $request->jumlah_orang ?? '-';
            $durasi = $request->lama_rental ?? '-';
            $deskripsi = "Jumlah Penumpang: {$jumlah} orang, Durasi: {$durasi} hari";
        }
        elseif ($request->layanan === 'Angkut Barang') {
            $barang = $request->deskripsi_barang ?? '-';
            $berat = $request->est_berat_ton ?? '-';
            $deskripsi = "Detail Barang: {$barang}, Estimasi Berat: {$berat} ton";
        }
        elseif ($request->layanan === 'Angkut Sampah') {
            $jenis = $request->jenis_sampah ?? '-';
            $volume = $request->perkiraan_volume ?? '-';
            $deskripsi = "Jenis: {$jenis}, Volume: {$volume}";
        }

        // Siapkan Data
        $data = [
            'id_pengguna' => auth()->id(), // PERBAIKAN: Hapus fallback, user HARUS login
            'id_layanan' => $layananId,
            'tgl_pesan' => Carbon::now(),
            'tgl_mulai' => $request->tgl_mulai,
            'tgl_selesai' => $request->tgl_selesai ?? null,

            'lokasi_jemput' => $request->lokasi_jemput,
            'lokasi_tujuan' => $request->lokasi_tujuan ?? $request->lokasi_jemput,

            'status_pemesanan' => 'Menunggu', // Status awal
            'total_biaya' => 0, // Harga 0 menunggu admin

            // PENTING: Set NULL agar Admin yang isi nanti (Dispatcher)
            'id_armada' => null,
            'id_supir' => null,

            'deskripsi_barang' => $deskripsi,
            'est_berat_ton' => $request->est_berat_ton ?? null,
            'jumlah_orang' => $request->jumlah_orang ?? null,
            'lama_rental' => $request->lama_rental ?? null,
            'foto_barang' => null
        ];

        // Handle Upload Foto
        $file = $request->file('foto_barang') ?? $request->file('foto_sampah');
        if ($file) {
            $path = $file->store('public/uploads/pemesanan');
            $data['foto_barang'] = Storage::url($path);
        }

        // Simpan ke DB
        try {
            $pemesanan = Pemesanan::create($data);
            return response()->json([
                'message' => 'Pesanan berhasil dibuat! Silakan tunggu konfirmasi Admin.',
                'data' => $pemesanan
            ], 201);
        } catch (\Exception $e) {
            Log::error('Order Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Terjadi kesalahan server saat menyimpan pesanan.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 2. SHOW: Melihat Detail Pesanan (Untuk Refresh Status)
     */
    public function show($id)
    {
        // Ambil data pesanan beserta detail Armada dan Supir (jika sudah dipilih admin)
        $pemesanan = Pemesanan::with(['layanan', 'armada', 'supir'])->find($id);

        if (!$pemesanan) {
            return response()->json(['message' => 'Pesanan tidak ditemukan'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $pemesanan
        ]);
    }

    /**
     * 3. GET ARMADA LIST: Untuk Dropdown (Opsional)
     */
    public function getArmadaList()
    {
        $armada = DB::table('armada')->where('status_ketersediaan', 'Tersedia')->get();
        return response()->json($armada);
    }

    /**
     * 4. GET USER ORDERS: Ambil semua pemesanan milik user yang login
     */
    public function getUserOrders(Request $request)
    {
        $userId = auth()->id();

        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Debug: Log user ID
        \Log::info('🔍 Fetching orders for user ID: ' . $userId);

        // Ambil semua pesanan user dengan relasi layanan, armada, supir, pembayaran
        $orders = Pemesanan::with(['layanan', 'armada', 'supir', 'pembayaran'])
            ->where('id_pengguna', $userId)
            ->orderBy('tgl_pesan', 'desc')
            ->get();

        // Debug: Log hasil query
        \Log::info('📦 Found ' . $orders->count() . ' orders');

        return response()->json([
            'status' => 'success',
            'data' => $orders,
            'debug' => [
                'user_id' => $userId,
                'total_orders' => $orders->count()
            ]
        ]);
    }
}
