import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';

// Impor komponen App utama dari AdminPanel.jsx
import App from './Pages/AdminPanel'; 

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}