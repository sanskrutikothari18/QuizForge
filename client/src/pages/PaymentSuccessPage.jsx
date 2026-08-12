import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const PaymentSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [copied, setCopied] = useState(false);

    const plan = location.state?.plan || 'PRO';
    const amount = location.state?.amount || 299;
    const status = location.state?.status || 'Active';
    const receiptId = `RCP_${Date.now()}`;

    useEffect(() => {
        // Trigger confetti animation
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, []);

    const handleCopyReceipt = () => {
        navigator.clipboard.writeText(receiptId);
        setCopied(true);
        toast.success('Receipt ID copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleGoToDashboard = () => {
        navigate('/dashboard');
    };

    const proFeatures = [
        'Unlimited quizzes',
        'Unlimited live participants',
        'Advanced real-time leaderboard',
        'Detailed score analytics',
        'Priority email support'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Success Card */}
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl backdrop-blur-sm p-8 md:p-12">
                    
                    {/* Checkmark Icon */}
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                                <CheckCircle className="w-14 h-14 text-white" strokeWidth={1.5} />
                            </div>
                            <div className="absolute inset-0 w-24 h-24 bg-emerald-500 rounded-full animate-ping opacity-20" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text mb-2">
                            Payment Successful!
                        </h1>
                        <p className="text-xl text-slate-300">
                            🎉 Welcome to QuizForge Pro!
                        </p>
                    </div>

                    {/* Subscription Details */}
                    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 mb-8">
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <p className="text-slate-400 text-sm mb-1">Plan</p>
                                <p className="text-2xl font-bold text-white">{plan}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm mb-1">Amount</p>
                                <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text">
                                    ₹{amount}/month
                                </p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm mb-1">Status</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                                    <p className="text-xl font-bold text-emerald-400">{status}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm mb-1">Receipt ID</p>
                                <div className="flex items-center gap-2">
                                    <p className="font-mono text-sm text-slate-300">{receiptId}</p>
                                    <button
                                        onClick={handleCopyReceipt}
                                        className="p-1 hover:bg-slate-700 rounded transition-colors"
                                        title="Copy receipt ID"
                                    >
                                        <Copy className={`w-4 h-4 ${copied ? 'text-emerald-500' : 'text-slate-400'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Valid Until */}
                        <div className="border-t border-slate-700 pt-4">
                            <p className="text-slate-400 text-sm mb-1">Auto-renews on</p>
                            <p className="text-slate-300">
                                {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Pro Features */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-white mb-4">You now have access to:</h3>
                        <div className="space-y-3">
                            {proFeatures.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" />
                                    <p className="text-slate-300">{feature}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleGoToDashboard}
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                    >
                        <span>Go to Dashboard</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    {/* Support Message */}
                    <p className="text-center text-slate-400 text-sm mt-6">
                        Questions? Check your email for the receipt and next steps.
                    </p>
                </div>

                {/* Benefits Card */}
                <div className="mt-8 bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">🚀 What's Next?</h3>
                    <ul className="space-y-2 text-slate-300">
                        <li>✓ Start creating unlimited quizzes</li>
                        <li>✓ Host games with unlimited participants</li>
                        <li>✓ Access detailed analytics and insights</li>
                        <li>✓ Get priority support from our team</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
