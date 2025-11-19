import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-white shadow-sm py-4 px-6 fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* LOGO */}
                <div className="flex items-center gap-2">
                    {/* Ganti src dengan path logo aslimu */}
                    <img src="/images/logo.png" alt="Zulzi Trans" className="h-10" />
                    <div>
                        <h1 className="text-xl font-bold text-blue-900 leading-none">ZULZI TRANS</h1>
                        <p className="text-xs text-blue-500 font-semibold tracking-wider">CEPAT, AMAN, TERPERCAYA</p>
                    </div>
                </div>

                {/* MENU LINKS */}
                <div className="hidden md:flex gap-8 text-gray-600 font-medium">
                    <a href="/" className="hover:text-blue-600 transition">Beranda</a>
                    <a href="/pemesanan" className="hover:text-blue-600 transition">Pemesanan</a>
                    <a href="/tentang-kami" className="hover:text-blue-600 transition">Tentang Kami</a>
                </div>

                {/* LOGIN BUTTON */}
                <div>
                    <a href="/login" className="bg-blue-400 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-500 transition shadow-md">
                        Login
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;