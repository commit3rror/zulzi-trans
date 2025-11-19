import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Link, useNavigate } from 'react-router-dom'; // jika pakai react-router
import '../../../css/app.css';
import { Mail, Lock, CheckCircle } from 'lucide-react';
import { FormInput, Alert, LoadingButton } from '@/components/ReusableUI';
import { Pagination } from '@/components/Pagination';

const LoginPage = () => {
    const navigate = useNavigate?.();// jika pakai react-router
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        setErrors({});
        try {
            // implementasi login sesuai API / hook
            // contoh: const response = await login(formData);
            setAlert({ type: 'success', message: 'Login berhasil!' });
            setTimeout(() => {
                if (navigate) navigate('/'); // redirect setelah login
            }, 1000);
        } catch (err) {
            setAlert({ type: 'error', message: 'Login gagal!' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-6 bg-white shadow-2xl rounded-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-indigo-600 mb-4">Login ke Zulzi Trans</h1>

                {alert && (
                    <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <FormInput
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="Masukkan email"
                        required
                    />
                    <FormInput
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        placeholder="Masukkan password"
                        required
                    />

                    <div className="flex justify-between items-center">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" /> Remember me
                        </label>
                        <Link to="/forgot-password" className="text-indigo-600">Lupa password?</Link>
                    </div>

                    <LoadingButton type="submit" loading={loading}>
                        🚀 LOGIN
                    </LoadingButton>
                </form>

                <p className="mt-4 text-center">
                    Belum punya akun? <Link to="/register" className="text-indigo-600">Register sekarang</Link>
                </p>
            </div>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('login-app')).render(
    <React.StrictMode>
        <LoginPage />
    </React.StrictMode>
);
