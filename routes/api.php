<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PemesananController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ProfileController;

// Import Admin Controllers
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PesananController;
use App\Http\Controllers\Admin\SupirController;
use App\Http\Controllers\Admin\UlasanController;
use App\Http\Controllers\Admin\ArmadaController;
use App\Http\Controllers\Admin\PembayaranController;
use App\Http\Controllers\Admin\LayananController;
use App\Http\Controllers\PenggunaController;

/*
|--------------------------------------------------------------------------
| API Routes - Zulzi Trans Express
|--------------------------------------------------------------------------
*/

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Zulzi Trans Express API is running',
        'timestamp' => now()->toISOString(),
    ]);
});

/*
|--------------------------------------------------------------------------
| Authentication Routes (Public)
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

/*
|--------------------------------------------------------------------------
| Public Routes (No Auth Required)
|--------------------------------------------------------------------------
*/
Route::get('/reviews/public', [ReviewController::class, 'getPublicReviews']); 
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/about', [AboutController::class, 'index']);

// Route Khusus Halaman Review
Route::get('/reviews/target/{id_pemesanan}', [ReviewController::class, 'getReviewTarget']);
Route::post('/reviews', [ReviewController::class, 'store']);

// Route Pemesanan
Route::post('/pemesanan', [PemesananController::class, 'store']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Require Authentication)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth Routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
        Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
    });

    Route::prefix('user/profile')->group(function () {
        
        // 1. Route untuk melihat data (GET)
        Route::get('/', [ProfileController::class, 'show']); 
        
        // 2. Route untuk memperbarui data (PUT) - INI YANG HILANG/SALAH!
        // Metode PUT harus mengarah ke ProfileController::update
        Route::put('/', [ProfileController::class, 'update']); 
        
        // Catatan: Jika Anda juga memiliki route password atau avatar, pastikan mereka ada di sini.
        // Route::post('/change-password', [ProfileController::class, 'changePassword']); 
    });

    // User Routes
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    /*
    |--------------------------------------------------------------------------
    | Admin Only Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware('admin')->prefix('admin')->group(function () {
        
        // Dashboard Stats
        Route::get('/dashboard-stats', [DashboardController::class, 'stats']);
        
        // Pengguna Management
        Route::get('/pengguna', [PenggunaController::class, 'index']);
        Route::delete('/pengguna/{id}', [PenggunaController::class, 'destroy']);
        
        // Supir Management
        Route::get('/supir', [SupirController::class, 'index']);
        Route::post('/supir', [SupirController::class, 'store']);
        Route::get('/supir/{id}', [SupirController::class, 'show']);
        Route::put('/supir/{id}', [SupirController::class, 'update']);
        Route::delete('/supir/{id}', [SupirController::class, 'destroy']);
        
        // Pesanan Management
        Route::get('/pesanan', [PesananController::class, 'index']);
        Route::get('/pesanan/{id}', [PesananController::class, 'show']);
        Route::put('/pesanan/{id}/status', [PesananController::class, 'updateStatus']);
        
        // Armada Management
        Route::get('/armada', [ArmadaController::class, 'index']);
        Route::post('/armada', [ArmadaController::class, 'store']);
        Route::get('/armada/{id}', [ArmadaController::class, 'show']);
        Route::put('/armada/{id}', [ArmadaController::class, 'update']);
        Route::delete('/armada/{id}', [ArmadaController::class, 'destroy']);
        
        // Layanan Management
        Route::get('/layanan', [LayananController::class, 'index']);
        
        // Pembayaran Management
        Route::get('/pembayaran', [PembayaranController::class, 'index']);
        Route::put('/pembayaran/{id}/verify', [PembayaranController::class, 'verify']);
        
        // Ulasan Management
        Route::get('/ulasan', [UlasanController::class, 'index']);
        Route::get('/ulasan/{id}', [UlasanController::class, 'show']);
        Route::put('/ulasan/{id}', [UlasanController::class, 'update']);
        Route::delete('/ulasan/{id}', [UlasanController::class, 'destroy']);
    });

});