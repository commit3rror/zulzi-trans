// resources/js/service/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true, // Wajib true untuk session/cookies
});

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // 401 Unauthorized & 419 CSRF Token Mismatch -> Sesi habis
            if (error.response.status === 401 || error.response.status === 419) {
                // Cek apakah kita sudah di halaman login untuk menghindari loop
                if (window.location.pathname !== '/login') {
                    // Opsional: Redirect ke login atau clear state context
                    // window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
