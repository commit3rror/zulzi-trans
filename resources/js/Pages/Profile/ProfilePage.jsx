import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainLayout from '../../Layouts/MainLayout';
import { User, Mail, Phone, MapPin, Calendar, Package, CheckCircle, Clock, XCircle, AlertTriangle, Eye, ArrowLeft } from 'lucide-react';

const ProfilePage = ({ auth }) => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' atau 'orders'

    // Fetch history pemesanan saat component mount
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/user/pemesanan', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Jika pakai Sanctum token
                }
            });
            if (response.data.status === 'success') {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Format rupiah
    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', { 
            style: 'currency', 
            currency: 'IDR', 
            minimumFractionDigits: 0 
        }).format(num);
    };

    // Format tanggal
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Status badge component
    const StatusBadge = ({ status }) => {
        const statusConfig = {
            'Menunggu': { bg: 'bg-orange-100', text: 'text-orange-700', icon: Clock },
            'Dikonfirmasi': { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
            'Menunggu Verifikasi': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
            'Pembayaran Ditolak': { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
            'Selesai': { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle },
            'Lunas': { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle }
        };

        const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: AlertTriangle };
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
                <Icon size={14} />
                {status}
            </span>
        );
    };

    // Render Tab Profile
    const renderProfileTab = () => (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 animate-fade-in-up">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="text-[#003366]" size={28} />
                Informasi Profil
            </h3>

            <div className="space-y-5">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-[#003366] rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {auth.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                        <label className="text-sm text-gray-500 font-medium">Nama Lengkap</label>
                        <p className="text-lg font-bold text-gray-800">{auth.user?.name || 'User'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <Mail className="text-[#00a3e0]" size={24} />
                    <div className="flex-1">
                        <label className="text-sm text-gray-500 font-medium">Email</label>
                        <p className="text-gray-800 font-medium">{auth.user?.email || 'user@example.com'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <Phone className="text-[#00a3e0]" size={24} />
                    <div className="flex-1">
                        <label className="text-sm text-gray-500 font-medium">Nomor Telepon</label>
                        <p className="text-gray-800 font-medium">{auth.user?.no_hp || 'Belum diatur'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <MapPin className="text-[#00a3e0]" size={24} />
                    <div className="flex-1">
                        <label className="text-sm text-gray-500 font-medium">Alamat</label>
                        <p className="text-gray-800 font-medium">{auth.user?.alamat || 'Belum diatur'}</p>
                    </div>
                </div>
            </div>

            {/* Button Edit Profile - Untuk Avita */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <button 
                    onClick={() => alert('Fitur Edit Profile akan dikerjakan oleh Avita')}
                    className="w-full md:w-auto px-6 py-3 bg-[#003366] text-white font-bold rounded-xl hover:bg-[#002244] transition shadow-lg"
                >
                    Edit Profil
                </button>
            </div>
        </div>
    );

    // Render Tab Orders
    const renderOrdersTab = () => (
        <div className="space-y-6 animate-fade-in-up">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Package className="text-[#003366]" size={28} />
                    Riwayat Pemesanan
                </h3>

                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a3e0] mx-auto"></div>
                        <p className="mt-4 text-gray-500">Memuat data...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <Package size={64} className="mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">Belum ada pesanan</p>
                        <p className="text-sm mt-2">Mulai pesan layanan Zulzi Trans sekarang!</p>
                        <a href="/pemesanan" className="inline-block mt-6 px-6 py-3 bg-[#00a3e0] text-white font-bold rounded-xl hover:bg-[#0082b3] transition">
                            Buat Pesanan
                        </a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div 
                                key={order.id_pemesanan} 
                                className="border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 bg-white"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-bold text-gray-800 text-lg">
                                                {order.layanan?.nama_layanan || 'Layanan'}
                                            </h4>
                                            <StatusBadge status={order.status_pemesanan} />
                                        </div>
                                        <p className="text-sm text-gray-500 font-mono">Order #{order.id_pemesanan}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Total Biaya</p>
                                        <p className="font-extrabold text-xl text-[#003366]">
                                            {order.total_biaya > 0 ? formatRupiah(order.total_biaya) : 'Belum Ditentukan'}
                                        </p>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar size={16} className="text-gray-400" />
                                        <span>Tanggal: <strong>{formatDate(order.tgl_mulai)}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin size={16} className="text-gray-400" />
                                        <span className="truncate">{order.lokasi_jemput}</span>
                                    </div>
                                    {order.armada && (
                                        <div className="flex items-center gap-2 text-gray-600 col-span-2">
                                            <Package size={16} className="text-gray-400" />
                                            <span>Armada: <strong>{order.armada.nama_armada}</strong> ({order.armada.no_plat})</span>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <p className="text-xs text-gray-400">
                                        Dipesan: {formatDate(order.tgl_pesan)}
                                    </p>
                                    <a 
                                        href={`/pemesanan?order=${order.id_pemesanan}`}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#00a3e0] text-white font-bold text-sm rounded-lg hover:bg-[#0082b3] transition"
                                    >
                                        <Eye size={16} />
                                        Lihat Detail
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <MainLayout>
            {/* Header */}
            <div className="mb-6 pt-4 max-w-6xl mx-auto">
                <a href="/" className="inline-flex items-center text-[#00a3e0] hover:text-[#003366] text-sm font-medium transition-colors">
                    <ArrowLeft size={16} className="mr-1" /> Kembali ke Beranda
                </a>
            </div>

            {/* Title */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-[#003366]">Profil Pengguna</h2>
                <p className="text-gray-500 mt-2">Kelola informasi akun & lihat riwayat pemesanan</p>
            </div>

            {/* Tabs */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-2 inline-flex gap-2">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${
                            activeTab === 'profile'
                                ? 'bg-[#003366] text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Profil Saya
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${
                            activeTab === 'orders'
                                ? 'bg-[#003366] text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Riwayat Pesanan
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto mb-20">
                {activeTab === 'profile' ? renderProfileTab() : renderOrdersTab()}
            </div>
        </MainLayout>
    );
};

export default ProfilePage;
