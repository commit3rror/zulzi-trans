<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ServiceController; // <-- 1. IMPORT CONTROLLER-NYA

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ... (Mungkin ada rute lain di sini) ...

// 2. DAFTARKAN RUTE-NYA SESUAI ENDPOINT
Route::get('/services', [ServiceController::class, 'index']);


// ... (Rute lain di bawah) ...