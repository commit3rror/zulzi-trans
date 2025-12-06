import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from '@/Layouts/AdminLayout.jsx';
import DashboardPage from '@/Pages/Admin/DashboardPage.jsx';
import ArmadaPage from '@/Pages/Admin/ArmadaPage.jsx';
import PenggunaPage from '@/Pages/Admin/PenggunaPage.jsx';
import PembayaranPage from '@/Pages/Admin/PembayaranPage.jsx';
import PesananPage from '@/Pages/Admin/PesananPage.jsx';
import KelolaSupir from '@/Pages/Admin/KelolaSupir.jsx';
import KelolaUlasan from '@/Pages/Admin/KelolaUlasan.jsx';

/**
 * AdminPanel dengan React Router (Nested Routes)
 * Mengganti window.history.pushState dengan navigate dari React Router
 */
const AdminPanel = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [headerAction, setHeaderAction] = useState(null);

    // Deteksi halaman aktif dari URL
    const getActivePage = () => {
        const pathAfterAdmin = location.pathname.split('/admin/')[1];
        
        // Jika tidak ada path setelah /admin/, return 'dashboard'
        if (!pathAfterAdmin || pathAfterAdmin === '') {
            return 'dashboard';
        }
        
        // Hapus trailing slash jika ada
        return pathAfterAdmin.replace(/\/$/, '');
    };

    const activePage = getActivePage();

    // Handle navigasi menggunakan React Router
    const handleNavigate = (pageId) => {
        navigate(`/admin/${pageId}`);
    };

    // Metadata untuk header
    const getPageMeta = () => {
        switch (activePage) {
            case 'dashboard':
                return { title: 'Dashboard', subtitle: 'Selamat datang di panel admin' };
            case 'armada':
                return { title: 'Pengelolaan Armada', subtitle: 'Kelola data armada kendaraan Anda' };
            case 'pengguna':
                return { title: 'Pengelolaan Pengguna', subtitle: 'Kelola data pengguna sistem' };
            case 'pembayaran':
                return { title: 'Verifikasi Pembayaran', subtitle: 'Verifikasi Pembayaran dari Pelanggan' };
            case 'pesanan':
                return { title: 'Pengelolaan Pesanan dan Jadwal', subtitle: 'Kelola Pesanan dan Jadwal Perjalanan' };
            case 'supir':
                return { title: 'Pengelolaan Supir', subtitle: 'Kelola data supir untuk armada' };
            case 'ulasan':
                return { title: 'Manajemen Ulasan', subtitle: 'Kelola ulasan pelanggan untuk landing page' };
            default:
                return { title: 'Halaman Tidak Ditemukan', subtitle: '' };
        }
    };

    return (
        <AdminLayout
            activePage={activePage}
            onNavigate={handleNavigate}
            meta={getPageMeta()}
            headerAction={headerAction}
        >
            <Routes>
                {/* Default route: redirect /admin ke /admin/dashboard */}
                <Route path="/" element={<Navigate to="dashboard" replace />} />
                
                {/* Nested routes untuk setiap halaman admin */}
                <Route path="dashboard" element={<DashboardPage setHeaderAction={setHeaderAction} />} />
                <Route path="armada" element={<ArmadaPage setHeaderAction={setHeaderAction} />} />
                <Route path="pengguna" element={<PenggunaPage setHeaderAction={setHeaderAction} />} />
                <Route path="pembayaran" element={<PembayaranPage setHeaderAction={setHeaderAction} />} />
                <Route path="pesanan" element={<PesananPage setHeaderAction={setHeaderAction} />} />
                <Route path="supir" element={<KelolaSupir setHeaderAction={setHeaderAction} />} />
                <Route path="ulasan" element={<KelolaUlasan setHeaderAction={setHeaderAction} />} />
                
                {/* 404 route */}
                <Route path="*" element={
                    <div className="p-10 text-center text-gray-400">
                        Halaman tidak ditemukan.
                    </div>
                } />
            </Routes>
        </AdminLayout>
    );
};

export default AdminPanel;