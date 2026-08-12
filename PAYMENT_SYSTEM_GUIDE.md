# QuizForge Payment & Subscription System Guide

## 📋 Overview

This guide documents the complete implementation of the payment and subscription system in QuizForge, including three tiers: FREE, PRO, and ENTERPRISE.

## 🏗️ Architecture

### Backend Components

#### 1. **User Model Updates** (`server/models/User.js`)
Added subscription-related fields:
- `plan` - Current subscription tier (FREE, PRO, ENTERPRISE)
- `subscriptionStatus` - Status of subscription (active, inactive, pending, cancelled, expired)
- `subscriptionStartDate` - When subscription started
- `subscriptionEndDate` - When subscription ends
- `razorpayCustomerId` - Razorpay customer ID for recurring payments
- `razorpaySubscriptionId` - Razorpay subscription ID
- `quizzesCreated` - Counter for quiz creation limits
- `paymentHistory` - Array of Payment references

#### 2. **Payment Model** (`server/models/Payment.js`)
Tracks all payment transactions:
```javascript
{
  userId,           // Reference to User
  plan,            // Plan purchased (FREE, PRO, ENTERPRISE)
  amount,          // Payment amount in paise
  paymentMethod,   // UPI, CARD, NETBANKING, WALLET
  razorpayPaymentId,
  razorpayOrderId,
  razorpaySignature,
  status,          // pending, completed, failed, cancelled
  billingPeriod,   // { startDate, endDate }
  receiptId
}
```

#### 3. **Payment Controller** (`server/controllers/paymentController.js`)
Key functions:
- `createPaymentOrder()` - Initiate payment order
- `verifyPayment()` - Verify and process successful payment
- `getPaymentHistory()` - Fetch user's payment history
- `getSubscription()` - Get current subscription details
- `upgradeSubscription()` - Upgrade to a higher plan
- `cancelSubscription()` - Cancel current subscription

#### 4. **Payment Routes** (`server/routes/paymentRoutes.js`)
```
POST   /payment/create-order       - Create Razorpay order
POST   /payment/verify-payment     - Verify and activate subscription
GET    /payment/history            - Get payment history
GET    /payment/subscription       - Get current subscription
POST   /payment/upgrade            - Upgrade subscription
POST   /payment/cancel             - Cancel subscription
```

### Frontend Components

#### 1. **AuthContext** (`client/src/context/AuthContext.jsx`)
Enhanced with subscription support:
- `useAuth()` hook for accessing user and subscription
- `login()` - Login and fetch subscription
- `register()` - Register with FREE plan
- `updateUserPlan()` - Update plan after payment
- `refreshSubscription()` - Refresh subscription data

#### 2. **Payment API Service** (`client/src/api/paymentAPI.js`)
Wrapper functions for payment endpoints:
```javascript
paymentAPI.createPaymentOrder(plan)
paymentAPI.verifyPayment(paymentData)
paymentAPI.getPaymentHistory()
paymentAPI.getSubscription()
paymentAPI.upgradeSubscription(newPlan)
paymentAPI.cancelSubscription()
```

#### 3. **Pages**

**PricingPage** (`client/src/pages/PricingPage.jsx`)
- Displays all three pricing tiers
- Razorpay payment integration
- Real-time plan comparison
- FAQ section
- Status indicators (Current Plan, Most Popular, etc.)

**PaymentSuccessPage** (`client/src/pages/PaymentSuccessPage.jsx`)
- Celebration animation
- Subscription confirmation details
- Receipt ID display
- Pro features overview
- Navigation to dashboard

**EnterpriseContactPage** (`client/src/pages/EnterpriseContactPage.jsx`)
- Enterprise plan details
- WhatsApp business contact
- Email contact option
- Feature comparison table
- Detailed benefits section

#### 4. **Components**

**UpgradeProModal** (`client/src/components/UpgradeProModal.jsx`)
- Shown when users hit quiz or participant limits
- Two variants: quiz_limit and participant_limit
- Direct navigation to pricing page

