import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Truck, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Modal, Alert } from '@/Components/ReusableUI'; // Asumsi path import ini benar

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const { isAuthenticated, user, logout } = useAuth(); 
    
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    
    const dropdownRef = useRef(null); 

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [logoutAlert, setLogoutAlert] = useState(null);       

    // --- STATE BARU: Modal Login Diperlukan ---
    const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false); 

    // Efek untuk mendeteksi scroll (kode yang sudah ada)
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // --- Efek untuk menutup dropdown saat klik di luar (Fix Dropdown Hover) ---
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside); 
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]); 
    
    // Fungsi helper untuk menentukan class aktif
    const isActive = (path) => {
        return location.pathname === path ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-600";
    };
    
    // --- FUNGSI BARU: Intersep Klik Pemesanan (Dibuat ROBUST & Terapkan Modal) ---
    const handlePemesananClick = (e) => {
        e.preventDefault(); // <--- SELALU MENCEGAH DEFAULT ACTION LINK untuk kontrol penuh
        
        if (!isAuthenticated) {
            setShowLoginRequiredModal(true); // Tampilkan modal pemberitahuan
        } else {
            // Jika sudah login, navigasi secara eksplisit
            navigate('/pemesanan'); 
        }
    };
    
    // Fungsi untuk membuka modal konfirmasi logout
    const handleOpenLogoutModal = (e) => {
        if (e) e.preventDefault();
        setIsProfileDropdownOpen(false); // Tutup dropdown saat modal dibuka
        setMobileMenuOpen(false);
        setShowLogoutModal(true);
    };

    // Fungsi untuk menjalankan proses logout
    const confirmLogout = async () => {
        setShowLogoutModal(false); 
        
        try {
            await logout();
            
            setLogoutAlert({ type: 'error', message: 'Logout berhasil! Anda telah keluar dari akun.' }); 

            setTimeout(() => {
                setLogoutAlert(null);
                navigate('/beranda', { replace: true });
            }, 3000); 

        } catch (error) {
            console.error("Logout failed:", error);
            setLogoutAlert({ type: 'error', message: 'Gagal melakukan logout.' });
            setTimeout(() => setLogoutAlert(null), 5000);
        }
    };


    // Komponen Tombol Autentikasi (Menggunakan Toggle Click)
    const AuthButton = () => {
        
        if (isAuthenticated && user) {
            
            const profilePath = user.role_pengguna === 'admin' ? '/admin/dashboard' : '/edit-profile';

            return (
                <div 
                    className="relative"
                    ref={dropdownRef} // TERAPKAN REF DI SINI
                >
                    <button 
                        onClick={() => setIsProfileDropdownOpen(prev => !prev)} // TOGGLE CLICK
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors shadow-md"
                    >
                        {user.nama.split(' ')[0]} 
                        <User size={18} />
                    </button>
                    
                    {isProfileDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 py-1">
                            <Link 
                                to={profilePath} 
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={() => { setIsProfileDropdownOpen(false); setMobileMenuOpen(false); }}
                            >
                                {user.role_pengguna === 'admin' ? 'Dashboard Admin' : 'Lihat Profil'}
                            </Link>
                            <button 
                                onClick={handleOpenLogoutModal} 
                                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        // Jika user BELUM LOGIN
        return (
            <Link 
                to="/login"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 px-6 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
            >
                Login Sekarang
            </Link>
        );
    };

    return (
        <>
            {/* NOTIFIKASI ALERT */}
            {logoutAlert && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md p-4 animate-fade-in-up">
                    <Alert 
                        type={logoutAlert.type} 
                        message={logoutAlert.message} 
                        onClose={() => setLogoutAlert(null)} 
                    />
                </div>
            )}
        
            <nav 
                className={`fixed w-full top-0 z-50 transition-all duration-300 ${
                    isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 backdrop-blur-sm py-4 border-b border-gray-100'
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    
                    {/* LOGO */}
                    <Link to="/beranda" className="flex items-center gap-2 text-xl font-extrabold text-[#003366]">
                        <Truck className="w-6 h-6 text-primary" />
                        Zulzi <span className="text-primary">Trans</span>
                    </Link>

                    {/* DESKTOP MENU */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/beranda" className={isActive("/beranda")}>Beranda</Link>
                        
                        {/* LINK PEMESANAN DESKTOP */}
                        <Link 
                            to="/pemesanan" 
                            className={isActive("/pemesanan")}
                            onClick={handlePemesananClick} 
                        >
                            Pemesanan
                        </Link>
                        
                        <Link to="/tentang-kami" className={isActive("/tentang-kami")}>Tentang Kami</Link>
                        
                        <AuthButton />
                    </div>

                    {/* MOBILE MENU BUTTON */}
                    <button 
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* MOBILE MENU DROPDOWN */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute w-full bg-white shadow-xl border-t border-gray-100">
                        <div className="px-6 py-4 flex flex-col space-y-3">
                            {/* Link Mobile */}
                            <Link 
                                to="/beranda" 
                                className="text-gray-700 font-medium hover:text-blue-600 py-2 border-b border-gray-50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Beranda
                            </Link>
                            
                            {/* LINK PEMESANAN MOBILE */}
                            <Link 
                                to="/pemesanan" 
                                className="text-gray-700 font-medium hover:text-blue-600 py-2 border-b border-gray-50"
                                onClick={(e) => {
                                    setMobileMenuOpen(false); // Tutup menu mobile
                                    handlePemesananClick(e); 
                                }}
                            >
                                Pemesanan
                            </Link>
                            
                            <Link 
                                to="/tentang-kami" 
                                className="text-gray-700 font-medium hover:text-blue-600 py-2 border-b border-gray-50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Tentang Kami
                            </Link>
                            
                            {/* Tombol Auth Mobile */}
                            <div className="mt-4">
                                {isAuthenticated ? (
                                    <button 
                                        onClick={handleOpenLogoutModal} 
                                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium"
                                    >
                                        <LogOut size={18} /> Logout
                                    </button>
                                ) : (
                                    <Link 
                                        to="/login"
                                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 px-6 rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-center"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login Sekarang
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
            
            {/* MODAL KONFIRMASI LOGOUT */}
            <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Konfirmasi Logout" size="sm">
                <div className="p-6 text-center">
                    <LogOut className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-slate-700">Apakah Anda yakin ingin keluar?</p>
                    <p className="text-sm text-slate-500 mt-2">Sesi Anda akan diakhiri dan Anda harus login kembali.</p>
                </div>
                <div className="flex justify-end gap-3 p-5 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                    <button 
                        type="button" 
                        onClick={() => setShowLogoutModal(false)} 
                        className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                    >
                        Batal
                    </button>
                    <button 
                        type="button" 
                        onClick={confirmLogout} 
                        className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Ya, Logout
                    </button>
                </div>
            </Modal>
            
            {/* --- MODAL LOGIN DIPERLUKAN (Login Required) --- */}
            <Modal isOpen={showLoginRequiredModal} onClose={() => setShowLoginRequiredModal(false)} title="Akses Dibatasi" size="sm">
                <div className="p-6 text-center">
                    <User className="w-12 h-12 text-[#003366] mx-auto mb-4" />
                    <p className="text-lg font-semibold text-slate-700">Login Diperlukan untuk Pemesanan</p>
                    <p className="text-sm text-slate-500 mt-2">
                        Anda harus masuk ke akun Anda terlebih dahulu untuk mengakses halaman Pemesanan dan melanjutkan transaksi.
                    </p>
                </div>
                <div className="flex justify-center gap-3 p-5 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                    <button 
                        type="button" 
                        onClick={() => setShowLoginRequiredModal(false)} 
                        className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                    >
                        Tutup
                    </button>
                    <button 
                        type="button" 
                        onClick={() => {
                            setShowLoginRequiredModal(false);
                            // Redirect ke halaman login
                            navigate('/login'); 
                        }} 
                        // Menggunakan warna primary: bg-primary / hover:bg-primary-dark
                        className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Login Sekarang
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default Navbar;