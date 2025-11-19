// resources/js/app.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext.jsx';

// Import Pages
import LoginPage from './Pages/Auth/LoginPage.jsx';
import RegisterPage from './Pages/Auth/RegisterPage.jsx';
import ForgotPasswordPage from './Pages/Auth/ForgotPasswordPage.jsx';
import EditProfile from './Pages/Auth/EditProfile.jsx'; // <--- GANTI INI
import AdminPanel from './Pages/AdminPanel.jsx';

import '../css/app.css';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    
                    {/* Rute baru untuk Edit Profile */}
                    <Route path="/edit-profile" element={<EditProfile />} />
                    
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    {/* ... 404 handler ... */}
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
