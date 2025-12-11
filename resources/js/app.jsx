import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext.jsx';
import { useAuth } from '@/hooks/useAuth';
import AdminRouteGuard from './Components/AdminRouteGuard.jsx';

// Import halaman Public
import LandingPage from '@/Pages/public/LandingPage';
import AboutPage from '@/Pages/AboutPage';
import ReviewPage from '@/Pages/ReviewPage';
import ReviewForm from '@/Pages/Review/ReviewForm';
import ReviewSuccess from '@/Pages/Review/ReviewSuccess';
import PemesananPage from '@/Pages/Pemesanan/Index';
import ProfilePage from '@/Pages/Profile/ProfilePage';

// Import halaman Payment Flow
import StatusPage from '@/Pages/Pemesanan/Status';
import PaymentNewPage from '@/Pages/Pemesanan/PaymentNew';
import PaymentUploadPage from '@/Pages/Pemesanan/PaymentUpload';
import PaymentSuccessPage from '@/Pages/Pemesanan/PaymentSuccess';

// Import halaman Auth
import LoginPage from './Pages/Auth/LoginPage.jsx';
import RegisterPage from './Pages/Auth/RegisterPage.jsx';
import ForgotPasswordPage from './Pages/Auth/ForgotPasswordPage.jsx';
import EditProfile from './Pages/Auth/EditProfile.jsx';
import ResetPasswordPage from './Pages/Auth/ResetPasswordPage.jsx';
import OAuthCallback from './Pages/Auth/OAuthCallback';

// Import halaman Admin
import AdminPanel from './Pages/Admin/AdminPanel.jsx';

import '../css/app.css';

// Wrapper untuk menangkap token Google OAuth
const LandingPageWithAuth = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { updateUser } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        const userDataEncoded = searchParams.get('user');

        if (token) {
            try {
                localStorage.setItem('auth_token', token);

                if (userDataEncoded) {
                    const userData = JSON.parse(decodeURIComponent(userDataEncoded));
                    localStorage.setItem('user', JSON.stringify(userData));
                    updateUser(userData);
                }
                
                import('@/services/api').then(({ default: api }) => {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                });

                navigate('/beranda', { replace: true });
                setTimeout(() => window.location.reload(), 100);

            } catch (error) {
                console.error('Error processing OAuth callback:', error);
            }
        }
    }, [searchParams, navigate, updateUser]);

    return <LandingPage />;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* ===================================== */}
                    {/* ROUTE PUBLIC (Tanpa Login)           */}
                    {/* ===================================== */}
                    <Route path="/" element={<Navigate to="/beranda" replace />} />
                    <Route path="/beranda" element={<LandingPageWithAuth />} />
                    <Route path="/tentang-kami" element={<AboutPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/pemesanan" element={<PemesananPage />} />
                    <Route path="/review/:id" element={<ReviewPage />} />

                    {/* ===================================== */}
                    {/* ROUTE REVIEW SYSTEM                  */}
                    {/* ===================================== */}
                    <Route path="/review-form/:id" element={<ReviewForm />} />
                    <Route path="/review-success/:id" element={<ReviewSuccess />} />

                    {/* ===================================== */}
                    {/* ROUTE AUTH (Login, Register, dsb)    */}
                    {/* ===================================== */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/auth/callback" element={<OAuthCallback />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />

                    {/* ===================================== */}
                    {/* ROUTE USER (Harus Login)             */}
                    {/* ===================================== */}
                    <Route
                        path="/profile"
                        element={<AdminRouteGuard element={<ProfilePage />} isAdminOnly={false} />}
                    />
                    <Route
                        path="/edit-profile"
                        element={<AdminRouteGuard element={<EditProfile />} isAdminOnly={false} />}
                    />

                    {/* ===================================== */}
                    {/* ROUTE PAYMENT FLOW (Harus Login)     */}
                    {/* ===================================== */}
                    <Route
                        path="/pemesanan/:id/status"
                        element={<AdminRouteGuard element={<StatusPage />} isAdminOnly={false} />}
                    />
                    <Route
                        path="/pemesanan/:id/payment/new"
                        element={<AdminRouteGuard element={<PaymentNewPage />} isAdminOnly={false} />}
                    />
                    <Route
                        path="/pemesanan/:id/payment/upload"
                        element={<AdminRouteGuard element={<PaymentUploadPage />} isAdminOnly={false} />}
                    />
                    <Route
                        path="/pemesanan/:id/payment/success"
                        element={<AdminRouteGuard element={<PaymentSuccessPage />} isAdminOnly={false} />}
                    />

                    {/* ===================================== */}
                    {/* ROUTE ADMIN (Admin Only)             */}
                    {/* ===================================== */}
                    <Route
                        path="/admin/*"
                        element={<AdminRouteGuard element={<AdminPanel />} isAdminOnly={true} />}
                    />
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
