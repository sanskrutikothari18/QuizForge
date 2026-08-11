import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 pt-8 pb-8 sm:px-6 sm:pt-12 sm:pb-12 lg:px-8 overflow-hidden">
      <div className="text-center relative z-10">

        {/* Live Promo Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/25 px-4 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition-all mb-8 shadow-sm cursor-pointer"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Version 2.0 Real-Time Multiplayer Engine</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-outfit text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15]"
        >
          Create Epic Quizzes.<br />
          <span className="text-gradient-primary">Battle In Real-Time.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-5 sm:mt-6 max-w-3xl text-base sm:text-lg lg:text-xl text-gray-300 font-medium px-2 sm:px-0 leading-relaxed"
        >
          The premier live multiplayer arena for classrooms, corporate squads, and trivia legends. Launch interactive battles, track rankings instantly, and analyze performance.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 px-4 sm:px-0"
        >
          <Link
            to="/register"
            className="btn-premium btn-primary-gradient px-8 py-4 flex items-center justify-center gap-2.5 group text-base font-extrabold shadow-premium-glow w-full sm:w-auto rounded-2xl"
          >
            <span>Create Quiz</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link
            to="/join"
            className="btn-premium btn-secondary-gradient px-8 py-4 flex items-center justify-center gap-2.5 text-base font-extrabold shadow-secondary-glow w-full sm:w-auto rounded-2xl"
          >
            <Play className="h-4 w-4 fill-current text-secondary" />
            <span>Join Game</span>
          </Link>
        </motion.div>

        {/* Key Metrics / Trust Bar */}
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
