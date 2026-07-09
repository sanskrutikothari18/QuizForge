import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Trophy, Home, BarChart3, Star, ArrowRight, Loader2, Sparkles, RefreshCw, CheckCircle, Save, Crown,
  Cpu, Monitor, Keyboard, Mouse, Database, Server, Wifi, Terminal, Code2,
  Atom, FlaskConical, Dna, Orbit, Telescope, Microscope,
  Globe, Compass, Map, Scroll, Landmark, Anchor, History,
  Lightbulb, Gamepad2, BookOpen, XCircle, AlertCircle, Clock, Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import AnimatedPage from '../components/AnimatedPage';
import { getGame } from '../services/gameService';
import { saveResult } from '../services/resultService';
import { disconnectSocket } from '../services/socketService';
import toast from 'react-hot-toast';


const getTheme = (category) => {
  const cat = String(category || 'general').toLowerCase();
  
  if (cat.includes('science') || cat.includes('biology') || cat.includes('physics') || cat.includes('chemistry') || cat.includes('lab')) {
    return {
      bg: 'bg-[#0b0716] bg-gradient-to-br from-[#120b24] via-[#1b1036] to-[#0d071b]',
      glow1: 'bg-purple-600/25',
      glow2: 'bg-fuchsia-600/15',
      accentText: 'text-fuchsia-400',
      badgeBg: 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20',
      cardBorder: 'border-fuchsia-500/20',
      ambientElements: null
    };
  }
  
  if (cat.includes('programming') || cat.includes('coding') || cat.includes('tech') || cat.includes('computer') || cat.includes('software') || cat.includes('hardware')) {
    return {
      bg: 'bg-[#030a08] bg-gradient-to-br from-[#051410] via-[#0b261f] to-[#040e0b]',
      glow1: 'bg-emerald-600/20',
      glow2: 'bg-teal-600/15',
      accentText: 'text-emerald-400 font-mono',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono',
      cardBorder: 'border-emerald-500/20',
      ambientElements: null
    };
  }

  if (cat.includes('geography') || cat.includes('history') || cat.includes('social') || cat.includes('civics') || cat.includes('world')) {
    return {
      bg: 'bg-[#040c14] bg-gradient-to-br from-[#071626] via-[#0d2745] to-[#05111d]',
      glow1: 'bg-blue-600/20',
      glow2: 'bg-amber-600/10',
      accentText: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      cardBorder: 'border-amber-500/20',
      ambientElements: null
    };
  }

  return {
    bg: 'bg-[#06070d] bg-gradient-to-br from-[#0d0f1a] via-[#16182c] to-[#090a11]',
    glow1: 'bg-indigo-600/25',
    glow2: 'bg-violet-600/15',
    accentText: 'text-primary',
    badgeBg: 'bg-primary/10 text-primary',
    cardBorder: 'border-white/10 focus-within:border-primary/50',
    ambientElements: null
  };
};

