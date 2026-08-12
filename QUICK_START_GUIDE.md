# QuizForge Payment System - Quick Start Guide

## ✅ What's Been Implemented

### Backend (Server)
1. ✅ **User Model Updates** - Added subscription fields (plan, status, dates, Razorpay IDs)
2. ✅ **Payment Model** - Stores all payment transactions and receipts
3. ✅ **Payment Controller** - 6 key functions for payment processing
4. ✅ **Payment Routes** - 6 API endpoints for payment operations
5. ✅ **Quiz Limit Enforcement** - FREE users limited to 5 quizzes
6. ✅ **Participant Limit Enforcement** - FREE users limited to 20 participants per session
7. ✅ **Razorpay Configuration** - Payment gateway integration ready

### Frontend (Client)
1. ✅ **AuthContext** - Enhanced with subscription management
2. ✅ **Payment API Service** - Client-side payment API wrapper
3. ✅ **Pricing Page** - Beautiful 3-tier pricing display with payment integration
4. ✅ **Payment Success Page** - Celebration page after successful payment
5. ✅ **Enterprise Contact Page** - WhatsApp integration for custom plans
6. ✅ **Upgrade Modal** - Shows when users hit plan limits
7. ✅ **Error Handling** - Graceful errors when limits reached
8. ✅ **Routing** - All new pages integrated into app

---

## 🚀 5-Minute Setup

### Step 1: Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Connection
MONGO_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_random_secret_key_here
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
HOST=0.0.0.0

# Razorpay (Get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# Frontend Razorpay Key
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx

# Email (for password reset)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# WhatsApp Enterprise Contact
WHATSAPP_BUSINESS_NUMBER=+919876543210
```

### Step 2: Install Backend Dependencies

```bash
cd server
npm install razorpay
npm install  # Install all dependencies
cd ..
```

### Step 3: Install Frontend Dependencies

```bash
cd client
npm install  # Install all dependencies
cd ..
```

### Step 4: Start the Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Frontend running on http://localhost:5173
```

### Step 5: Get Razorpay Keys

1. Go to https://dashboard.razorpay.com
2. Sign up or log in
3. Navigate to Settings > API Keys
4. Copy TEST Key ID and Secret
5. Add to your `.env` file

---

## 📱 Testing the System

### Test Account
1. Register a new account on the app
2. You start with FREE plan
3. Can create 5 quizzes and host 20 participants

### Test Upgrade Flow
1. Try to create 6th quiz → See "Upgrade" modal → Click "Upgrade Now"
2. Navigate to `/pricing`
3. Click "Upgrade Now" on PRO plan
4. Complete payment with test card: **4111 1111 1111 1111** (Exp: any future date, CVV: any 3 digits)
5. See success page with celebration animation
6. Can now create unlimited quizzes!

### Test Participant Limit
1. Create a quiz on FREE plan
2. Share PIN to others
3. When 20th person joins → 21st person sees limit error
4. They see upgrade prompt

### Test Enterprise Contact
1. Go to `/pricing`
2. Click "ENTERPRISE" card
3. Click "Contact Sales" button
4. Select a WhatsApp number (if you have it set up)
5. Or click "Email Us"

---

## 📊 Plan Features Summary

### FREE Plan
```
✓ Create up to 5 quizzes
✓ Host up to 20 participants per session
✓ Basic real-time leaderboard
✓ Basic score analytics
✗ No priority support
```

### PRO Plan (₹299/month)
```
✓ Unlimited quizzes
✓ Unlimited participants
✓ Advanced real-time leaderboard
✓ Detailed score analytics
✓ Priority email support
✓ Auto-renews monthly
```

### ENTERPRISE Plan
```
✓ Everything in PRO
✓ Dedicated 24/7 support manager
✓ Institution admin dashboard
✓ Multi-teacher account management
✓ Unlimited team workspace
✓ REST API & Webhooks
✓ Custom LMS integrations
→ Contact sales for custom pricing
```

---

## 🌐 Routes Created

### Client Routes
- `/pricing` - Display all plans and pricing
- `/payment-success` - Show after successful payment
- `/enterprise` - Enterprise plan details and contact options

