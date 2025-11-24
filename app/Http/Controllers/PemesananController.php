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
            'layanan' => 'required|in:rental,barang,sampah',
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
            'rental' => 1,
            'barang' => 2,
            'sampah' => 3,
            default => 1,
        };

        // Logic Deskripsi (Gabungkan request user jadi satu string)
        $deskripsi = "";
        if ($request->layanan === 'rental') {
            $mobil = $request->preferensi_armada ?? 'Tidak ada preferensi';
            $deskripsi = "Layanan Rental Mobil. Request Unit: {$mobil}.";
        } 
        elseif ($request->layanan === 'barang') {
            $barang = $request->deskripsi_barang ?? '-';
            $truk = $request->preferensi_armada ?? 'Standar';
            $deskripsi = "Angkut Barang: {$barang}. Request Truk: {$truk}.";
        } 
        elseif ($request->layanan === 'sampah') {
            $jenis = $request->jenis_sampah ?? '-';
            $volume = $request->perkiraan_volume ?? '-';
            $truk = $request->preferensi_armada ?? 'Sesuai Volume';
            $deskripsi = "Sampah: {$jenis}, Volume: {$volume}. Request Truk: {$truk}.";
        }

        // Siapkan Data
        $data = [
            'id_pengguna' => auth()->id() ?? 1, // Fallback ID 1 jika testing
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
        // Ambil data pesanan beserta detail Armada (jika sudah dipilih admin)
        $pemesanan = Pemesanan::with(['layanan', 'armada'])->find($id);

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

        // Ambil semua pesanan user dengan relasi layanan, armada, pembayaran
        $orders = Pemesanan::with(['layanan', 'armada', 'pembayaran'])
            ->where('id_pengguna', $userId)
            ->orderBy('tgl_pesan', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }
}