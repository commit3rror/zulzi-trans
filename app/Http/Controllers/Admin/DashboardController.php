<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Armada;
use App\Models\Pemesanan;
use App\Models\Pembayaran;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Mengambil data statistik untuk dashboard admin.
     */
    public function stats(Request $request)
    {
        // Query real data dari database
        $totalFleet = Armada::count();
        $fleetAvailable = Armada::where('status_ketersediaan', 'Tersedia')->count();
        
        $ordersThisMonth = Pemesanan::whereMonth('tgl_pesan', Carbon::now()->month)
            ->whereYear('tgl_pesan', Carbon::now()->year)
            ->count();
        $ordersInProgress = Pemesanan::where('status_pemesanan', 'Berlangsung')->count();

        $pendingPayments = Pembayaran::whereNull('id_admin')->count();

        // Recent orders dengan relasi
        $recentOrdersData = Pemesanan::with(['pengguna', 'layanan'])
            ->orderBy('tgl_pesan', 'desc')
            ->take(3)
            ->get()
            ->map(function($order) {
                return [
                    'id' => 'ZT-' . str_pad($order->id_pemesanan, 4, '0', STR_PAD_LEFT),
                    'customer' => $order->pengguna?->nama ?? 'N/A',
                    'route' => ($order->lokasi_jemput ?? 'N/A') . ' → ' . ($order->lokasi_tujuan ?? 'N/A'),
                    'date' => Carbon::parse($order->tgl_pesan)->format('d M Y'),
                ];
            });

        return response()->json([
            'totalFleet' => $totalFleet,
            'fleetAvailable' => $fleetAvailable,
            'ordersThisMonth' => $ordersThisMonth,
            'ordersInProgress' => $ordersInProgress,
            'pendingPayments' => $pendingPayments,
            'recentOrders' => $recentOrdersData,
        ]);
    }
}