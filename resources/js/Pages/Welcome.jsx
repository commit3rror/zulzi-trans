import React from 'react';
import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { ArrowRight, Car, Shield, Clock, Star } from 'lucide-react';

export default function Welcome() {
    return (
        <GuestLayout>
            <Head title="Beranda" />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h1 className="text-5xl font-bold mb-6">
                                Perjalanan Nyaman Dimulai Dari Sini
                            </h1>
                            <p className="text-xl mb-8 text-blue-100">
                                Nikmati layanan transportasi terpercaya dengan armada modern dan sopir profesional
                            </p>
                            <div className="flex gap-4">
                                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
                                    Pesan Sekarang
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                                <Link 
                                    href="/about"
                                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                                >
                                    Tentang Kami
                                </Link>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                                <Car className="w-64 h-64 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                        Mengapa Memilih Kami?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                            <div className="flex justify-center mb-4">
                                <Shield className="w-16 h-16 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Aman & Terpercaya</h3>
                            <p className="text-gray-600">
                                Armada terawat dan sopir berpengalaman untuk keamanan perjalanan Anda
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                            <div className="flex justify-center mb-4">
                                <Clock className="w-16 h-16 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Tepat Waktu</h3>
                            <p className="text-gray-600">
                                Layanan 24/7 dengan komitmen ketepatan waktu di setiap perjalanan
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                            <div className="flex justify-center mb-4">
                                <Star className="w-16 h-16 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Harga Terjangkau</h3>
                            <p className="text-gray-600">
                                Tarif kompetitif dengan kualitas pelayanan terbaik untuk Anda
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-blue-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold mb-2">1000+</div>
                            <div className="text-blue-200">Pelanggan Puas</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">50+</div>
                            <div className="text-blue-200">Rute Kota</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">24/7</div>
                            <div className="text-blue-200">Layanan</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">99%</div>
                            <div className="text-blue-200">Kepuasan</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-16 bg-gray-100">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Siap Memulai Perjalanan Anda?
                    </h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        Pesan sekarang dan rasakan pengalaman berkendara yang berbeda
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-colors">
                        Pesan Sekarang
                    </button>
                </div>
            </div>
        </GuestLayout>
    );
}