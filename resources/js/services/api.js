import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Request Interceptor - Add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Unauthorized - remove token dan local user data
      // Jangan hard-redirect, biarkan component handle navigation
      if (error.response.status === 401) {
        console.error('❌ Unauthorized (401): Token invalid atau expired');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        // Jangan redirect di sini, biarkan component/route handle
        // window.location.href = '/login'; // REMOVED - biarkan React Router handle
      }
      
      // Forbidden
      if (error.response.status === 403) {
        console.error('❌ Forbidden (403): You do not have permission to access this resource');
      }
    }
    return Promise.reject(error);
  }
);

export default api;