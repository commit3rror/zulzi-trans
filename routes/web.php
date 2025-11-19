<?php

use Illuminate\Support\Facades\Route;


// Import Controller
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ArmadaController;
use App\Http\Controllers\Admin\LayananController;
use App\Http\Controllers\Admin\SupirController;
use App\Http\Controllers\Admin\UlasanController;
use App\Http\Controllers\PenggunaController;
use App\Http\Controllers\Admin\PembayaranController;
use App\Http\Controllers\PesananController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Redirect root ke dashboard
Route::get('/', function () {
    return redirect('/admin');
});

// --- JALUR DATA (API) ---
// Tambahkan 'api/' di depan agar tidak bentrok dengan URL browser
Route::prefix('api/admin')->group(function () {

    Route::get('/dashboard-stats', [DashboardController::class, 'getStats']);

    // Route Armada
    Route::apiResource('armada', ArmadaController::class)->parameters([
        'armada' => 'id_armada'
    ]);

    Route::apiResource('supir', SupirController::class)->parameters([
        'supir' => 'id_supir'
    ]);

    Route::apiResource('ulasan', UlasanController::class)->only(['index', 'show', 'update', 'destroy'])->parameters([
        'ulasan' => 'id_ulasan'
    ]);

    // Route Layanan
    Route::get('/layanan', [LayananController::class, 'index']);

    // Route Pengguna
    Route::get('/pengguna', [PenggunaController::class, 'index']);
    Route::delete('/pengguna/{id_pengguna}', [PenggunaController::class, 'destroy']);

    // ========================================
    // Routes untuk Pembayaran
    // ========================================

    // GET /api/admin/pembayaran - Mendapatkan semua pembayaran dengan filter pencarian
    Route::get('/pembayaran', [PembayaranController::class, 'index']);

    // GET /api/admin/pembayaran/{id} - Mendapatkan detail pembayaran berdasarkan ID
    Route::get('/pembayaran/{id}', [PembayaranController::class, 'show']);

    // POST /api/admin/pembayaran/{id}/verify - Verifikasi pembayaran (approve/reject)
    // Body: { "action": "approve" } atau { "action": "reject" }
    Route::post('/pembayaran/{id}/verify', [PembayaranController::class, 'verify']);

    // GET /api/admin/pembayaran/statistics/all - Mendapatkan statistik pembayaran
    Route::get('/pembayaran/statistics/all', [PembayaranController::class, 'statistics']);


    // Route pemesanan
    Route::get('/pemesanan', [PemesananController::class, 'index']);
    Route::get('/pemesanan/{id}', [PemesananController::class, 'show']);
    Route::post('/pemesanan', [PemesananController::class, 'store']);
    Route::put('/pemesanan/{id}', [PemesananController::class, 'update']);
    Route::delete('/pemesanan/{id}', [PemesananController::class, 'destroy']);

    // Route khusus untuk verifikasi dan assign
    Route::put('/pemesanan/{id}/verifikasi', [PemesananController::class, 'verifikasi']);
    Route::put('/pemesanan/{id}/assign', [PemesananController::class, 'assignSupirArmada']);



});

// Route Catch-all: Menyerahkan semua request URL ke React (kecuali API)
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '^(?!api).*$'); // Regex: Tangkap semua kecuali yang diawali 'api'

// --- JALUR TAMPILAN (UI/React) ---
// Route ini menangkap semua URL /admin/... dan menampilkan file blade
Route::get('/admin/{any?}', function () {
    return view('admin');
})->where('any', '.*')->name('admin.panel');
