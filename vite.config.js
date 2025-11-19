import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path'; // <--- Tambahkan ini

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css', 
                'resources/js/main.jsx'
            ],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            // Gunakan path.resolve agar mengarah tepat ke root project/resources/js
            '@': path.resolve(__dirname, 'resources/js'), 
        },
    },
});