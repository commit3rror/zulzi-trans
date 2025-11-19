import React from 'react';
import { CheckCircle, Target, Users, Award } from 'lucide-react';

// 1. IMPORT KOMPONEN NAVBAR & FOOTER
// Pastikan path-nya sesuai dengan lokasi file kamu. 
// Jika file ini ada di 'resources/js/Pages/', maka gunakan '../components/...'
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer';

export default function AboutPage(props) {
  // Mengambil data auth dari props (dikirim dari Laravel/Inertia)
  const auth = props.auth || {};

  return (
    <div className="font-sans antialiased text-gray-800 bg-white min-h-screen flex flex-col">
      
      {/* Inject Font Montserrat (Jika belum ada di app.blade.php) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');
        body, h1, h2, h3, h4, p, div, span { font-family: 'Montserrat', sans-serif; }
      `}</style>

      {/* 2. PASANG NAVBAR DI SINI */}
      {/* Kita kirim props 'auth' agar tombol Login/Dashboard berfungsi */}
      <Navbar auth={auth} />

      {/* --- CONTENT START --- */}
      
      {/* Header Section */}
      <section className="relative bg-[#003366] pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Tentang Zulzi Trans</h1>
            <p className="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                Kami bukan sekadar penyedia transportasi, kami adalah mitra perjalanan Anda menuju kesuksesan dan tujuan impian.
            </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="w-full md:w-1/2">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                        {/* Placeholder Image */}
                        <div className="bg-gray-200 h-96 w-full flex items-center justify-center text-gray-400">
                             [Foto Kantor/Armada]
                        </div>
                        <div className="absolute bottom-0 left-0 bg-[#00a3e0] text-white px-8 py-4 rounded-tr-2xl font-bold text-xl">
                            Est. 2018
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2">
                    <h2 className="text-sm font-bold text-[#00a3e0] uppercase tracking-widest mb-2">Siapa Kami</h2>
                    <h3 className="text-3xl font-extrabold text-[#003366] mb-6">Solusi Transportasi Terintegrasi</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Zulzi Trans didirikan dengan visi untuk mempermudah mobilitas masyarakat dan logistik bisnis di Indonesia. Berawal dari 2 unit armada, kini kami telah melayani ribuan pelanggan dengan puluhan armada yang siap beroperasi 24 jam.
                    </p>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Kami percaya bahwa perjalanan yang baik dimulai dari pelayanan yang prima, kendaraan yang terawat, dan pengemudi yang profesional.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-[#00a3e0]" size={20} />
                            <span className="font-bold text-gray-700">Respon Cepat</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-[#00a3e0]" size={20} />
                            <span className="font-bold text-gray-700">Harga Transparan</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-[#00a3e0]" size={20} />
                            <span className="font-bold text-gray-700">Armada Prima</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-[#00a3e0]" size={20} />
                            <span className="font-bold text-gray-700">Supir Profesional</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="py-20 bg-[#f0f9ff]">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-blue-50 hover:shadow-md transition-all">
                    <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-[#003366] mb-6">
                        <Target size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-[#003366] mb-3">Visi Kami</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Menjadi perusahaan transportasi dan logistik terdepan di Indonesia yang dikenal karena kualitas pelayanan, keamanan, dan inovasi teknologi.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-blue-50 hover:shadow-md transition-all">
                    <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-[#003366] mb-6">
                        <Users size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-[#003366] mb-3">Misi Kami</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Memberikan pengalaman perjalanan yang aman dan nyaman, serta solusi logistik yang efisien bagi mitra bisnis kami melalui SDM yang unggul.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-blue-50 hover:shadow-md transition-all">
                    <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-[#003366] mb-6">
                        <Award size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-[#003366] mb-3">Nilai Kami</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Integritas, Profesionalisme, Keselamatan, dan Kepuasan Pelanggan adalah pilar utama dalam setiap langkah operasional kami.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* --- CONTENT END --- */}

      {/* 3. PASANG FOOTER DI SINI */}
      <Footer />

    </div>
  );
}