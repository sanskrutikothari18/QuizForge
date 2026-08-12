import API from './config';

const paymentAPI = {
    // Create payment order
    createPaymentOrder: async (plan) => {
        try {
            const response = await API.post('/payment/create-order', { plan });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Verify payment after successful transaction
    verifyPayment: async (paymentData) => {
        try {
            const response = await API.post('/payment/verify-payment', paymentData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get payment history
    getPaymentHistory: async () => {
        try {
            const response = await API.get('/payment/history');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get current subscription
    getSubscription: async () => {
        try {
            const response = await API.get('/payment/subscription');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Upgrade subscription
    upgradeSubscription: async (newPlan) => {
        try {
            const response = await API.post('/payment/upgrade', { newPlan });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Cancel subscription
    cancelSubscription: async () => {
        try {
            const response = await API.post('/payment/cancel');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default paymentAPI;
