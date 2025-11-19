import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FormInput, Alert, LoadingButton } from '@/components/ReusableUI';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

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
            const response = await login(formData);
            
            setAlert({ type: 'success', message: 'Login berhasil!' });
            
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } catch (err) {
            console.error('Login error:', err);
            
            if (err.errors) {
                setErrors(err.errors);
            }
            
            setAlert({ 
                type: 'error', 
                message: err.message || 'Email atau password salah!' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                    {/* Logo / Brand */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-indigo-600 mb-2">
                            Zulzi Trans
                        </h1>
                        <p className="text-gray-500">Selamat datang kembali!</p>
                    </div>

                    {alert && (
                        <Alert 
                            type={alert.type} 
                            message={alert.message} 
                            onClose={() => setAlert(null)} 
                        />
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
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

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-600">Ingat saya</span>
                            </label>
                            
                            <Link 
                                to="/forgot-password" 
                                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                            >
                                Lupa password?
                            </Link>
                        </div>

                        <LoadingButton type="submit" loading={loading} className="w-full">
                            🚀 Login
                        </LoadingButton>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Belum punya akun?{' '}
                            <Link 
                                to="/register" 
                                className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                            >
                                Daftar sekarang
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;