import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// PERBAIKAN 1: Mengganti path relatif dengan alias (@/) yang tampaknya berfungsi di App.jsx 
// untuk mengatasi masalah resolusi yang persisten.
import { useAuth } from '@/context/AuthContext.jsx'; 

/**
 * Komponen AdminRouteGuard: Melindungi rute dari akses yang tidak sah.
 * @param {object} props
 * @param {React.Element} props.element - Komponen yang akan dirender jika akses diizinkan.
 * @param {boolean} props.isAdminOnly - Jika true, hanya user dengan role 'admin' yang diizinkan.
 * Jika false, user terautentikasi (admin/customer) diizinkan.
 */
const AdminRouteGuard = ({ element, isAdminOnly }) => {
    // PERBAIKAN 2: Menggunakan useLocation untuk mendapatkan lokasi saat ini
    const location = useLocation();
    
    // Ambil status autentikasi dari konteks
    const { isAuthenticated, user, loading } = useAuth();

    // 1. Jika masih loading DAN belum ada user, tampilkan loading state
    // Tapi jika user sudah ada (dari localStorage), jangan tampilkan loading meski loading=true
    // Ini agar tidak ada redirect loop saat validation ulang di background
    if (loading && !user) {
        return (
            <div className="flex items-center justify-center min-h-screen text-xl text-gray-700 bg-gray-50">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memuat data autentikasi...
            </div>
        );
    }

    // 2. Cek status Login (Untuk semua rute yang menggunakan guard ini)
    if (!isAuthenticated || !user) {
        // Jika belum login, redirect ke halaman login
        // Menambahkan state agar setelah login, user dikembalikan ke halaman yang dituju
        console.log('❌ Not authenticated, redirecting to login');
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    // 3. Cek Role (Hanya berlaku jika isAdminOnly adalah true)
    if (isAdminOnly) {
        // Cek apakah user sudah login TAPI role-nya bukan 'admin'
        // Normalize ke lowercase untuk memastikan case-insensitive comparison
        const userRole = user?.role_pengguna?.toLowerCase();
        
        console.log('🔐 AdminRouteGuard - Checking role:', {
            userRole,
            isAdminOnly,
            isAdmin: userRole === 'admin'
        });
        
        if (userRole !== 'admin') {
            // Jika bukan admin, redirect ke halaman utama (misalnya / atau /beranda)
            console.warn("⛔ Akses ditolak: Pengguna bukan admin. Redirecting to /beranda");
            return <Navigate to="/beranda" replace />; 
        }
        
        console.log('✅ Admin access granted');
    }

    // 4. Jika semua pemeriksaan lolos, tampilkan elemen rute yang diminta
    return element;
};

export default AdminRouteGuard;