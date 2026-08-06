import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, QrCode, Users, Gamepad2, Trophy, ArrowRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Create Quiz',
    icon: <PlusCircle className="h-6 w-6 text-primary" />,
    desc: 'Build custom questions with multiple choice options, images, and time limits in minutes.',
    badge: 'Host Action',
  },
  {
    step: '02',
    title: 'Share Game PIN',
    icon: <QrCode className="h-6 w-6 text-secondary" />,
    desc: 'Launch your lobby to generate a unique 6-digit Game PIN or display a scan-to-join QR code.',
    badge: 'Instant Share',
  },
  {
    step: '03',
    title: 'Students Join',
    icon: <Users className="h-6 w-6 text-accent" />,
    desc: 'Players enter the PIN on any device without creating an account or downloading an app.',
    badge: 'Zero Friction',
  },
  {
    step: '04',
    title: 'Play Live',
    icon: <Gamepad2 className="h-6 w-6 text-yellow-400" />,
    desc: 'Questions appear simultaneously on screen. Answer fast to claim maximum points.',
    badge: 'Live Action',
  },
  {
    step: '05',
    title: 'View Results',
    icon: <Trophy className="h-6 w-6 text-emerald-400" />,
    desc: 'Celebrate podium winners on the live leaderboard and download full performance analytics.',
    badge: 'Final Insights',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 scroll-mt-20">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[700px] rounded-full bg-primary/10 blur-[140px] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <span className="rounded-full bg-secondary/10 border border-secondary/20 px-4 py-1.5 text-xs font-bold text-secondary uppercase tracking-wider">
          Simple 5-Step Process
        </span>
        <h2 className="font-outfit text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight">
          How <span className="text-gradient-primary">QuizForge</span> Works
        </h2>
        <p className="mt-4 text-sm sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
          From quiz creation to podium glory — jump into battle in less than 60 seconds.
        </p>
      </motion.div>

      {/* 5-Step Horizontal Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">

        {/* Connecting Line across steps on desktop */}
        <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-primary via-secondary to-emerald-400 z-0 opacity-30" />

        {steps.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="glass-panel glass-panel-hover rounded-2xl p-5 border border-white/10 flex flex-col justify-between relative z-10 group text-left"
          >
            <div>
              {/* Step number badge & Icon */}
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="font-outfit text-2xl font-black text-white/30 group-hover:text-primary transition-colors">
                  {item.step}
                </span>
              </div>

              <span className="text-[10px] font-extrabold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mb-2">
                {item.badge}
              </span>

              <h3 className="font-outfit text-base font-extrabold text-white mb-2">
                {item.title}
              </h3>

              <p className="text-xs text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </div>

            {/* Mobile arrow indicator */}
            {idx < steps.length - 1 && (
              <div className="md:hidden flex justify-center pt-3 text-primary">
                <ArrowRight className="h-4 w-4 rotate-90" />
              </div>
            )}
          </motion.div>
        ))}

      </div>

    </section>
  );
}
