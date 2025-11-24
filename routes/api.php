<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PemesananController;
use App\Http\Controllers\PembayaranController; // <-- TAMBAHAN PENTING: Import Controller Pembayaran
use App\Http\Controllers\AboutController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ProfileController;

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