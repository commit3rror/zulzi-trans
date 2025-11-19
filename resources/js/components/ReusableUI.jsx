import React from 'react';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';

// ==================== FORM COMPONENTS ====================

/**
 * FormInput - Input teks standar dengan label dan pesan error
 */
export const FormInput = ({ 
    label, 
    name, 
    value, 
    onChange, 
    error, 
    type = 'text',
    placeholder = '',
    disabled = false,
    required = false
}) => {
    return (
        <div className="space-y-2">
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {error && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
        </div>
    );
};

/**
 * FormSelect - Dropdown menu standar dengan label dan pesan error
 */
export const FormSelect = ({ 
    label, 
    name, 
    value, 
    onChange, 
    error, 
    children,
    disabled = false,
    required = false
}) => {
    return (
        <div className="space-y-2">
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
                {children}
            </select>
            {error && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
        </div>
    );
};

/**
 * FormTextarea - Textarea dengan label dan pesan error
 */
export const FormTextarea = ({ 
    label, 
    name, 
    value, 
    onChange, 
    error, 
    placeholder = '',
    rows = 4,
    disabled = false,
    required = false
}) => {
    return (
        <div className="space-y-2">
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                disabled={disabled}
                className={`w-full px-4 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {error && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
        </div>
    );
};

// ==================== DISPLAY & ACTION COMPONENTS ====================

/**
 * StatCard - Kartu statistik untuk dashboard
 */
export const StatCard = ({ label, value, subtext, icon: Icon, iconBgColor = 'bg-indigo-600' }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">{label}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
                    {subtext && (
                        <p className="text-xs text-gray-500 mt-1">{subtext}</p>
                    )}
                </div>
                {Icon && (
                    <div className={`${iconBgColor} p-4 rounded-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * PrimaryButton - Tombol utama untuk aksi penting
 */
export const PrimaryButton = ({ onClick, icon: Icon, children, type = 'button', disabled = false, className = '' }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {Icon && <Icon className="w-5 h-5" />}
            {children}
        </button>
    );
};

/**
 * SecondaryButton - Tombol sekunder
 */
export const SecondaryButton = ({ onClick, icon: Icon, children, type = 'button', disabled = false, className = '' }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {Icon && <Icon className="w-5 h-5" />}
            {children}
        </button>
    );
};

/**
 * ActionButton - Tombol kecil untuk aksi di dalam tabel
 */
export const ActionButton = ({ type, onClick, title }) => {
    const config = {
        edit: {
            icon: Edit2,
            className: 'text-blue-600 hover:text-blue-800 hover:bg-blue-50',
            title: title || 'Edit'
        },
        delete: {
            icon: Trash2,
            className: 'text-red-600 hover:text-red-800 hover:bg-red-50',
            title: title || 'Hapus'
        }
    };

    const { icon: Icon, className, title: btnTitle } = config[type];

    return (
        <button
            onClick={onClick}
            title={btnTitle}
            className={`p-2 rounded-lg transition-all duration-200 ${className}`}
        >
            <Icon className="w-5 h-5" />
        </button> 
    );
};

// ----------------------------------------------------------------------
// BAGIAN INI ADALAH KODE YANG ANDA PASTE (VERSI KEDUA/DUPLIKAT)
// SAYA UBAH NAMA IMPORT DAN VARIABELNYA MENJADI [NAMA]_V2 AGAR TIDAK ERROR
// ----------------------------------------------------------------------

import { Search as Search_V2, Edit2 as Edit2_V2, Trash2 as Trash2_V2, X as X_V2 } from 'lucide-react';

/**
 * StatCard (Dashboard) - VERSI 2
 * Kartu untuk menampilkan statistik di halaman dashboard.
 */
export const StatCard_V2 = ({ label, value, subtext, icon: Icon, iconBgColor }) => (
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
 * PrimaryButton - VERSI 2
 * Tombol aksi utama (misal: "Tambah Armada").
 */
export const PrimaryButton_V2 = ({ children, onClick, icon: Icon, className = "" }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm ${className}`}
    >
        {Icon && <Icon size={16} />}
        {children}
    </button>
);

/**
 * ActionButton (Tabel) - VERSI 2
 * Tombol aksi kecil di dalam tabel (Edit, Hapus).
 */
export const ActionButton_V2 = ({ type, onClick }) => {
    const className = type === 'edit'
        ? 'text-slate-400 hover:text-blue-600'
        : 'text-slate-400 hover:text-red-600';
    const Icon = type === 'edit' ? Edit2_V2 : Trash2_V2;

    return (
        <button onClick={onClick} className={`transition-colors p-1.5 ${className}`}>
            <Icon size={17} />
        </button>
    );
};

/**
 * SearchInput - Input pencarian dengan ikon
 */
export const SearchInput = ({ value, onChange, placeholder = 'Cari data...' }) => {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
        </div>
    );
};

/**
 * StatusBadge - Label status berbentuk pil
 */
export const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
        const normalizedStatus = status?.toLowerCase() || '';
        
        if (normalizedStatus.includes('tersedia') || normalizedStatus.includes('aktif') || normalizedStatus.includes('selesai')) {
            return 'bg-green-100 text-green-800';
        }
        if (normalizedStatus.includes('proses') || normalizedStatus.includes('pending')) {
            return 'bg-yellow-100 text-yellow-800';
        }
        if (normalizedStatus.includes('tidak') || normalizedStatus.includes('nonaktif') || normalizedStatus.includes('batal')) {
            return 'bg-red-100 text-red-800';
        }
        return 'bg-blue-100 text-blue-800';
    };

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
            {status}
        </span>
    );
};

/**
 * SearchInput - VERSI 2
 * Kotak pencarian yang reusable.
 */
export const SearchInput_V2 = ({ value, onChange, placeholder }) => (
    <div className="relative w-full max-w-sm">
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        />
        <Search_V2 size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
    </div>
);

/**
 * StatusBadge (Tabel) - VERSI 2
 * Label status (Tersedia, Digunakan) di tabel.
 */
export const StatusBadge_V2 = ({ status }) => {
    const styles = status === 'Tersedia'
        ? 'bg-green-100 text-green-700'
        : 'bg-blue-100 text-blue-700';

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles}`}>
            {status}
        </span>
    );
};

// ==================== MODAL COMPONENT ====================

/**
 * Modal - Jendela pop-up untuk form atau konfirmasi
 */
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl'
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className={`relative bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} transform transition-all`}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    
                    {/* Content */}
                    {children}
                </div>
            </div>
        </div>
    );
};

