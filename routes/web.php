<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Web Routes - Google OAuth Routes
|--------------------------------------------------------------------------
*/

// PENTING: Route ini harus di ATAS catch-all route
Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

// ✅ BARU: Rute bernama untuk Reset Password (Diperlukan oleh Laravel Mailer)
// Ini mengarahkan Laravel ke halaman React Router: /password/reset/{token}
Route::get('/password/reset/{token}', function () {
    return view('app');
})->name('password.reset'); // <--- INI ADALAH PERBAIKAN KRUSIAL

/*
|--------------------------------------------------------------------------
| Catch-all Route untuk React Router
|--------------------------------------------------------------------------
*/
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');