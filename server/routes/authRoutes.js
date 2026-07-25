const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getProfile,
    forgotPassword,
    verifyOtp,
    resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/profile', protect, getProfile);

module.exports = router;