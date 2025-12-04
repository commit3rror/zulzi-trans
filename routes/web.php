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
Route::get('/reset-password/{token}', function ($token) {
    // Ambil FRONTEND_URL dari .env
    $frontendUrl = env('APP_URL', 'http://localhost:8000'); 
    
    // Redirect ke halaman reset password di frontend
    return redirect($frontendUrl . '/reset-password?token=' . $token . '&email=' . request('email'));
})->name('password.reset');
/*
|--------------------------------------------------------------------------
| Catch-all Route untuk React Router
|--------------------------------------------------------------------------
*/
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
