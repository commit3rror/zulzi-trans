<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class PembayaranController extends Controller
{
    /**
     * Menampilkan daftar pembayaran dengan pencarian
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $query = DB::table('pembayaran')
            ->join('pemesanan', 'pembayaran.id_pemesanan', '=', 'pemesanan.id_pemesanan')
            ->join('user', 'pemesanan.id_pengguna', '=', 'user.id_pengguna')
            ->select(
                'pembayaran.id_pembayaran',
                'pembayaran.id_pemesanan',
                'user.nama as nama',
                'pembayaran.jumlah_bayar',
                'pembayaran.tgl_bayar',
                'pembayaran.metode_bayar',
                'pembayaran.jenis_pembayaran',
                'pembayaran.bukti_transfer',
                'pembayaran.id_admin'
            );

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('pembayaran.id_pemesanan', 'like', "%{$search}%")
                  ->orWhere('user.nama', 'like', "%{$search}%")
                  ->orWhere('pembayaran.metode_bayar', 'like', "%{$search}%")
                  ->orWhere('pembayaran.jenis_pembayaran', 'like', "%{$search}%");
            });
        }

        $pembayaran = $query->orderBy('pembayaran.tgl_bayar', 'desc')->get();

        // Tambahkan informasi tambahan seperti rekening tujuan dan waktu transfer
        $pembayaran = $pembayaran->map(function($item) {
            // Ambil data rekening tujuan dari metode bayar
            $rekening = $this->getRekeningTujuan($item->metode_bayar);
            $item->rekening_tujuan = $rekening;

            // Format waktu transfer (misalnya dari bukti transfer atau data lain)
            $item->waktu_transfer = $this->getWaktuTransfer($item->tgl_bayar);

            return $item;
        });

        return response()->json($pembayaran);
    }

    /**
     * Menampilkan detail pembayaran
     */
    public function show($id)
    {
        $pembayaran = DB::table('pembayaran')
            ->join('pemesanan', 'pembayaran.id_pemesanan', '=', 'pemesanan.id_pemesanan')
            ->join('user', 'pemesanan.id_pengguna', '=', 'user.id_pengguna')
            ->select(
                'pembayaran.id_pembayaran',
                'pembayaran.id_pemesanan',
                'user.nama as nama',
                'pembayaran.jumlah_bayar',
                'pembayaran.tgl_bayar',
                'pembayaran.metode_bayar',
                'pembayaran.jenis_pembayaran',
                'pembayaran.bukti_transfer',
                'pembayaran.id_admin'
            )
            ->where('pembayaran.id_pembayaran', $id)
            ->first();

        if (!$pembayaran) {
            return response()->json(['message' => 'Pembayaran tidak ditemukan'], 404);
        }

        // Tambahkan info rekening dan waktu
        $pembayaran->rekening_tujuan = $this->getRekeningTujuan($pembayaran->metode_bayar);
        $pembayaran->waktu_transfer = $this->getWaktuTransfer($pembayaran->tgl_bayar);

        return response()->json($pembayaran);
    }

    /**
     * Verifikasi pembayaran (approve/reject)
     */
    public function verify(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:approve,reject'
        ]);

        $adminId = Auth::id(); // ID admin yang melakukan verifikasi

        // Update id_admin pada pembayaran
        $updated = DB::table('pembayaran')
            ->where('id_pembayaran', $id)
            ->update([
                'id_admin' => $adminId
            ]);

        if (!$updated) {
            return response()->json(['message' => 'Pembayaran tidak ditemukan'], 404);
        }

        // Ambil data pembayaran
        $pembayaran = DB::table('pembayaran')->where('id_pembayaran', $id)->first();

        if ($request->action === 'approve') {
            // Jika disetujui, update status pemesanan menjadi "Diproses" atau status lain yang sesuai
            DB::table('pemesanan')
                ->where('id_pemesanan', $pembayaran->id_pemesanan)
                ->update([
                    'status_pemesanan' => 'Diproses'
                ]);

            return response()->json([
                'message' => 'Pembayaran berhasil disetujui',
                'action' => 'approve'
            ]);
        } else {
            // Jika ditolak, bisa tambahkan log atau update status pemesanan jika diperlukan
            DB::table('pemesanan')
                ->where('id_pemesanan', $pembayaran->id_pemesanan)
                ->update([
                    'status_pemesanan' => 'Pembayaran Ditolak'
                ]);

            return response()->json([
                'message' => 'Pembayaran ditolak',
                'action' => 'reject'
            ]);
        }
    }

    /**
     * Mendapatkan statistik pembayaran
     */
    // public function statistics()
    // {
    //     $stats = [
    //         'total_pembayaran' => DB::table('pembayaran')->count(),
    //         'total_dp' => DB::table('pembayaran')
    //             ->where('jenis_pembayaran', 'DP')
    //             ->count(),
    //         'total_lunas' => DB::table('pembayaran')
    //             ->where('jenis_pembayaran', 'Lunas')
    //             ->count(),
    //         'menunggu_verifikasi' => DB::table('pembayaran')
    //             ->whereNull('id_admin')
    //             ->count(),
    //         'terverifikasi' => DB::table('pembayaran')
    //             ->whereNotNull('id_admin')
    //             ->count(),
    //         'total_nilai_dp' => DB::table('pembayaran')
    //             ->where('jenis_pembayaran', 'DP')
    //             ->sum('jumlah_bayar'),
    //         'total_nilai_lunas' => DB::table('pembayaran')
    //             ->where('jenis_pembayaran', 'Lunas')
    //             ->sum('jumlah_bayar')
    //     ];

    //     return response()->json($stats);
    // }

    /**
     * Helper: Dapatkan rekening tujuan berdasarkan metode bayar
     */
    private function getRekeningTujuan($metodeBayar)
    {
        $rekeningMap = [
            'BCA - 1234567890' => 'BCA - 1234567890',
        ];

        return $rekeningMap[$metodeBayar] ?? 'BCA - 1234567890';
    }

    /**
     * Helper: Format waktu transfer dari tanggal bayar
     */
    private function getWaktuTransfer($tglBayar)
    {
        // Misalnya ambil waktu dari timestamp atau set default
        // Untuk sementara return format waktu default
        return date('H:i', strtotime($tglBayar)) . ' WIB';
    }
}
