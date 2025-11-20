import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth'; // Perbaikan path
import { FormInput, Alert, LoadingButton } from '@/components/ReusableUI'; // Perbaikan path
import { CheckCircle, Zap } from 'lucide-react'; // Tambahkan Zap untuk Google

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

            // Cek apakah user adalah admin
            if (response.data.user.role_pengguna === 'admin') {
                navigate('/admin');
            } else {
                navigate('/beranda');
            }

            setAlert({ type: 'success', message: 'Login berhasil!' });
        } catch (err) {
            console.error('Login error:', err);
            if (err.errors) {
                setErrors(err.errors);
                setAlert({ type: 'error', message: 'Terdapat kesalahan pada input.' });
            } else {
                setAlert({ type: 'error', message: err.message || 'Email atau password salah.' });
            }
        } finally {
            setLoading(false);
        }
    };

    // URL untuk redirect Google OAuth (menggunakan rute Laravel)
    const googleAuthUrl = `${window.location.origin}/auth/google/redirect`;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            {/* Split Screen: Kiri (Form) */}
            <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-xl shadow-2xl space-y-6">
                <div className="text-center">
                    <Zap className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                    <h1 className="text-3xl font-bold text-gray-900">Selamat Datang Kembali</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Masuk ke akun Anda atau {' '}
                        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                            buat akun baru
                        </Link>
                    </p>
                </div>

                {alert && (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert(null)}
                    />
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormInput
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="email@contoh.com"
                        required
                    />

                    <FormInput
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        placeholder="Minimal 8 karakter"
                        required
                    />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="rememberMe"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Ingat Saya
                            </label>
                        </div>
                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                Lupa Password?
                            </Link>
                        </div>
                    </div>

                    <LoadingButton
                        type="submit"
                        loading={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition duration-150"
                    >
                        Masuk
                    </LoadingButton>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                            Atau masuk dengan
                        </span>
                    </div>
                </div>

                <a
                    href={googleAuthUrl}
                    className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg font-semibold transition duration-150 shadow-sm"
                >
                    {/* Menggunakan Google Icon dari URL untuk menghindari error */}
                    <img className="w-5 h-5" src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google Logo" />
                    Google
                </a>

            </div>

            {/* Split Screen: Kanan (Ilustrasi/Informasi) - Hanya tampil di md ke atas */}
            <div className="hidden md:flex w-full max-w-xl h-full ml-10 bg-blue-600 rounded-xl shadow-2xl p-12 relative overflow-hidden">
                {/* Latar belakang gelombang abstrak */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] transform -translate-x-1/2 -translate-y-1/2"></div>

                <div className="text-center max-w-lg z-10">
                    <h2 className="text-5xl font-extrabold mb-6 leading-tight text-white">
                        Perjalanan Dimulai <br/> dari Sini
                    </h2>
                    <p className="text-lg text-blue-50 mb-10 font-light leading-relaxed">
                        Nikmati kemudahan booking transportasi dari layanan Zulzi Trans!
                    </p>

                    {/* Feature List */}
                    <div className="space-y-4 text-left inline-block">
                        <div className="flex items-center gap-4 text-white">
                            <CheckCircle className="w-6 h-6 text-white-400" />
                            <span className="text-lg font-medium">Booking Cepat dan Mudah</span>
                        </div>
                        <div className="flex items-center gap-4 text-white">
                            <CheckCircle className="w-6 h-6 text-white-400" />
                            <span className="text-lg font-medium">Armada Terbaik dan Terawat</span>
                        </div>
                        <div className="flex items-center gap-4 text-white">
                            <CheckCircle className="w-6 h-6 text-white-400" />
                            <span className="text-lg font-medium">Supir Berpengalaman</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
