// resources/js/service/authService.js
import api from './api';
import axios from 'axios';

const authService = {
    // Request CSRF Cookie sebelum POST request login/register
    getCsrfToken: async () => {
        await axios.get('/sanctum/csrf-cookie', {
            baseURL: window.location.origin
        });
    },

    register: async (data) => {
        try {
            await authService.getCsrfToken();
            const response = await api.post('/auth/register', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    login: async (credentials) => {
        try {
            await authService.getCsrfToken();
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    me: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default authService;