## 💰 Pricing Tiers

### FREE Plan
- **Price**: ₹0/forever
- **Quizzes**: Up to 5
- **Participants**: Up to 20 per session
- **Leaderboard**: Basic real-time
- **Analytics**: Basic score analytics
- **Support**: Email (community)

### PRO Plan
- **Price**: ₹299/month
- **Quizzes**: Unlimited
- **Participants**: Unlimited
- **Leaderboard**: Advanced real-time
- **Analytics**: Detailed score analytics & insights
- **Support**: Priority email support
- **Auto-renewal**: Monthly

### ENTERPRISE Plan
- **Price**: Custom/tailored
- **Everything in Pro**: ✓
- **Dedicated Support Manager**: 24/7
- **Admin Dashboard**: Institution-wide
- **Multi-Teacher Accounts**: Unlimited
- **Team Workspace**: Unlimited
- **API Access**: REST API + Webhooks
- **LMS Integrations**: Custom integrations
- **Contact**: WhatsApp or Email

## 🔧 Setup Instructions

### Prerequisites
1. Razorpay account with API keys
2. MongoDB with Atlas connectivity
3. Node.js 14+ and npm

### Backend Setup

1. **Install dependencies**:
```bash
cd server
npm install razorpay
```

2. **Update .env**:
```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# MongoDB
MONGO_URI=your_mongodb_uri

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
```

3. **Database Migration**:
The User and Payment models are already updated. Restart the server to apply changes.

### Frontend Setup

1. **Install Razorpay script** (added in PricingPage.jsx):
```html
<script src="https://checkout.razorpay.com/v1/checkout.js" />
```

