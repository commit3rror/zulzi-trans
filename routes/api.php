<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AboutController;

Route::middleware('api')->group(function () {
    // About API
    Route::get('/about', [AboutController::class, 'index']);
});