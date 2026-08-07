import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const comparisonRows = [
  { feature: 'Quiz Limit', free: '5 Quizzes', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Participant Limit', free: '20 Players', pro: 'Unlimited', enterprise: 'Custom Unlimited' },
  { feature: 'Analytics & Export Reports', free: 'Basic', pro: 'Advanced PDF/CSV', enterprise: 'Custom BI Export' },
  { feature: 'Question Bank & Custom Branding', free: false, pro: true, enterprise: true },
  { feature: 'Support Level', free: false, pro: 'Priority Email', enterprise: '24/7 Dedicated Manager' },
  { feature: 'API & Institution Admin Dashboard', free: false, pro: false, enterprise: true },
];

export default function ComparisonTableSection() {
  return (
    <section className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      
      {/* Minimal Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-center mb-4"
      >
        <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Detailed Plan Comparison
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
          Compare features side-by-side to choose the best plan for your needs.
        </p>
      </motion.div>

      {/* Compact Table Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[540px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="py-3 px-5 font-outfit font-extrabold text-xs sm:text-sm text-white w-2/5">
                  Features
                </th>
                <th className="py-3 px-4 font-outfit font-extrabold text-xs sm:text-sm text-gray-300 text-center w-1/5">
                  Free
                </th>
                <th className="py-3 px-4 font-outfit font-extrabold text-xs sm:text-sm text-primary text-center w-1/5 bg-primary/10">
                  Pro
                </th>
                <th className="py-3 px-4 font-outfit font-extrabold text-xs sm:text-sm text-secondary text-center w-1/5">
                  Enterprise
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-xs">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3 px-5 font-semibold text-gray-200">
                    {row.feature}
                  </td>

                  {/* Free Column */}
                  <td className="py-3 px-4 text-center">
                    {typeof row.free === 'boolean' ? (
                      row.free ? (
                        <Check className="h-4 w-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-gray-600 mx-auto opacity-50" />
                      )
                    ) : (
                      <span className="font-medium text-gray-300">{row.free}</span>
                    )}
                  </td>

                  {/* Pro Column */}
                  <td className="py-3 px-4 text-center bg-primary/5 font-extrabold text-white">
                    {typeof row.pro === 'boolean' ? (
                      row.pro ? (
                        <Check className="h-4 w-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-gray-600 mx-auto opacity-50" />
                      )
                    ) : (
                      <span className="text-primary">{row.pro}</span>
                    )}
                  </td>

                  {/* Enterprise Column */}
                  <td className="py-3 px-4 text-center">
                    {typeof row.enterprise === 'boolean' ? (
                      row.enterprise ? (
                        <Check className="h-4 w-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-gray-600 mx-auto opacity-50" />
                      )
                    ) : (
                      <span className="font-extrabold text-secondary">{row.enterprise}</span>
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
