import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import Auth Provider - TANPA default export
import { AuthProvider } from '@/context/AuthContext.jsx';

// Import Pages
import LoginPage from './Pages/Auth/LoginPage.jsx';
import RegisterPage from './Pages/Auth/RegisterPage.jsx';
import ForgotPasswordPage from './Pages/Auth/ForgotPasswordPage.jsx';
import ProfilePage from './Pages/Auth/ProfilePage.jsx';
import AdminPanel from './Pages/AdminPanel.jsx';

// Import CSS
import '../css/app.css';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={
                        <div className="flex items-center justify-center min-h-screen bg-gray-100">
                            <div className="text-center">
                                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                                <p className="text-xl text-gray-600">Halaman tidak ditemukan</p>
                                <a 
                                    href="/login" 
                                    className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Kembali ke Login
                                </a>
                            </div>
                        </div>
                    } />
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