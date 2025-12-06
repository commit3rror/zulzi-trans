<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

// Update semua pembayaran Pending untuk pemesanan yang statusnya Lunas atau DP Dibayar
$updated = DB::table('pembayaran')
    ->whereIn('id_pemesanan', function($query) {
        $query->select('id_pemesanan')
            ->from('pemesanan')
            ->whereIn('status_pemesanan', ['Lunas', 'DP Dibayar']);
    })
    ->where('status_pembayaran', 'Pending')
    ->update([
        'status_pembayaran' => 'Verified',
        'id_admin' => 1
    ]);

echo "✅ Berhasil memperbarui {$updated} pembayaran menjadi Verified\n";

// Tampilkan hasil
$verified = DB::table('pembayaran')
    ->join('pemesanan', 'pembayaran.id_pemesanan', '=', 'pemesanan.id_pemesanan')
    ->where('pembayaran.status_pembayaran', 'Verified')
    ->select('pembayaran.id_pembayaran', 'pembayaran.id_pemesanan', 'pembayaran.jenis_pembayaran', 'pembayaran.jumlah_bayar', 'pemesanan.status_pemesanan')
    ->get();

echo "\n📊 Daftar Pembayaran Verified:\n";
foreach ($verified as $p) {
    echo "  - ID {$p->id_pembayaran}: Pemesanan #{$p->id_pemesanan} ({$p->status_pemesanan}) - {$p->jenis_pembayaran} Rp " . number_format($p->jumlah_bayar, 0, ',', '.') . "\n";
}
