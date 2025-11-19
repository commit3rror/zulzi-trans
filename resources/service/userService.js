import api from './api';

const userService = {
    // Get user profile
    getProfile: async () => {
        try {
            const response = await api.get('/profile');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update user profile
    updateProfile: async (data) => {
        try {
            const response = await api.put('/profile', data);
            
            // Update localStorage
            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.data));
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default userService;