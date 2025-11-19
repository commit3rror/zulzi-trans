<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ReviewController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Route Public
Route::get('/reviews/public', [ReviewController::class, 'getPublicReviews']); 
Route::get('/services', [ServiceController::class, 'index']);

// Route Khusus Halaman Review
// Mengambil data pesanan untuk form review
Route::get('/reviews/target/{id_pemesanan}', [ReviewController::class, 'getReviewTarget']);
// Menyimpan review
Route::post('/reviews', [ReviewController::class, 'store']);

Route::middleware('api')->group(function () {
    Route::get('/about', [AboutController::class, 'index']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});