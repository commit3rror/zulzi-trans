// resources/js/app.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext.jsx';

import LoginPage from './Pages/Auth/LoginPage.jsx';
import RegisterPage from './Pages/Auth/RegisterPage.jsx';
import ForgotPasswordPage from './Pages/Auth/ForgotPasswordPage.jsx';
import EditProfile from './Pages/Auth/EditProfile.jsx';
import AdminPanel from './Pages/AdminPanel.jsx';
import BerandaPage from './Pages/BerandaPage.jsx';

import '../css/app.css';

// Komponen Guard untuk memproteksi rute
const ProtectedRoute = ({ children, roles = [] }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles.length > 0 && !roles.includes(user.role_pengguna?.toLowerCase())) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

// Komponen Redirect jika sudah login (untuk halaman login/register)
const GuestRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    if (user) {
        return <Navigate to={user.role_pengguna === 'admin' ? '/admin' : '/beranda'} replace />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes (Guest Only) */}
                    <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
                    <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                    {/* Redirect root ke Beranda */}
                    <Route path="/" element={<Navigate to="/beranda" replace />} />

                    {/* Protected Routes (Customer & Admin) */}
                    <Route path="/beranda" element={
                        <ProtectedRoute roles={['customer', 'admin']}>
                            <BerandaPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/edit-profile" element={
                        <ProtectedRoute>
                            <EditProfile />
                        </ProtectedRoute>
                    } />

                    {/* Admin Routes */}
                    <Route path="/admin/*" element={
                        <ProtectedRoute roles={['admin']}>
                            <AdminPanel />
                        </ProtectedRoute>
                    } />

                    {/* Fallback Route */}
                    <Route path="*" element={<div>404 Not Found</div>} />
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
