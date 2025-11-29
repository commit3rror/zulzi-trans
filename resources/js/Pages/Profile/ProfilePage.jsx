import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../Layouts/MainLayout';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, Package, CheckCircle, Clock, XCircle, AlertTriangle, Eye, ArrowLeft } from 'lucide-react';

const ProfilePage = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' atau 'orders'
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal edit profile
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // Modal detail pesanan
    const [selectedOrder, setSelectedOrder] = useState(null); // Pesanan yang dipilih
    
    // Edit form state
    const [editForm, setEditForm] = useState({
        nama: '',
        no_telepon: ''
    });
    const [isEditLoading, setIsEditLoading] = useState(false);
    const [editError, setEditError] = useState('');

    // Load user data ke form saat modal dibuka
    useEffect(() => {
        if (isEditModalOpen && user) {
            setEditForm({
                nama: user.nama || '',
                no_telepon: user.no_telepon || ''
            });
            setEditError('');
        }
    }, [isEditModalOpen, user]);

    // Fetch history pemesanan saat component mount
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            console.log('🔑 Token:', token ? 'Found' : 'Not Found');
            const response = await axios.get('/api/user/pemesanan', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('📦 API Response:', response.data);
            console.log('🐛 Debug Info:', response.data.debug);
            console.log('📋 Raw Orders Data:', response.data.data);
            
            if (response.data.status === 'success') {
                setOrders(response.data.data);
                console.log('✅ Orders loaded:', response.data.data.length, 'items');
            }
        } catch (error) {
            console.error('❌ Error fetching orders:', error);
            console.error('Response:', error.response?.data);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle edit form change
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle edit form submit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsEditLoading(true);
        setEditError('');

        try {
            const token = localStorage.getItem('auth_token');
            // Hanya kirim field yang bisa diubah (tanpa email)
            const dataToSend = {
                nama: editForm.nama,
                no_telepon: editForm.no_telepon
            };
            
            const response = await axios.put('/api/user/profile', dataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.message) {
                alert('Profil berhasil diperbarui!');
                setIsEditModalOpen(false);
                // Refresh halaman untuk update data
                window.location.reload();
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            const errorMsg = error.response?.data?.errors 
                ? Object.values(error.response.data.errors).flat().join(', ')
                : error.response?.data?.message || 'Gagal memperbarui profil. Silakan coba lagi.';
            setEditError(errorMsg);
        } finally {
            setIsEditLoading(false);
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
                        {user?.nama?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                        <label className="text-sm text-gray-500 font-medium">Nama Lengkap</label>
                        <p className="text-lg font-bold text-gray-800">{user?.nama || 'User'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <Mail className="text-[#00a3e0]" size={24} />
                    <div className="flex-1">
                        <label className="text-sm text-gray-500 font-medium">Email</label>
                        <p className="text-gray-800 font-medium">{user?.email || 'user@example.com'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <Phone className="text-[#00a3e0]" size={24} />
                    <div className="flex-1">
                        <label className="text-sm text-gray-500 font-medium">Nomor Telepon</label>
                        <p className="text-gray-800 font-medium">{user?.no_telepon || 'Belum diatur'}</p>
                    </div>
                </div>
            </div>

            {/* Button Edit Profile - Untuk Avita */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <button 
                    onClick={() => setIsEditModalOpen(true)}
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
                                    <button 
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setIsDetailModalOpen(true);
                                        }}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#00a3e0] text-white font-bold text-sm rounded-lg hover:bg-[#0082b3] transition"
                                    >
                                        <Eye size={16} />
                                        Lihat Detail
                                    </button>
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

            {/* Modal Edit Profile */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setIsEditModalOpen(false)}>
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Edit Profil</h3>
                        
                        <form onSubmit={handleEditSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                                <input 
                                    type="text"
                                    name="nama"
                                    value={editForm.nama}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00a3e0] focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                <input 
                                    type="email"
                                    value={user?.email}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nomor Telepon</label>
                                <input 
                                    type="tel"
                                    name="no_telepon"
                                    value={editForm.no_telepon}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00a3e0] focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            {editError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                    {editError}
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition"
                                    disabled={isEditLoading}
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-[#003366] text-white font-bold rounded-xl hover:bg-[#002244] transition disabled:bg-gray-400"
                                    disabled={isEditLoading}
                                >
                                    {isEditLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Detail Pesanan */}
            {isDetailModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setIsDetailModalOpen(false)}>
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#003366] to-[#00a3e0] p-6 text-white">
                            <h3 className="text-2xl font-bold">Detail Pesanan #{selectedOrder.id_pemesanan}</h3>
                            <p className="text-sm opacity-90 mt-1">{selectedOrder.layanan?.nama_layanan}</p>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status Badge */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500">Status</span>
                                <StatusBadge status={selectedOrder.status_pemesanan} />
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <p className="text-xs text-gray-500 mb-1">Tanggal Layanan</p>
                                    <p className="font-bold text-gray-800">{formatDate(selectedOrder.tgl_mulai)}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <p className="text-xs text-gray-500 mb-1">Total Biaya</p>
                                    <p className="font-bold text-[#003366] text-lg">{formatRupiah(selectedOrder.total_biaya)}</p>
                                </div>
                            </div>

                            {/* Lokasi */}
                            <div className="space-y-3">
                                <div className="flex gap-3 items-start">
                                    <MapPin className="text-[#00a3e0] shrink-0 mt-1" size={20} />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500">Lokasi Jemput</p>
                                        <p className="font-medium text-gray-800">{selectedOrder.lokasi_jemput}</p>
                                    </div>
                                </div>
                                {selectedOrder.lokasi_tujuan && selectedOrder.lokasi_tujuan !== '-' && (
                                    <div className="flex gap-3 items-start">
                                        <MapPin className="text-[#00a3e0] shrink-0 mt-1" size={20} />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">Lokasi Tujuan</p>
                                            <p className="font-medium text-gray-800">{selectedOrder.lokasi_tujuan}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Armada */}
                            {selectedOrder.armada && (
                                <div className="border border-gray-200 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 mb-3">Armada</p>
                                    <div className="flex gap-4 items-center">
                                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                            <Package size={32} className="text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{selectedOrder.armada.nama_armada}</p>
                                            <p className="text-sm text-gray-600">{selectedOrder.armada.no_plat}</p>
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                                                {selectedOrder.armada.jenis_kendaraan}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Deskripsi */}
                            {selectedOrder.deskripsi_barang && (
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <p className="text-xs text-gray-500 mb-2">Deskripsi</p>
                                    <p className="text-sm text-gray-700">{selectedOrder.deskripsi_barang}</p>
                                </div>
                            )}

                            {/* Timeline */}
                            <div className="border-t border-gray-200 pt-4">
                                <p className="text-xs text-gray-500 mb-3">Timeline</p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tanggal Pesan</span>
                                        <span className="font-medium">{formatDate(selectedOrder.tgl_pesan)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tanggal Mulai</span>
                                        <span className="font-medium">{formatDate(selectedOrder.tgl_mulai)}</span>
                                    </div>
                                    {selectedOrder.tgl_selesai && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tanggal Selesai</span>
                                            <span className="font-medium">{formatDate(selectedOrder.tgl_selesai)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button 
                                    onClick={() => setIsDetailModalOpen(false)}
                                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition"
                                >
                                    Tutup
                                </button>
                                {(selectedOrder.status_pemesanan === 'Dikonfirmasi' || selectedOrder.status_pemesanan === 'Menunggu Verifikasi') && (
                                    <button 
                                        onClick={() => {
                                            setIsDetailModalOpen(false);
                                            // Redirect dengan state data pesanan lengkap
                                            navigate('/pemesanan', { 
                                                state: { 
                                                    orderData: selectedOrder,
                                                    showPayment: true 
                                                } 
                                            });
                                        }}
                                        className="flex-1 px-6 py-3 bg-[#00a3e0] text-white font-bold rounded-xl hover:bg-[#0082b3] transition"
                                    >
                                        Lanjut Pembayaran
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default ProfilePage;

