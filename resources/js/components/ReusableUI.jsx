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
                <label htmlFor={name} className="block text-sm font-medium text-primary-dark">
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
                className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                <label htmlFor={name} className="block text-sm font-medium text-primary-dark">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                <label htmlFor={name} className="block text-sm font-medium text-primary-dark">
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
                className={`input-field resize-none ${error ? 'border-red-500 focus:ring-red-500' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
export const StatCard = ({ label, value, subtext, icon: Icon, iconBgColor = 'bg-primary' }) => {
    return (
        <div className="card p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">{label}</p>
                    <h3 className="text-3xl font-bold text-primary-dark mt-2">{value}</h3>
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
export const PrimaryButton = ({ onClick, icon: Icon, children, type = 'button', disabled = false }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {Icon && <Icon className="w-5 h-5" />}
            {children}
        </button>
    );
};

/**
 * SecondaryButton - Tombol sekunder
 */
export const SecondaryButton = ({ onClick, icon: Icon, children, type = 'button', disabled = false }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="input-field pl-10"
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
            <div className="flex min-height-full items-center justify-center p-4">
                <div className={`relative bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} transform transition-all`}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h3 className="text-xl font-bold text-primary-dark">{title}</h3>
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
        <div className="flex flex-col items-center justify-center min-height-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
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
                <thead className="bg-gradient-primary">
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-left text-xs font-bold text-primary-dark uppercase tracking-wider"
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
