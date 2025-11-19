import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useAuth}from '../../hooks/useAuth';
import { FormInput, Alert, LoadingButton } from '@/components/ReusableUI';
import { CheckCircle } from 'lucide-react';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        no_telepon: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        setErrors({});

        try {
            const response = await register(formData);
            setAlert({
                type: 'success',
                message: response.message || 'Registrasi berhasil!',
            });

            setTimeout(() => navigate('/login'), 1500);

        } catch (error) {
            console.error('Register error:', error);

            if (error.errors) {
                setErrors(error.errors);
            }

            setAlert({
                type: 'error',
                message: error.message || 'Registrasi gagal! Periksa kembali data Anda.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 items-center">

                    {/* Promo Section */}
                    <div className="text-white bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 shadow-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Perjalanan Dimulai dari Sini
                        </h2>
                        <p className="text-indigo-100 text-lg mb-8">
                            Nikmati kemudahan booking transportasi dari layanan Zulzi Trans!
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-lg">Booking Cepat & Mudah</h3>
                                    <p className="text-indigo-100 text-sm">Proses pemesanan yang simpel dan efisien</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-lg">Driver Berpengalaman</h3>
                                    <p className="text-indigo-100 text-sm">Tim profesional yang siap melayani Anda</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-lg">Layanan 24/7</h3>
                                    <p className="text-indigo-100 text-sm">Tersedia kapan saja Anda membutuhkan</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Daftar Akun Baru
                            </h1>
                            <p className="text-gray-500">
                                Buat akun untuk memulai perjalanan Anda!
                            </p>
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
                                label="Nama Lengkap"
                                name="nama"
                                type="text"
                                value={formData.nama}
                                onChange={handleChange}
                                error={errors.nama}
                                placeholder="Masukkan nama lengkap"
                                required
                            />

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
                                label="Nomor HP"
                                name="no_telepon"
                                type="text"
                                value={formData.no_telepon}
                                onChange={handleChange}
                                error={errors.no_telepon}
                                placeholder="Contoh: 08123456789"
                                required
                            />

                            <FormInput
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                placeholder="Minimal 8 karakter"
                                required
                            />

                            <FormInput
                                label="Konfirmasi Password"
                                name="password_confirmation"
                                type="password"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                error={errors.password_confirmation}
                                placeholder="Ulangi password"
                                required
                            />

                            <LoadingButton 
                                type="submit" 
                                loading={loading}
                                className="w-full"
                            >
                                🚀 Buat Akun
                            </LoadingButton>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Sudah punya akun?{' '}
                                <Link 
                                    to="/login"
                                    className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                                >
                                    Login di sini
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;