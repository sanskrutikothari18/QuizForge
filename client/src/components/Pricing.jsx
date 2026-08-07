import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { getPlans } from '../services/infoService';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'

  useEffect(() => {
    let isMounted = true;
    const fetchPlansData = async () => {
      setLoading(true);
      const data = await getPlans();
      if (isMounted) {
        setPlans(data);
        setLoading(false);
      }
    };
    fetchPlansData();
    return () => { isMounted = false; };
  }, []);

  return (
    <section id="pricing" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 sm:mb-16"
      >
        <span className="text-xs font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-3.5 py-1.5 rounded-full border border-accent/20">
          Flexible Pricing
        </span>
        <h2 className="font-outfit text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">
          Simple, Transparent <span className="text-gradient-primary">Plans</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Choose the plan that best fits your trivia needs. Upgrade or downgrade anytime with no hidden lock-ins.
        </p>

        {/* Monthly / Annual Billing Switch */}
        <div className="mt-8 inline-flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 rounded-2xl">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-primary text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingCycle === 'annual'
                ? 'bg-primary text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>Annual Billing</span>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full uppercase font-black">
              Save 20%
            </span>
          </button>
        </div>
      </motion.div>

      {/* Loading Skeleton State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-panel p-8 rounded-3xl animate-pulse space-y-4 border border-white/10">
              <div className="h-6 bg-white/10 rounded w-1/2" />
              <div className="h-10 bg-white/10 rounded w-3/4" />
              <div className="h-24 bg-white/5 rounded-2xl" />
              <div className="space-y-2 pt-4">
                <div className="h-4 bg-white/10 rounded w-full" />
                <div className="h-4 bg-white/10 rounded w-5/6" />
                <div className="h-4 bg-white/10 rounded w-4/6" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const calculatedPrice = billingCycle === 'annual' && plan.price > 0
              ? Math.round(plan.price * 0.8)
              : plan.price;

            const isHighlighted = plan.highlighted;

            return (
              <motion.div
                key={plan._id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`glass-panel rounded-3xl p-7 sm:p-8 flex flex-col justify-between relative transition-all duration-300 ${
                  isHighlighted
                    ? 'border-2 border-primary bg-gradient-to-b from-primary/15 to-background shadow-2xl shadow-primary/20 scale-[1.02]'
                    : 'border border-white/10 hover:border-white/20'
                }`}
              >
                {/* Popular Highlight Badge */}
                {isHighlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-purple-600 text-white text-[11px] font-extrabold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 fill-current" />
                    <span>Most Popular Choice</span>
                  </div>
                )}

                <div>
                  <h3 className="font-outfit font-extrabold text-white text-xl sm:text-2xl tracking-tight">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed min-h-[36px]">
                    {plan.description}
                  </p>

                  {/* Price Tag */}
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="font-outfit text-4xl sm:text-5xl font-black text-white">
                      ₹{calculatedPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      / {billingCycle === 'annual' ? 'month (billed yearly)' : 'month'}
                    </span>
                  </div>

                  <div className="my-6 border-t border-white/10" />

                  {/* Feature Checklist */}
                  <ul className="space-y-3 text-left">
                    {plan.features?.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                        <div className={`mt-0.5 rounded-full p-0.5 shrink-0 ${
                          isHighlighted ? 'bg-primary text-white' : 'bg-white/10 text-emerald-400'
                        }`}>
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Action Button */}
                <div className="mt-8">
                  <Link
                    to="/login"
                    className="btn-premium btn-primary-gradient shadow-premium-glow text-white w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 group hover:scale-105"
                  >
                    <span>{plan.buttonText || 'Choose Plan'}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
