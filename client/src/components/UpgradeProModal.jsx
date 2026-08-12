import { useNavigate } from 'react-router-dom';
import { Zap, Lock, Users, ArrowRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const UpgradeProModal = ({ onClose, reason = 'quiz_limit' }) => {
    const navigate = useNavigate();

    const reasons = {
        quiz_limit: {
            title: '🎯 Quiz Limit Reached!',
            description: 'You can create up to 5 quizzes on FREE plan. Upgrade to PRO for unlimited quizzes.',
            features: ['Unlimited quizzes', 'Unlimited participants', 'Advanced analytics'],
            cta: 'Upgrade to Pro Now'
        },
        participant_limit: {
            title: '👥 Participant Limit Reached!',
            description: 'Your game can host up to 20 participants on FREE plan. Upgrade to PRO for unlimited participants.',
            features: ['Host unlimited participants', 'Better performance', 'Advanced analytics'],
            cta: 'Upgrade to Pro Now'
        }
    };

    const selectedReason = reasons[reason] || reasons.quiz_limit;

    const handleUpgrade = () => {
        navigate('/pricing');
        if (onClose) onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 max-w-md w-full p-8 shadow-2xl">
                
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-white" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-white text-center mb-3">
                    {selectedReason.title}
                </h2>

                {/* Description */}
                <p className="text-slate-400 text-center mb-6">
                    {selectedReason.description}
                </p>

                {/* Features Preview */}
                <div className="bg-slate-800/50 rounded-lg p-4 mb-6 border border-slate-700">
                    <p className="text-sm font-semibold text-slate-300 mb-3">PRO Plan includes:</p>
                    <div className="space-y-2">
                        {selectedReason.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                <span className="text-sm text-slate-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price */}
                <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg p-4 mb-6">
                    <p className="text-slate-400 text-sm">Just</p>
                    <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text">
                        ₹299/month
                    </p>
                    <p className="text-slate-400 text-xs mt-1">Cancel anytime, 7-day money-back guarantee</p>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handleUpgrade}
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <span>{selectedReason.cta}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpgradeProModal;
