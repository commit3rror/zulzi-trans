// resources/js/app.jsx
import './bootstrap';
import '../css/app.css'; // Pastikan CSS Tailwind diimport disini

import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router'; // Import router yang dibuat di Langkah 2

const rootElement = document.getElementById('app');

if (rootElement) {
    createRoot(rootElement).render(
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    );
}