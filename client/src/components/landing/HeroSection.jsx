import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, Plus, Sparkles, Radio, Users, Trophy, BarChart3, Clock, Zap, CheckCircle2, ArrowRight
} from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
      {/* Background glow & particles */}
      <div className="absolute top-[-15%] left-[20%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[15%] h-[600px] w-[600px] rounded-full bg-secondary/15 blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-10%] h-[400px] w-[400px] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />

      {/* Grid ambient background pattern */}
      <div className="absolute inset-0 ambient-grid pointer-events-none opacity-40" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <motion.div
          animate={{ y: [0, -35, 0], x: [0, 20, 0], rotate: [0, 360] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[15%] right-[12%] h-14 w-14 border border-primary/30 rounded-2xl bg-primary/5 backdrop-blur-sm"
        />
        <motion.div
          animate={{ y: [0, 45, 0], x: [0, -25, 0], rotate: [360, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[25%] left-[8%] h-16 w-16 border border-secondary/30 rounded-full bg-secondary/5 backdrop-blur-sm"
        />
        <motion.div
          animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[45%] left-[48%] h-3.5 w-3.5 bg-accent rounded-full blur-[2px]"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Hero Text Column */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-6">
            
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
              className="font-outfit text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]"
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
              className="text-sm sm:text-base lg:text-lg text-gray-300 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Create engaging quizzes, invite players instantly, compete live, track performance, and make learning fun.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link
                to="/register"
                className="btn-premium btn-primary-gradient px-8 py-4 flex items-center justify-center gap-2.5 text-base font-extrabold text-white shadow-premium-glow hover:scale-105 active:scale-95 transition-all w-full sm:w-auto rounded-2xl"
              >
                <span>Start Free</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#live-demo"
                className="btn-premium btn-secondary-gradient px-8 py-4 flex items-center justify-center gap-2.5 text-base font-extrabold text-white shadow-secondary-glow hover:scale-105 active:scale-95 transition-all w-full sm:w-auto rounded-2xl"
              >
                <Play className="h-4 w-4 fill-current text-secondary" />
                <span>Watch Demo</span>
              </a>
            </motion.div>

            {/* Feature Checklist */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-gray-400 font-semibold pt-2"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Up to 1,000+ Live Players</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Instant QR Join</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Floating Dashboard Mockup */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mx-auto max-w-lg lg:max-w-none"
            >
              {/* Main Window Frame */}
              <div className="glass-panel rounded-3xl border border-white/10 p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative z-10 overflow-hidden bg-gradient-to-b from-white/10 via-black/40 to-black/80">
                
                {/* Header bar mock */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="h-3 w-3 rounded-full bg-green-500/80 inline-block" />
                    <span className="ml-2 text-xs font-mono text-gray-400">quizforge.app/live-arena</span>
                  </div>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-black text-emerald-400 uppercase tracking-wider">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    Live Match
                  </span>
                </div>

                {/* Main Preview Content */}
                <div className="space-y-4">
                  {/* Quiz Title & Status */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-primary">Active Question 04/10</span>
                      <h4 className="text-base font-extrabold text-white">Quantum Physics & Relativity Trivia</h4>
                    </div>
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/20 border border-primary/30 text-primary font-black text-xs">
                      12s
                    </div>
                  </div>

                  {/* Options Mock */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-white text-xs font-bold flex items-center gap-2">
                      <span className="h-4 w-4 rounded bg-red-500 flex items-center justify-center text-[10px]">▲</span>
                      <span>Speed of Light</span>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-500/15 border border-blue-500/30 text-white text-xs font-bold flex items-center gap-2">
                      <span className="h-4 w-4 rounded bg-blue-500 flex items-center justify-center text-[10px]">◆</span>
                      <span>Planck Constant</span>
                    </div>
                    <div className="p-3 rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-white text-xs font-bold flex items-center gap-2">
                      <span className="h-4 w-4 rounded bg-yellow-500 flex items-center justify-center text-[10px]">●</span>
                      <span>Gravitational Wave</span>
                    </div>
                    <div className="p-3 rounded-xl bg-green-500/15 border border-green-500/30 text-white text-xs font-bold flex items-center gap-2">
                      <span className="h-4 w-4 rounded bg-green-500 flex items-center justify-center text-[10px]">■</span>
                      <span>Mass-Energy Equivalence</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Floating Card 1: Live Quiz */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -left-6 z-20 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl glass-panel border border-primary/30 bg-black/80 shadow-2xl"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                  <Radio className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Live Quiz</div>
                  <div className="text-xs font-black text-white">Quantum Physics</div>
                </div>
              </motion.div>

              {/* Floating Card 2: Participants */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-6 -left-4 z-20 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl glass-panel border border-secondary/30 bg-black/80 shadow-2xl"
              >
                <div className="h-10 w-10 rounded-xl bg-secondary/20 border border-secondary/40 flex items-center justify-center text-secondary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Participants</div>
                  <div className="text-xs font-black text-white">142 Live Players</div>
                </div>
              </motion.div>

              {/* Floating Card 3: Leaderboard */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -top-4 -right-6 z-20 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl glass-panel border border-yellow-500/30 bg-black/80 shadow-2xl"
              >
                <div className="h-10 w-10 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Leaderboard</div>
                  <div className="text-xs font-black text-yellow-400">#1 Alex • 12,450 pts</div>
                </div>
              </motion.div>

              {/* Floating Card 4: Analytics */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                className="absolute -bottom-8 -right-4 z-20 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl glass-panel border border-emerald-500/30 bg-black/80 shadow-2xl"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Analytics</div>
                  <div className="text-xs font-black text-white">94% Accuracy Rate</div>
                </div>
              </motion.div>

              {/* Floating Card 5: Countdown Timer */}
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[45%] -right-8 z-30 hidden sm:flex items-center gap-2.5 p-3 rounded-2xl glass-panel border border-accent/40 bg-black/90 shadow-2xl"
              >
                <div className="h-8 w-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
                  <Clock className="h-4 w-4 animate-spin" />
                </div>
                <span className="text-xs font-black text-accent pr-1">08s Left</span>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
