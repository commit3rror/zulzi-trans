<?php

use Illuminate\Support\Facades\Route;

// Controller Import
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\ArmadaController;
use App\Http\Controllers\Admin\LayananController;
use App\Http\Controllers\Admin\SupirController;
use App\Http\Controllers\Admin\UlasanController;
use App\Http\Controllers\PenggunaController;
use App\Http\Controllers\Admin\PembayaranController;
use App\Http\Controllers\PesananController;
use App\Http\Controllers\PemesananController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Redirect root ke dashboard
Route::get('/', function () {
    return redirect('/admin');
});

// =====================================================
// API ROUTES
// =====================================================
Route::prefix('api/admin')->group(function () {

    Route::get('/dashboard-stats', [DashboardController::class, 'getStats']);

    // Armada
    Route::apiResource('armada', ArmadaController::class)->parameters([
        'armada' => 'id_armada'
    ]);

    // Supir
    Route::apiResource('supir', SupirController::class)->parameters([
        'supir' => 'id_supir'
    ]);

    // Ulasan
    Route::apiResource('ulasan', UlasanController::class)
        ->only(['index', 'show', 'update', 'destroy'])
        ->parameters(['ulasan' => 'id_ulasan']);

    // Pembayaran
    Route::get('/pembayaran', [PembayaranController::class, 'index']);
    Route::get('/pembayaran/{id}', [PembayaranController::class, 'show']);
    Route::post('/pembayaran/{id}/verify', [PembayaranController::class, 'verify']);
    Route::get('/pembayaran/statistics/all', [PembayaranController::class, 'statistics']);

    // Pemesanan
    Route::get('/pemesanan', [PemesananController::class, 'index']);
    Route::get('/pemesanan/{id}', [PemesananController::class, 'show']);
    Route::post('/pemesanan', [PemesananController::class, 'store']);
    Route::put('/pemesanan/{id}', [PemesananController::class, 'update']);
    Route::delete('/pemesanan/{id}', [PemesananController::class, 'destroy']);

    // Verifikasi & Assign
    Route::put('/pemesanan/{id}/verifikasi', [PemesananController::class, 'verifikasi']);
    Route::put('/pemesanan/{id}/assign', [PemesananController::class, 'assignSupirArmada']);
});

// =====================================================
// AUTH
// =====================================================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// =====================================================
// DATA ROUTES (Non-API, untuk admin panel)
// =====================================================

// Layanan
Route::get('/layanan', [LayananController::class, 'index']);

// Pengguna
Route::get('/pengguna', [PenggunaController::class, 'index']);
Route::delete('/pengguna/{id_pengguna}', [PenggunaController::class, 'destroy']);

// =====================================================
// REACT FRONTEND
// =====================================================

// Catch-all non-API -> React
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '^(?!api).*$');

// Route admin panel
Route::get('/admin/{any?}', function () {
    return view('admin');
})->where('any', '.*')->name('admin.panel');