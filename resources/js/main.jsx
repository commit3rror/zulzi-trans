import React from 'react';
import ReactDOM from 'react-dom/client';
import '../css/app.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import halaman
import LandingPage from '@/Pages/public/LandingPage';
import AboutPage from '@/Pages/AboutPage';

// IMPORT YANG BENAR (Pastikan file ini ada di resources/js/Pages/public/ReviewPage.jsx)
import ReviewPage from '@/Pages/ReviewPage'; 
import AdminPanel from '@/Pages/AdminPanel'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        
        {/* Review Route */}
        <Route path="/review/:id" element={<ReviewPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);