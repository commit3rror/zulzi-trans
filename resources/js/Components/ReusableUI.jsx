import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

// Form Input Component
export const FormInput = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    required = false,
    disabled = false,
    className = ''
}) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? 'border-red-500' : 'border-gray-300'
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} ${className}`}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

// Form Select Component
export const FormSelect = ({
    label,
    name,
    value,
    onChange,
    options = [],
    error,
    required = false,
    disabled = false,
    placeholder = 'Pilih opsi...'
}) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? 'border-red-500' : 'border-gray-300'
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

// Alert Component
export const Alert = ({ type = 'info', message, onClose, title = '' }) => {
    const bgColor =
        type === 'success'
            ? 'bg-green-50 border-green-200'
            : type === 'error'
            ? 'bg-red-50 border-red-200'
            : type === 'warning'
            ? 'bg-yellow-50 border-yellow-200'
            : 'bg-blue-50 border-blue-200';

    const textColor =
        type === 'success'
            ? 'text-green-800'
            : type === 'error'
            ? 'text-red-800'
            : type === 'warning'
            ? 'text-yellow-800'
            : 'text-blue-800';

    const iconColor =
        type === 'success'
            ? 'text-green-500'
            : type === 'error'
            ? 'text-red-500'
            : type === 'warning'
            ? 'text-yellow-500'
            : 'text-blue-500';

    const Icon = type === 'error' ? AlertCircle : CheckCircle;

    return (
        <div className={`border rounded-lg p-4 mb-4 ${bgColor}`}>
            <div className="flex items-start gap-3">
                <Icon className={`${iconColor} flex-shrink-0 mt-0.5`} size={20} />
                <div className="flex-1">
                    {title && <p className={`font-semibold ${textColor}`}>{title}</p>}
                    <p className={`${textColor} text-sm`}>{message}</p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className={`${textColor} hover:opacity-75 transition-opacity`}
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
        </div>
    );
};

// Loading Button Component
export const LoadingButton = ({ type = 'button', loading, disabled, children, className = '', onClick }) => {
    return (
        <button
            type={type}
            disabled={loading || disabled}
            onClick={onClick}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium ${className}`}
        >
            {loading ? (
                <span className="flex items-center gap-2">
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Loading...
                </span>
            ) : (
                children
            )}
        </button>
    );
};

// Primary Button Component
export const PrimaryButton = ({ onClick, children, className = '', disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium ${className}`}
        >
            {children}
        </button>
    );
};

// Action Button Component (for edit/delete)
export const ActionButton = ({ onClick, children, variant = 'primary', className = '' }) => {
    const variants = {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white',
        danger: 'bg-red-500 hover:bg-red-600 text-white',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
        secondary: 'bg-gray-400 hover:bg-gray-500 text-white'
    };

    return (
        <button
            onClick={onClick}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

// Search Input Component
export const SearchInput = ({ value, onChange, placeholder = 'Cari...', className = '' }) => {
    return (
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        />
    );
};

// Status Badge Component
export const StatusBadge = ({ status, className = '' }) => {
    const statusColors = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-blue-100 text-blue-800',
        'in-progress': 'bg-purple-100 text-purple-800',
        available: 'bg-green-100 text-green-800',
        unavailable: 'bg-red-100 text-red-800'
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-800'} ${className}`}>
            {status}
        </span>
    );
};

// Modal Component
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full mx-4`}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Stat Card Component
export const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        red: 'bg-red-50 text-red-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        purple: 'bg-purple-50 text-purple-600'
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
                    {trend && (
                        <p className="text-sm text-green-600 mt-1">{trend}</p>
                    )}
                </div>
                {Icon && (
                    <div className={`${colorClasses[color]} p-3 rounded-lg`}>
                        <Icon size={24} />
                    </div>
                )}
            </div>
        </div>
    );
};

// Confirmation Dialog
export const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, isDangerous = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-white rounded-lg transition-colors ${
                            isDangerous
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        Konfirmasi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default {
    FormInput,
    FormSelect,
    Alert,
    LoadingButton,
    PrimaryButton,
    ActionButton,
    SearchInput,
    StatusBadge,
    Modal,
    StatCard,
    ConfirmDialog
};
