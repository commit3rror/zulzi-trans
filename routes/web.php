<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ArmadaController; // <-- TAMBAHKAN INI

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// ... (rute /user yang mungkin sudah ada)

Route::prefix('admin')->middleware('auth:sanctum')->group(function () { 
    // Rute dashboard dari sebelumnya
    Route::get('/dashboard-stats', [DashboardController::class, 'getStats']);

    // TAMBAHKAN RUTE INI UNTUK ARMADA
    Route::apiResource('armada', ArmadaController::class)->parameters([
        'armada' => 'id_armada' // Ini untuk menyesuaikan 'id_armada'
    ]);
});