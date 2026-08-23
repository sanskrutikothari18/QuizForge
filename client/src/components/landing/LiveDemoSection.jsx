import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, RotateCcw, CheckCircle2, XCircle, Sparkles, ArrowRight, Flame, Clock } from 'lucide-react';

const sampleQuestions = [
  {
    id: 1,
    question: 'What does HTML stand for?',
    category: 'Web Development',
    options: [
      { id: 'A', text: 'HyperText Markup Language', shape: '▲', color: 'bg-red-500 hover:bg-red-600', isCorrect: true },
      { id: 'B', text: 'High Tech Markup Language', shape: '◆', color: 'bg-blue-500 hover:bg-blue-600', isCorrect: false },
      { id: 'C', text: 'Hyperlink Text Management Language', shape: '●', color: 'bg-yellow-500 hover:bg-yellow-600', isCorrect: false },
      { id: 'D', text: 'Home Tool Markup Language', shape: '■', color: 'bg-emerald-500 hover:bg-emerald-600', isCorrect: false },
    ],
  },
  {
    id: 2,
    question: 'Which planet is known as the Red Planet?',
    category: 'Astronomy',
    options: [
      { id: 'A', text: 'Venus', shape: '▲', color: 'bg-red-500 hover:bg-red-600', isCorrect: false },
      { id: 'B', text: 'Mars', shape: '◆', color: 'bg-blue-500 hover:bg-blue-600', isCorrect: true },
      { id: 'C', text: 'Jupiter', shape: '●', color: 'bg-yellow-500 hover:bg-yellow-600', isCorrect: false },
      { id: 'D', text: 'Saturn', shape: '■', color: 'bg-emerald-500 hover:bg-emerald-600', isCorrect: false },
    ],
  },
  {
    id: 3,
    question: 'What primary colors mix together to make Green?',
    category: 'General Knowledge',
    options: [
      { id: 'A', text: 'Red & Blue', shape: '▲', color: 'bg-red-500 hover:bg-red-600', isCorrect: false },
      { id: 'B', text: 'Yellow & Blue', shape: '◆', color: 'bg-blue-500 hover:bg-blue-600', isCorrect: true },
      { id: 'C', text: 'Yellow & Red', shape: '●', color: 'bg-yellow-500 hover:bg-yellow-600', isCorrect: false },
      { id: 'D', text: 'Purple & Green', shape: '■', color: 'bg-emerald-500 hover:bg-emerald-600', isCorrect: false },
    ],
  },
];

