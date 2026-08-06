import React from 'react';
import { motion } from 'framer-motion';
import {
  Radio, Plus, KeyRound, Trophy, Zap, ShieldCheck, Smartphone,
  FileDown, QrCode
} from 'lucide-react';

const features = [
  {
    title: 'Real-time Multiplayer Quiz',
    icon: <Radio className="h-5 w-5 text-primary" />,
    desc: 'Battle live with players in synchronized real-time quiz sessions powered by WebSocket engine.'
  },
  {
    title: 'Create & Host Custom Quizzes',
    icon: <Plus className="h-5 w-5 text-secondary" />,
    desc: 'Design your own questions, timer limits, and custom backgrounds to host engaging quiz games instantly.'
  },
  {
    title: 'Join with Game Code',
    icon: <KeyRound className="h-5 w-5 text-accent" />,
    desc: 'Quickly enter a 6-digit PIN and join any active game in seconds from desktop or mobile.'
  },
  {
    title: 'Live Leaderboard',
    icon: <Trophy className="h-5 w-5 text-primary" />,
    desc: 'Track rankings in real-time as players answer each question with instant speed bonuses.'
  },
  {
    title: 'Instant Results',
    icon: <Zap className="h-5 w-5 text-secondary" />,
    desc: 'Get immediate feedback, correct answer reveals, and final podium scores the moment a game ends.'
  },
  {
    title: 'Secure Authentication',
    icon: <ShieldCheck className="h-5 w-5 text-accent" />,
    desc: 'Protected user accounts with JWT-based login, password recovery, and encrypted sessions.'
  },
  {
    title: 'Responsive Design',
    icon: <Smartphone className="h-5 w-5 text-primary" />,
    desc: 'Enjoy a seamless, fluid experience across desktop, tablet, and mobile devices with zero lag.'
  },
  {
    title: 'Export Results & Analytics',
    icon: <FileDown className="h-5 w-5 text-secondary" />,
    desc: 'Download comprehensive battle logs, player accuracy metrics, and reports in PDF or CSV format.'
  },
  {
    title: 'QR Code Game Join',
    icon: <QrCode className="h-5 w-5 text-accent" />,
    desc: 'Scan an on-screen QR code to instantly enter any live host lobby without typing a PIN manually.'
  },
];

export default function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 sm:mb-16"
      >
        <span className="text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1.5 rounded-full border border-primary/20">
          Supercharged Platform
        </span>
        <h2 className="font-outfit text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">
          Everything You Need for <span className="text-gradient-primary">Epic Battles</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          From instantaneous live socket updates to PDF export reporting, Quiz Hub equips hosts and players with an enterprise-tier quiz toolkit.
        </p>
      </motion.div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col gap-4 border border-white/10 hover:border-primary/40 transition-all text-left group shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-300">
              {feature.icon}
            </div>
            <h3 className="font-outfit font-bold text-white text-base sm:text-lg tracking-tight group-hover:text-primary transition-colors">
              {feature.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
