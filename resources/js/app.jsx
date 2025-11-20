// resources/js/app.jsx
import React, { useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation,
    useNavigate
} from 'react-router-dom';

// Import Context (Perbaikan path alias)
import { AuthProvider, AuthContext } from '@/context/AuthContext.jsx';

// Import Pages
import LoginPage from './Pages/Auth/LoginPage.jsx';
import RegisterPage from './Pages/Auth/RegisterPage.jsx';
import ForgotPasswordPage from './Pages/Auth/ForgotPasswordPage.jsx';
import EditProfile from './Pages/Auth/EditProfile.jsx';
import AdminPanel from './Pages/AdminPanel.jsx';
import BerandaPage from './Pages/BerandaPage.jsx'; // Asumsi ini adalah halaman beranda customer

import '../css/app.css';

/**
 * Komponen/Hook Handler untuk menangani callback Google OAuth
 * Komponen ini akan ditempatkan di path '/' karena Laravel mengarahkan ke sana.
 */
function OAuthCallbackHandler() {
    const location = useLocation();
    const navigate = useNavigate();
    // Ambil fungsi/setter dari AuthContext Anda
    const { login, setUser, loading } = useContext(AuthContext);

    useEffect(() => {
        if (loading) return; // Tunggu AuthContext selesai inisialisasi

        const params = new URLSearchParams(location.search);
        const token = params.get('auth_token');
        const userDataJson = params.get('user');
        const error = params.get('error');

        // Cek jika ada token dan data user (dari callback Google)
        if (token && userDataJson) {
            try {
                const userData = JSON.parse(decodeURIComponent(userDataJson));

                // Simpan token dan user data ke localStorage dan update state AuthContext
                localStorage.setItem('auth_token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData); // Update state AuthContext

                // Redirect berdasarkan role
                if (userData.role_pengguna === 'admin') {
                    navigate('/admin', { replace: true });
                } else {
                    navigate('/beranda', { replace: true });
                }

            } catch (e) {
                console.error('Error memproses data OAuth:', e);
                // Redirect ke login dengan pesan error jika gagal parsing
                navigate('/login?error=Gagal memproses data login.', { replace: true });
            }
        } else if (error) {
            // Jika ada error dari Laravel/Google
            console.error('Error dari OAuth:', decodeURIComponent(error));
            navigate(`/login?error=${error}`, { replace: true });
        } else {
            // Jika tidak ada token, arahkan ke login (atau rute default customer)
            navigate('/beranda', { replace: true });
        }
    }, [location.search, navigate, setUser, loading]); // Tambahkan loading sebagai dependency

    // Komponen ini tidak me-render apa pun secara visual
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-xl text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-700 font-medium">Memproses login...</p>
            </div>
        </div>
    );
}


function App() {
    // Asumsi: <BerandaPage /> adalah rute default untuk pengguna biasa
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Rute untuk menangani callback Google di path '/' atau rute default */}
                    <Route path="/" element={<OAuthCallbackHandler />} />
                    <Route path="/beranda" element={<BerandaPage />} />

                    {/* Rute Auth yang sudah ada */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                    {/* Rute Lain */}
                    <Route path="/edit-profile" element={<EditProfile />} />

                    {/* Rute Admin Panel */}
                    <Route path="/admin" element={<AdminPanel />} />
                    {/* Menangkap semua rute di bawah /admin dan menanganinya di dalam AdminPanel */}
                    <Route path="/admin/*" element={<AdminPanel />} />

                    {/* Contoh rute 404 (Opsional) */}
                    {/* <Route path="*" element={<div>404 Not Found</div>} /> */}

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

const root = document.getElementById('app');
if (root) {
    ReactDOM.createRoot(root).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