### Server Routes
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify-payment` - Verify and activate subscription
- `GET /api/payment/history` - Get payment history
- `GET /api/payment/subscription` - Get current subscription details
- `POST /api/payment/upgrade` - Upgrade to higher plan
- `POST /api/payment/cancel` - Cancel subscription

---

## 🔒 Security Notes

1. **Never commit .env** - Already in .gitignore
2. **Use HTTPS in production** - Razorpay requires secure connection
3. **Verify signatures** - Backend verifies all payments with Razorpay
4. **Keep secrets safe** - Razorpay keys should never be exposed
5. **Use strong JWT_SECRET** - Generate random strong string in production

---

## 📝 Database Changes

### User Table - New Fields
```javascript
{
  // ... existing fields ...
  plan: String,                    // "FREE", "PRO", "ENTERPRISE"
  subscriptionStatus: String,       // "active", "inactive", "cancelled", etc.
  subscriptionStartDate: Date,
  subscriptionEndDate: Date,
  razorpayCustomerId: String,
  razorpaySubscriptionId: String,
  quizzesCreated: Number,
  paymentHistory: [ObjectId]        // References to Payment documents
}
```

### Payment Table - New Document
```javascript
{
  userId: ObjectId,
  plan: String,
  amount: Number,                   // in paise
  currency: String,                 // "INR"
  paymentMethod: String,            // "UPI", "CARD", etc.
  razorpayPaymentId: String,
  razorpayOrderId: String,
  razorpaySignature: String,
  status: String,                   // "completed", "failed", etc.
  billingPeriod: {
    startDate: Date,
    endDate: Date
  },
  receiptId: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Test Scenarios

### Scenario 1: Quiz Limit
```
1. Login as FREE user
2. Create 5 quizzes (should work)
3. Try to create 6th quiz
4. See: "Quiz limit reached! Upgrade to PRO"
5. Click "Upgrade Now" → Goes to pricing page
6. Complete payment
7. Now can create unlimited quizzes
```

### Scenario 2: Participant Limit
```
1. Create quiz on FREE plan
2. Host the quiz (get PIN)
3. Have 20 people join (all join successfully)
4. 21st person tries to join
5. See: "Participant limit reached! Max 20 on FREE plan"
6. Quiz creator upgrades to PRO
7. Now unlimited participants can join
```

### Scenario 3: Successful Payment
```
1. Click "Upgrade Now" on PRO plan
2. Razorpay modal opens
3. Enter test card: 4111 1111 1111 1111
4. Click Pay
5. See success page with:
   - Celebration animation
   - Plan details (PRO, ₹299/month)
   - Receipt ID
   - Features list
6. Click "Go to Dashboard"
7. Can create unlimited content
```

---

## 💡 Tips

1. **Test Cards** (in test mode):
   - Visa: `4111 1111 1111 1111`
   - Mastercard: `5555 5555 5555 4444`
   - Amex: `3782 822463 10005`
   
2. **Test UPI**: Use any test UPI ID (test@ybl, test@okhdfcbank)

3. **Webhook Testing**: In production, configure webhook URL in Razorpay dashboard

4. **Payment History**: Users can see all their payments in their dashboard (implement viewing in user profile)

5. **Receipts**: Receipt IDs are generated and can be used for invoice generation

---

## 🆘 Troubleshooting

### "Invalid Razorpay Key"
- Check .env file has correct RAZORPAY_KEY_ID
- Ensure it starts with `rzp_test_` or `rzp_live_`
- Restart server after changing .env

### "Cannot connect to server"
- Check server is running on http://localhost:5000
- Check CORS is enabled
- Check firewall isn't blocking port 5000

### "Quiz limit error not showing"
- Clear browser cache
- Check network tab to see error response
- Verify server is returning error code: `QUIZ_LIMIT_EXCEEDED`

### "Payment not processing"
- Check Razorpay API keys are correct
- Test payment in Razorpay test mode first
- Check browser console for errors
- Check server logs for backend errors

### "WhatsApp link not working"
- Ensure phone number has country code (+91 for India)
- Test direct URL: https://wa.me/919876543210
- WhatsApp must be installed on device

---

## 📚 Additional Resources

- **Payment System Guide**: See `PAYMENT_SYSTEM_GUIDE.md` for detailed documentation
- **Razorpay Docs**: https://razorpay.com/docs
- **MongoDB Docs**: https://docs.mongodb.com
- **React Docs**: https://react.dev

---

## 🎯 Next Steps

1. ✅ Setup completed
2. ✅ Test all features
3. 📞 Add WhatsApp business account for enterprise
4. 📧 Add email service for payment receipts
5. 🎨 Customize branding in pricing page
6. 🔐 Move to production Razorpay keys
7. 📊 Monitor payments in Razorpay dashboard
8. 🚀 Deploy to production

---

**Questions?** Check the `PAYMENT_SYSTEM_GUIDE.md` for detailed information.

**Happy selling! 🎉**