2. **Environment variables** (`client/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_key_id
```

3. **Update router**:
Routes already added in App.jsx:
- `/pricing` - Pricing page
- `/payment-success` - Success page
- `/enterprise` - Enterprise contact page

## 📊 Plan Limit Enforcement

### Quiz Creation Limits

**File**: `server/controllers/quizController.js`

```javascript
// FREE users can create up to 5 quizzes
if (user.plan === 'FREE') {
  const count = await Quiz.countDocuments({ createdBy: userId });
  if (count >= 5) {
    // Return error with code 'QUIZ_LIMIT_EXCEEDED'
  }
}
```

**Client Handler**: `client/src/pages/CreateQuiz.jsx`
- Catches QUIZ_LIMIT_EXCEEDED error
- Shows UpgradeProModal
- Navigates to pricing on upgrade

### Participant Limits

**File**: `server/controllers/gameController.js`

```javascript
// FREE plan hosts can have up to 20 participants
if (quizCreator.plan === 'FREE' && game.players.length >= 20) {
  // Return error with code 'PARTICIPANT_LIMIT_EXCEEDED'
}
```

**Client Handler**: `client/src/pages/JoinGame.jsx`
- Catches PARTICIPANT_LIMIT_EXCEEDED error
- Shows UpgradeProModal with participant_limit reason
- Allows quiz creator to upgrade

## 💳 Payment Flow

### For PRO Upgrade

1. User clicks "Upgrade Now" on pricing page
2. Frontend calls `paymentAPI.createPaymentOrder('PRO')`
3. Backend creates Razorpay order and returns order details
4. Razorpay checkout modal opens
5. User selects payment method (UPI/Card/Net Banking/Wallet)
6. After successful payment:
   - Razorpay callback returns payment details
   - Frontend calls `paymentAPI.verifyPayment()`
   - Backend verifies signature and updates user subscription
   - Frontend navigates to `/payment-success`

### For ENTERPRISE

1. User clicks "Contact Sales" on enterprise page
2. Opens WhatsApp with pre-filled message:
   > "I want to access the custom plan for QuizForge"
3. Sales team responds with custom pricing and options

## 🔐 Security Features

### Payment Verification
- Razorpay signature verification on backend
- HMAC-SHA256 validation
- Prevents unauthorized payment approval

### Authentication
- JWT token validation on all payment routes
- User ownership verification for subscription changes
- Rate limiting recommended on production

### Sensitive Data
- Razorpay signature never sent to client
- Payment details encrypted in transit (HTTPS)
- PII handled according to compliance standards

## 🧪 Testing

### Test Razorpay Credentials
```
Key ID: rzp_test_xxxxxxxxxx
Key Secret: xxxxxxxxxxxxxx

Test Cards:
- Visa: 4111 1111 1111 1111
- Mastercard: 5555 5555 5555 4444
- Amex: 3782 822463 10005
```

### Test UPI
- Use any valid UPI ID (test@ybl, test@okhdfcbank, etc.)

### Test Webhook (Production)
Razorpay sends webhooks for:
- payment.authorized
- payment.failed
- subscription.charged
- subscription.completed

## 📱 WhatsApp Enterprise Integration

### Configuration
```javascript
// In EnterpriseContactPage.jsx
const phoneNumber = '+919876543210'; // Your business number
const message = 'I want to access the custom plan for QuizForge';
const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
```

### Setup
1. Get WhatsApp business account
2. Add phone number to enterprise page
3. Users can click to open WhatsApp directly

## 🚀 Deployment Checklist

- [ ] Update Razorpay production keys
- [ ] Set HTTPS for all endpoints
- [ ] Configure webhook URL in Razorpay dashboard
- [ ] Update WhatsApp business number
- [ ] Set MONGO_URI to production database
- [ ] Set JWT_SECRET to strong random string
- [ ] Configure CORS for production domain
- [ ] Test payment flow end-to-end
- [ ] Monitor error logs for failed payments
- [ ] Set up email notifications for receipts

## 🐛 Troubleshooting

### Payment Not Processing
1. Check Razorpay API keys in .env
2. Verify network connectivity
3. Check MongoDB connection
4. Review server logs for errors

### Signature Verification Failed
1. Ensure exact match of order_id and payment_id
2. Verify correct key_secret is used
3. Check for whitespace in signature

### User Can't Upgrade
1. Check user is authenticated
2. Verify user doesn't already have active subscription
3. Check MongoDB connection
4. Review payment controller logs

### WhatsApp Link Not Working
1. Verify phone number format (include country code)
2. Ensure WhatsApp is installed on device
3. Test with URL: https://wa.me/919876543210

## 📞 Support

For issues related to:
- **Razorpay Integration**: https://razorpay.com/support
- **Payment Flow**: Check error logs and payment controller
- **Database Issues**: Check MongoDB Atlas dashboard
- **Frontend**: Check browser console and network tab

## 🔄 Migration from Old System

If migrating from existing system:

```javascript
// Update existing users to FREE plan
db.users.updateMany({}, { 
  $set: { 
    plan: 'FREE', 
    subscriptionStatus: 'active',
    subscriptionStartDate: new Date(),
    quizzesCreated: 0
  }
});

// Optionally migrate payment history if available
// Write custom migration script based on old payment table
```

## 📝 API Response Examples

### Create Order Response
```json
{
  "success": true,
  "orderId": "order_xxxxxxxxxxxxx",
  "amount": 29900,
  "currency": "INR",
  "key": "rzp_prod_xxxxxxxxxx",
  "plan": "PRO"
}
```

### Verify Payment Response
```json
{
  "success": true,
  "message": "Payment successful! Subscription activated",
  "user": {
    "id": "user_id",
    "plan": "PRO",
    "subscriptionStatus": "active"
  }
}
```

### Get Subscription Response
```json
{
  "success": true,
  "subscription": {
    "plan": "PRO",
    "status": "active",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-02-01T00:00:00Z",
    "quizzesCreated": 3
  }
}
```

---

**Version**: 1.0  
**Last Updated**: 2024  
**Maintained by**: QuizForge Dev Team
