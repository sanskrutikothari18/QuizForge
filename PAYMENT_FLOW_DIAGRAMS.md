# QuizForge Payment System - Flow Diagrams

## 1️⃣ User Signup & Plan Assignment Flow

```
┌─────────────────────────────────────────────────────────┐
│  New User Registration                                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ Create User Record  │
        │ - Email            │
        │ - Password         │
        │ - Name             │
        └────────┬───────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ Assign Plan: FREE  │
        │ - quizzesCreated=0 │
        │ - Status: active   │
        └────────┬───────────┘
                 │
                 ▼
        ┌────────────────────────────┐
        │ Show Home Page             │
        │ ✓ Create 5 quizzes allowed │
        │ ✓ Host 20 participants     │
        └────────────────────────────┘
```

---

## 2️⃣ Quiz Creation with Limit Check

```
┌──────────────────────────────────┐
│  User Click "Create Quiz"         │
└────────────────┬─────────────────┘
                 │
                 ▼
        ┌────────────────────────────────┐
        │ Check User Authentication      │
        │ (Is token valid?)              │
        └────────┬───────────────────────┘
                 │
          ┌──────┴──────┐
          │ NO          │ YES
          ▼             ▼
      Redirect    ┌─────────────────────┐
      to Login    │ Get User Plan       │
                  │ From Database       │
                  └────────┬────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
            FREE PLAN         PRO/ENTERPRISE
                    │             │
                    ▼             ▼
          ┌──────────────────┐  ┌──────────┐
          │ Count existing   │  │ Unlimited│
          │ quizzes          │  │ Quizzes  │
          │ SELECT WHERE     │  │ Allowed  │
          │ createdBy=user   │  └────┬─────┘
          └────────┬─────────┘       │
                   │                  │
            ┌──────┴────────┐        │
            │ COUNT         │        │
         < 5 ?             >= 5 ?    │
            │                │       │
       YES  │          NO    │       │
            │                │       │
            ▼                ▼       │
        ┌─────────┐  ┌──────────────┴─────┐
        │Allow    │  │ Error: QUIZ_LIMIT  │
        │Quiz     │  │ Response:          │
        │Creation │  │ - code: "QUIZ_..."│
        └────┬────┘  │ - message: "Upgrade"
             │       └──────────┬──────────┘
             │                  │
             ▼                  ▼
        ┌─────────────┐  ┌──────────────────┐
        │Save Quiz    │  │Client: Show      │
        │to Database  │  │Upgrade Modal     │
        │             │  │ → User clicks    │
        │Update       │  │   "Upgrade Now"  │
        │quizzesCount │  │ → Navigate to    │
        │++           │  │   /pricing       │
        └─────────────┘  └──────────────────┘
```

---

## 3️⃣ Game Join with Participant Limit

```
┌─────────────────────────────────┐
│  Player Enters PIN & Name        │
│  Click "Join Lobby Room"         │
└────────────────┬────────────────┘
                 │
                 ▼
        ┌────────────────────────────┐
        │ Send Join Request to Server │
        │ /api/game/join              │
        │ { pin, playerName, avatar } │
        └────────┬───────────────────┘
                 │
                 ▼
        ┌────────────────────────────────┐
        │ Find Game Session by PIN       │
        └────────┬───────────────────────┘
                 │
          ┌──────┴────────┐
          │ NO            │ YES
          ▼               ▼
      ┌────────┐   ┌──────────────────────┐
      │Error:  │   │ Get Quiz Info        │
      │Game    │   │ Find Quiz Creator    │
      │Not     │   │ Check Creator's Plan │
      │Found   │   └────────┬─────────────┘
      └────────┘            │
                     ┌──────┴──────┐
                     │             │
                 FREE            PRO/ENT
                     │             │
                     ▼             ▼
            ┌─────────────────┐  ┌──────────┐
            │ Count current   │  │Unlimited │
            │ players         │  │Players   │
            │ in game         │  │Allowed   │
            └────────┬────────┘  └────┬─────┘
                     │                 │
              ┌──────┴────────┐        │
              │ COUNT        │        │
           < 20 ?           >= 20 ?   │
              │               │       │
         YES  │         NO    │       │
              │               │       │
              ▼               ▼       │
          ┌────────────┐  ┌──────────┴────────┐
          │Add Player  │  │Error:              │
          │to Game     │  │PARTICIPANT_LIMIT  │
          │Emit Event: │  │Response:           │
          │player_list │  │- code: "PART_..."│
          └─────┬──────┘  │- message: "Max 20"│
                │         └───────────┬────────┘
                ▼                     │
          ┌────────────┐              ▼
          │Broadcast   │      ┌────────────────┐
          │Updated     │      │Client: Show    │
          │Player List │      │Upgrade Modal   │
          │to Waiting  │      │reason:"part_..." │
          │Room        │      └────────────────┘
          └────────────┘
```

