<?php

use Illuminate\Support\Facades\Route;

// Ganti 'welcome' jadi 'app'
Route::get('/{any?}', function () {
    return view('app'); // <-- Pastikan ini 'app', BUKAN 'welcome'
})->where('any', '.*');


// Admin routes (jika ada)
Route::middleware(['auth'])->group(function () {
    // Tambahkan route admin di sini
});