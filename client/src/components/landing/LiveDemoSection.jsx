import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, Trophy, Users, Clock, CheckCircle2, RotateCcw, Monitor, Smartphone } from 'lucide-react';

const mockQuestion = {
  title: 'Which element has the chemical symbol "Au" on the periodic table?',
  options: [
    { label: 'Silver', shape: '▲', color: 'bg-red-500 hover:bg-red-600', isCorrect: false },
    { label: 'Gold', shape: '◆', color: 'bg-blue-500 hover:bg-blue-600', isCorrect: true },
    { label: 'Argon', shape: '●', color: 'bg-yellow-500 hover:bg-yellow-600', isCorrect: false },
    { label: 'Aluminum', shape: '■', color: 'bg-green-500 hover:bg-green-600', isCorrect: false },
  ],
};

export default function LiveDemoSection() {
  const [activeView, setActiveView] = useState('host'); // 'host' | 'player'
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(4200);
  const [answeredCount, setAnsweredCount] = useState(38);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : 15));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectOption = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (mockQuestion.options[index].isCorrect) {
      setScore((prev) => prev + 980);
      setAnsweredCount((prev) => prev + 1);
    }
  };

  const handleResetDemo = () => {
    setSelectedAnswer(null);
    setTimeLeft(15);
  };

  return (
    <section id="live-demo" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 scroll-mt-20">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-secondary/10 blur-[130px] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <span className="rounded-full bg-accent/10 border border-accent/20 px-4 py-1.5 text-xs font-bold text-accent uppercase tracking-wider">
          Interactive Live Demo
        </span>
        <h2 className="font-outfit text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight">
          Experience <span className="text-gradient-primary">QuizForge</span> in Action
        </h2>
        <p className="mt-4 text-sm sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
          Test out our real-time interface right here! Click an option below to simulate live gameplay.
        </p>

        {/* View Switcher Toggle */}
        <div className="mt-8 inline-flex items-center gap-2 p-1.5 rounded-2xl glass-panel border border-white/10">
          <button
            onClick={() => setActiveView('host')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeView === 'host'
                ? 'bg-primary text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Monitor className="h-4 w-4" />
            <span>Host Screen</span>
          </button>
          <button
            onClick={() => setActiveView('player')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeView === 'player'
                ? 'bg-secondary text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            <span>Player Device</span>
          </button>
        </div>
      </motion.div>

      {/* Interactive Mock Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-panel rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl relative overflow-hidden bg-gradient-to-b from-black/80 via-black/95 to-black max-w-4xl mx-auto"
      >
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs font-extrabold text-primary">
              PIN: 849-204
            </span>
            <span className="text-xs text-gray-400 font-semibold hidden sm:inline">
              Game Mode: Real-time Arena
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-extrabold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Users className="h-3.5 w-3.5" />
              <span>{answeredCount} / 42 Answered</span>
            </div>

            <button
              onClick={handleResetDemo}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Reset Demo"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content View according to toggle */}
        {activeView === 'host' ? (
          /* Host Screen View */
          <div className="space-y-6">
            
            {/* Question Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 text-left">
              <div className="space-y-1">
                <span className="text-xs font-extrabold uppercase text-secondary tracking-wider">Question 03 of 10</span>
                <h3 className="font-outfit text-lg sm:text-xl font-bold text-white leading-snug">
                  {mockQuestion.title}
                </h3>
              </div>

              {/* Animated Timer Circle */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-accent/10 border-2 border-accent text-accent font-black text-xl animate-pulse">
                  {timeLeft}s
                </div>
              </div>
            </div>

            {/* Interactive Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mockQuestion.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const showFeedback = selectedAnswer !== null;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-5 rounded-2xl transition-all duration-300 flex items-center justify-between text-white font-extrabold text-sm sm:text-base border cursor-pointer ${
                      opt.color
                    } ${
                      isSelected ? 'ring-4 ring-white scale-105' : 'opacity-95 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-8 w-8 rounded-xl bg-black/20 flex items-center justify-center font-mono text-lg">
                        {opt.shape}
                      </span>
                      <span>{opt.label}</span>
                    </div>

                    {showFeedback && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-black/40 font-bold">
                        {opt.isCorrect ? '✓ Correct (+980 pts)' : '✕ Incorrect'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answered Banner feedback */}
            {selectedAnswer !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl text-center text-sm font-black border ${
                  mockQuestion.options[selectedAnswer].isCorrect
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-500/20 border-red-500/40 text-red-300'
                }`}
              >
                {mockQuestion.options[selectedAnswer].isCorrect
                  ? '🎉 Correct Answer! Score updated to ' + score + ' pts'
                  : '❌ Oops! Gold (Au) is the correct answer.'}
              </motion.div>
            )}

          </div>
        ) : (
          /* Player Device View */
          <div className="max-w-md mx-auto space-y-6 text-center">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300">Player: Team Alpha</span>
              <span className="text-xs font-black text-yellow-400 flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                {score} pts
              </span>
            </div>

            <div className="py-4">
              <h4 className="font-outfit text-base font-bold text-white mb-2">
                Select your answer on device:
              </h4>
              <p className="text-xs text-gray-400">
                Tap matching shape fast to earn maximum points!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {mockQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`h-24 rounded-2xl flex flex-col items-center justify-center gap-1 text-white font-black text-lg transition-all ${opt.color} cursor-pointer active:scale-95`}
                >
                  <span className="text-2xl">{opt.shape}</span>
                  <span className="text-xs font-bold">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </motion.div>
    </section>
  );
}
