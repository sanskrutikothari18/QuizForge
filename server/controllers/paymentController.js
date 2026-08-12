const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');

// Initialize Razorpay lazily to ensure env vars are loaded
let razorpay = null;
const getRazorpayInstance = () => {
    if (!razorpay) {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            throw new Error('Razorpay credentials not found in environment variables');
        }
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    }
    return razorpay;
};

// Plan pricing configuration
const PLAN_CONFIG = {
    FREE: { amount: 0, description: 'Free Plan' },
    PRO: { amount: 29900, description: 'Pro Plan - ₹299/month' }, // Amount in paise
    ENTERPRISE: { amount: 0, description: 'Enterprise Plan - Custom pricing' }
};

// Create payment order
exports.createPaymentOrder = async (req, res) => {
    try {
        const { plan } = req.body;
        const userId = req.user.id;

        // Validate plan
        if (!PLAN_CONFIG[plan]) {
            return res.status(400).json({ success: false, message: 'Invalid plan' });
        }

        // Check if user already has an active subscription
        const user = await User.findById(userId);
        if (user.subscriptionStatus === 'active' && user.plan !== 'FREE') {
            return res.status(400).json({ 
                success: false, 
                message: 'You already have an active subscription' 
            });
        }

        const planConfig = PLAN_CONFIG[plan];

        // For FREE plan, no payment needed
        if (plan === 'FREE') {
            return res.status(200).json({
                success: true,
                message: 'Already on free plan',
                planConfig
            });
        }

        // Create Razorpay order
        const options = {
            amount: planConfig.amount, // Amount in paise
            currency: 'INR',
            receipt: `order_${userId}_${Date.now()}`,
            description: planConfig.description,
            customer_notify: 1,
            notes: {
                userId: userId,
                plan: plan,
                email: user.email
            }
        };

        const order = await getRazorpayInstance().orders.create(options);

        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID,
            plan,
            userEmail: user.email,
            userName: user.name
        });
    } catch (error) {
        console.error('Error creating payment order:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create payment order',
            error: error.message 
        });
    }
};

// Verify payment and update subscription
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, plan } = req.body;
        const userId = req.user.id;

        // Verify signature
        const body = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpaySignature) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }

        // Calculate subscription dates
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        // Create payment record
        const payment = await Payment.create({
            userId,
            plan,
            amount: PLAN_CONFIG[plan].amount,
            paymentMethod: 'UPI', // Default, can be passed in request
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            status: 'completed',
            billingPeriod: {
                startDate,
                endDate
            },
            description: PLAN_CONFIG[plan].description,
            receiptId: `RCP_${userId}_${Date.now()}`
        });

        // Update user subscription
        const user = await User.findByIdAndUpdate(
            userId,
            {
                plan,
                subscriptionStatus: 'active',
                subscriptionStartDate: startDate,
                subscriptionEndDate: endDate,
                $push: { paymentHistory: payment._id }
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Payment successful! Subscription activated',
            payment,
            user: {
                id: user._id,
                plan: user.plan,
                subscriptionStatus: user.subscriptionStatus,
                subscriptionEndDate: user.subscriptionEndDate
            }
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification failed',
            error: error.message
        });
    }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const payments = await Payment.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            payments
        });
    } catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment history',
            error: error.message
        });
    }
};

// Get current subscription
exports.getSubscription = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId)
            .select('plan subscriptionStatus subscriptionStartDate subscriptionEndDate quizzesCreated')
            .populate('paymentHistory', '-razorpaySignature');

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.status(200).json({
            success: true,
            subscription: {
                plan: user.plan,
                status: user.subscriptionStatus,
                startDate: user.subscriptionStartDate,
                endDate: user.subscriptionEndDate,
                quizzesCreated: user.quizzesCreated,
                paymentHistory: user.paymentHistory
            }
        });
    } catch (error) {
        console.error('Error fetching subscription:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subscription',
            error: error.message
        });
    }
};

// Upgrade subscription
exports.upgradeSubscription = async (req, res) => {
    try {
        const { newPlan } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Validate plan upgrade logic
        const planHierarchy = { FREE: 0, PRO: 1, ENTERPRISE: 2 };
        if (planHierarchy[newPlan] <= planHierarchy[user.plan]) {
            return res.status(400).json({
                success: false,
                message: 'Can only upgrade to a higher plan'
            });
        }

        // Create new order for upgrade
        const options = {
            amount: PLAN_CONFIG[newPlan].amount,
            currency: 'INR',
            receipt: `upgrade_${userId}_${Date.now()}`,
            description: `Upgrade to ${newPlan} Plan`,
            notes: {
                userId,
                plan: newPlan,
                type: 'upgrade',
                previousPlan: user.plan
            }
        };

        const order = await getRazorpayInstance().orders.create(options);

        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID,
            plan: newPlan,
            userEmail: user.email,
            userName: user.name
        });
    } catch (error) {
        console.error('Error upgrading subscription:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upgrade subscription',
            error: error.message
        });
    }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByIdAndUpdate(
            userId,
            {
                plan: 'FREE',
                subscriptionStatus: 'cancelled',
                subscriptionEndDate: new Date()
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Subscription cancelled successfully',
            user: {
                plan: user.plan,
                subscriptionStatus: user.subscriptionStatus
            }
        });
    } catch (error) {
        console.error('Error cancelling subscription:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel subscription',
            error: error.message
        });
    }
};
