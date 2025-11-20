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
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    /**
     * Register user baru (Customer) dengan Session
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

            // Login otomatis menggunakan session setelah register
            Auth::login($user);

            return response()->json([
                'success' => true,
                'message' => 'Registrasi berhasil! Selamat datang di Zulzi Trans Express',
                'data' => [
                    'user' => new UserResource($user),
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
     * Login user dengan Session
     */
    public function login(LoginRequest $request): JsonResponse
    {
        // Cek kredensial menggunakan Session Guard
        if (Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {

            // Regenerate session ID untuk mencegah session fixation attacks
            $request->session()->regenerate();

            return response()->json([
                'success' => true,
                'message' => 'Login berhasil',
                'data' => [
                    'user' => new UserResource(Auth::user()),
                ],
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Email atau password salah',
        ], 401);
    }

    /**
     * Logout user (Hapus Session)
     */
    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil',
        ], 200);
    }

    /**
     * Ambil data user yang sedang login (Session Check)
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

    // =====================================================
    // GOOGLE OAUTH METHODS (SESSION BASED)
    // =====================================================

    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            // Cari user berdasarkan email atau google_id
            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                // Jika user ada, update google_id jika belum ada
                if (!$user->google_id) {
                    $user->update(['google_id' => $googleUser->getId()]);
                }
            } else {
                // Jika belum ada, buat user baru
                $user = User::create([
                    'nama' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'role_pengguna' => 'customer',
                    'password' => Hash::make(Str::random(24)), // Password acak
                    'tgl_daftar' => now(),
                    'email_verified_at' => now(),
                    'no_telepon' => '', // Google tidak selalu return no hp
                ]);
            }

            // Login User ke Session
            Auth::login($user, true);

            // Redirect langsung ke halaman beranda React
            // Karena session sudah tersimpan di browser, React akan otomatis mendeteksi user via endpoint /me
            if ($user->isAdmin()) {
                return redirect('/admin');
            }

            return redirect('/beranda');

        } catch (\Exception $e) {
            \Log::error('Google Login Error: ' . $e->getMessage());
            return redirect('/login?error=' . urlencode('Gagal login dengan Google.'));
        }
    }
}
