import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles } from 'lucide-react';

const comparisonRows = [
  { feature: 'Quiz Limit', free: '5 Quizzes', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Participant Limit', free: '20 Players', pro: 'Unlimited', enterprise: 'Custom Unlimited' },
  { feature: 'Real-Time Analytics', free: 'Basic', pro: 'Advanced PDF/CSV', enterprise: 'Custom BI Export' },
  { feature: 'Export Reports (PDF / CSV)', free: false, pro: true, enterprise: true },
  { feature: 'Question Bank Storage', free: false, pro: true, enterprise: true },
  { feature: 'Priority Support', free: false, pro: 'Priority Email', enterprise: '24/7 Dedicated Manager' },
  { feature: 'API & Webhook Access', free: false, pro: false, enterprise: true },
  { feature: 'Custom Branding & Logo', free: false, pro: true, enterprise: true },
  { feature: 'Dark & Light Mode', free: true, pro: true, enterprise: true },
  { feature: 'Custom Domain Integration', free: false, pro: false, enterprise: true },
  { feature: 'Institution Admin Dashboard', free: false, pro: false, enterprise: true },
];

export default function ComparisonTableSection() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 overflow-hidden">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <span className="rounded-full bg-secondary/10 border border-secondary/20 px-4 py-1.5 text-xs font-bold text-secondary uppercase tracking-wider">
          Feature Breakdown
        </span>
        <h2 className="font-outfit text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
          Detailed <span className="text-gradient-primary">Plan Comparison</span>
        </h2>
        <p className="mt-3 text-sm text-gray-400 max-w-xl mx-auto">
          Compare features side-by-side to choose the best plan for your needs.
        </p>
      </motion.div>

      {/* Table Glass Container */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-5 font-outfit text-base font-extrabold text-white">Features</th>
                <th className="p-5 font-outfit text-base font-extrabold text-white text-center w-1/4">
                  Free
                </th>
                <th className="p-5 font-outfit text-base font-extrabold text-primary text-center w-1/4 bg-primary/10">
                  <div className="flex items-center justify-center gap-1">
                    <Sparkles className="h-4 w-4 text-secondary" />
                    <span>Pro</span>
                  </div>
                </th>
                <th className="p-5 font-outfit text-base font-extrabold text-secondary text-center w-1/4">
                  Enterprise
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs sm:text-sm font-semibold">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-gray-200">{row.feature}</td>
                  
                  {/* Free Col */}
                  <td className="p-4 sm:p-5 text-center text-gray-300">
                    {typeof row.free === 'boolean' ? (
                      row.free ? (
                        <Check className="h-5 w-5 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-gray-600 mx-auto" />
                      )
                    ) : (
                      row.free
                    )}
                  </td>

                  {/* Pro Col */}
                  <td className="p-4 sm:p-5 text-center text-white font-extrabold bg-primary/5">
                    {typeof row.pro === 'boolean' ? (
                      row.pro ? (
                        <Check className="h-5 w-5 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-gray-600 mx-auto" />
                      )
                    ) : (
                      row.pro
                    )}
                  </td>

                  {/* Enterprise Col */}
                  <td className="p-4 sm:p-5 text-center text-gray-200">
                    {typeof row.enterprise === 'boolean' ? (
                      row.enterprise ? (
                        <Check className="h-5 w-5 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-gray-600 mx-auto" />
                      )
                    ) : (
                      row.enterprise
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
