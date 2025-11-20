import React from 'react';
import { Search, Edit2, Trash2, X } from 'lucide-react';

/**
 * StatCard (Dashboard)
 * Kartu untuk menampilkan statistik di halaman dashboard.
 */
export const StatCard = ({ label, value, subtext, icon: Icon, iconBgColor }) => (
    <div className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm flex flex-col justify-between h-full">
        <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 text-sm font-medium">{label}</span>
            <div className={`p-2.5 rounded-lg ${iconBgColor} shadow-sm`}>
                <Icon size={20} className="text-white" />
            </div>
        </div>
        <div>
            <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
            <p className="text-xs text-slate-400 mt-1">{subtext}</p>
        </div>
    </div>
);

/**
 * PrimaryButton
 * Tombol aksi utama (misal: "Tambah Armada").
 */
export const PrimaryButton = ({ children, onClick, icon: Icon, className = "" }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm ${className}`}
    >
        {Icon && <Icon size={16} />}
        {children}
    </button>
);

/**
 * ActionButton (Tabel)
 * Tombol aksi kecil di dalam tabel (Edit, Hapus).
 */
export const ActionButton = ({ type, onClick }) => {
    const className = type === 'edit'
        ? 'text-slate-400 hover:text-blue-600'
        : 'text-slate-400 hover:text-red-600';
    const Icon = type === 'edit' ? Edit2 : Trash2;

    return (
        <button onClick={onClick} className={`transition-colors p-1.5 ${className}`}>
            <Icon size={17} />
        </button>
    );
};

/**
 * SearchInput
 * Kotak pencarian yang reusable.
 */
export const SearchInput = ({ value, onChange, placeholder }) => (
    <div className="relative w-full max-w-sm">
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        />
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
    </div>
);

/**
 * StatusBadge (Tabel)
 * Label status (Tersedia, Digunakan) di tabel.
 */
export const StatusBadge = ({ status }) => {
    const styles = status === 'Tersedia'
        ? 'bg-green-100 text-green-700'
        : 'bg-blue-100 text-blue-700';

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles}`}>
            {status}
        </span>
    );
};

/**
 * Modal
 * Komponen pop-up untuk form Tambah/Edit.
 */
export const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header Modal */}
                <div className="flex justify-between items-center p-5 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>
                {/* Konten (Form) */}
                {children}
            </div>
        </div>
    );
};

/**
 * FormInput
 * Komponen input standar untuk form di dalam modal.
 */
export const FormInput = ({ label, name, value, onChange, error, type = 'text', ...props }) => (
    <div className="w-full">
        <label htmlFor={name} className="block text-xs font-medium text-slate-600 mb-1.5">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            className={`w-full px-3 py-2 border rounded-md text-sm shadow-sm
                ${error ? 'border-red-500' : 'border-slate-300'}
                focus:ring-2 focus:ring-sky-500 focus:outline-none`}
            {...props}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

/**
 * FormSelect
 * Komponen select standar untuk form di dalam modal.
 */
export const FormSelect = ({ label, name, value, onChange, error, children }) => (
    <div className="w-full">
        <label htmlFor={name} className="block text-xs font-medium text-slate-600 mb-1.5">{label}</label>
        <select
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            className={`w-full px-3 py-2 border rounded-md text-sm shadow-sm
                ${error ? 'border-red-500' : 'border-slate-300'}
                focus:ring-2 focus:ring-sky-500 focus:outline-none`}
        >
            {children}
        </select>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);