const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Plan price is required'],
    default: 0,
  },
  billingCycle: {
    type: String,
    default: 'monthly',
  },
  description: {
    type: String,
    trim: true,
  },
  features: [{
    type: String,
    trim: true,
  }],
  highlighted: {
    type: Boolean,
    default: false,
  },
  buttonText: {
    type: String,
    default: 'Get Started',
  },
  buttonColor: {
    type: String,
    default: 'primary',
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Plan', planSchema);
