import React from 'react';
import ReactDOM from 'react-dom/client';
import '../css/app.css';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import halaman Public
import LandingPage from '@/Pages/public/LandingPage';
import AboutPage from '@/Pages/AboutPage';
import ReviewForm from '@/Pages/Review/ReviewForm';
import ReviewSuccess from '@/Pages/Review/ReviewSuccess';
import PemesananPage from '@/Pages/Pemesanan/Index';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Route Utama: /beranda */}
        <Route path="/beranda" element={<LandingPage />} />
        
        {/* Jika user akses root '/' via navigasi internal React, redirect ke beranda */}
        <Route path="/" element={<Navigate to="/beranda" replace />} />

        {/* Halaman Public Lainnya */}
        <Route path="/tentang-kami" element={<AboutPage />} /> 
        <Route path="/about" element={<AboutPage />} /> 
        
        <Route path="/pemesanan" element={<PemesananPage />} />
        
        {/* Review Routes */}
        <Route path="/review/:id" element={<ReviewForm />} />
        <Route path="/review/success" element={<ReviewSuccess />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);