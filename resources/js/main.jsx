import React from 'react';
import ReactDOM from 'react-dom/client';
import '../css/app.css';
import OAuthCallback from './Pages/Auth/OAuthCallback';

import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
// Import AuthProvider & AdminRouteGuard
import { AuthProvider, useAuth } from '@/context/AuthContext'; 
import AdminRouteGuard from '@/Components/AdminRouteGuard.jsx';

// Import halaman Public
import LandingPage from '@/Pages/public/LandingPage';
import AboutPage from '@/Pages/AboutPage';
import ReviewPage from '@/Pages/ReviewPage';
import ReviewForm from '@/Pages/Review/ReviewForm';
import ReviewSuccess from '@/Pages/Review/ReviewSuccess';
import PemesananPage from '@/Pages/Pemesanan/Index';
import ProfilePage from '@/Pages/Profile/ProfilePage';
// import PembayaranPage from '@/Pages/PembayaranPage';

// Import halaman Auth
import LoginPage from '@/Pages/Auth/LoginPage.jsx';
import RegisterPage from '@/Pages/Auth/RegisterPage.jsx';
import ForgotPasswordPage from '@/Pages/Auth/ForgotPasswordPage.jsx';
import EditProfile from '@/Pages/Auth/EditProfile.jsx';
import ResetPasswordPage from './Pages/Auth/ResetPasswordPage.jsx';

// Import halaman Admin
import AdminPanel from '@/Pages/Admin/AdminPanel.jsx';

// Wrapper untuk menangkap token Google OAuth - SIMPLIFIED
const LandingPageWithAuth = () => {
    return <LandingPage />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));

// Loading Component
const AppLoader = () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-300 border-t-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg font-semibold">Memuat aplikasi...</p>
        </div>
    </div>
);

// App Routes Component (Routes saja, tanpa BrowserRouter)
const AppRoutes = () => {
    return (
        <Routes>
            {/* ===================================== */}
            {/* ROUTE PUBLIC (Accessible untuk semua) */}
            {/* ===================================== */}
            <Route path="/" element={<Navigate to="/beranda" replace />} />
            <Route path="/beranda" element={<LandingPageWithAuth />} />
            <Route path="/tentang-kami" element={<AboutPage />} /> 
            <Route path="/about" element={<AboutPage />} /> 
            <Route path="/pemesanan" element={<PemesananPage />} />
            <Route path="/review/:id" element={<ReviewPage />} />

            {/* ===================================== */}
            {/* ROUTE AUTH (Login, Register, dsb)    */}
            {/* ===================================== */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />

            {/* ===================================== */}
            {/* ROUTE USER (Harus Login)             */}
            {/* ===================================== */}
            <Route 
                path="/edit-profile" 
                element={<AdminRouteGuard element={<EditProfile />} isAdminOnly={false} />} 
            />
            
            {/* ===================================== */}
            {/* ROUTE ADMIN (Admin Only)             */}
            {/* ===================================== */}
            <Route 
                path="/admin/*" 
                element={<AdminRouteGuard element={<AdminPanel />} isAdminOnly={true} />} 
            />
        </Routes>
    );
};

// Wrapper untuk show loading saat app initial loading
// HARUS berada di dalam AuthProvider agar bisa akses useAuth context
const AppWithInitialLoaderWrapper = () => {
    const { loading } = useAuth();
    
    // Hanya show loader saat initial load (loading === true)
    if (loading) {
        return <AppLoader />;
    }
    
    return <AppRoutes />;
};

root.render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* ===================================== */}
                    {/* ROUTE PUBLIC (Tanpa Login)           */}
                    {/* ===================================== */}
                    <Route path="/" element={<Navigate to="/beranda" replace />} />
                    <Route path="/beranda" element={<LandingPageWithAuth />} />
                    <Route path="/tentang-kami" element={<AboutPage />} /> 
                    <Route path="/about" element={<AboutPage />} /> 
                    <Route 
                        path="/pemesanan" 
                        // Menerapkan AdminRouteGuard dengan isAdminOnly=false (hanya butuh login)
                        element={<AdminRouteGuard element={<PemesananPage />} isAdminOnly={false} />} 
                    />
                    <Route path="/review/:id" element={<ReviewPage />} />

                    {/* ===================================== */}
                    {/* ROUTE AUTH (Login, Register, dsb)    */}
                    {/* ===================================== */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/auth/callback" element={<OAuthCallback />} />
                    {/* ✅ PERBAIKAN: Mengubah path agar sesuai dengan redirect Laravel yang menggunakan query params */}
                    <Route path="/reset-password" element={<ResetPasswordPage />} /> 

                    {/* ===================================== */}
                    {/* ROUTE USER (Harus Login)             */}\
                    {/* ===================================== */}
                    <Route 
                        path="/edit-profile" 
                        element={<AdminRouteGuard element={<EditProfile />} isAdminOnly={false} />} 
                    />
                    
                    {/* ===================================== */}
                    {/* ROUTE ADMIN (Admin Only)             */}
                    {/* ===================================== */}
                    <Route 
                        path="/admin/*" 
                        element={<AdminRouteGuard element={<AdminPanel />} isAdminOnly={true} />} 
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>
);