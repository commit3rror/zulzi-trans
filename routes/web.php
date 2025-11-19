<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Welcome/Landing Page
Route::get('/', function () {
    return Inertia::render('Welcome');
});

// About Page
Route::get('/about', function () {
    return Inertia::render('AboutPage');
})->name('about');

// Admin routes (jika ada)
Route::middleware(['auth'])->group(function () {
    // Tambahkan route admin di sini
});