<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PemesananController; // <-- Import Controller
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

    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    // Admin Only Routes
    Route::middleware('admin')->prefix('admin')->group(function () {
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

Route::middleware('api')->group(function () {
    Route::get('/about', [AboutController::class, 'index']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ROUTE BARU UNTUK PEMESANAN (Menerima data dari React)
Route::post('/pemesanan', [PemesananController::class, 'store']);