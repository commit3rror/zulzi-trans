<?php

use Illuminate\Support\Facades\Route;

// Import Controller
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ArmadaController;
use App\Http\Controllers\Admin\LayananController;
use App\Http\Controllers\Admin\SupirController;
use App\Http\Controllers\Admin\UlasanController;
use App\Http\Controllers\PenggunaController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Redirect root ke dashboard
Route::get('/', function () {
    return redirect('/admin/dashboard'); 
});

// --- JALUR DATA (API) ---
// Tambahkan 'api/' di depan agar tidak bentrok dengan URL browser
Route::prefix('api/admin')->group(function () {
    
    Route::get('/dashboard-stats', [DashboardController::class, 'getStats']);

    // Route Armada
    Route::apiResource('armada', ArmadaController::class)->parameters([
        'armada' => 'id_armada'
    ]);

    Route::apiResource('supir', SupirController::class)->parameters([
        'supir' => 'id_supir'
    ]);

    Route::apiResource('ulasan', UlasanController::class)->only(['index', 'show', 'update', 'destroy'])->parameters([
        'ulasan' => 'id_ulasan'
    ]);

    // Route Layanan
    Route::get('/layanan', [LayananController::class, 'index']);

    // Route Pengguna
    Route::get('/pengguna', [PenggunaController::class, 'index']);
    Route::delete('/pengguna/{id_pengguna}', [PenggunaController::class, 'destroy']);
});


// --- JALUR TAMPILAN (UI/React) ---
// Route ini menangkap semua URL /admin/... dan menampilkan file blade
Route::get('/admin/{any?}', function () {
    return view('admin');
})->where('any', '.*')->name('admin.panel');