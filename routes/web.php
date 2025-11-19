<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ArmadaController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// --- RUTE ADMIN / API (Ditaruh DI ATAS Catch-All) ---
// Sebaiknya rute data seperti ini nanti dipindah ke api.php, 
// tapi untuk sekarang di sini tidak apa-apa.
Route::prefix('admin')->middleware('auth:sanctum')->group(function () { 
    Route::get('/dashboard-stats', [DashboardController::class, 'getStats']);
    Route::apiResource('armada', ArmadaController::class)->parameters([
        'armada' => 'id_armada'
    ]);
});

// --- RUTE SAPU JAGAT (CATCH-ALL) ---
// Ini PENTING! Kode ini artinya:
// "Apapun alamat yang diketik user (selain admin di atas),
// tolong serahkan ke React (view welcome)."
Route::get('/{any?}', function () {
    return view('welcome');
})->where('any', '.*');