import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { FormInput, Alert, LoadingButton } from '@/components/ReusableUI';
import { ArrowLeft } from 'lucide-react';
import userService from '@/services/userService';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    
    const [formData, setFormData] = useState({
        nama: '',
        no_telepon: '',
        email: '',
        alamat: '',
    });
    
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    // Load user data on mount
    useEffect(() => {
        if (user) {
            setFormData({
                nama: user.nama || '',
                no_telepon: user.no_telepon || '',
                email: user.email || '',
                alamat: user.alamat || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

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
            const response = await userService.updateProfile(formData);
            updateUser(response.data);

            setAlert({
                type: 'success',
                message: response.message || 'Profile berhasil diperbarui!',
            });

        } catch (error) {
            console.error('Update profile error:', error);
            if (error.errors) setErrors(error.errors);

            setAlert({
                type: 'error',
                message: error.message || 'Gagal memperbarui profile.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page-container">
            <div className="profile-content-wrapper">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="back-button"
                >
                    <ArrowLeft className="icon-back" />
                    <span>Kembali</span>
                </button>

                {/* Profile Form Card */}
                <div className="profile-card">
                    <h1 className="profile-title">Edit Profile</h1>

                    {alert && (
                        <Alert
                            type={alert.type}
                            message={alert.message}
                            onClose={() => setAlert(null)}
                        />
                    )}

                    <form onSubmit={handleSubmit} className="profile-form">
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
                            label="No Telepon"
                            name="no_telepon"
                            type="text"
                            value={formData.no_telepon}
                            onChange={handleChange}
                            error={errors.no_telepon}
                            placeholder="Masukkan nomor telepon"
                            required
                        />

                        <FormInput
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            disabled
                        />

                        <FormInput
                            label="Alamat"
                            name="alamat"
                            type="text"
                            value={formData.alamat}
                            onChange={handleChange}
                            error={errors.alamat}
                            placeholder="Masukkan alamat"
                        />

                        <div className="form-info">
                            <p>Tekan save untuk menyimpan perubahan.</p>
                        </div>

                        <LoadingButton
                            type="submit"
                            loading={loading}
                            className="btn-save"
                        >
                            Save
                        </LoadingButton>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
