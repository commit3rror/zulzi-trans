<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Zulzi Trans Express
|--------------------------------------------------------------------------
*/

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Zulzi Trans Express API is running',
        'timestamp' => now()->toISOString(),
    ]);
});

/*
|--------------------------------------------------------------------------
| Authentication Routes (Public)
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

/*
|--------------------------------------------------------------------------
| Protected Routes (Require Authentication)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth Routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
        Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
    });

    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    // Admin Only Routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        // Dashboard
        // Route::get('/dashboard', [DashboardController::class, 'index']);
        
        // User Management
        // Route::apiResource('users', AdminUserController::class);
        
        // Vehicle Management
        // Route::apiResource('vehicles', AdminVehicleController::class);
        
        // Order Management
        // Route::apiResource('orders', AdminOrderController::class);
        
        // Payment Management
        // Route::apiResource('payments', AdminPaymentController::class);
        
        // Driver Management
        // Route::apiResource('drivers', AdminDriverController::class);
        
        // Review Management
        // Route::apiResource('reviews', AdminReviewController::class);
        
        // Service Management
        // Route::apiResource('services', AdminServiceController::class);
    });

    // Customer Routes
    // Route::apiResource('orders', OrderController::class);
    // Route::apiResource('payments', PaymentController::class);
    // Route::apiResource('reviews', ReviewController::class);
    // Route::get('/profile', [ProfileController::class, 'show']);
    // Route::put('/profile', [ProfileController::class, 'update']);
});
