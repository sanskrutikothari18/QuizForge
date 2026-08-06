import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden">
      
      {/* Container Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-panel rounded-3xl border-2 border-primary/40 p-8 sm:p-14 text-center relative overflow-hidden bg-gradient-to-br from-primary/30 via-black/90 to-secondary/30 shadow-2xl"
      >
        {/* Glow Spheres */}
        <div className="absolute top-[-50%] left-[-20%] h-[450px] w-[450px] rounded-full bg-primary/30 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-50%] right-[-20%] h-[450px] w-[450px] rounded-full bg-secondary/30 blur-[130px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-extrabold text-white uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span>Join 5,000+ Active Players Today</span>
          </span>

          <h2 className="font-outfit text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Ready to Make Learning <br className="hidden sm:inline" />
            <span className="text-gradient-primary">Interactive & Fun?</span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-gray-300 font-medium max-w-xl mx-auto leading-relaxed">
            Create your first quiz in minutes or join an active live game session instantly. Zero setup required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="btn-premium btn-primary-gradient px-9 py-4 rounded-2xl text-base font-extrabold text-white shadow-premium-glow hover:scale-105 transition-all w-full sm:w-auto flex items-center justify-center gap-2.5"
            >
              <span>Start Free</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <a
              href="#pricing"
              className="btn-premium border border-white/20 hover:border-white/40 text-white px-9 py-4 rounded-2xl text-base font-extrabold hover:bg-white/10 transition-all w-full sm:w-auto flex items-center justify-center gap-2.5"
            >
              <span>View Pricing</span>
            </a>
          </div>
        </div>

      </motion.div>

    </section>
  );
}
