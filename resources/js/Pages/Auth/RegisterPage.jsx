import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
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
        <div className="register-container">
            <div className="register-content">

                {/* Promo Section */}
                <div className="promo-section">
                    <h2>Perjalanan Dimulai dari Sini</h2>
                    <p>Nikmati kemudahan booking transportasi dari layanan Zulzi Trans!</p>
                    <ul className="promo-list">
                        <li><CheckCircle /> Booking cepat dan mudah</li>
                        <li><CheckCircle /> Driver berpengalaman</li>
                        <li><CheckCircle /> Layanan tersedia 24/7</li>
                    </ul>
                </div>

                {/* Form Section */}
                <div className="register-card">
                    <h1>Daftar Akun Baru</h1>
                    <p>Buat akun untuk memulai perjalanan Anda!</p>

                    {alert && (
                        <Alert
                            type={alert.type}
                            message={alert.message}
                            onClose={() => setAlert(null)}
                        />
                    )}

                    <form onSubmit={handleSubmit} className="register-form">
                        <FormInput
                            label="Nama"
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
                            label="No HP"
                            name="no_telepon"
                            type="text"
                            value={formData.no_telepon}
                            onChange={handleChange}
                            error={errors.no_telepon}
                            placeholder="Masukkan nomor HP"
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

                        <LoadingButton type="submit" loading={loading}>🚀 Buat Akun</LoadingButton>
                    </form>

                    <p className="login-redirect">
                        Sudah punya akun?{' '}
                        <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
