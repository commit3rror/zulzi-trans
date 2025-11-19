import React from 'react';
import ReactDOM from 'react-dom/client';
import '../css/app.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import halaman
import LandingPage from '@/Pages/public/LandingPage';
import AboutPage from '@/Pages/AboutPage';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
