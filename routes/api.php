<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ReviewController; // <-- 1. IMPORT REVIEW CONTROLLER

Route::get('/reviews/public', [ReviewController::class, 'getPublicReviews']); 



Route::middleware('api')->group(function () {
    // About API
    Route::get('/about', [AboutController::class, 'index']);
});