---

## 4️⃣ Upgrade to PRO Payment Flow

```
┌──────────────────────────────────┐
│  User at Pricing Page             │
│  Click "Upgrade Now" (PRO)         │
└────────────────┬─────────────────┘
                 │
                 ▼
        ┌────────────────────────────┐
        │ Check Authentication       │
        │ (Is user logged in?)       │
        └────────┬──────────────────┘
                 │
          ┌──────┴──────┐
          │NO           │YES
          ▼             ▼
      ┌────────┐  ┌──────────────────────────┐
      │Redirect│  │Call: paymentAPI.          │
      │to Login│  │createPaymentOrder('PRO') │
      └────────┘  └────────┬─────────────────┘
                           │
                           ▼
                  ┌─────────────────────────┐
                  │ Backend: POST           │
                  │ /api/payment/create... │
                  │ { plan: 'PRO' }        │
                  └────────┬────────────────┘
                           │
                           ▼
                  ┌──────────────────────────┐
                  │ Verify User is Logged In │
                  │ Get User from DB         │
                  └────────┬─────────────────┘
                           │
                    ┌──────┴────────┐
                    │NO             │YES
                    ▼               ▼
                ┌─────────┐  ┌─────────────────┐
                │Error:   │  │Check: User has  │
                │Require  │  │active sub already
                │Auth     │  └────────┬────────┘
                └─────────┘           │
                              ┌───────┴────────┐
                              │NO              │YES
                              ▼                ▼
                        ┌────────────┐  ┌──────────────┐
                        │Create      │  │Error: Already
                        │Razorpay    │  │has subscription
                        │Order       │  └──────────────┘
                        │amount: 2990│
                        │0 paise     │
                        └─────┬──────┘
                              │
                              ▼
                        ┌──────────────┐
                        │Razorpay      │
                        │Creates Order │
                        │Returns:      │
                        │- orderId     │
                        │- amount      │
                        │- currency    │
                        └──────┬───────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │Send to Client:   │
                        │- orderId         │
                        │- amount: 29900   │
                        │- key_id (public) │
                        └────────┬─────────┘
                                 │
                                 ▼
                        ┌──────────────────────┐
                        │Frontend: Initialize  │
                        │Razorpay Checkout     │
                        │Modal Opens           │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │User Selects Payment  │
                        │Method:               │
                        │- UPI (PhonePe, etc) │
                        │- Card               │
                        │- Net Banking        │
                        │- Wallet             │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │User Completes        │
                        │Payment Process       │
                        │                      │
                        │Enter OTP / Verify    │
                        └──────────┬───────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                FAILED                       SUCCESS
                    │                             │
                    ▼                             ▼
            ┌──────────────┐          ┌───────────────────┐
            │Razorpay      │          │Razorpay Returns   │
            │Returns Error │          │Success with:      │
            │              │          │- payment_id       │
            │              │          │- order_id         │
            │              │          │- signature        │
            └──────┬───────┘          └────────┬──────────┘
                   │                           │
                   ▼                           ▼
            ┌──────────────┐          ┌───────────────────┐
            │Frontend:     │          │Frontend: Call:    │
            │Show Error    │          │verifyPayment()    │
            │Message       │          │                   │
            └──────────────┘          │POST /payment/     │
                                      │verify-payment     │
                                      └────────┬──────────┘
                                               │
                                               ▼
                                      ┌──────────────────┐
                                      │Backend: Verify   │
                                      │Signature with    │
                                      │HMAC-SHA256       │
                                      └────────┬─────────┘
                                               │
                                        ┌──────┴──────┐
                                        │INVALID      │VALID
                                        ▼             ▼
                                    ┌────────┐  ┌──────────────┐
                                    │Error:  │  │Create        │
                                    │Forgery │  │Payment Record│
                                    │        │  │              │
                                    │        │  │Update User:  │
                                    │        │  │- plan=PRO    │
                                    │        │  │- status=act. │
                                    │        │  │- dates set   │
                                    │        │  └──────┬───────┘
                                    │        │         │
                                    │        │         ▼
                                    │        │  ┌──────────────┐
                                    │        │  │Return Success│
                                    │        │  │Response      │
                                    │        │  └──────┬───────┘
                                    │        │         │
                                    ▼        │         ▼
                                ┌─────────┐ │  ┌────────────────┐
                                │Error    │ │  │Frontend:       │
                                │Response │ │  │Navigate to     │
                                └─────────┘ │  │/payment-success│
                                            │  │                │
                                            │  │Show:           │
                                            │  │- Celebration   │
                                            │  │- Plan details  │
                                            │  │- Receipt ID    │
                                            │  │- Features      │
                                            │  └────────────────┘
                                            │
                                            └──────────────────┘
```

