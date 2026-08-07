import React from 'react';
import { motion } from 'framer-motion';
import {
  LogIn, Gamepad2, Clock, Timer, ListOrdered, CheckCircle
} from 'lucide-react';

const steps = [
  {
    step: '01',
    num: 1,
    title: 'Sign Up / Login',
    desc: 'Create your account or log in to access the quiz dashboard.',
    icon: <LogIn className="h-6 w-6 text-indigo-400" />,
    gradient: 'from-indigo-600 via-indigo-500/20 to-transparent',
    accentColor: '#6366f1',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    variant: 'top', // Extended block at top
  },
  {
    step: '02',
    num: 2,
    title: 'Create or Join a Quiz',
    desc: 'Host a new quiz game or join an existing one with a game code.',
    icon: <Gamepad2 className="h-6 w-6 text-pink-400" />,
    gradient: 'from-transparent via-pink-500/20 to-pink-600',
    accentColor: '#ec4899',
    badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    variant: 'bottom', // Extended block at bottom
  },
  {
    step: '03',
    num: 3,
    title: 'Wait for Host to Start',
    desc: 'Relax in the waiting room until the host launches the session.',
    icon: <Clock className="h-6 w-6 text-cyan-400" />,
    gradient: 'from-cyan-600 via-cyan-500/20 to-transparent',
    accentColor: '#06b6d4',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    variant: 'top',
  },
  {
    step: '04',
    num: 4,
    title: 'Answer Before Time Ends',
    desc: 'Think fast and select the correct answer before the timer expires.',
    icon: <Timer className="h-6 w-6 text-emerald-400" />,
    gradient: 'from-transparent via-emerald-500/20 to-emerald-600',
    accentColor: '#10b981',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    variant: 'bottom',
  },
  {
    step: '05',
    num: 5,
    title: 'View Live Leaderboard',
    desc: 'See where you rank against other players after every question.',
    icon: <ListOrdered className="h-6 w-6 text-amber-400" />,
    gradient: 'from-amber-600 via-amber-500/20 to-transparent',
    accentColor: '#f59e0b',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    variant: 'top',
  },
  {
    step: '06',
    num: 6,
    title: 'Check Final Results',
    desc: 'Review your final score and detailed performance at the end.',
    icon: <CheckCircle className="h-6 w-6 text-fuchsia-400" />,
    gradient: 'from-transparent via-fuchsia-500/20 to-fuchsia-600',
    accentColor: '#d946ef',
    badgeBg: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
    variant: 'bottom',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 scroll-mt-20 overflow-hidden">
      
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8 sm:mb-10"
      >
        <span className="text-xs font-extrabold uppercase tracking-widest text-secondary bg-secondary/10 px-3.5 py-1.5 rounded-full border border-secondary/20 shadow-sm">
          Timeline Columns
        </span>
        <h2 className="font-outfit text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight">
          How It <span className="text-gradient-secondary">Works</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
          From sign-up to final results — get battle-ready in six simple steps.
        </p>
      </motion.div>

      {/* ============================================================== */}
      {/* DESKTOP VERTICAL COLUMNS TIMELINE (Matching Image Format)      */}
      {/* ============================================================== */}
      <div className="hidden lg:grid grid-cols-6 gap-2 sm:gap-3 items-stretch relative min-h-[480px]">
        
        {/* Continuous Horizontal Middle Numbering Band */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-24 bg-white/[0.03] border-y border-white/10 z-0 backdrop-blur-md" />

        {steps.map((item, idx) => {
          const isTop = item.variant === 'top';

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: isTop ? -30 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="relative z-10 flex flex-col justify-between rounded-3xl border border-white/10 overflow-hidden glass-panel hover:border-white/25 transition-all duration-300 group hover:-translate-y-1 text-center"
            >
              {/* TOP EXTENDED COLOR BLOCK */}
              <div className={`p-4 flex flex-col items-center justify-center transition-all ${
                isTop ? 'bg-white/10 border-b border-white/10 pt-6 pb-4' : 'pt-4'
              }`}>
                {isTop ? (
                  <div className="space-y-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${item.badgeBg}`}>
                      Step {item.step}
                    </span>
                    <h4 className="font-outfit font-extrabold text-white text-xs sm:text-sm leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 leading-tight">
                      {item.desc}
                    </p>
                  </div>
                ) : (
                  <div className="h-16" />
                )}
              </div>

              {/* CENTER NUMBERING & ICON BAND */}
              <div className="my-auto py-6 px-2 flex flex-col items-center justify-center relative bg-slate-900/80 border-y border-white/10 group-hover:bg-slate-900 transition-colors">
                <span className="font-outfit text-4xl sm:text-5xl font-black text-white/90 tracking-tighter group-hover:scale-110 transition-transform">
                  {item.step}
                </span>

                <div className="mt-3 h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg group-hover:border-white/30 transition-all">
                  {item.icon}
                </div>
              </div>

              {/* BOTTOM EXTENDED COLOR BLOCK */}
              <div className={`p-4 flex flex-col items-center justify-center transition-all ${
                !isTop ? 'bg-white/10 border-t border-white/10 pb-6 pt-4' : 'pb-4'
              }`}>
                {!isTop ? (
                  <div className="space-y-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${item.badgeBg}`}>
                      Step {item.step}
                    </span>
                    <h4 className="font-outfit font-extrabold text-white text-xs sm:text-sm leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 leading-tight">
                      {item.desc}
                    </p>
                  </div>
                ) : (
                  <div className="h-16" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* MOBILE & TABLET RESPONSIVE CARDS                               */}
      {/* ============================================================== */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        {steps.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className="glass-panel rounded-3xl p-5 border border-white/10 flex items-start gap-4 shadow-xl"
          >
            <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
              {item.icon}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${item.badgeBg}`}>
                  Step {item.step}
                </span>
                <h4 className="font-outfit font-extrabold text-white text-base">
                  {item.title}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