export default function LiveDemoSection({ isModal = false, onCloseModal = null }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [earnedPts, setEarnedPts] = useState(0);
  
  // 30-Second Countdown Timer
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const currentQ = sampleQuestions[currentQIndex];

  // Timer Effect
  useEffect(() => {
    if (!isTimerRunning || isCompleted || selectedOption !== null || isTimedOut) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, currentQIndex, selectedOption, isTimedOut, isCompleted]);

  const handleTimeOut = () => {
    setIsTimedOut(true);
    setIsTimerRunning(false);
    setStreak(0);
    setEarnedPts(0);
  };

  const handleSelectOption = (index) => {
    if (selectedOption !== null || isTimedOut || isCompleted) return;

    setIsTimerRunning(false);
    setSelectedOption(index);

    const opt = currentQ.options[index];

    if (opt.isCorrect) {
      const speedBonus = Math.round((timeLeft / 30) * 500);
      const basePoints = 500;
      const streakBonus = streak * 50;
      const addedPts = basePoints + speedBonus + streakBonus;

      setEarnedPts(addedPts);
      setScore((prev) => prev + addedPts);
      setCorrectCount((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
      setEarnedPts(0);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsTimedOut(false);
    setTimeLeft(30);

    if (currentQIndex < sampleQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setIsTimerRunning(true);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestartDemo = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsTimedOut(false);
    setScore(0);
    setCorrectCount(0);
    setStreak(0);
    setIsCompleted(false);
    setEarnedPts(0);
    setTimeLeft(30);
    setIsTimerRunning(true);
  };

  // Benchmark bot competitors
  const benchmarkPlayers = [
    { name: 'QuizNinja_99', score: 2100, correct: '2/3', isUser: false },
    { name: 'SpeedDemon', score: 1400, correct: '2/3', isUser: false },
  ];

  const userPlayer = {
    name: 'You (Demo Player)',
    score: score,
    correct: `${correctCount}/${sampleQuestions.length}`,
    isUser: true,
  };

  const sortedLeaderboard = [...benchmarkPlayers, userPlayer].sort((a, b) => b.score - a.score);
  const userRankIndex = sortedLeaderboard.findIndex((p) => p.isUser);

  return (
    <section
      id="interactive-demo"
      className={`relative mx-auto w-full ${isModal ? 'p-0' : 'max-w-5xl px-3 sm:px-6 lg:px-8 py-8 sm:py-20 scroll-mt-20'}`}
    >
      {/* Radial glow background */}
      {!isModal && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] sm:h-[450px] w-[350px] sm:w-[450px] rounded-full bg-primary/15 blur-[100px] pointer-events-none" />
      )}

      {/* Header section */}
      {!isModal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/25 px-3 sm:px-4 py-1 text-[11px] sm:text-xs font-extrabold text-primary uppercase tracking-wider mb-2 sm:mb-3">
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-secondary animate-pulse shrink-0" />
            <span>Interactive Product Demo</span>
          </div>
          <h2 className="font-outfit text-2xl sm:text-5xl font-black text-white tracking-tight">
            See How <span className="text-gradient-primary">Quiz Hub</span> Works
          </h2>
          <p className="mt-2 sm:mt-3 text-xs sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed px-2">
            Test drive our real-time interactive quiz experience! Pick an answer fast before the 30-second timer runs out.
          </p>
        </motion.div>
      )}

      {/* Demo Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass-panel rounded-2xl sm:rounded-3xl border border-white/15 p-3.5 sm:p-8 shadow-2xl relative overflow-hidden bg-gradient-to-b from-slate-950/90 via-black/95 to-slate-950 w-full"
      >
        {/* Top Game Bar - Flexible & Compact on Phone */}
        <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 mb-4 sm:mb-6 gap-1.5 sm:gap-2 gap-y-2">
          <div className="flex items-center gap-1.5 sm:gap-3">
            <span className="flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-[10px] sm:text-xs font-extrabold text-primary shrink-0 whitespace-nowrap">
              PIN: 849-204
            </span>
            {!isCompleted && (
              <span className="text-[10px] sm:text-xs text-gray-400 font-extrabold shrink-0 whitespace-nowrap">
                Q{currentQIndex + 1}/{sampleQuestions.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* 30-SECOND TIMER AT CORNER BESIDE POINTS */}
            {!isCompleted && (
              <div
                className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full border text-[11px] sm:text-sm font-black transition-all shrink-0 ${
                  timeLeft <= 5
                    ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse'
                    : timeLeft <= 10
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                }`}
              >
                <Clock className={`h-3.5 w-3.5 shrink-0 ${timeLeft <= 5 ? 'animate-bounce text-red-400' : 'text-cyan-400'}`} />
                <span className="whitespace-nowrap">{timeLeft}s</span>
              </div>
            )}

            {/* Live Score Counter */}
            <div className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-extrabold text-[11px] sm:text-sm shrink-0">
              <Trophy className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span className="whitespace-nowrap">{score.toLocaleString()} pts</span>
            </div>

            {/* Streak Indicator */}
            {streak > 1 && (
              <div className="hidden xs:flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[10px] sm:text-xs font-black animate-pulse shrink-0">
                <Flame className="h-3 w-3 fill-current" />
                <span>{streak}x</span>
              </div>
            )}

            {/* Reset Button */}
            <button
              onClick={handleRestartDemo}
              className="p-1.5 sm:p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="Restart Demo"
            >
              <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>

        {/* CONTENT VIEW: Active Question vs Leaderboard Result */}
        {!isCompleted ? (
          <div className="space-y-4 sm:space-y-6">
            
            {/* Question Box */}
            <div className="relative p-4 sm:p-7 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-left overflow-hidden">
              {/* Animated Progress Bar for Timer */}
              <div
                className="absolute top-0 left-0 bottom-0 bg-primary/10 transition-all duration-1000 ease-linear pointer-events-none"
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />

              <div className="relative z-10 flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[9px] sm:text-xs font-black uppercase text-secondary tracking-wider bg-secondary/15 px-2 py-0.5 rounded-full border border-secondary/20">
                  {currentQ.category}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-gray-400">
                  Question {currentQIndex + 1} of {sampleQuestions.length}
                </span>
              </div>

              <h3 className="relative z-10 font-outfit text-sm sm:text-2xl font-extrabold text-white leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* Answer Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isRevealed = selectedOption !== null || isTimedOut;

                let stateStyles = opt.color;
                if (isRevealed) {
                  if (opt.isCorrect) {
                    stateStyles = 'bg-emerald-600 border-2 border-emerald-300 ring-2 ring-emerald-400/50 shadow-emerald-500/30 shadow-lg';
                  } else if (isSelected && !opt.isCorrect) {
                    stateStyles = 'bg-red-600/90 border-2 border-red-400 opacity-90';
                  } else {
                    stateStyles = 'bg-white/5 border-white/10 opacity-40';
                  }
                }

                return (
                  <motion.button
                    key={idx}
                    whileHover={selectedOption === null && !isTimedOut ? { scale: 1.01 } : {}}
                    whileTap={selectedOption === null && !isTimedOut ? { scale: 0.98 } : {}}
                    onClick={() => handleSelectOption(idx)}
                    disabled={selectedOption !== null || isTimedOut}
                    className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-between text-white font-extrabold text-xs sm:text-base cursor-pointer text-left border ${stateStyles}`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="h-6 w-6 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-black/25 flex items-center justify-center font-mono text-xs sm:text-base shrink-0">
                        {opt.shape}
                      </span>
                      <span className="truncate">{opt.text}</span>
                    </div>

                    {isRevealed && opt.isCorrect && (
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-white shrink-0 ml-1.5 animate-bounce" />
                    )}
                    {isRevealed && isSelected && !opt.isCorrect && (
                      <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white shrink-0 ml-1.5" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback Banner & Next Button */}
            <AnimatePresence>
              {(selectedOption !== null || isTimedOut) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-left"
                >
                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    {isTimedOut ? (
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                        <Clock className="h-4 w-4 sm:h-6 sm:w-6" />
                      </div>
                    ) : currentQ.options[selectedOption].isCorrect ? (
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                        <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                        <XCircle className="h-4 w-4 sm:h-6 sm:w-6" />
                      </div>
                    )}

                    <div className="overflow-hidden">
                      <p className="text-xs sm:text-sm font-black text-white leading-tight truncate">
                        {isTimedOut
                          ? '⏰ Time Out! 30s elapsed (0 pts).'
                          : currentQ.options[selectedOption].isCorrect
                          ? `🎉 Correct! Earned +${earnedPts} pts!`
                          : `✕ Incorrect! Correct: ${currentQ.options.find((o) => o.isCorrect).text}`}
                      </p>
                      <p className="text-[10px] text-gray-400 hidden xs:block">
                        {currentQIndex < sampleQuestions.length - 1
                          ? 'Click next to continue.'
                          : 'Final question done! View leaderboard.'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="btn-premium btn-primary-gradient px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-black text-white rounded-xl shadow-lg flex items-center gap-1.5 shrink-0 cursor-pointer w-full sm:w-auto justify-center"
                  >
                    <span>{currentQIndex < sampleQuestions.length - 1 ? 'Next Question' : 'View Leaderboard'}</span>
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        ) : (
          /* LEADERBOARD & RESULT SCREEN */
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 sm:space-y-6 text-center py-1 sm:py-2"
          >
            {/* Victory Trophy */}
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-lg animate-pulse" />
              <div className="h-12 w-12 sm:h-20 sm:w-20 rounded-2xl sm:rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 relative z-10">
                <Trophy className="h-6 w-6 sm:h-10 sm:w-10" />
              </div>
            </div>

            <div>
              <span className="text-[10px] sm:text-xs font-black uppercase text-secondary tracking-widest bg-secondary/10 px-2.5 py-0.5 rounded-full border border-secondary/20">
                Demo Gameplay Complete
              </span>
              <h3 className="font-outfit text-xl sm:text-4xl font-black text-white mt-1.5">
                {userRankIndex === 0 ? '🏆 1st Place Podium Champion!' : userRankIndex === 1 ? '🥈 2nd Place Winner!' : '🥉 3rd Place Finish!'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Calculated Score:{' '}
                <span className="text-amber-400 font-extrabold">{score.toLocaleString()} pts</span> ({correctCount}/{sampleQuestions.length} Correct)
              </p>
            </div>

            {/* DYNAMIC LEADERBOARD TABLE */}
            <div className="max-w-md mx-auto rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 overflow-hidden divide-y divide-white/5 text-left text-xs">
              {sortedLeaderboard.map((player, idx) => {
                const rankNum = idx + 1;
                const isUser = player.isUser;

                return (
                  <div
                    key={idx}
                    className={`p-2.5 sm:p-3.5 flex items-center justify-between transition-all ${
                      isUser
                        ? 'bg-primary/25 border-l-4 border-primary font-black'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center font-black text-[10px] sm:text-xs ${
                          rankNum === 1
                            ? 'bg-amber-400 text-black'
                            : rankNum === 2
                            ? 'bg-gray-300 text-black'
                            : 'bg-amber-700 text-white'
                        }`}
                      >
                        {rankNum}
                      </span>
                      <div>
                        <span className={`font-extrabold text-xs block ${isUser ? 'text-white' : 'text-gray-200'}`}>
                          {player.name}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-gray-400 font-semibold">
                          {player.correct} Correct
                        </span>
                      </div>
                    </div>
                    <span className={`font-outfit font-black text-xs sm:text-sm ${isUser ? 'text-amber-400' : 'text-gray-300'}`}>
                      {player.score.toLocaleString()} pts
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
              <button
                onClick={handleRestartDemo}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-extrabold flex items-center gap-1.5 cursor-pointer transition-all w-full sm:w-auto justify-center"
              >
                <RotateCcw className="h-3.5 w-3.5 text-secondary" />
                <span>Replay Demo</span>
              </button>

              <Link
                to="/register"
                onClick={() => {
                  if (onCloseModal) onCloseModal();
                }}
                className="btn-premium btn-primary-gradient px-5 py-2.5 rounded-xl text-white text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shadow-lg transition-all w-full sm:w-auto justify-center"
              >
                <span>Create Your First Quiz</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        )}

      </motion.div>
    </section>
  );
}
