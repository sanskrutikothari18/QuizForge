const express = require('express');
const router = express.Router();
const {
    createPaymentOrder,
    verifyPayment,
    getPaymentHistory,
    getSubscription,
    upgradeSubscription,
    cancelSubscription
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// All payment routes require authentication
router.use(protect);

// Create payment order
router.post('/create-order', createPaymentOrder);

// Verify payment and activate subscription
router.post('/verify-payment', verifyPayment);

// Get payment history
router.get('/history', getPaymentHistory);

// Get current subscription details
router.get('/subscription', getSubscription);

// Upgrade subscription
router.post('/upgrade', upgradeSubscription);

// Cancel subscription
router.post('/cancel', cancelSubscription);

module.exports = router;
