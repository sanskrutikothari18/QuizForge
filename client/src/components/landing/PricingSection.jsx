import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Zap, Shield, ArrowRight, X } from 'lucide-react';
import PlanComparisonTable from '../PlanComparisonTable';

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const [showPlanDetails, setShowPlanDetails] = useState(false);

  // Close modal with Escape key and lock body scroll while open
  useEffect(() => {
    if (!showPlanDetails) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowPlanDetails(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [showPlanDetails]);

  return (
    <section id="pricing" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 scroll-mt-20">
      
      {/* Background glow spheres */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[550px] w-[550px] rounded-full bg-primary/15 blur-[150px] pointer-events-none" />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <span className="rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-wider">
          Flexible Pricing
        </span>
        <h2 className="font-outfit text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight">
          Simple, Transparent <span className="text-gradient-primary">Plans for Everyone</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
          Start for free with basic features or upgrade to unlock unlimited live players, advanced analytics, and custom branding.
        </p>

        {/* Monthly / Yearly Toggle Switch */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 max-w-full mx-auto p-1.5 rounded-full glass-panel border border-white/10">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-5 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              !isYearly ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
              isYearly ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>Yearly Billing</span>
            <span className="bg-emerald-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
              Save 20%
            </span>
          </button>
          <button
            onClick={() => setShowPlanDetails(true)}
            className="px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap text-gray-300 hover:text-white border border-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            Plan Details
          </button>
        </div>
      </motion.div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">

        {/* FREE PLAN */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="glass-panel glass-panel-hover rounded-3xl p-8 border border-white/10 flex flex-col h-full justify-between relative group text-left"
        >
          <div>
            <div className="flex justify-between items-center mb-4 gap-2">
              <h3 className="font-outfit text-xl font-extrabold text-white whitespace-nowrap">FREE</h3>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10 whitespace-nowrap shrink-0">
                Starter
              </span>
            </div>

            {/* Fixed-height price row keeps dividers aligned across all cards */}
            <div className="mb-6 min-h-[3.5rem]">
              <div className="flex flex-wrap items-end gap-x-2">
                <span className="font-outfit text-4xl sm:text-5xl font-black text-white">₹0</span>
                <span className="text-xs text-gray-400 font-semibold">/ forever free</span>
              </div>
            </div>

            {/* Fixed-height description block keeps feature lists aligned */}
            <p className="text-xs text-gray-400 mb-6 leading-relaxed break-words min-h-[2.5rem]">
              Perfect for students and casual trivia hosts getting started with live quiz battles.
            </p>

            <div className="space-y-3 border-t border-white/10 pt-6 flex-1">
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-200">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Create up to 5 quizzes</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-200">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Up to 20 live participants</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-200">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Basic real-time leaderboard</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-200">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Basic score analytics</span>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-auto">
            <Link
              to="/register"
              className="btn-premium btn-primary-gradient w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-extrabold text-white shadow-premium-glow hover:scale-105 transition-all whitespace-nowrap"
            >
              <span>Start Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* PRO PLAN (MOST POPULAR) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-panel glass-panel-hover rounded-3xl p-8 border-2 border-primary/50 flex flex-col h-full justify-between relative group text-left bg-gradient-to-b from-primary/20 via-black/80 to-black shadow-2xl shadow-primary/20 lg:scale-105 scale-100 z-10 lg:my-0 my-4"
        >
          {/* Ribbon Badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white text-[11px] font-black uppercase px-4 py-1 rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span className="whitespace-nowrap">Most Popular</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4 mt-2 gap-2">
              <h3 className="font-outfit text-xl font-extrabold text-white whitespace-nowrap">PRO</h3>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 whitespace-nowrap shrink-0">
                Best Value
              </span>
            </div>

            {/* Fixed-height price row keeps dividers aligned across all cards.
                The yearly sub-line is absolutely positioned so billing toggle
                changes never shift the divider / feature list position. */}
            <div className="mb-6 min-h-[3.5rem] relative">
              <div className="flex flex-wrap items-end gap-x-2">
                <span className="font-outfit text-4xl sm:text-5xl font-black text-white">
                  {isYearly ? '₹239' : '₹299'}
                </span>
                <span className="text-xs text-gray-300 font-semibold">/ month</span>
              </div>
              {isYearly && (
                <span className="block text-[11px] text-emerald-400 font-bold mt-1">
                  Billed annually (Save ₹720/yr)
                </span>
              )}
            </div>

            {/* Fixed-height description block keeps feature lists aligned */}
            <p className="text-xs text-gray-300 mb-6 leading-relaxed break-words min-h-[2.5rem]">
              Designed for teachers, schools, corporate trainers, and high-frequency quizmasters.
            </p>

            <div className="space-y-3 border-t border-white/10 pt-6 flex-1">
              <div className="flex items-center gap-3 text-xs font-bold text-white">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Unlimited quizzes creation</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-white">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Unlimited live participants</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-white">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Advanced performance analytics</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-white">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Question Bank storage</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-white">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Dark & Light mode themes</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-white">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Priority email & chat support</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-white">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Custom logo & branding</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-white">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Export detailed PDF & CSV reports</span>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-auto">
            <Link
              to="/register"
              className="btn-premium btn-primary-gradient w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-extrabold text-white shadow-premium-glow hover:scale-105 transition-all whitespace-nowrap"
            >
              <span>Upgrade to Pro</span>
              <Zap className="h-4 w-4 fill-current text-secondary" />
            </Link>
          </div>
        </motion.div>

        {/* ENTERPRISE PLAN */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-panel glass-panel-hover rounded-3xl p-8 border border-white/10 flex flex-col h-full justify-between relative group text-left"
        >
          <div>
            <div className="flex justify-between items-center mb-4 gap-2">
              <h3 className="font-outfit text-xl font-extrabold text-white whitespace-nowrap">ENTERPRISE</h3>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 whitespace-nowrap shrink-0">
                Custom
              </span>
            </div>

            {/* Fixed-height price row keeps dividers aligned across all cards */}
            <div className="mb-6 min-h-[3.5rem] flex flex-wrap items-end gap-x-2">
              <span className="font-outfit text-3xl sm:text-4xl font-black text-white">Custom</span>
              <span className="text-xs text-gray-400 font-semibold">/ tailored plan</span>
            </div>

            {/* Fixed-height description block keeps feature lists aligned */}
            <p className="text-xs text-gray-400 mb-6 leading-relaxed break-words min-h-[2.5rem]">
              Custom solutions tailored for universities, large educational institutions, and global enterprises.
            </p>

            <div className="space-y-3 border-t border-white/10 pt-6 flex-1">
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-200">
                <Check className="h-4 w-4 text-secondary shrink-0" />
                <span>Everything in Pro Plan</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-200">
                <Check className="h-4 w-4 text-secondary shrink-0" />
                <span>Dedicated 24/7 Support manager</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-200">
                <Check className="h-4 w-4 text-secondary shrink-0" />
                <span>Institution Admin Dashboard</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-200">
                <Check className="h-4 w-4 text-secondary shrink-0" />
                <span>Multi-teacher account management</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-200">
                <Check className="h-4 w-4 text-secondary shrink-0" />
                <span>Unlimited team workspace</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-200">
                <Check className="h-4 w-4 text-secondary shrink-0" />
                <span>REST API Access & Webhooks</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-200">
                <Check className="h-4 w-4 text-secondary shrink-0" />
                <span>Custom LMS Integrations</span>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-auto">
            <a
              href="mailto:sales@fourisequizhub.com?subject=Enterprise%20Plan%20Inquiry"
              className="btn-premium btn-secondary-gradient text-white w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-extrabold shadow-secondary-glow transition-all whitespace-nowrap"
            >
              <span>Contact Sales</span>
              <Shield className="h-4 w-4" />
            </a>
          </div>
        </motion.div>

      </div>

      {/* Plan Details Modal */}
      <AnimatePresence>
        {showPlanDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowPlanDetails(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-[var(--card-bg)] backdrop-blur-xl">
                <div>
                  <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[var(--text-heading)]">
                    Detailed Plan Comparison
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-[var(--text-muted)]">
                    Compare features side-by-side to choose the best plan for your needs.
                  </p>
                </div>
                <button
                  onClick={() => setShowPlanDetails(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5 text-[var(--text-muted)] hover:text-[var(--text-heading)]" />
                </button>
              </div>

              {/* Comparison Table */}
              <div className="p-6">
                <div className="overflow-x-auto scrollbar-thin">
                  <PlanComparisonTable />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/10 bg-[var(--glass-panel-bg)]">
                <p className="text-center text-xs text-[var(--text-muted)]">
                  Need help choosing? <Link to="/contact" className="text-primary hover:underline">Contact our sales team</Link>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
