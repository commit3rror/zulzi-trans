import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import '../css/app.css';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        const searchFor = `${name}.jsx`;

        console.log(`🔍 Mencari file dengan akhiran: ${searchFor}`);

        for (const path in pages) {
            if (path.endsWith(searchFor)) {
                const module = pages[path];
                console.log(`✅ KETEMU di alamat: ${path}`);
                
                // --- PERBAIKAN LOGIKA DI SINI ---
                // 1. Jika module punya properti default, ambil default-nya.
                // 2. Jika tidak, berarti 'module' itu sendiri adalah komponennya (karena eager loading).
                return module.default || module; 
            }
        }

        console.error(`❌ ERROR: Tidak ada file yang cocok dengan ${searchFor}`);
        return null;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});