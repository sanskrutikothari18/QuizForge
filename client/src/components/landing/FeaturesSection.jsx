import React from 'react';
import { motion } from 'framer-motion';
import {
  Radio, Trophy, Timer, Zap, BarChart3, LayoutDashboard, UserCheck, Smartphone,
  Moon, ShieldCheck, Database, Bot, Shuffle, FileDown, GraduationCap
} from 'lucide-react';

const allFeatures = [
  {
    icon: <Radio className="h-5 w-5 text-primary" />,
    title: 'Real-time Multiplayer',
    desc: 'Battle live with unlimited players in synchronized real-time WebSocket sessions.',
    badge: 'Live Sync',
  },
  {
    icon: <Trophy className="h-5 w-5 text-yellow-400" />,
    title: 'Instant Leaderboards',
    desc: 'Track global & session player rankings in real-time as points accumulate.',
    badge: 'Real-Time',
  },
  {
    icon: <Timer className="h-5 w-5 text-accent" />,
    title: 'Question Timer',
    desc: 'Customizable countdown timers per question to keep players focused and fast.',
    badge: 'Configurable',
  },
  {
    icon: <Zap className="h-5 w-5 text-secondary" />,
    title: 'Live Results',
    desc: 'Get instant feedback on answer accuracy the second each question ends.',
    badge: 'Instant',
  },
  {
    icon: <BarChart3 className="h-5 w-5 text-emerald-400" />,
    title: 'Quiz Analytics',
    desc: 'Deep-dive metrics on accuracy, completion rates, and player performance.',
    badge: 'Analytics',
  },
  {
    icon: <LayoutDashboard className="h-5 w-5 text-primary" />,
    title: 'Host Dashboard',
    desc: 'Full control center to manage quizzes, view battle history, and launch games.',
    badge: 'Host Control',
  },
  {
    icon: <UserCheck className="h-5 w-5 text-secondary" />,
    title: 'Student Dashboard',
    desc: 'Personalized player portal to view past battle scores and track growth.',
    badge: 'Player Portal',
  },
  {
    icon: <Smartphone className="h-5 w-5 text-accent" />,
    title: 'Responsive Design',
    desc: 'Flawless performance on mobile, tablet, and desktop without app downloads.',
    badge: 'Cross-Platform',
  },
  {
    icon: <Moon className="h-5 w-5 text-indigo-400" />,
    title: 'Dark & Light Mode',
    desc: 'Sleek dark mode and pure light mode tailored for comfortable viewing anytime.',
    badge: 'Themes',
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-emerald-400" />,
    title: 'Secure Authentication',
    desc: 'JWT-secured accounts with password encryption and reset token flow.',
    badge: 'Encrypted',
  },
  {
    icon: <Database className="h-5 w-5 text-primary" />,
    title: 'Question Bank',
    desc: 'Store, organize, and reuse questions across multiple custom quizzes.',
    badge: 'Pro Feature',
  },
  {
    icon: <Bot className="h-5 w-5 text-purple-400" />,
    title: 'AI Quiz Generation',
    desc: 'Instantly generate high-quality quizzes on any topic using advanced AI.',
    badge: 'Coming Soon',
    highlight: true,
  },
  {
    icon: <Shuffle className="h-5 w-5 text-secondary" />,
    title: 'Randomized Questions',
    desc: 'Shuffle question order and options automatically to prevent cheating.',
    badge: 'Anti-Cheat',
  },
  {
    icon: <FileDown className="h-5 w-5 text-accent" />,
    title: 'Export Results',
    desc: 'Download detailed session reports as PDF or CSV for record-keeping.',
    badge: 'PDF / CSV',
  },
  {
    icon: <GraduationCap className="h-5 w-5 text-yellow-400" />,
    title: 'Classroom Friendly',
    desc: 'Built specifically for educators, schools, corporate training & trivia hosts.',
    badge: 'Education',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 scroll-mt-20">
      
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 sm:mb-16"
      >
        <span className="rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-wider">
          Powerful Features
        </span>
        <h2 className="font-outfit text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight">
          Everything You Need to <span className="text-gradient-primary">Engage & Conquer</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          QuizForge comes packed with enterprise-grade features for teachers, quizmasters, and corporate team leaders.
        </p>
      </motion.div>

      {/* Grid of 15 Cards */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {allFeatures.map((feat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.04 }}
            className={`glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between border relative group overflow-hidden ${
              feat.highlight
                ? 'border-purple-500/40 bg-purple-950/20'
                : 'border-white/10'
            }`}
          >
            {/* Top gradient glow line on hover */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:border-primary/40 group-hover:scale-105 transition-all">
                  {feat.icon}
                </div>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                  feat.highlight
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    : 'bg-white/5 text-gray-300 border-white/10'
                }`}>
                  {feat.badge}
                </span>
              </div>

              <h3 className="font-outfit text-lg font-extrabold text-white group-hover:text-primary transition-colors">
                {feat.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
}
