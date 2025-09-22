import axiosInstance from './axiosInstance';

const profileService = {
    // Get current user profile
    getProfile: async () => {
        try {
            const response = await axiosInstance.get('/api/auth/user');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update user profile
    updateProfile: async (profileData) => {
        try {
            const response = await axiosInstance.put('/api/auth/user/profile', profileData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default profileService;