/**
 * Modal - VERSI 2
 * Komponen pop-up untuk form Tambah/Edit.
 */
export const Modal_V2 = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header Modal */}
                <div className="flex justify-between items-center p-5 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X_V2 size={20} />
                    </button>
                </div>
                {/* Konten (Form) */}
                {children}
            </div>
        </div>
    );
};

// ==================== ALERT COMPONENT ====================

/**
 * Alert - Notifikasi atau pesan informasi
 */
export const Alert = ({ type = 'info', message, onClose }) => {
    const types = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-500',
            text: 'text-green-800'
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-500',
            text: 'text-red-800'
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-500',
            text: 'text-yellow-800'
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-500',
            text: 'text-blue-800'
        }
    };

    const { bg, border, text } = types[type];

    return (
        <div className={`${bg} ${border} ${text} border-l-4 p-4 rounded-lg mb-4 flex items-center justify-between`}>
            <p className="font-medium">{message}</p>
            {onClose && (
                <button 
                    onClick={onClose} 
                    className="ml-4 text-xl font-bold hover:opacity-70 transition-opacity"
                >
                    ×
                </button>
            )}
        </div>
    );
};

// ==================== LOADING COMPONENT ====================

/**
 * Loading - Indikator loading
 */
export const Loading = ({ message = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            <p className="mt-4 text-gray-500 font-medium">{message}</p>
        </div>
    );
};

/**
 * LoadingButton - Tombol dengan loading state
 */
export const LoadingButton = ({ loading, children, ...props }) => {
    return (
        <PrimaryButton {...props} disabled={loading || props.disabled}>
            {loading ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Loading...
                </>
            ) : (
                children
            )}
        </PrimaryButton>
    );
};

// ==================== TABLE COMPONENT ====================

/**
 * Table - Tabel data standar
 */
export const Table = ({ headers, children }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {children}
                </tbody>
            </table>
        </div>
    );
};

/**
 * EmptyState - Tampilan ketika data kosong
 */
export const EmptyState = ({ message = 'Tidak ada data', icon: Icon }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            {Icon && <Icon className="w-16 h-16 text-gray-300 mb-4" />}
            <p className="text-gray-500 text-lg">{message}</p>
        </div>
    );
};

/**
 * FormInput - VERSI 2
 * Komponen input standar untuk form di dalam modal.
 */
export const FormInput_V2 = ({ label, name, value, onChange, error, type = 'text', ...props }) => (
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
 * FormSelect - VERSI 2
 * Komponen select standar untuk form di dalam modal.
 */
export const FormSelect_V2 = ({ label, name, value, onChange, error, children }) => (
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