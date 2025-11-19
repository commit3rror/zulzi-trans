import api from './api';

const authService = {
    // Register new user
    register: async (data) => {
        try {
            const response = await api.post('/auth/register', data);
            
            // Save token and user data
            if (response.data.success) {
                localStorage.setItem('auth_token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Login user
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            
            // Save token and user data
            if (response.data.success) {
                localStorage.setItem('auth_token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Logout user
    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear local storage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        }
    },

    // Get current user
    me: async () => {
        try {
            const response = await api.get('/auth/me');
            
            // Update user data in localStorage
            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.data));
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Change password
    changePassword: async (data) => {
        try {
            const response = await api.post('/auth/change-password', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('auth_token');
    },

    // Get stored user data
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Get stored token
    getToken: () => {
        return localStorage.getItem('auth_token');
    },
};

export default authService;