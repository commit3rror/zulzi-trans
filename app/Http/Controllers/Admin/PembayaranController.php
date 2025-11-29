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
            'pembayaran.id_admin',
            'pembayaran.status'   // <-- WAJIB TAMBAH INI
        );

    if (!empty($search)) {
        $query->where(function ($q) use ($search) {
            $q->where('pembayaran.id_pemesanan', 'like', "%{$search}%")
              ->orWhere('user.nama', 'like', "%{$search}%")
              ->orWhere('pembayaran.metode_bayar', 'like', "%{$search}%")
              ->orWhere('pembayaran.jenis_pembayaran', 'like', "%{$search}%");
              // Search  bulan
            $q->orWhereRaw("LOWER(MONTHNAME(pembayaran.tgl_bayar)) LIKE ?", ["%" . strtolower($search) . "%"]);

        });
    }

    $pembayaran = $query->orderBy('pembayaran.id_pemesanan', 'asc')->get();

    // Tambahkan informasi tambahan seperti rekening tujuan dan waktu transfer
    $pembayaran = $pembayaran->map(function($item) {

        $item->rekening_tujuan = $this->getRekeningTujuan($item->metode_bayar);

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

    $adminId = Auth::id();

    // Ambil pembayaran
    $pembayaran = DB::table('pembayaran')->where('id_pembayaran', $id)->first();

    if (!$pembayaran) {
        return response()->json(['message' => 'Pembayaran tidak ditemukan'], 404);
    }

    // Tentukan status baru pembayaran
    $newStatus = $request->action === 'approve'
        ? 'Terverifikasi'
        : 'Ditolak';

    // Update pembayaran: id_admin + status
    DB::table('pembayaran')
        ->where('id_pembayaran', $id)
        ->update([
            'id_admin' => $adminId,
            'status' => $newStatus
        ]);

    // Update status pemesanan terkait
    $newOrderStatus = $request->action === 'approve'
        ? 'Diproses'
        : 'Pembayaran Ditolak';

    DB::table('pemesanan')
        ->where('id_pemesanan', $pembayaran->id_pemesanan)
        ->update([
            'status_pemesanan' => $newOrderStatus
        ]);

    return response()->json([
        'message' => 'Status pembayaran diperbarui',
        'status' => $newStatus,
        'order_status' => $newOrderStatus
    ]);
}


    // FUNGSI DELETE YANG HILANG SEBELUMNYA
    public function destroy($id)
    {
        $pembayaran = DB::table('pembayaran')->where('id_pembayaran', $id)->first();

        if (!$pembayaran) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        // Hapus file bukti transfer jika ada
        if ($pembayaran->bukti_transfer && file_exists(storage_path('app/public/' . $pembayaran->bukti_transfer))) {
            unlink(storage_path('app/public/' . $pembayaran->bukti_transfer));
        }

        DB::table('pembayaran')->where('id_pembayaran', $id)->delete();

        return response()->json(['message' => 'Pembayaran berhasil dihapus']);
    }

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
