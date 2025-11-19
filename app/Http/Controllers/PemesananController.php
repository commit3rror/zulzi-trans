<?php

namespace App\Http\Controllers;

use App\Models\Pemesanan;
use App\Models\Armada;
use App\Models\Supir;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PemesananController extends Controller
{
    public function index(Request $request)
    {
        // Start Query dengan Eager Loading
        $query = Pemesanan::with(['user', 'layanan', 'armada', 'supir']);

        // 1. Handle Search (Cari berdasarkan Nama User atau ID Pemesanan)
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                // Cari di tabel pemesanan
                $q->where('id_pemesanan', 'like', "%{$search}%")
                  ->orWhere('lokasi_jemput', 'like', "%{$search}%")
                  ->orWhere('lokasi_tujuan', 'like', "%{$search}%");
                  
                // Cari di tabel user (relasi)
                $q->orWhereHas('user', function($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%");
                });
            });
        }

        // 2. Handle Filter Layanan (Perbaikan Logic: Pakai whereHas)
        if ($request->has('layanan') && !empty($request->layanan) && $request->layanan !== 'semua') {
            $layananFilter = $request->layanan; 
            
            // Cari di tabel relasi 'layanan', kolom 'nama_layanan'
            $query->whereHas('layanan', function($q) use ($layananFilter) {
                $q->where('nama_layanan', 'like', "%{$layananFilter}%");
            });
        }

        // 3. Handle Filter Status
        if ($request->has('status') && !empty($request->status) && $request->status !== 'semua') {
            $query->where('status_pemesanan', $request->status);
        }

        // Ambil data terbaru
        $data = $query->latest()->get();

        return response()->json($data);
    }

    public function show($id)
    {
        $pemesanan = Pemesanan::with(['user', 'layanan', 'armada', 'supir', 'pembayaran'])->find($id);

        if (!$pemesanan) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json($pemesanan);
    }

    public function update(Request $request, $id)
    {
        $pemesanan = Pemesanan::find($id);
        if (!$pemesanan) return response()->json(['message' => 'Not found'], 404);

        $pemesanan->update($request->all());
        return response()->json(['message' => 'Berhasil update', 'data' => $pemesanan]);
    }

    public function destroy($id)
    {
        $pemesanan = Pemesanan::find($id);
        if (!$pemesanan) return response()->json(['message' => 'Not found'], 404);

        $pemesanan->delete();
        return response()->json(['message' => 'Berhasil dihapus']);
    }

    // Verifikasi Pemesanan
    public function verifikasi(Request $request, $id)
    {
        $pemesanan = Pemesanan::find($id);
        if (!$pemesanan) return response()->json(['message' => 'Not found'], 404);

        $pemesanan->status_pemesanan = 'Menunggu Pembayaran'; 
        $pemesanan->save();

        return response()->json(['message' => 'Pemesanan diverifikasi', 'data' => $pemesanan]);
    }

    // Assign Supir & Armada
    public function assignSupirArmada(Request $request, $id)
    {
        $request->validate([
            'id_supir' => 'required|exists:supir,id_supir',
            'id_armada' => 'required|exists:armada,id_armada',
        ]);

        $pemesanan = Pemesanan::find($id);
        if (!$pemesanan) return response()->json(['message' => 'Not found'], 404);

        DB::beginTransaction();
        try {
            $pemesanan->id_supir = $request->id_supir;
            $pemesanan->id_armada = $request->id_armada;
            $pemesanan->status_pemesanan = 'Diproses'; 
            $pemesanan->save();

            Armada::where('id_armada', $request->id_armada)->update(['status_ketersediaan' => 'Digunakan']);
            Supir::where('id_supir', $request->id_supir)->update(['status' => 'Tidak Tersedia']);

            DB::commit();
            return response()->json(['message' => 'Supir & Armada berhasil ditugaskan', 'data' => $pemesanan]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal assign: ' . $e->getMessage()], 500);
        }
    }
}