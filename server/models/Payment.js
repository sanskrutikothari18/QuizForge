const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan: {
        type: String,
        enum: ['FREE', 'PRO', 'ENTERPRISE'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    paymentMethod: {
        type: String,
        enum: ['UPI', 'CARD', 'NETBANKING', 'WALLET'],
        required: true
    },
    razorpayPaymentId: {
        type: String
    },
    razorpayOrderId: {
        type: String
    },
    razorpaySignature: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'cancelled'],
        default: 'pending'
    },
    billingPeriod: {
        startDate: Date,
        endDate: Date
    },
    description: String,
    receiptId: String,
    failureReason: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
