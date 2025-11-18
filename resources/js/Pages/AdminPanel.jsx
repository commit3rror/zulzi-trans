import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios'; // Pastikan Anda sudah npm install axios
import { 
    LayoutDashboard, 
    Truck, 
    Users, 
    ClipboardList, 
    CalendarCheck, 
    UserCheck, 
    Star, 
    Settings,
    Briefcase,
    DollarSign,
    Clock,
    Plus,
    Search,
    Edit2,
    Trash2,
    X
} from 'lucide-react';

//=============================================================================
// 1. KOMPONEN SIDEBAR (Dapat Digunakan Bersama)
//=============================================================================
const Sidebar = ({ activePage }) => {
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
        { name: 'Armada', icon: Truck, href: '/admin/armada' },
        { name: 'Pengguna', icon: Users, href: '#' },
        { name: 'Verifikasi Pembayaran', icon: ClipboardList, href: '#' },
        { name: 'Pesanan & Jadwal', icon: CalendarCheck, href: '#' },
        { name: 'Kelola Supir', icon: UserCheck, href: '#' },
        { name: 'Kelola Ulasan', icon: Star, href: '#' },
    ];

    return (
        <aside className="w-64 bg-gray-900 text-white min-h-screen p-6 flex flex-col justify-between fixed h-full">
            <div>
                <div className="flex items-center gap-3 mb-10">
                    <div className="bg-blue-500 p-2 rounded-full">
                        <span className="font-bold text-xl">Z</span>
                    </div>
                    <span className="text-xl font-semibold">Zulzi Trans</span>
                </div>
                
                <nav>
                    <ul>
                        {navItems.map((item) => {
                            const isActive = activePage === item.name.toLowerCase();
                            return (
                                <li key={item.name}>
                                    <a 
                                        href={item.href} 
                                        className={`
                                            flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all
                                            ${isActive
                                                ? 'bg-blue-600 text-white' 
                                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                                        `}
                                    >
                                        <item.icon size={20} />
                                        <span>{item.name}</span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>

            <div>
                <a 
                    href="#" 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                    <Settings size={20} />
                    <span>Pengaturan</span>
                </a>
            </div>
        </aside>
    );
};

//=============================================================================
// 2. KOMPONEN HALAMAN DASHBOARD (Dari Latihan Sebelumnya)
//=============================================================================
const StatCard = ({ title, value, description, icon: Icon, iconBgColor }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
            <span className="text-gray-500">{title}</span>
            <div className={`p-3 rounded-lg ${iconBgColor}`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>
        <div>
            <h2 className="text-4xl font-bold mb-1">{value}</h2>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
    </div>
);

const DashboardPage = () => {
    // Di sini Anda bisa fetch stats seperti di latihan sebelumnya
    const [stats, setStats] = useState({
        totalFleet: 12,
        fleetAvailable: 8,
        ordersThisMonth: 48,
        ordersInProgress: 12,
        pendingPayments: 8,
        pendingVerification: 8,
    });
    const [recentOrders, setRecentOrders] = useState([
        { id: 'ORD-001', customer: 'Citra Dewi', route: 'Bandung', date: '15 Okt 2025' },
        { id: 'ORD-002', customer: 'Doni Pratama', route: 'Yogyakarta', date: '20 Okt 2025' },
    ]);

    return (
        <>
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Hey Admin,</h1>
                <p className="text-gray-500">Rabu, 8 Oktober, 2025</p> 
            </header>

            {/* Konten Dashboard */}
            <div>
                <h2 className="text-2xl font-semibold mb-1">Dashboard</h2>
                <p className="text-gray-500 mb-6">Selamat datang di panel admin</p>

                {/* Grid Kartu Statistik */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <StatCard 
                        title="Total Armada"
                        value={stats.totalFleet}
                        description={`${stats.fleetAvailable} tersedia`}
                        icon={Briefcase}
                        iconBgColor="bg-blue-500"
                    />
                    <StatCard 
                        title="Pesanan Bulan Ini"
                        value={stats.ordersThisMonth}
                        description={`${stats.ordersInProgress} dalam proses`}
                        icon={Clock}
                        iconBgColor="bg-purple-500"
                    />
                    <StatCard 
                        title="Pembayaran Pending"
                        value={stats.pendingPayments}
                        description={`${stats.pendingVerification} menunggu verifikasi`}
                        icon={DollarSign}
                        iconBgColor="bg-yellow-500"
                    />
                </div>
            </div>
        </>
    );
};

//=============================================================================
// 3. KOMPONEN HALAMAN ARMADA (BARU)
//=============================================================================

// --- Komponen Modal untuk Tambah/Edit Armada ---
const ArmadaModal = ({ isOpen, onClose, onSave, armadaData, setArmadaData, errors }) => {
    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setArmadaData(prev => ({ ...prev, [name]: value }));
    };

    const modalTitle = armadaData.id_armada ? "Edit Armada" : "Tambah Armada";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                {/* Header Modal */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-xl font-semibold">{modalTitle}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={onSave}>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Kolom Kiri */}
                        <div>
                            {/* Nama Armada */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Armada</label>
                                <input 
                                    type="text"
                                    name="nama_armada"
                                    value={armadaData.nama_armada || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.nama_armada && <p className="text-red-500 text-xs mt-1">{errors.nama_armada[0]}</p>}
                            </div>

                            {/* Nomor Polisi */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Polisi</label>
                                <input 
                                    type="text"
                                    name="no_plat"
                                    value={armadaData.no_plat || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.no_plat && <p className="text-red-500 text-xs mt-1">{errors.no_plat[0]}</p>}
                            </div>

                            {/* Layanan */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Layanan</label>
                                <input 
                                    type="text"
                                    name="layanan"
                                    value={armadaData.layanan || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.layanan && <p className="text-red-500 text-xs mt-1">{errors.layanan[0]}</p>}
                            </div>
                        </div>

                        {/* Kolom Kanan */}
                        <div>
                            {/* Jenis Kendaraan */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kendaraan</label>
                                <input 
                                    type="text"
                                    name="jenis_kendaraan"
                                    value={armadaData.jenis_kendaraan || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.jenis_kendaraan && <p className="text-red-500 text-xs mt-1">{errors.jenis_kendaraan[0]}</p>}
                            </div>

                            {/* Kapasitas */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas</label>
                                <input 
                                    type="text"
                                    name="kapasitas"
                                    value={armadaData.kapasitas || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.kapasitas && <p className="text-red-500 text-xs mt-1">{errors.kapasitas[0]}</p>}
                            </div>

                            {/* Harga Sewa */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Harga Sewa / Hari</label>
                                <input 
                                    type="number"
                                    name="harga_sewa_per_hari"
                                    value={armadaData.harga_sewa_per_hari || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.harga_sewa_per_hari && <p className="text-red-500 text-xs mt-1">{errors.harga_sewa_per_hari[0]}</p>}
                            </div>

                            {/* Status */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    name="status_ketersediaan"
                                    value={armadaData.status_ketersediaan || 'Tersedia'}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Tersedia">Tersedia</option>
                                    <option value="Digunakan">Digunakan</option>
                                </select>
                                {errors.status_ketersediaan && <p className="text-red-500 text-xs mt-1">{errors.status_ketersediaan[0]}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Footer Modal */}
                    <div className="flex justify-end p-6 border-t bg-gray-50 rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md mr-3 hover:bg-gray-300">
                            Batal
                        </button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Komponen Halaman Utama Armada ---
const ArmadaPage = () => {
    const [armadaList, setArmadaList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
    const [currentArmada, setCurrentArmada] = useState({});
    const [formErrors, setFormErrors] = useState({});
    
    // State untuk konfirmasi hapus
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [armadaToDelete, setArmadaToDelete] = useState(null);

    // Ambil token CSRF dari meta tag (jika ada)
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    }

    // Fungsi untuk mengambil data armada
    const fetchArmada = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/admin/armada');
            setArmadaList(response.data);
            setError(null);
        } catch (err) {
            setError("Gagal mengambil data armada.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Ambil data saat komponen dimuat
    useEffect(() => {
        fetchArmada();
    }, []);

    // Memoized filtered list
    const filteredArmada = useMemo(() => {
        return armadaList.filter(armada => 
            (armada.nama_armada && armada.nama_armada.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (armada.no_plat && armada.no_plat.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (armada.jenis_kendaraan && armada.jenis_kendaraan.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [armadaList, searchQuery]);

    // Handler untuk membuka modal
    const handleOpenModal = (type, armada = null) => {
        setModalType(type);
        setCurrentArmada(type === 'add' ? { status_ketersediaan: 'Tersedia' } : { ...armada });
        setIsModalOpen(true);
        setFormErrors({});
    };

    // Handler untuk menutup modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentArmada({});
    };

    // Handler untuk submit form (tambah/edit)
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});
        
        const url = modalType === 'add' 
            ? '/api/admin/armada' 
            : `/api/admin/armada/${currentArmada.id_armada}`;
        
        const method = modalType === 'add' ? 'post' : 'put';

        try {
            await axios[method](url, currentArmada);
            fetchArmada(); // Ambil data terbaru
            handleCloseModal();
        } catch (err) {
            if (err.response && err.response.status === 422) {
                // Handle validation errors
                setFormErrors(err.response.data.errors);
            } else {
                setError("Gagal menyimpan data.");
                console.error(err);
            }
        }
    };
    
    // Handler untuk membuka konfirmasi hapus
    const handleDeleteClick = (armada) => {
        setArmadaToDelete(armada);
        setShowDeleteConfirm(true);
    };

    // Handler untuk konfirmasi hapus
    const confirmDelete = async () => {
        if (!armadaToDelete) return;
        
        try {
            await axios.delete(`/api/admin/armada/${armadaToDelete.id_armada}`);
            fetchArmada(); // Ambil data terbaru
            setShowDeleteConfirm(false);
            setArmadaToDelete(null);
        } catch (err) {
            setError("Gagal menghapus data.");
            console.error(err);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <>
            {/* Header */}
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Pengelolaan Armada</h1>
                    <p className="text-gray-500">Kelola data armada kendaraan Anda</p>
                </div>
                <button 
                    onClick={() => handleOpenModal('add')}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
                >
                    <Plus size={20} />
                    <span>Tambah Armada</span>
                </button>
            </header>

            {/* Konten Utama */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                {/* Search Bar */}
                <div className="relative mb-6">
                    <input 
                        type="text"
                        placeholder="Cari armada (nama, no. plat, jenis)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>

                {/* Tampilan Error */}
                {error && <div className="text-red-500 mb-4">{error}</div>}

                {/* Tabel Armada */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Armada</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Polisi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Layanan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kapasitas</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-6">Loading...</td>
                                </tr>
                            ) : filteredArmada.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-6 text-gray-500">Data armada tidak ditemukan.</td>
                                </tr>
                            ) : (
                                filteredArmada.map((armada) => (
                                    <tr key={armada.id_armada}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{armada.nama_armada}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{armada.no_plat}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{armada.layanan}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{armada.jenis_kendaraan}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{armada.kapasitas}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                                ${armada.status_ketersediaan === 'Tersedia' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'}
                                            `}>
                                                {armada.status_ketersediaan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onClick={() => handleOpenModal('edit', armada)} className="text-blue-600 hover:text-blue-900 mr-3">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDeleteClick(armada)} className="text-red-600 hover:text-red-900">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah/Edit */}
            <ArmadaModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleFormSubmit}
                armadaData={currentArmada}
                setArmadaData={setCurrentArmada}
                errors={formErrors}
            />

            {/* Modal Konfirmasi Hapus */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
                        <h3 className="text-lg font-medium text-gray-900">Hapus Armada?</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Anda yakin ingin menghapus armada **{armadaToDelete?.nama_armada}** ({armadaToDelete?.no_plat})? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button 
                                type="button" 
                                onClick={() => setShowDeleteConfirm(false)} 
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                                Batal
                            </button>
                            <button 
                                type="button" 
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};


//=============================================================================
// 4. KOMPONEN APP UTAMA (ROUTER)
//=============================================================================
const App = () => {
    const [activePage, setActivePage] = useState('dashboard');

    useEffect(() => {
        // Deteksi halaman berdasarkan URL
        const path = window.location.pathname.split('/')[2]; // Ambil bagian setelah '/admin/'
        setActivePage(path || 'dashboard');
    }, []);

    const renderPage = () => {
        switch(activePage) {
            case 'armada':
                return <ArmadaPage />;
            case 'dashboard':
            default:
                return <DashboardPage />;
            // Tambahkan case lain di sini untuk halaman baru
            // case 'pengguna':
            //     return <PenggunaPage />;
        }
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar activePage={activePage} />
            <main className="ml-64 p-8 flex-1">
                {renderPage()}
            </main>
        </div>
    );
};

export default App;