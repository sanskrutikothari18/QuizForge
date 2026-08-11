import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Sparkles, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="hero" className="relative flex items-center justify-center pt-8 pb-8 sm:pt-12 sm:pb-12 overflow-hidden">
      {/* Background glow & particles */}
      <div className="absolute top-[-15%] left-[20%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[15%] h-[600px] w-[600px] rounded-full bg-secondary/15 blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-10%] h-[400px] w-[400px] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />

      {/* Grid ambient background pattern */}
      <div className="absolute inset-0 ambient-grid pointer-events-none opacity-40" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 z-10 w-full text-center space-y-6">
        
        {/* Promo Pill */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/25 px-4 py-1.5 text-xs font-bold text-primary hover:bg-primary/15 transition-all shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-secondary animate-pulse" />
          <span>Next-Gen Multiplayer Quiz Platform</span>
          <span className="bg-primary/20 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase text-white">v2.0</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-outfit text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]"
        >
          Create, Host & Play <br className="hidden sm:inline" />
          <span className="text-gradient-primary">Interactive Quizzes</span> <br className="hidden sm:inline" />
          in Real-Time
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-base lg:text-lg text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto"
        >
          Create engaging quizzes, invite players instantly, compete live, track performance, and make learning fun.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link
            to="/register"
            className="btn-premium btn-primary-gradient px-8 py-4 flex items-center justify-center gap-2.5 text-base font-extrabold text-white shadow-premium-glow hover:scale-105 active:scale-95 transition-all w-full sm:w-auto rounded-2xl"
          >
            <span>Create Quiz</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/join"
            className="btn-premium btn-secondary-gradient px-8 py-4 flex items-center justify-center gap-2.5 text-base font-extrabold text-white shadow-secondary-glow hover:scale-105 active:scale-95 transition-all w-full sm:w-auto rounded-2xl"
          >
            <Play className="h-4 w-4 fill-current text-secondary" />
            <span>Join Game</span>
          </Link>
        </motion.div>

        {/* Requested Stats Bar Below Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          <div className="flex flex-col items-center">
            <span className="font-outfit text-2xl sm:text-3xl font-black text-white">250+</span>
            <span className="text-xs text-gray-400 font-semibold mt-1">Total Quizzes Hosted</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-outfit text-2xl sm:text-3xl font-black text-primary">1M+</span>
            <span className="text-xs text-gray-400 font-semibold mt-1">Active Battle Players</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-outfit text-2xl sm:text-3xl font-black text-secondary">12,50+</span>
            <span className="text-xs text-gray-400 font-semibold mt-1">Classrooms Connected</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-outfit text-2xl sm:text-3xl font-black text-accent">94.2%</span>
            <span className="text-xs text-gray-400 font-semibold mt-1">Response Accuracy</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
