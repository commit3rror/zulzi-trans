import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormInput, Alert, LoadingButton } from '@/components/ReusableUI';
import { ArrowLeft } from 'lucide-react';
import authService from '../../../service/authService'; // Import service

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false); // State untuk konfirmasi kirim email

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        setErrors({});

        try {
            // ✅ PERBAIKAN: Panggil API Forgot Password
            const response = await authService.forgotPassword({ email });
            
            setAlert({
                type: 'success',
                message: response.message || 'Link reset password telah dikirim ke email Anda!'
            });
            setEmailSent(true);

        } catch (error) {
            console.error('Forgot password error:', error);
            
            // Tangani error validasi (misal email tidak valid) atau error server
            const errorData = error.response?.data || error;

            if (errorData.errors) {
                setErrors(errorData.errors);
            }
            
            setAlert({
                type: 'error',
                message: errorData.message || 'Gagal mengirim link reset password. Cek email Anda.'
            });
            setEmailSent(false);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100">
                    <Link 
                        to="/login"
                        className="flex items-center gap-2 text-primary hover:text-primary-dark mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Kembali ke Login</span>
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-primary-dark mb-2">
                            Lupa Password?
                        </h1>
                        <p className="text-neutral-gray">
                            Masukkan email Anda untuk menerima link reset password
                        </p>
                    </div>

                    {alert && (
                        <div className="mb-6">
                            <Alert 
                                type={alert.type} 
                                message={alert.message}
                                onClose={() => setAlert(null)}
                            />
                        </div>
                    )}
                    
                    {/* Jika email sudah terkirim, tampilkan notifikasi saja */}
                    {emailSent ? (
                        <div className="text-center p-6 bg-blue-50 border border-blue-200 rounded-xl text-blue-800">
                            <p className="font-semibold">Link sudah dikirim!</p>
                            <p className="text-sm mt-1">Periksa kotak masuk email Anda (termasuk folder spam).</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <FormInput
                                label="Email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setErrors({}); // Clear errors saat input berubah
                                }}
                                error={errors.email && errors.email[0]}
                                placeholder="Masukkan email"
                                required
                            />

                            <LoadingButton
                                type="submit"
                                isLoading={loading}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-lg shadow-md transition-all"
                            >
                                Kirim Link Reset Password
                            </LoadingButton>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;