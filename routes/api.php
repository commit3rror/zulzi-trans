<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PemesananController;
// use App\Http\Controllers\PembayaranController; // <-- TAMBAHAN PENTING: Import Controller Pembayaran
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
        'timestamp' => now()->toIso8601String(),
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
| Public Routes (Tanpa Login)
|--------------------------------------------------------------------------
*/
// Route untuk mengambil data Armada (Untuk Dropdown di Form Rental)
Route::get('/armada-list', [PemesananController::class, 'getArmadaList']);

// Route untuk menyimpan Pemesanan Baru
Route::post('/pemesanan', [PemesananController::class, 'store']);

// --- TAMBAHAN PENTING (MULAI) ---
// Route untuk Refresh Status (Cek status pesanan berdasarkan ID)
Route::get('/pemesanan/{id}', [PemesananController::class, 'show']);

// Route untuk mendapatkan history pemesanan user (Login Required)
Route::middleware('auth:sanctum')->get('/user/pemesanan', [PemesananController::class, 'getUserOrders']);

// Route untuk Upload Bukti Pembayaran
Route::post('/pembayaran', [PembayaranController::class, 'store']);
// --- TAMBAHAN PENTING (SELESAI) ---

// Route Public Lainnya
Route::get('/reviews/public', [ReviewController::class, 'getPublicReviews']); 
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/about', [AboutController::class, 'index']);

// Route Khusus Halaman Review (Mengambil target pesanan)
Route::get('/reviews/target/{id_pemesanan}', [ReviewController::class, 'getReviewTarget']);
// Menyimpan review
Route::post('/reviews', [ReviewController::class, 'store']);


/*
|--------------------------------------------------------------------------
| Protected Routes (Butuh Login / Token)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    
    // User Data
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Auth Actions
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
        Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
    });

    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    // Admin Only Routes (Jika ada)
    Route::middleware('admin')->prefix('admin')->group(function () {
        // Route khusus admin bisa ditaruh di sini
    });

});
// Route Public
Route::get('/reviews/public', [ReviewController::class, 'getPublicReviews']); 
Route::get('/services', [ServiceController::class, 'index']);

// Route Khusus Halaman Review (Public - buat fetch data)
Route::get('/reviews/target/{id_pemesanan}', [ReviewController::class, 'getReviewTarget']);

// TEST MODE: Public Review Routes (Uncomment auth:sanctum untuk production)
Route::post('/reviews', [ReviewController::class, 'store']); // Create review
Route::get('/ulasan/{id}', [ReviewController::class, 'show']); // Get single review
Route::delete('/ulasan/{id}', [ReviewController::class, 'destroy']); // Delete review
Route::get('/pemesanan/{id}', [PemesananController::class, 'show']); // Get order

// PRODUCTION: Uncomment ini nanti saat integration
// Route::middleware('auth:sanctum')->group(function () {
//     Route::post('/reviews', [ReviewController::class, 'store']);
//     Route::get('/ulasan/{id}', [ReviewController::class, 'show']);
//     Route::delete('/ulasan/{id}', [ReviewController::class, 'destroy']);
//     Route::get('/pemesanan/{id}', [PemesananController::class, 'show']);
// });
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