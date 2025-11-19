import './bootstrap'; // Ini akan mengimpor file bootstrap.js Laravel (misalnya untuk Axios)
import React from 'react';
import { createRoot } from 'react-dom/client';
import '../../css/app.css'; // Import file CSS utama Anda

// Temukan elemen di HTML (biasanya di resources/views/welcome.blade.php) 
// tempat React akan me-render aplikasinya
const container = document.getElementById('app'); 

if (container) {
    const root = createRoot(container);
    
    // Render komponen utama Anda
    root.render(
        <React.StrictMode>
            <App /> 
        </React.StrictMode>
    );
} else {
    // Pesan jika elemen 'app' tidak ditemukan (opsional)
    console.error('Failed to find the root element with id="app"');
}

export default App;