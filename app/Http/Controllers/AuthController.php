<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str; // NEW: Untuk membuat password random
use Laravel\Socialite\Facades\Socialite; // NEW: Import Socialite
class AuthController extends Controller
{
    /**
     * Tampilkan form login (opsional untuk web)
     */
    public function showLoginForm()
    {
        return view('auth.login');

    }

    /**
     * Register user baru (Customer)
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $user = User::create([
                'role_pengguna' => 'customer',
                'nama' => $request->nama,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'no_telepon' => $request->no_telepon,
                'tgl_daftar' => now(),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Registrasi berhasil! Selamat datang di Zulzi Trans Express',
                'data' => [
                    'user' => new UserResource($user),
                    'token' => $token,
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registrasi gagal',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Login user
     */
    public function login(LoginRequest $request): JsonResponse
    {
        // Cek kredensial
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah',
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'data' => [
                'user' => new UserResource($user),
                'token' => $token,
            ],
        ], 200);
    }

    /**
     * Logout user (hapus token saat ini)
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logout berhasil',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout gagal',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Ambil data user yang sedang login
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new UserResource($request->user()),
        ], 200);
    }

    /**
     * Ganti password
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Password lama tidak sesuai',
            ], 400);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil diubah',
        ], 200);
    }

    /**
     * Refresh token (opsional)
     */
    public function refreshToken(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $request->user()->currentAccessToken()->delete();

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Token berhasil di-refresh',
                'data' => [
                    'token' => $token,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Refresh token gagal',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // =====================================================
    // NEW: GOOGLE OAUTH METHODS
    // =====================================================

    /**
     * Redirect user to the Google authentication page.
     */
    public function redirectToGoogle()
    {
        // Menggunakan stateless() karena ini adalah otentikasi API/SPA
        return Socialite::driver('google')->stateless()->redirect();
    }

    /**
     * Handle the callback from Google.
     * Logika: Cari berdasarkan google_id -> Cari berdasarkan email -> Buat user baru
     */
    public function handleGoogleCallback()
    {
        try {
            // Socialite akan memproses callback dari Google
            $googleUser = Socialite::driver('google')->user();

            // 1. Cari atau buat user berdasarkan email Google
            $user = User::firstOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'nama' => $googleUser->getName(),
                    'role_pengguna' => 'customer', // Asumsi default role
                    // Password diisi dengan random string (hanya jika user baru dibuat)
                    'password' => Hash::make(Str::random(16)),
                    'tgl_daftar' => now(),
                    'email_verified_at' => now(), // Verifikasi email otomatis untuk Google
                ]
            );

            // 2. Berhasil login: Hapus token lama dan buat token Sanctum baru
            $user->tokens()->delete();
            $token = $user->createToken('auth_token')->plainTextToken;

            // 3. Persiapkan data user untuk frontend
            $userData = [
                'id_pengguna' => $user->id_pengguna,
                'nama' => $user->nama,
                'email' => $user->email,
                'role_pengguna' => $user->role_pengguna, // Penting untuk redirect di FE
            ];

            // 4. Arahkan kembali ke frontend di path utama ('/') dengan query string
            // Frontend URL diset di app.jsx sebagai window.location.origin
            $redirectUrl = env('APP_URL') . '/?auth_token=' . $token . '&user=' . urlencode(json_encode($userData));

            return redirect($redirectUrl);

        } catch (\Exception $e) {
            // Log error
            \Log::error('Google OAuth Error: ' . $e->getMessage());

            // Arahkan kembali ke halaman login frontend dengan pesan error
            $errorUrl = env('APP_URL') . '/login?error=' . urlencode('Gagal login dengan Google. Silakan coba lagi.');

            return redirect($errorUrl);
        }
    }
}
