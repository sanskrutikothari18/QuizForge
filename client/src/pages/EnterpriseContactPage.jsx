import { useEffect } from 'react';
import { Phone, MessageSquare, Mail, Clock, Users, Building2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EnterpriseContactPage = () => {
    const navigate = useNavigate();

    const handleWhatsAppContact = () => {
        // Replace with your actual WhatsApp business number
        const phoneNumber = '+919876543210'; // E.g., +91 98765 43210
        const message = 'I want to access the custom plan for QuizForge. I am interested in learning more about enterprise solutions for my institution.';
        const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[+\s-()]/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleEmailContact = () => {
        window.location.href = 'mailto:enterprise@quizforge.com?subject=Enterprise Plan Inquiry&body=I am interested in QuizForge Enterprise plan for my institution.';
    };

    const enterpriseFeatures = [
        {
            title: 'Everything in Pro Plan',
            description: 'All unlimited features from our PRO plan included',
            icon: <Zap className="w-6 h-6" />
        },
        {
            title: 'Dedicated Support Manager',
            description: '24/7 support from a dedicated account manager',
            icon: <Users className="w-6 h-6" />
        },
        {
            title: 'Institution Admin Dashboard',
            description: 'Centralized management of all teachers and students',
            icon: <Building2 className="w-6 h-6" />
        },
        {
            title: 'Multi-Teacher Accounts',
            description: 'Manage multiple teachers within your institution',
            icon: <Users className="w-6 h-6" />
        },
        {
            title: 'Unlimited Team Workspace',
            description: 'Create unlimited workspace for your institution',
            icon: <Building2 className="w-6 h-6" />
        },
        {
            title: 'REST API & Webhooks',
            description: 'Full API access for custom integrations',
            icon: <MessageSquare className="w-6 h-6" />
        },
        {
            title: 'LMS Integration',
            description: 'Seamless integration with popular LMS platforms',
            icon: <Building2 className="w-6 h-6" />
        },
        {
            title: 'Custom Solutions',
            description: 'Tailored solutions for your specific needs',
            icon: <Users className="w-6 h-6" />
        }
    ];

    const whyEnterpriseFeatures = [
        'Scale across multiple departments and campuses',
        'Reduce administrative overhead with centralized management',
        'Enhanced security and data privacy controls',
        'Priority bug fixes and feature development',
        'Training and onboarding support',
        'Regular performance optimization'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate('/pricing')}
                    className="text-slate-400 hover:text-white flex items-center gap-2 mb-8 transition-colors"
                >
                    ← Back to Pricing
                </button>

                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                        Enterprise Solutions
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                        Custom solutions tailored for universities, large educational institutions, and global enterprises.
                    </p>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 md:p-12 mb-12">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-4">
                                📞 Get in Touch
                            </h2>
                            <p className="text-slate-300 mb-6">
                                Our team will work with you to create a custom plan that fits your institution's needs. 
                            </p>
                            <p className="text-slate-400 mb-8">
                                Typical response time: Within 24 hours
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={handleWhatsAppContact}
                                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    <span>Chat on WhatsApp</span>
                                </button>
                                <button
                                    onClick={handleEmailContact}
                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <Mail className="w-5 h-5" />
                                    <span>Email Us</span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8">
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Phone className="w-5 h-5 text-emerald-500" />
                                        <h3 className="font-bold text-white">WhatsApp</h3>
                                    </div>
                                    <p className="text-slate-400">+91 98765 43210</p>
                                    <p className="text-sm text-slate-500 mt-1">Fastest way to reach us</p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Mail className="w-5 h-5 text-blue-500" />
                                        <h3 className="font-bold text-white">Email</h3>
                                    </div>
                                    <p className="text-slate-400">enterprise@quizforge.com</p>
                                    <p className="text-sm text-slate-500 mt-1">For detailed inquiries</p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Clock className="w-5 h-5 text-purple-500" />
                                        <h3 className="font-bold text-white">Business Hours</h3>
                                    </div>
                                    <p className="text-slate-400">Mon - Fri: 9:00 AM - 6:00 PM IST</p>
                                    <p className="text-sm text-slate-500 mt-1">24/7 emergency support available</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">
                        Enterprise Features
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {enterpriseFeatures.map((feature, idx) => (
                            <div
                                key={idx}
                                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all group"
                            >
                                <div className="text-amber-500 mb-3 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-sm text-slate-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Why Enterprise Section */}
                <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-700/30 rounded-2xl p-8 md:p-12 mb-12">
                    <h2 className="text-3xl font-bold text-white mb-8">Why Choose Enterprise?</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {whyEnterpriseFeatures.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-4">
                                <div className="w-6 h-6 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-sm font-bold text-white">✓</span>
                                </div>
                                <span className="text-slate-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pricing Comparison */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">
                        Plan Comparison
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                            <thead className="bg-slate-900/50 border-b border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-white font-bold">Feature</th>
                                    <th className="px-6 py-4 text-center text-white font-bold">FREE</th>
                                    <th className="px-6 py-4 text-center text-white font-bold">PRO</th>
                                    <th className="px-6 py-4 text-center text-white font-bold">ENTERPRISE</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {[
                                    { feature: 'Quizzes', free: '5', pro: '∞', enterprise: '∞' },
                                    { feature: 'Participants', free: '20', pro: '∞', enterprise: '∞' },
                                    { feature: 'Support Manager', free: '✗', pro: '✗', enterprise: '✓ 24/7' },
                                    { feature: 'Admin Dashboard', free: '✗', pro: '✗', enterprise: '✓' },
                                    { feature: 'API Access', free: '✗', pro: '✗', enterprise: '✓' },
                                    { feature: 'LMS Integration', free: '✗', pro: '✗', enterprise: '✓' }
                                ].map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 text-slate-300 font-semibold">{row.feature}</td>
                                        <td className="px-6 py-4 text-center text-slate-400">{row.free}</td>
                                        <td className="px-6 py-4 text-center text-slate-400">{row.pro}</td>
                                        <td className="px-6 py-4 text-center text-emerald-400 font-semibold">{row.enterprise}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-white mb-4">
                        Ready to Transform Your Institution?
                    </h3>
                    <p className="text-slate-400 mb-6">
                        Let's discuss how QuizForge Enterprise can revolutionize your educational platform.
                    </p>
                    <button
                        onClick={handleWhatsAppContact}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 inline-flex items-center gap-2"
                    >
                        <MessageSquare className="w-5 h-5" />
                        Start Your Enterprise Journey
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EnterpriseContactPage;
