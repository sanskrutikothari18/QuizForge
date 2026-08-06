import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles } from 'lucide-react';

const comparisonMatrix = [
  { feature: 'Max Concurrent Live Players', starter: '50 Players', pro: '250 Players', enterprise: 'Unlimited' },
  { feature: 'Custom Quizzes & Questions', starter: true, pro: true, enterprise: true },
  { feature: 'Real-Time Leaderboard', starter: true, pro: true, enterprise: true },
  { feature: 'QR Code Quick Join', starter: true, pro: true, enterprise: true },
  { feature: 'PDF Analytics Reports', starter: 'Basic', pro: 'Detailed', enterprise: 'Custom Branding' },
  { feature: 'CSV & Excel Raw Exports', starter: false, pro: true, enterprise: true },
  { feature: 'Custom Background Pickers', starter: false, pro: true, enterprise: true },
  { feature: 'Dedicated Server Socket Cluster', starter: false, pro: true, enterprise: true },
  { feature: 'Multi-Host Squad Accounts', starter: false, pro: false, enterprise: true },
  { feature: 'Custom Domain & SSO Integration', starter: false, pro: false, enterprise: true },
  { feature: '24/7 Dedicated Support', starter: false, pro: 'Priority Email', enterprise: '24/7 Phone & Slack' },
];

export default function PricingComparison() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h3 className="font-outfit text-2xl sm:text-4xl font-extrabold text-white">
          Compare <span className="text-gradient-primary">Plan Features</span>
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
          See a breakdown of what is included in each Quiz Hub subscription tier.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="py-4 px-6 font-outfit font-extrabold text-sm text-white w-2/5">
                  Plan Capabilities
                </th>
                <th className="py-4 px-4 font-outfit font-extrabold text-xs sm:text-sm text-gray-300 text-center w-1/5">
                  Starter Explorer
                </th>
                <th className="py-4 px-4 font-outfit font-extrabold text-xs sm:text-sm text-primary text-center w-1/5 bg-primary/10 border-x border-primary/20">
                  <div className="flex items-center justify-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> Pro Battles
                  </div>
                </th>
                <th className="py-4 px-4 font-outfit font-extrabold text-xs sm:text-sm text-secondary text-center w-1/5">
                  Enterprise Squad
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
              {comparisonMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-gray-200">
                    {row.feature}
                  </td>

                  {/* Starter Column */}
                  <td className="py-3.5 px-4 text-center">
                    {typeof row.starter === 'boolean' ? (
                      row.starter ? (
                        <Check className="h-4 w-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-gray-600 mx-auto" />
                      )
                    ) : (
                      <span className="font-medium text-gray-300">{row.starter}</span>
                    )}
                  </td>

                  {/* Pro Column */}
                  <td className="py-3.5 px-4 text-center bg-primary/5 border-x border-primary/15 font-bold text-white">
                    {typeof row.pro === 'boolean' ? (
                      row.pro ? (
                        <Check className="h-4 w-4 text-primary mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-gray-600 mx-auto" />
                      )
                    ) : (
                      <span className="text-primary">{row.pro}</span>
                    )}
                  </td>

                  {/* Enterprise Column */}
                  <td className="py-3.5 px-4 text-center">
                    {typeof row.enterprise === 'boolean' ? (
                      row.enterprise ? (
                        <Check className="h-4 w-4 text-secondary mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-gray-600 mx-auto" />
                      )
                    ) : (
                      <span className="font-bold text-secondary">{row.enterprise}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
}
