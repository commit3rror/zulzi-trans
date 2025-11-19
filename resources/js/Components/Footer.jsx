import React from 'react';
import { Facebook, Instagram } from 'lucide-react'; // Pastikan install lucide-react

const Footer = () => {
    return (
        <footer className="bg-[#0f3456] text-white pt-12 pb-6 mt-auto">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                {/* Kolom 1: Logo & Deskripsi */}
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-2xl font-bold">ZULZI TRANS</h2>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        Solusi transportasi terpercaya untuk segala kebutuhan bisnis Anda. Dengan armada lengkap dan supir berpengalaman, kami siap melayani 24/7 di seluruh Indonesia.
                    </p>
                </div>

                {/* Kolom 2: Layanan */}
                <div>
                    <h3 className="font-bold text-lg mb-4">Layanan Kami</h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                        <li><a href="#" className="hover:text-white">Angkut Barang</a></li>
                        <li><a href="#" className="hover:text-white">Angkut Sampah</a></li>
                        <li><a href="#" className="hover:text-white">Rental Mobil</a></li>
                    </ul>
                </div>

                {/* Kolom 3: Link Cepat */}
                <div>
                    <h3 className="font-bold text-lg mb-4">Link Cepat</h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                        <li><a href="/" className="hover:text-white">Beranda</a></li>
                        <li><a href="/pemesanan" className="hover:text-white">Pemesanan</a></li>
                        <li><a href="/tentang" className="hover:text-white">Tentang Kami</a></li>
                    </ul>
                </div>

                {/* Kolom 4: Kontak */}
                <div>
                    <h3 className="font-bold text-lg mb-4">Kontak Kami</h3>
                    <div className="space-y-3 text-gray-300 text-sm">
                        <div className="flex items-center gap-2">
                            <Instagram size={18} /> <span>zulzi.trans</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Ikon TikTok bisa pakai svg custom atau library lain */}
                            <span>🎵</span> <span>zulzi.trans</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Facebook size={18} /> <span>zulzi.trans</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Area Layanan Box */}
            <div className="max-w-7xl mx-auto px-6 mb-8">
                <div className="bg-[#1a456e] p-4 rounded-lg border border-[#2a5d8f]">
                    <h4 className="text-yellow-400 font-semibold flex items-center gap-2 mb-1">
                        📍 Area Layanan
                    </h4>
                    <p className="text-xs text-gray-300">Jabodetabek, Jawa Barat, Jawa Tengah, Jawa Timur, dan seluruh Indonesia</p>
                </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-xs text-gray-400 border-t border-gray-700 pt-6">
                © 2025 Zulzi Trans. Hak Cipta Dilindungi. | PT Zulzi Trans Indonesia
            </div>
        </footer>
    );
};

export default Footer;