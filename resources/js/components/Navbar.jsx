import React, { useState, useEffect } from 'react';
import { Truck, User, Menu, X, LogIn } from 'lucide-react';

export default function Navbar({ auth }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Deteksi scroll untuk mengubah background navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur-sm py-4'}`}>
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex justify-between items-center">
                    
                    {/* LOGO */}
                    <a href="/" className="flex items-center gap-3 group text-decoration-none">
                        <div className="w-10 h-10 bg-[#003366] rounded-lg flex items-center justify-center text-white transform group-hover:rotate-12 transition-transform duration-300">
                            <Truck size={20} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-extrabold text-[#003366] leading-none tracking-tighter font-sans">ZULZI</span>
                            <span className="text-sm font-bold text-[#00a3e0] leading-none tracking-[0.2em] font-sans">TRANS</span>
                        </div>
                    </a>

                    {/* DESKTOP MENU */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="/" className="text-sm font-semibold text-gray-600 hover:text-[#00a3e0] uppercase tracking-wide transition-colors no-underline">Beranda</a>
                        <a href="#layanan" className="text-sm font-semibold text-gray-600 hover:text-[#00a3e0] uppercase tracking-wide transition-colors no-underline">Layanan</a>
                        <a href="/about" className="text-sm font-semibold text-gray-600 hover:text-[#00a3e0] uppercase tracking-wide transition-colors no-underline">Tentang Kami</a>
                        
                        {auth?.user ? (
                            <a href="/dashboard" className="px-6 py-2.5 bg-[#003366] text-white text-sm font-bold rounded-full hover:bg-[#002244] transition-all shadow-lg flex items-center gap-2 no-underline">
                                <User size={16} /> Dashboard
                            </a>
                        ) : (
                            <a href="/login" className="px-6 py-2.5 bg-[#00a3e0] text-white text-sm font-bold rounded-full hover:bg-[#008bc0] transition-all shadow-md flex items-center gap-2 hover:-translate-y-0.5 no-underline">
                                <LogIn size={16} /> Login
                            </a>
                        )}
                    </div>

                    {/* MOBILE TOGGLE BUTTON */}
                    <button className="md:hidden text-[#003366] focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU DROPDOWN */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col p-4 space-y-4">
                    <a href="/" className="text-gray-600 font-medium hover:text-[#00a3e0] py-2 border-b border-gray-50 no-underline">Beranda</a>
                    <a href="#layanan" className="text-gray-600 font-medium hover:text-[#00a3e0] py-2 border-b border-gray-50 no-underline">Layanan</a>
                    <a href="#tentang" className="text-gray-600 font-medium hover:text-[#00a3e0] py-2 border-b border-gray-50 no-underline">Tentang Kami</a>
                    <a href={auth?.user ? "/dashboard" : "/login"} className="w-full text-center py-3 bg-[#00a3e0] text-white font-bold rounded-lg mt-2 no-underline block">
                        {auth?.user ? 'Dashboard' : 'Login'}
                    </a>
                </div>
            </div>
        </nav>
    );
}