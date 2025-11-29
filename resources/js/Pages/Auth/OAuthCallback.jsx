import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import api from '../../../service/api';
import authService from '../../../service/authService';

export default function OAuthCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { updateUser } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get('token');
            const error = searchParams.get('error');

            // Jika ada error dari backend
            if (error) {
                console.error('❌ OAuth Error:', error);
                alert(error);
                navigate('/login');
                return;
            }

            // Jika tidak ada token
            if (!token) {
                console.error('❌ No token received');
                navigate('/login');
                return;
            }

            try {
                console.log('🔑 Token received from OAuth:', token.substring(0, 20) + '...');

                // 1. Simpan token ke localStorage
                localStorage.setItem('auth_token', token);

                // 2. Set Authorization header
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // 3. Fetch user data menggunakan token
                const response = await authService.me();
                const userData = response.data.data || response.data;

                // 4. Simpan user data ke localStorage
                localStorage.setItem('user', JSON.stringify(userData));

                // 5. Update AuthContext
                updateUser(userData);

                console.log('✅ OAuth login successful:', userData.nama);

                // 6. Redirect ke beranda
                setTimeout(() => {
                    navigate('/beranda', { replace: true });
                }, 100);

            } catch (error) {
                console.error('❌ Failed to process OAuth callback:', error);
                
                // Clear everything if failed
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                api.defaults.headers.common['Authorization'] = null;
                
                alert('Gagal memproses login. Silakan coba lagi.');
                navigate('/login');
            }
        };

        handleCallback();
    }, [searchParams, navigate, updateUser]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-700">
                    Memproses login...
                </h2>
                <p className="text-gray-500 mt-2">
                    Mohon tunggu sebentar
                </p>
            </div>
        </div>
    );
}