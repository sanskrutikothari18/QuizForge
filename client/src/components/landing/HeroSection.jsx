import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Sparkles, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="hero" className="relative flex items-center justify-center pt-6 pb-8 sm:pt-12 sm:pb-12 overflow-hidden px-3 sm:px-6">
      {/* Background glow & particles */}
      <div className="absolute top-[-15%] left-[20%] h-[350px] sm:h-[500px] w-[350px] sm:w-[500px] rounded-full bg-primary/20 blur-[100px] sm:blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[15%] h-[400px] sm:h-[600px] w-[400px] sm:w-[600px] rounded-full bg-secondary/15 blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-10%] h-[300px] sm:h-[400px] w-[300px] sm:w-[400px] rounded-full bg-accent/10 blur-[90px] sm:blur-[120px] pointer-events-none" />

      {/* Grid ambient background pattern */}
      <div className="absolute inset-0 ambient-grid pointer-events-none opacity-40" />

      <div className="relative mx-auto max-w-5xl px-2 sm:px-6 lg:px-8 z-10 w-full text-center space-y-5 sm:space-y-6">
        
        {/* Promo Pill */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex max-w-full items-center gap-1.5 sm:gap-2 rounded-full bg-primary/10 border border-primary/25 px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold text-primary hover:bg-primary/15 transition-all shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-secondary animate-pulse shrink-0" />
          <span className="truncate">Next-Gen Multiplayer Quiz Platform</span>
          <span className="bg-primary/20 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase shrink-0">v2.0</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-outfit text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] px-1"
          style={{ color: 'var(--text-heading)' }}
        >
          Create, Host & Play <br className="hidden xs:inline" />
          <span className="text-gradient-primary">Interactive Quizzes</span> <br className="hidden xs:inline" />
          in Real-Time
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xs sm:text-base lg:text-lg font-medium leading-relaxed max-w-2xl mx-auto px-2"
          style={{ color: 'var(--text-muted)' }}
        >
          Create engaging quizzes, invite players instantly, compete live, track performance, and make learning fun.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 w-full max-w-sm sm:max-w-none mx-auto"
        >
          <Link
            to="/register"
            className="btn-premium btn-primary-gradient px-6 sm:px-8 py-3.5 sm:py-4 flex items-center justify-center gap-2.5 text-sm sm:text-base font-extrabold text-white shadow-premium-glow hover:scale-105 active:scale-95 transition-all w-full sm:w-auto rounded-xl sm:rounded-2xl"
          >
            <span>Start Free</span>
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
          <a
            href="#how-it-works"
            className="btn-premium btn-secondary-gradient px-6 sm:px-8 py-3.5 sm:py-4 flex items-center justify-center gap-2.5 text-sm sm:text-base font-extrabold text-white shadow-secondary-glow hover:scale-105 active:scale-95 transition-all w-full sm:w-auto rounded-xl sm:rounded-2xl"
          >
            <Play className="h-4 w-4 fill-current text-secondary" />
            <span>See How It Works</span>
          </a>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 sm:mt-14 pt-6 sm:pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto"
        >
          <div className="flex flex-col items-center">
            <span className="font-outfit text-xl sm:text-3xl font-black" style={{ color: 'var(--text-heading)' }}>250+</span>
            <span className="text-[11px] sm:text-xs font-semibold mt-1" style={{ color: 'var(--text-muted)' }}>Total Quizzes Hosted</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-outfit text-xl sm:text-3xl font-black text-primary">1M+</span>
            <span className="text-[11px] sm:text-xs font-semibold mt-1" style={{ color: 'var(--text-muted)' }}>Active Battle Players</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-outfit text-xl sm:text-3xl font-black text-secondary">12,500+</span>
            <span className="text-[11px] sm:text-xs font-semibold mt-1" style={{ color: 'var(--text-muted)' }}>Classrooms Connected</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-outfit text-xl sm:text-3xl font-black text-accent">94.2%</span>
            <span className="text-[11px] sm:text-xs font-semibold mt-1" style={{ color: 'var(--text-muted)' }}>Response Accuracy</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
