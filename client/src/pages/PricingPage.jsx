import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Zap, Users, BarChart3, Lock, Headphones } from 'lucide-react';
import toast from 'react-hot-toast';
import paymentAPI from '../api/paymentAPI';
import { useAuth } from '../context/AuthContext';

const PricingPage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [currentPlan, setCurrentPlan] = useState('FREE');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated && user) {
            setCurrentPlan(user.plan || 'FREE');
        }
    }, [isAuthenticated, user]);

    const handleUpgradeToPro = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to upgrade');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const response = await paymentAPI.createPaymentOrder('PRO');
            
            // Initialize Razorpay
            const options = {
                key: response.key,
                amount: response.amount,
                currency: response.currency,
                order_id: response.orderId,
                name: 'QuizForge Pro',
                description: 'Pro Plan - ₹299/month',
                image: '/logo.png',
                prefill: {
                    name: response.userName,
                    email: response.userEmail
                },
                handler: async (paymentResult) => {
                    try {
                        // Verify payment on backend
                        await paymentAPI.verifyPayment({
                            razorpayOrderId: response.orderId,
                            razorpayPaymentId: paymentResult.razorpay_payment_id,
                            razorpaySignature: paymentResult.razorpay_signature,
                            plan: 'PRO'
                        });

                        toast.success('🎉 Welcome to QuizForge Pro!');
                        navigate('/payment-success', { 
                            state: { 
                                plan: 'PRO',
                                amount: 299,
                                status: 'Active'
                            } 
                        });
                    } catch (error) {
                        toast.error('Payment verification failed');
                        console.error('Payment verification error:', error);
                    }
                },
                theme: {
                    color: '#3b82f6'
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            toast.error('Failed to initiate payment');
            console.error('Payment error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnterpriseContact = () => {
        // Open WhatsApp with pre-filled message
        const phoneNumber = '+919876543210'; // Replace with your WhatsApp number
        const message = 'I want to access the custom plan for QuizForge';
        const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const plans = [
        {
            name: 'FREE',
            price: '₹0',
            period: '/forever',
            description: 'Perfect for beginners',
            color: 'from-blue-500 to-blue-600',
            features: [
                { icon: <Lock className="w-5 h-5" />, text: 'Create up to 5 quizzes' },
                { icon: <Users className="w-5 h-5" />, text: 'Up to 20 live participants' },
                { icon: <BarChart3 className="w-5 h-5" />, text: 'Basic real-time leaderboard' },
                { icon: <BarChart3 className="w-5 h-5" />, text: 'Basic score analytics' },
                { icon: <Check className="w-5 h-5 opacity-50" />, text: 'Email support', disabled: true }
            ],
            buttonText: currentPlan === 'FREE' ? '✓ Current Plan' : 'Get Started',
            isCurrentPlan: currentPlan === 'FREE',
            action: null
        },
        {
            name: 'PRO',
            price: '₹299',
            period: '/month',
            description: 'For active educators',
            color: 'from-purple-500 to-purple-600',
            features: [
                { icon: <Zap className="w-5 h-5" />, text: 'Unlimited quizzes' },
                { icon: <Users className="w-5 h-5" />, text: 'Unlimited live participants' },
                { icon: <BarChart3 className="w-5 h-5" />, text: 'Advanced real-time leaderboard' },
                { icon: <BarChart3 className="w-5 h-5" />, text: 'Detailed score analytics & insights' },
                { icon: <Headphones className="w-5 h-5" />, text: 'Priority email support' }
            ],
            buttonText: currentPlan === 'PRO' ? '✓ Current Plan' : 'Upgrade Now',
            isCurrentPlan: currentPlan === 'PRO',
            action: currentPlan !== 'PRO' ? handleUpgradeToPro : null,
            highlighted: true
        },
        {
            name: 'ENTERPRISE',
            price: 'Custom',
            period: '/tailored plan',
            description: 'For universities & institutions',
            color: 'from-amber-500 to-amber-600',
            features: [
                { icon: <Zap className="w-5 h-5" />, text: 'Everything in Pro Plan' },
                { icon: <Users className="w-5 h-5" />, text: 'Dedicated 24/7 Support manager' },
                { icon: <Lock className="w-5 h-5" />, text: 'Institution Admin Dashboard' },
                { icon: <Users className="w-5 h-5" />, text: 'Multi-teacher account management' },
                { icon: <Zap className="w-5 h-5" />, text: 'Unlimited team workspace' },
                { icon: <Lock className="w-5 h-5" />, text: 'REST API Access & Webhooks' },
                { icon: <Headphones className="w-5 h-5" />, text: 'Custom LMS Integrations' }
            ],
            buttonText: 'Contact Sales',
            isCurrentPlan: currentPlan === 'ENTERPRISE',
            action: handleEnterpriseContact
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Simple, Transparent Pricing
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                    Choose the perfect plan for your teaching needs. Upgrade anytime.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 mb-12">
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className={`relative rounded-2xl backdrop-blur-sm transition-all duration-300 ${
                            plan.highlighted 
                                ? 'ring-2 ring-purple-500 transform md:scale-105 shadow-2xl' 
                                : 'border border-slate-700 hover:border-slate-600'
                        } ${plan.isCurrentPlan ? 'bg-slate-800/50' : 'bg-slate-800/30'}`}
                    >
                        {/* Badge */}
                        {plan.highlighted && (
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                    Most Popular
                                </span>
                            </div>
                        )}

                        {plan.isCurrentPlan && !plan.highlighted && (
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                    Current Plan
                                </span>
                            </div>
                        )}

                        <div className="p-8">
                            {/* Plan Name */}
                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <p className="text-slate-400 text-sm mb-6">{plan.description}</p>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-baseline">
                                    <span className={`text-4xl font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                                        {plan.price}
                                    </span>
                                    <span className="text-slate-400 ml-2">{plan.period}</span>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <button
                                onClick={plan.action}
                                disabled={plan.isCurrentPlan || loading}
                                className={`w-full py-3 px-4 rounded-lg font-semibold mb-8 flex items-center justify-center gap-2 transition-all ${
                                    plan.isCurrentPlan
                                        ? 'bg-slate-700 text-slate-300 cursor-default'
                                        : `bg-gradient-to-r ${plan.color} text-white hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`
                                }`}
                            >
                                {loading && plan.action ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        {plan.buttonText}
                                        {!plan.isCurrentPlan && <ArrowRight className="w-4 h-4" />}
                                    </>
                                )}
                            </button>

                            {/* Features */}
                            <div className="space-y-4">
                                {plan.features.map((feature, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-3"
                                    >
                                        <div className={`mt-1 flex-shrink-0 ${feature.disabled ? 'text-slate-600' : 'text-emerald-500'}`}>
                                            {feature.icon}
                                        </div>
                                        <span className={`text-sm ${feature.disabled ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                                            {feature.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto mt-16">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {[
                        {
                            q: 'Can I switch between plans?',
                            a: 'Yes! You can upgrade or downgrade your plan anytime. Changes take effect immediately.'
                        },
                        {
                            q: 'Is there a free trial?',
                            a: 'Yes, you get FREE plan forever with up to 5 quizzes and 20 participants.'
                        },
                        {
                            q: 'What payment methods do you accept?',
                            a: 'We accept UPI (PhonePe, Google Pay), Credit/Debit Cards, Net Banking, and Digital Wallets through Razorpay.'
                        },
                        {
                            q: 'Can I get a refund?',
                            a: 'Yes, we offer a 7-day money-back guarantee if you\'re not satisfied.'
                        }
                    ].map((faq, idx) => (
                        <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                            <p className="text-slate-400">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Script for Razorpay */}
            <script src="https://checkout.razorpay.com/v1/checkout.js" />
        </div>
    );
};

export default PricingPage;
