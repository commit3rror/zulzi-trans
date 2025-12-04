import React from 'react';
import {
    LayoutDashboard,
    Truck,
    Users,
    ClipboardList,
    CalendarCheck,
    UserCheck,
    Star,
    Settings
} from 'lucide-react';

/**
 * Sidebar Navigasi
 * Komponen ini me-render menu navigasi di sebelah kiri.
 */
const Sidebar = ({ activePage, onNavigate }) => {
    // Definisikan item menu
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'armada', label: 'Armada', icon: Truck },
        { id: 'pengguna', label: 'Pengguna', icon: Users },
        { id: 'pembayaran', label: 'Verifikasi Pembayaran', icon: ClipboardList },
        { id: 'pesanan', label: 'Pesanan & Jadwal', icon: CalendarCheck },
        { id: 'supir', label: 'Kelola Supir', icon: UserCheck },
        { id: 'ulasan', label: 'Kelola Ulasan', icon: Star },
    ];

    return (
        <aside className="w-64 bg-[#1a2a3a] text-white min-h-screen flex flex-col fixed h-full shadow-2xl">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3 mb-8 border-b border-white/10">
                <div className="bg-linear-to-r from-[#0369a1] to-[#0284c7] p-2.5 rounded-xl h-12 w-12 flex items-center justify-center shadow-lg">
                    <span className="font-extrabold text-white text-xl">Z</span>
                </div>
                <div className="flex-1">
                    <span className="text-base font-bold tracking-tight text-white block">Zulzi Trans</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Navigation</div>
                <ul className="space-y-1.5">
                    {navItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => onNavigate(item.id)}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium
                                    ${activePage === item.id
                                        ? 'bg-[#0369a1] text-white shadow-md border-l-4 border-[#00d4ff]'
                                        : 'text-gray-300 hover:text-white hover:bg-white/8'}
                                `}
                            >
                                <item.icon size={19} className="shrink-0" />
                                <span className="flex-1 text-left">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Settings at bottom */}
            <div className="p-4 border-t border-white/10">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/8 text-sm transition-all duration-200 font-medium">
                    <Settings size={19} className="shrink-0" />
                    <span>Pengaturan</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
