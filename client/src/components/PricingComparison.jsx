import React from 'react';
import { motion } from 'framer-motion';
import PlanComparisonTable from './PlanComparisonTable';

export default function PricingComparison() {
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
        <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[var(--text-heading)] tracking-tight">
          Detailed Plan Comparison
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-[var(--text-muted)] max-w-md mx-auto">
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
          <PlanComparisonTable />
        </div>
      </motion.div>

    </section>
  );
}