---

## 5️⃣ Enterprise WhatsApp Flow

```
┌──────────────────────────────────┐
│  User at Pricing Page             │
│  Click ENTERPRISE Card             │
└────────────────┬─────────────────┘
                 │
                 ▼
        ┌────────────────────────────┐
        │ Show Enterprise Plan Details│
        │ - All PRO features         │
        │ - 24/7 Support             │
        │ - Admin Dashboard          │
        │ - API Access               │
        │ - Custom Integrations      │
        └────────┬───────────────────┘
                 │
                 ▼
        ┌────────────────────────────┐
        │ User Scroll Down            │
        │ See "Contact Sales" Options │
        └────────┬───────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
      Click           Click
   WhatsApp          Email
        │                 │
        ▼                 ▼
    ┌─────────────┐   ┌──────────┐
    │Open WhatsApp│   │Open Email│
    │with Message:│   │to:       │
    │"I want to   │   │entr..@.. │
    │access       │   │subject:  │
    │custom plan" │   │Enterprise│
    │             │   │Inquiry   │
    │Sends to:    │   └──────────┘
    │+91 98765... │
    └─────────────┘
         │
         ▼
    ┌──────────────┐
    │Sales Team    │
    │Responds with:│
    │- Custom Plan │
    │- Pricing     │
    │- Timeline    │
    │- Onboarding  │
    └──────────────┘
```

---

## 6️⃣ Subscription Status Lifecycle

```
                    ┌─────────────────────┐
                    │ NEW USER (FREE PLAN) │
                    │ status: "active"    │
                    │ plan: "FREE"        │
                    │ startDate: now      │
                    │ endDate: null       │
                    └────────────┬────────┘
                                 │
                ┌────────────────┴────────────────┐
                │                                 │
         User Clicks            User Clicks
         "Upgrade"              "Cancel" (future)
                │                                 │
                ▼                                 ▼
        ┌──────────────┐              ┌──────────────────┐
        │Redirect to   │              │Update: plan=FREE │
        │Pricing Page  │              │status="cancelled"│
        │              │              │endDate: now      │
        │User Pays     │              │                  │
        │              │              │All quizzes stay  │
        │              │              │But can't create  │
        │              │              │new quizzes       │
        └────────┬─────┘              └──────────────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │Create Payment Record  │
        │status: "completed"    │
        │amount: 29900 paise    │
        │billingPeriod:         │
        │  startDate: now       │
        │  endDate: now + 30d   │
        └────────┬──────────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │Update User:          │
        │plan: "PRO"          │
        │status: "active"      │
        │startDate: now        │
        │endDate: now + 30d    │
        │quizzesCreated: reset │
        └────────┬──────────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │PRO USER (ACTIVE)     │
        │Unlimited Quizzes     │
        │Unlimited Participants│
        │Auto-Renew in 30 days │
        └────────┬──────────────┘
                 │
        ┌────────┴───────────┐
        │                    │
    Day 25          Day 30 (Subscription expires)
        │                    │
   User              Auto-Renewal
   Upgrades to       Attempts
   ENTERPRISE   (Check: Still subscribed?)
        │                    │
        ▼            ┌───────┴──────┐
   ┌──────────┐      │              │
   │Contact   │  Success      Failed
   │Sales     │      │              │
   │Team      │      ▼              ▼
   │for       │  ┌─────────┐   ┌──────────┐
   │Custom    │  │Renewed  │   │Expired   │
   │Plan      │  │for 30d+ │   │          │
   │          │  │more     │   │Downgrade│
   │          │  └─────────┘   │to FREE   │
   └──────────┘                 └──────────┘
```

