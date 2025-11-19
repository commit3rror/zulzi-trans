<?php

use Illuminate\Support\Facades\Route;

// Route Catch-all: Menyerahkan semua request URL ke React (kecuali API)
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '^(?!api).*$'); // Regex: Tangkap semua kecuali yang diawali 'api'