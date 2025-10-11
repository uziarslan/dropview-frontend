import axiosInstance from "./axiosInstance";

const API_URL = "/api/auth";

const progressService = {
    // Get user's progress data for unlocking first drop
    getProgressData: async () => {
        try {
            const response = await axiosInstance.get(`${API_URL}/user/progress`);
            return response.data;
        } catch (error) {
            console.error('Error fetching progress data:', error);
            throw error;
        }
    },
};

export default progressService;