---

## 7️⃣ Error Handling Flow

```
┌─────────────────────────────────────┐
│ User Action Triggers Limit Check     │
│ (Create Quiz OR Join Game)           │
└────────────────┬────────────────────┘
                 │
                 ▼
        ┌─────────────────────────┐
        │ Send Request to Server   │
        └────────┬────────────────┘
                 │
                 ▼
        ┌──────────────────────────────┐
        │ Server Processes Request      │
        │ - Validates                  │
        │ - Checks Plan/Limits         │
        └────────┬─────────────────────┘
                 │
          ┌──────┴────────────────┐
          │                       │
       SUCCESS               ERROR/LIMIT
          │                       │
          ▼                       ▼
     ┌─────────┐        ┌──────────────────┐
     │Send OK   │        │Send Error JSON:  │
     │Response  │        │{                 │
     │          │        │  success: false  │
     │          │        │  code: "XXX_..." │
     │          │        │  message: "text" │
     │          │        │  maxLimit: 5     │
     │          │        │  currentCount: 5 │
     │          │        │  suggestedPlan   │
     │          │        │}                 │
     └────┬─────┘        └────────┬─────────┘
          │                       │
          ▼                       ▼
     ┌──────────┐        ┌──────────────────┐
     │Frontend  │        │Frontend: Check   │
     │Proceeds  │        │Response Code     │
     │with Flow │        └────────┬─────────┘
     └──────────┘                 │
                          ┌───────┴─────────┐
                          │                 │
                  QUIZ_LIMIT_   PARTICIPANT
                  EXCEEDED       LIMIT_EXC
                          │                 │
                          ▼                 ▼
                  ┌──────────────────┐ ┌─────────────┐
                  │Show UpgradeModal │ │Show          │
                  │reason:           │ │UpgradeModal │
                  │"quiz_limit"      │ │reason: "part_│
                  │                  │ │limit"        │
                  │- Show limits     │ │              │
                  │- Show PRO price  │ │- Show limits │
                  │- "Upgrade" btn   │ │- Show price  │
                  └────────┬─────────┘ └────┬─────────┘
                           │                │
                           └────────┬───────┘
                                    │
                                    ▼
                           ┌──────────────────┐
                           │User Options:     │
                           │                  │
                           │[Upgrade Now]     │
                           │[Maybe Later]     │
                           │[Close]           │
                           └────────┬─────────┘
                                    │
                    ┌───────────────┼─────────────┐
                    │               │             │
                Click          Click          Click
                Upgrade        Later          Close
                    │               │             │
                    ▼               ▼             ▼
                Navigate      Dismiss       Dismiss
                to /pricing   Modal        Modal
                              & Stay       & Stay
                              on Page      on Page
```

---

## Summary of Key Endpoints

```
Frontend Actions                Backend Endpoints
───────────────────────────────────────────────────────────

1. Click "Upgrade"          → POST /api/payment/create-order
   ├─ Response: Razorpay checkout details
   └─ Razorpay Modal Opens

2. Payment Success          → POST /api/payment/verify-payment
   ├─ Verify signature
   ├─ Create Payment record
   ├─ Update User plan
   └─ Response: Success + User data

3. Check Subscription       → GET /api/payment/subscription
   ├─ Fetch user's current plan
   └─ Return subscription details

4. View Payment History     → GET /api/payment/history
   ├─ Fetch all user payments
   └─ Return payment list

5. Upgrade to Higher Plan   → POST /api/payment/upgrade
   ├─ Validate new plan is higher
   ├─ Create new order
   └─ Proceed with payment

6. Cancel Subscription      → POST /api/payment/cancel
   ├─ Update user plan to FREE
   └─ Set subscription as cancelled
```

---

**End of Flow Diagrams**
