import axiosInstance from './axiosInstance';

export const referralService = {
    // Get user's referral information
    getReferralInfo: async () => {
        try {
            const response = await axiosInstance.get('/api/referral/info');
            return response.data;
        } catch (error) {
            console.error('Error fetching referral info:', error);
            throw error;
        }
    },

    // Validate referral code
    validateReferralCode: async (referralCode) => {
        try {
            const response = await axiosInstance.get(`/api/referral/validate/${referralCode}`);
            return response.data;
        } catch (error) {
            console.error('Error validating referral code:', error);
            throw error;
        }
    },

    // Get referral leaderboard
    getReferralLeaderboard: async () => {
        try {
            const response = await axiosInstance.get('/api/referral/leaderboard');
            return response.data;
        } catch (error) {
            console.error('Error fetching referral leaderboard:', error);
            throw error;
        }
    },

    // Share referral link using Web Share API (if supported) or fallback to clipboard
    shareReferralLink: async (referralLink, userName) => {
        // Check if Web Share API is supported
        if (navigator.share && navigator.canShare) {
            try {
                await navigator.share({
                    url: referralLink
                });
                return { success: true, method: 'native' };
            } catch (error) {
                console.log('Native sharing cancelled or failed:', error);
                // Fall back to clipboard - copy only the URL
                return await referralService.fallbackToClipboard(referralLink);
            }
        } else {
            // Fall back to clipboard - copy only the URL
            return await referralService.fallbackToClipboard(referralLink);
        }
    },

    // Fallback to clipboard when Web Share API is not available
    fallbackToClipboard: async (referralLink) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(referralLink);
                return { success: true, method: 'clipboard' };
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = referralLink;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                const result = document.execCommand('copy');
                document.body.removeChild(textArea);

                return { success: result, method: 'clipboard' };
            }
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            return { success: false, method: 'clipboard', error };
        }
    }
};
