// resources/js/router.jsx
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import OAuthCallback from './Pages/Auth/OAuthCallback';

// Import Halaman
import PemesananPage from './Pages/Pemesanan/Index';
import ResetPasswordPage from './Pages/Auth/ResetPasswordPage';

// Disini kita daftarkan URL-nya
const router = createBrowserRouter([
    {
        path: "/",
        element: <div className="p-10 text-center"><h1>Halaman Home Belum Dibuat (Klik <a href="/pemesanan" className="text-blue-500 underline">/pemesanan</a>)</h1></div>, 
    },
    {
        path: "/pemesanan",
        element: <PemesananPage />, // Ini halaman yang baru kita buat
    },
    {
        path: '/auth/google/callback',
        element: <OAuthCallback />
    },
    // Nanti tambah path lain disini (misal /login, /admin)
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/forgot-password", // Rute untuk halaman meminta reset link
        element: <ForgotPasswordPage />,
    },
    {
        path: "/reset-password", 
        element: <ResetPasswordPage />,
    },
]);

export default router;