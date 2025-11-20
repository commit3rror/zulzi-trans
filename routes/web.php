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
use App\Http\Controllers\PemesananController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// 1. REDIRECT ROOT KE BERANDA
Route::get('/', function () {
    // Karena kita sudah punya OAuthCallbackHandler di React yang menerima callback di path ini,
    // kita akan membiarkan rute ini mengarah ke view utama atau ke handler, bukan redirect keras.
    // Jika tidak ada parameter OAuth, app.jsx akan mengarahkan ke /beranda.
    return view('app');
});

// =====================================================
// API ROUTES
// =====================================================
Route::prefix('api/admin')->group(function () {
    Route::get('/dashboard-stats', [DashboardController::class, 'getStats']);

    // Layanan
    Route::get('/layanan', [LayananController::class, 'index']);

    // FIX: Pindahkan Pengguna ke sini agar bisa diakses via /api/admin/pengguna
    Route::get('/pengguna', [PenggunaController::class, 'index']);
    Route::delete('/pengguna/{id_pengguna}', [PenggunaController::class, 'destroy']);

    Route::apiResource('armada', ArmadaController::class)->parameters(['armada' => 'id_armada']);
    Route::apiResource('supir', SupirController::class)->parameters(['supir' => 'id_supir']);
    Route::apiResource('ulasan', UlasanController::class)->parameters(['ulasan' => 'id_ulasan']);
    Route::apiResource('pembayaran', PembayaranController::class)->parameters(['pembayaran' => 'id_pembayaran']);

    // Pemesanan
    Route::get('/pemesanan', [PemesananController::class, 'indexAdmin']); // Admin view
    Route::put('/pemesanan/{id}/verifikasi', [PemesananController::class, 'verifikasi']);
    Route::put('/pemesanan/{id}/assign', [PemesananController::class, 'assignSupirArmada']);
});

// Rute untuk Customer (Non-Admin)
Route::prefix('api/customer')->middleware('auth:sanctum')->group(function () {
    Route::get('/pemesanan', [PemesananController::class, 'indexCustomer']); // Customer view
    Route::post('/pemesanan', [PemesananController::class, 'store']);
    Route::put('/pemesanan/{id}', [PemesananController::class, 'update']);
    Route::delete('/pemesanan/{id}', [PemesananController::class, 'destroy']);
});


// =====================================================
// AUTH ROUTES (Email/Password)
// =====================================================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// =====================================================
// NEW: GOOGLE OAUTH ROUTES (Socialite)
// =====================================================
// 1. Mengarahkan pengguna ke Google (Dipanggil dari tombol di React)
Route::get('auth/google/redirect', [AuthController::class, 'redirectToGoogle'])->name('google.redirect');

// 2. Callback dari Google (Akan me-redirect kembali ke frontend di path '/')
Route::get('auth/google/callback', [AuthController::class, 'handleGoogleCallback']);


// =====================================================
// FRONTEND ROUTES (REACT) - Semua rute akan di-handle oleh React Router
// =====================================================

// GROUP A: ADMIN & AUTH (Load view 'admin' -> resources/js/app.jsx)
Route::get('/login', function () { return view('app'); })->name('login'); // Ganti 'admin' ke 'app' jika app.jsx adalah entry point tunggal
Route::get('/register', function () { return view('app'); });
Route::get('/forgot-password', function () { return view('app'); });
Route::get('/edit-profile', function () { return view('app'); });
Route::get('/beranda', function () { return view('app'); }); // Rute Beranda

// Route Admin Panel (menangkap /admin dan /admin/...)
Route::get('/admin/{any?}', function () {
    return view('app'); // Menggunakan 'app' sebagai view tunggal
})->where('any', '.*')->name('admin.panel');


// GROUP B: CATCH-ALL FOR REACT ROUTER
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');
