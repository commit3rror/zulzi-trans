<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use Illuminate\Http\Request;

class PembayaranController extends Controller
{
    public function index(Request $request)
    {
        // Eager load relasi ke pemesanan -> user
        $query = Pembayaran::with(['pemesanan.user', 'pemesanan.layanan']);

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            
            $query->where(function($q) use ($search) {
                // Cari ID Pembayaran
                $q->where('id_pembayaran', 'like', "%{$search}%")
                  ->orWhere('metode_pembayaran', 'like', "%{$search}%");

                // Cari User via Pemesanan (Nested Relation)
                $q->orWhereHas('pemesanan.user', function($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%");
                });
            });
        }

        $data = $query->latest()->get();

        return response()->json($data);
    }

    public function show($id)
    {
        $pembayaran = Pembayaran::with(['pemesanan.user', 'pemesanan.layanan'])->find($id);

        if (!$pembayaran) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json($pembayaran);
    }

    public function verify(Request $request, $id)
    {
        $pembayaran = Pembayaran::find($id);
        if (!$pembayaran) return response()->json(['message' => 'Not found'], 404);

        $pembayaran->status_pembayaran = 'Lunas';
        $pembayaran->save();

        // Update juga status pemesanan jadi 'Selesai' atau 'Lunas'
        if ($pembayaran->pemesanan) {
            $pembayaran->pemesanan->status_pemesanan = 'Selesai'; // Sesuaikan alur bisnis
            $pembayaran->pemesanan->save();
        }

        return response()->json(['message' => 'Pembayaran diverifikasi', 'data' => $pembayaran]);
    }

    public function statistics()
    {
        $total = Pembayaran::sum('jumlah_bayar');
        $count = Pembayaran::count();
        $pending = Pembayaran::where('status_pembayaran', 'Pending')->count();

        return response()->json([
            'total_pendapatan' => $total,
            'total_transaksi' => $count,
            'menunggu_verifikasi' => $pending
        ]);
    }
}