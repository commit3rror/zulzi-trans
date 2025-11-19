import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
const appName = 'Zulzi Trans';


// Impor komponen App utama
import AdminPanel from '@/Pages/AdminPanel.jsx';

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <AdminPanel />
        </React.StrictMode>
    );
}
