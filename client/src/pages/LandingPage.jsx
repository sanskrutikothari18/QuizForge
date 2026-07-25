import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, Sparkles, Plus
} from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

export default function LandingPage() {
  return (
    <AnimatedPage>
      <div className="relative min-h-screen overflow-hidden bg-background">
        
        {/* Glow Spheres */}
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-glow-primary pointer-events-none opacity-60"></div>
        <div className="absolute bottom-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-glow-secondary pointer-events-none opacity-50"></div>

        {/* Ambient floating geometry particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <motion.div 
            animate={{ 
              y: [0, -30, 0],
              x: [0, 15, 0],
              rotate: [0, 360]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute top-[20%] right-[15%] h-12 w-12 border border-primary/20 rounded-xl"
          />
          <motion.div 
            animate={{ 
              y: [0, 40, 0],
              x: [0, -20, 0],
              rotate: [360, 0]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[30%] left-[10%] h-16 w-16 border border-secondary/20 rounded-full"
          />
          <motion.div 
            animate={{ 
              scale: [0.8, 1.2, 0.8],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[50%] left-[45%] h-3 w-3 bg-accent rounded-full blur-[2px]"
          />
        </div>

        {/* Hero Section ONLY */}
        <section className="relative mx-auto max-w-7xl px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24 lg:px-8">
          <div className="text-center">
            
            {/* Promo Pill */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/25 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/15 transition-all mb-8"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Version 2.0 Live Battle Engine</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-outfit text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
            >
              Create Epic Quizzes.<br />
              <span className="text-gradient-primary">Battle Real-Time.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base text-gray-400 sm:text-lg px-2 sm:px-0"
            >
              The premium multiplayer quiz platform designed for classrooms, corporate squads, and trivia champions. Engage players instantly.
            </motion.p>

            {/* CTA Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mx-auto mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0"
            >
              <Link
                to="/login"
                className="btn-premium btn-primary-gradient px-6 sm:px-8 py-3.5 sm:py-4 flex items-center justify-center gap-2 group text-sm sm:text-base font-bold shadow-premium-glow w-full sm:w-auto"
              >
                <span>Create Quiz</span>
                <Plus className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/join"
                className="btn-premium btn-secondary-gradient px-6 sm:px-8 py-3.5 sm:py-4 flex items-center justify-center gap-2 text-sm sm:text-base font-bold shadow-secondary-glow w-full sm:w-auto"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Join Game</span>
              </Link>
            </motion.div>

          </div>
        </section>

      </div>
    </AnimatedPage>
  );
}