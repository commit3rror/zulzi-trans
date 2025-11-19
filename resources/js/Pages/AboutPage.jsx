import React from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { 
    Users, MapPin, Clock, Star, CheckCircle, DollarSign, 
    Headphones, Globe, Shield, Heart 
} from 'lucide-react';

export default function AboutPage() {
    // Hardcoded data sesuai dengan AboutController
    const aboutData = {
        company: {
            name: 'Zulzi Trans',
            tagline: 'Partner Terpercaya untuk Kebutuhan Transportasi Anda',
            description: 'Zulzi Trans adalah penyedia layanan transportasi terpercaya yang mengutamakan kenyamanan, keamanan, dan ketepatan waktu. Dengan pengalaman bertahun-tahun, kami mampu memberikan pelayanan terbaik. Dengan pengalaman bertahun-tahun, kami mampu memfasilitasi transportasi yang aman, nyaman, dan terpercaya.'
        },
        statistics: [
            {
                icon: 'users',
                value: '1000+',
                label: 'Pelanggan Puas'
            },
            {
                icon: 'map',
                value: '50+',
                label: 'Armada Siap'
            },
            {
                icon: 'clock',
                value: '24/7',
                label: 'Layanan'
            },
            {
                icon: 'star',
                value: '99%',
                label: 'Kepuasan'
            }
        ],
        vision: [
            {
                number: '1',
                text: 'Harga penyedia layanan transportasi terpercaya di Indonesia'
            },
            {
                number: '2',
                text: 'Menyajikan solusi perjalanan yang aman dan nyaman'
            },
            {
                number: '3',
                text: 'Menjadi pilihan utama masyarakat untuk mobilitas sehari-hari'
            }
        ],
        mission: [
            {
                icon: 'check-circle',
                text: 'Memberikan layanan transportasi yang berkualitas dan terpercaya'
            },
            {
                icon: 'check-circle',
                text: 'Menyediakan armada yang terawat dan dalam kondisi prima'
            },
            {
                icon: 'check-circle',
                text: 'Meningkatkan kepuasan pelanggan dengan layanan terbaik dan profesional'
            },
            {
                icon: 'check-circle',
                text: 'Memberikan pelayanan yang ramah dan profesional'
            }
        ],
        features: [
            {
                icon: 'dollar-sign',
                title: 'Harga Kompetitif',
                description: 'Tarif yang terjangkau dengan kualitas terbaik untuk semua kalangan'
            },
            {
                icon: 'headphones',
                title: 'Layanan 24/7',
                description: 'Siap melayani kebutuhan transportasi Anda kapan saja'
            },
            {
                icon: 'globe',
                title: 'Booking Online',
                description: 'Kemudahan untuk melakukan pemesanan melalui aplikasi digital'
            },
            {
                icon: 'shield',
                title: 'Transparansi Penuh',
                description: 'Informasi harga dan layanan yang jelas tanpa biaya tersembunyi'
            }
        ],
        commitment: {
            guarantee: '100%',
            guarantee_label: 'Garansi',
            service: '24/7',
            service_label: 'Layanan',
            rating: '5★',
            rating_label: 'Rating',
            description: 'Kepercayaan yang Anda berikan adalah aset kami. Kami berkomitmen untuk terus meningkatkan dan memberikan layanan transportasi yang terpercaya dalam setiap perjalanan. Keselamatan dan kenyamanan Anda adalah prioritas utama kami. Dengan armada terawat dan sopir berpengalaman, kami siap mengantarkan Anda ke tujuan dengan aman dan nyaman.'
        }
    };

    const getIcon = (iconName, className = "w-8 h-8") => {
        const icons = {
            'users': <Users className={className} />,
            'map': <MapPin className={className} />,
            'clock': <Clock className={className} />,
            'star': <Star className={className} />,
            'check-circle': <CheckCircle className={className} />,
            'dollar-sign': <DollarSign className={className} />,
            'headphones': <Headphones className={className} />,
            'globe': <Globe className={className} />,
            'shield': <Shield className={className} />
        };
        return icons[iconName] || null;
    };

    return (
        <GuestLayout>
            <Head title="Tentang Kami - Zulzi Trans" />
            
            {/* Header Section dengan styling sesuai mockup */}
            <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 py-16 px-4">
                <div className="container mx-auto text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-cyan-400 rounded-full p-4 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold text-blue-900 mb-4">
                        Tentang Kami
                    </h1>
                    <p className="text-blue-700 text-xl max-w-2xl mx-auto">
                        {aboutData.company.tagline}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                {/* Company Info Card - Sesuai Mockup */}
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left Side - Text */}
                        <div>
                            <h2 className="text-3xl font-bold text-blue-900 mb-6">
                                {aboutData.company.name}
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg mb-6">
                                {aboutData.company.description}
                            </p>
                        </div>

                        {/* Right Side - Illustration Card */}
                        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-8 flex items-center justify-center">
                            <div className="text-center">
                                <div className="bg-red-500 rounded-2xl w-56 h-40 mx-auto mb-6 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                                    <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                                    </svg>
                                </div>
                                <p className="text-blue-900 font-bold text-lg mb-2">
                                    Perjalanan Dimulai Dari Sini
                                </p>
                                <p className="text-blue-600 text-sm">
                                    Anda hanya perlu klik!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                        {aboutData.statistics.map((stat, index) => (
                            <div key={index} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                                <div className="flex justify-center mb-3 text-cyan-500">
                                    {getIcon(stat.icon, "w-10 h-10")}
                                </div>
                                <div className="text-3xl font-bold text-blue-900 mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-blue-600 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vision Section - Sesuai Mockup */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 md:p-12 mb-16">
                    <div className="flex items-center justify-center mb-8">
                        <div className="bg-cyan-400 rounded-full p-4 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"/>
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold text-center text-blue-900 mb-6">
                        Visi Kami
                    </h2>
                    <p className="text-center text-gray-600 text-lg mb-12 max-w-3xl mx-auto">
                        Kami berkomitmen untuk menjadi penyedia layanan transportasi yang terpercaya dalam membantu perjalanan yang tak terlupakan bagi setiap pelanggan.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8">
                        {aboutData.vision.map((item, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-shadow">
                                <div className="bg-gradient-to-br from-cyan-100 to-blue-100 text-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-md">
                                    {item.number}
                                </div>
                                <p className="text-gray-700 leading-relaxed">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mission Section */}
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16">
                    <div className="flex items-center justify-center mb-8">
                        <div className="bg-cyan-400 rounded-full p-4 shadow-lg">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
                        Misi Kami
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {aboutData.mission.map((item, index) => (
                            <div key={index} className="flex items-start gap-4 bg-blue-50 rounded-xl p-6">
                                <div className="text-cyan-500 flex-shrink-0">
                                    {getIcon(item.icon, "w-7 h-7")}
                                </div>
                                <p className="text-gray-700 leading-relaxed">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Why Choose Us Section */}
                <div className="mb-16">
                    <h2 className="text-4xl font-bold text-center text-blue-900 mb-4">
                        Mengapa Memilih Zulzi Trans?
                    </h2>
                    <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
                        Keunggulan dan kemudahan kami untuk memberikan layanan transportasi terbaik
                    </p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {aboutData.features.map((feature, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all transform hover:-translate-y-2">
                                <div className="flex justify-center mb-6 text-cyan-500">
                                    {index === 3 ? (
                                        getIcon(feature.icon, "w-14 h-14 text-orange-500")
                                    ) : (
                                        getIcon(feature.icon, "w-14 h-14")
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-blue-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Commitment Section - Sesuai Mockup */}
                <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl mb-16">
                    <div className="text-center mb-10">
                        <div className="flex justify-center mb-6">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                                <Heart className="w-12 h-12" fill="white" />
                            </div>
                        </div>
                        <h2 className="text-4xl font-bold mb-6">
                            Komitmen Kami
                        </h2>
                        <p className="max-w-4xl mx-auto leading-relaxed text-lg text-white/95">
                            {aboutData.commitment.description}
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-12">
                        <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                            <div className="text-5xl font-bold mb-2">
                                {aboutData.commitment.guarantee}
                            </div>
                            <div className="text-lg opacity-90">
                                {aboutData.commitment.guarantee_label}
                            </div>
                        </div>
                        <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                            <div className="text-5xl font-bold mb-2">
                                {aboutData.commitment.service}
                            </div>
                            <div className="text-lg opacity-90">
                                {aboutData.commitment.service_label}
                            </div>
                        </div>
                        <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                            <div className="text-5xl font-bold mb-2">
                                {aboutData.commitment.rating}
                            </div>
                            <div className="text-lg opacity-90">
                                {aboutData.commitment.rating_label}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-12">
                    <h2 className="text-4xl font-bold text-blue-900 mb-4">
                        Siap Memulai Perjalanan Anda?
                    </h2>
                    <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
                        Hubungi kami sekarang dan dapatkan pengalaman berkendaraan yang tak terlupakan
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                            Pesan Sekarang
                        </button>
                        <button className="border-3 border-blue-500 text-blue-600 hover:bg-blue-50 px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1">
                            Lihat Demo
                        </button>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}