export default function FinalResult() {
  const { pin } = useParams();
  const navigate = useNavigate();
  const [podium, setPodium] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [category, setCategory] = useState('general');
  const [isSaved, setIsSaved] = useState(false);

  // Fetch final game data
  const { 
    data: gameData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['final-game', pin],
    queryFn: () => getGame(pin),
    refetchOnWindowFocus: false,
  });

  const game = gameData?.game;
  const sessionId = game?.id;

  // Auto-save results to MongoDB Result schema for Host
  useEffect(() => {
    if (isHost && sessionId && !isSaved) {
      const persistResults = async () => {
        try {
          const res = await saveResult(sessionId);
          if (res.success) {
            setIsSaved(true);
            toast.success('Battle metrics saved to Dashboard! 💾');
          }
        } catch (err) {
          console.log('Result save status:', err.response?.data?.message || err.message);
          setIsSaved(true); // Stop loop on error/already-saved
        }
      };
      persistResults();
    }
  }, [isHost, sessionId, isSaved]);

  useEffect(() => {
    const localPlayer = localStorage.getItem('guest_playerName');
    const hostToken = localStorage.getItem('token');
    setIsHost(!localPlayer && !!hostToken);
    setCategory(localStorage.getItem('last_category') || 'general');

    // Trigger double confetti blast on mount
    const triggerConfetti = () => {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    };
    triggerConfetti();

    // Clean up temporary gameplay theme state from localStorage
    localStorage.removeItem('last_bg_image');
    localStorage.removeItem('last_category');

    return () => {
      disconnectSocket();
    };
  }, []);

  const players = game?.players || [];
  
  // Sort players by total score (points) first, then accuracy and speed
  const rankedPlayers = [...players]
    .sort((a, b) => {
      const aScore = a.totalScore || 0;
      const bScore = b.totalScore || 0;
      if (aScore !== bScore) {
        return bScore - aScore;
      }
      
      const aCorrect = a.answers?.filter(ans => ans.isCorrect).length || 0;
      const bCorrect = b.answers?.filter(ans => ans.isCorrect).length || 0;
      
      if (aCorrect !== bCorrect) {
        return bCorrect - aCorrect;
      }
      
      const aTime = a.answers?.reduce((acc, ans) => acc + (ans.isCorrect ? ans.timeTaken : 0), 0) || 0;
      const bTime = b.answers?.reduce((acc, ans) => acc + (ans.isCorrect ? ans.timeTaken : 0), 0) || 0;
      
      if (aTime !== bTime) {
        return aTime - bTime;
      }
      
      return new Date(a.joinedAt || 0) - new Date(b.joinedAt || 0);
    })
    .map((p, idx) => {
      const totalCorrect = p.answers?.filter(a => a.isCorrect).length || 0;
      const totalTimeCorrect = p.answers?.reduce((acc, ans) => acc + (ans.isCorrect ? ans.timeTaken : 0), 0) || 0;
      return {
        ...p,
        rank: idx + 1,
        correctAnswers: totalCorrect,
        timeCorrect: (totalTimeCorrect / 1000).toFixed(2)
      };
    });

  const winner = rankedPlayers[0];
  const second = rankedPlayers[1];
  const third = rankedPlayers[2];

  const localPlayerName = localStorage.getItem('guest_playerName');
  const currentPlayer = rankedPlayers.find(p => p.name.toLowerCase() === localPlayerName?.toLowerCase());
  const questions = game?.quiz?.questions || [];

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
          <div className="text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="text-xs text-gray-400">Summoning podium results...</p>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  const theme = getTheme(category);

  return (
    <AnimatedPage>
      <div className={`relative min-h-screen ${theme.bg} animate-gradient-bg text-gray-200 p-6 flex flex-col justify-between transition-all duration-700 overflow-y-auto`}>
        
        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 ambient-grid opacity-25 pointer-events-none"></div>

        {/* Glow Spheres */}
        <div className={`absolute top-[10%] left-[15%] h-[350px] w-[350px] rounded-full ${theme.glow1} pointer-events-none filter blur-[100px]`}></div>
        <div className={`absolute bottom-[10%] right-[15%] h-[400px] w-[400px] rounded-full ${theme.glow2} pointer-events-none filter blur-[120px]`}></div>

        {/* Dynamic theme element floaters */}
        {theme.ambientElements}

        {/* Content Panel */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full my-8 space-y-8 text-center relative z-10">
          
          {/* Pulsing Trophy */}
          <div className="relative">
            <motion.div 
              animate={{ 
                scale: [1, 1.08, 1],
                rotate: [0, 3, -3, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="h-24 w-24 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-600 flex items-center justify-center text-white shadow-[0_0_40px_rgba(234,179,8,0.35)] mx-auto relative z-10"
            >
              <Trophy className="h-12 w-12 stroke-[2] text-white" />
            </motion.div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full border border-yellow-500/10 animate-ping opacity-25"></div>
          </div>

          <div>
            <h1 className="font-outfit text-4xl font-extrabold text-white">Battle Finished!</h1>
            <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
              The quiz arena has closed. Hail the champions who stood atop the podium!
            </p>
            {isHost && (
              <div className="flex justify-center mt-3.5">
                <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full select-none text-[10px] font-bold text-gray-400">
                  <CheckCircle className={`h-4 w-4 ${isSaved ? 'text-green-400' : 'text-gray-500 animate-pulse'}`} />
                  <span>{isSaved ? 'Results Saved to Dashboard' : 'Saving results...'}</span>
                </div>
              </div>
            )}
          </div>

          {/* PODIUM GRAPHIC */}
          <div className="flex items-end justify-center gap-4 sm:gap-8 w-full max-w-lg h-60 mt-6 border-b border-white/5 pb-2">
            
            {/* 2nd place */}
            {second ? (
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs font-bold text-gray-300 truncate max-w-[80px]">{second.name}</span>
                <span className="text-[10px] text-gray-400 font-semibold">{second.totalScore || 0} pts ({second.timeCorrect || '0.00'}s)</span>
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: 100 }}
                  transition={{ type: 'spring', stiffness: 50, delay: 0.2 }}
                  className="w-full bg-gradient-to-t from-white/5 to-white/15 border border-white/10 rounded-t-2xl flex items-center justify-center mt-2"
                >
                  <span className="font-outfit text-xl font-bold text-gray-400">🥈</span>
                </motion.div>
              </div>
            ) : <div className="flex-1" />}

            {/* 1st place */}
            {winner ? (
              <div className="flex flex-col items-center flex-1">
                <CrownIcon className="h-6 w-6 text-yellow-500 animate-bounce mb-1" />
                <span className="text-sm font-bold text-white truncate max-w-[90px]">{winner.name}</span>
                <span className="text-[10px] text-warning font-bold">{winner.totalScore || 0} pts ({winner.timeCorrect || '0.00'}s)</span>
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: 140 }}
                  transition={{ type: 'spring', stiffness: 50 }}
                  className="w-full bg-gradient-to-t from-primary/10 to-primary/30 border border-primary/20 rounded-t-2xl flex items-center justify-center mt-2 relative"
                >
                  <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                  <span className="font-outfit text-2xl font-black text-white">👑</span>
                </motion.div>
              </div>
            ) : <div className="flex-1" />}

            {/* 3rd place */}
            {third ? (
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs font-bold text-gray-300 truncate max-w-[80px]">{third.name}</span>
                <span className="text-[10px] text-gray-400 font-semibold">{third.totalScore || 0} pts ({third.timeCorrect || '0.00'}s)</span>
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: 75 }}
                  transition={{ type: 'spring', stiffness: 50, delay: 0.3 }}
                  className="w-full bg-gradient-to-t from-white/5 to-white/10 border border-white/10 rounded-t-2xl flex items-center justify-center mt-2"
                >
                  <span className="font-outfit text-lg font-bold text-amber-700">🥉</span>
                </motion.div>
              </div>
            ) : <div className="flex-1" />}

          </div>

          {/* Detailed Question Review for Student */}
          {!isHost && currentPlayer && questions.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-full max-w-2xl mx-auto mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl text-left relative z-10"
            >
              <h2 className="font-outfit text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary animate-pulse" />
                <span>Your Performance Breakdown</span>
              </h2>
              <p className="text-xs text-gray-400 mb-6">
                Review your answers below to see where you excelled and where you can improve.
              </p>

              <div className="space-y-6">
                {questions.map((q, idx) => {
                  const userAnswer = currentPlayer.answers?.find(a => a.questionIndex === idx);
                  const isUserCorrect = userAnswer?.isCorrect;
                  const hasAnswered = userAnswer !== undefined && userAnswer.answerIndex !== -1;

                  return (
                    <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            Question {idx + 1}
                          </span>
                          <h3 className="text-sm font-semibold text-white mt-0.5">{q.questionText}</h3>
                        </div>
                        <div>
                          {hasAnswered ? (
                            isUserCorrect ? (
                              <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                                <CheckCircle className="h-3 w-3" /> Correct
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                                <XCircle className="h-3 w-3" /> Incorrect
                              </span>
                            )
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                              <AlertCircle className="h-3 w-3" /> Unanswered
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Answer Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {q.options.map((opt, optIdx) => {
                          const isCorrectOption = optIdx === q.correctAnswer;
                          const isSelectedOption = userAnswer && Number(userAnswer.answerIndex) === optIdx;

                          let optClass = "border-white/5 bg-white/5 text-gray-400";
                          let icon = null;

                          if (isCorrectOption) {
                            optClass = "border-green-500/30 bg-green-500/10 text-green-300 font-medium";
                            icon = <CheckCircle className="h-3.5 w-3.5 text-green-400 shrink-0" />;
                          } else if (isSelectedOption && !isUserCorrect) {
                            optClass = "border-red-500/30 bg-red-500/10 text-red-300 font-medium";
                            icon = <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />;
                          }

                          return (
                            <div
                              key={optIdx}
                              className={`flex items-center justify-between gap-2 p-2.5 rounded-lg border text-xs ${optClass}`}
                            >
                              <span>{opt}</span>
                              {icon}
                            </div>
                          );
                        })}
                      </div>

                      {/* Extra Info (Score & Time) */}
                      {hasAnswered && (
                        <div className="flex gap-4 text-[10px] text-gray-400 pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-500" />
                            Time taken: {(userAnswer.timeTaken / 1000).toFixed(2)}s
                          </span>
                          {isUserCorrect && (
                            <span className="flex items-center gap-1 text-yellow-500/80 font-bold">
                              <Award className="h-3 w-3" />
                              +{userAnswer.score} pts
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

        </div>

        {/* BOTTOM NAVIGATION ACTIONS */}
        <div className="w-full max-w-md mx-auto grid gap-4 mt-auto">
          {isHost ? (
            <>
              {/* Host sees Dashboard, Save Result, and Full Analytics */}
              {isSaved ? (
                <Link 
                  to={`/results/${game?.id}`}
                  className="w-full btn-premium btn-primary-gradient py-3.5 flex items-center justify-center gap-2 text-sm font-bold shadow-premium-glow"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>View Full Analytics Report</span>
                </Link>
              ) : (
                <button
                  onClick={async () => {
                    if (!sessionId) return;
                    toast.loading('Saving metrics...', { id: 'save-res' });
                    try {
                      const res = await saveResult(sessionId);
                      if (res.success) {
                        setIsSaved(true);
                        toast.success('Results successfully saved! 💾');
                      }
                    } catch (err) {
                      toast.error(err.response?.data?.message || 'Error saving results');
                    } finally {
                      toast.dismiss('save-res');
                    }
                  }}
                  className="w-full btn-premium btn-secondary-gradient py-3.5 flex items-center justify-center gap-2 text-sm font-bold shadow-secondary-glow cursor-pointer animate-pulse"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Results to Dashboard</span>
                </button>
              )}
              <Link 
                to="/dashboard"
                className="w-full btn-premium btn-glass py-3.5 flex items-center justify-center gap-2 text-sm font-bold"
              >
                <Home className="h-4 w-4" />
                <span>Return to Dashboard</span>
              </Link>
            </>
          ) : (
            <>
              {/* Player sees Play Again and Exit */}
              <Link 
                to="/join"
                className="w-full btn-premium btn-secondary-gradient py-3.5 flex items-center justify-center gap-2 text-sm font-bold shadow-secondary-glow"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Play Again</span>
              </Link>
              <Link 
                to="/"
                className="w-full btn-premium btn-glass py-3.5 flex items-center justify-center gap-2 text-sm font-bold"
              >
                <Home className="h-4 w-4" />
                <span>Exit Game</span>
              </Link>
            </>
          )}
        </div>

      </div>
    </AnimatedPage>
  );
}

function CrownIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.727l.707-.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
