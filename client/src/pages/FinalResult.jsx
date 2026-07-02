import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Trophy, Home, BarChart3, Star, ArrowRight, Loader2, Sparkles, RefreshCw, CheckCircle, Save, Crown,
  Cpu, Monitor, Keyboard, Mouse, Database, Server, Wifi, Terminal, Code2,
  Atom, FlaskConical, Dna, Orbit, Telescope, Microscope,
  Globe, Compass, Map, Scroll, Landmark, Anchor, History,
  Lightbulb, Gamepad2, BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import AnimatedPage from '../components/AnimatedPage';
import { getGame } from '../services/gameService';
import { saveResult } from '../services/resultService';
import { disconnectSocket } from '../services/socketService';

const getTheme = (category) => {
  const cat = String(category || 'general').toLowerCase();
  
  if (cat.includes('science') || cat.includes('biology') || cat.includes('physics') || cat.includes('chemistry') || cat.includes('lab')) {
    return {
      bg: 'bg-[#1e114a] bg-gradient-to-br from-[#3b0764] via-[#6b21a8] to-[#ec4899]',
      glow1: 'bg-pink-500/50',
      glow2: 'bg-fuchsia-500/40',
      accentText: 'text-fuchsia-400',
      badgeBg: 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20',
      titleGradient: 'from-purple-300 via-indigo-200 to-fuchsia-400',
      cardBorder: 'border-fuchsia-500/25',
      ambientElements: (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35 select-none z-0">
          <div className="absolute top-[12%] left-[8%] animate-float-orbit text-fuchsia-400/50">
            <Atom className="h-16 w-16 stroke-[1.5]" />
          </div>
          <div className="absolute top-[25%] right-[10%] animate-float-drift text-pink-400/45">
            <Dna className="h-20 w-20 stroke-[1.2]" />
          </div>
          <div className="absolute bottom-[30%] left-[12%] animate-float-pulse text-indigo-400/40">
            <FlaskConical className="h-24 w-24 stroke-[1.2]" />
          </div>
          <div className="absolute bottom-[15%] right-[15%] animate-float-orbit text-purple-400/50">
            <Telescope className="h-14 w-14 stroke-[1.5]" />
          </div>
          <div className="absolute top-[45%] left-[25%] animate-float-pulse text-fuchsia-300/40">
            <Orbit className="h-12 w-12 stroke-[1.5]" />
          </div>
          <div className="absolute bottom-[45%] right-[28%] animate-float-drift text-indigo-300/40">
            <Microscope className="h-12 w-12 stroke-[1.5]" />
          </div>
        </div>
      )
    };
  }
  
  if (cat.includes('programming') || cat.includes('coding') || cat.includes('tech') || cat.includes('computer') || cat.includes('software') || cat.includes('hardware')) {
    return {
      bg: 'bg-[#022c22] bg-gradient-to-br from-[#065f46] via-[#0d9488] to-[#10b981]',
      glow1: 'bg-emerald-400/50',
      glow2: 'bg-teal-400/40',
      accentText: 'text-emerald-400 font-mono',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono',
      titleGradient: 'from-emerald-400 via-green-200 to-teal-400',
      cardBorder: 'border-emerald-500/25',
      ambientElements: (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35 select-none z-0">
          <div className="absolute top-[12%] left-[8%] animate-float-orbit text-emerald-400/50">
            <Monitor className="h-16 w-16 stroke-[1.5]" />
          </div>
          <div className="absolute top-[25%] right-[10%] animate-float-drift text-teal-400/45">
            <Cpu className="h-20 w-20 stroke-[1.2]" />
          </div>
          <div className="absolute bottom-[30%] left-[12%] animate-float-pulse text-green-400/40">
            <Server className="h-24 w-24 stroke-[1.2]" />
          </div>
          <div className="absolute bottom-[15%] right-[15%] animate-float-orbit text-emerald-300/50">
            <Keyboard className="h-14 w-14 stroke-[1.5]" />
          </div>
          <div className="absolute top-[45%] left-[25%] animate-float-pulse text-teal-300/40">
            <Code2 className="h-10 w-10 stroke-[1.5]" />
          </div>
          <div className="absolute bottom-[45%] right-[28%] animate-float-drift text-green-300/40">
            <Database className="h-12 w-12 stroke-[1.5]" />
          </div>
          <div className="absolute top-[18%] left-[45%] animate-float-orbit text-emerald-400/35">
            <Terminal className="h-8 w-8 stroke-[1.5]" />
          </div>
          <div className="absolute bottom-[10%] left-[40%] animate-float-pulse text-teal-400/35">
            <Wifi className="h-10 w-10 stroke-[1.5]" />
          </div>
        </div>
      )
    };
  }

  if (cat.includes('geography') || cat.includes('history') || cat.includes('social') || cat.includes('civics') || cat.includes('world')) {
    return {
      bg: 'bg-[#0b3c5d] bg-gradient-to-br from-[#0284c7] via-[#0ea5e9] to-[#f59e0b]',
      glow1: 'bg-sky-400/50',
      glow2: 'bg-amber-400/45',
      accentText: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      titleGradient: 'from-amber-400 via-amber-200 to-teal-400',
      cardBorder: 'border-amber-500/25',
      ambientElements: (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35 select-none z-0">
          <div className="absolute top-[10%] left-[8%] animate-float-orbit text-sky-400/50">
            <Globe className="h-16 w-16 stroke-[1.5]" />
          </div>
          <div className="absolute top-[25%] right-[10%] animate-float-drift text-amber-400/45">
            <Map className="h-20 w-20 stroke-[1.2]" />
          </div>
          <div className="absolute bottom-[30%] left-[12%] animate-float-pulse text-orange-400/40">
            <Scroll className="h-24 w-24 stroke-[1.2]" />
          </div>
          <div className="absolute bottom-[15%] right-[15%] animate-float-orbit text-yellow-400/50">
            <Compass className="h-14 w-14 stroke-[1.5]" />
          </div>
          <div className="absolute top-[45%] left-[25%] animate-float-pulse text-sky-300/40">
            <Landmark className="h-12 w-12 stroke-[1.5]" />
          </div>
          <div className="absolute bottom-[45%] right-[28%] animate-float-drift text-amber-300/40">
            <Anchor className="h-12 w-12 stroke-[1.5]" />
          </div>
        </div>
      )
    };
  }

  return {
    bg: 'bg-[#1e1b4b] bg-gradient-to-br from-[#312e81] via-[#4f46e5] to-[#f43f5e]',
    glow1: 'bg-rose-500/50',
    glow2: 'bg-indigo-400/40',
    accentText: 'text-primary',
    badgeBg: 'bg-primary/10 text-primary',
    titleGradient: 'from-white via-gray-200 to-gray-400',
    cardBorder: 'border-white/10 focus-within:border-primary/50',
    ambientElements: (
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35 select-none z-0">
        <div className="absolute top-[10%] left-[8%] animate-float-orbit text-pink-400/50">
          <Sparkles className="h-16 w-16 stroke-[1.5]" />
        </div>
        <div className="absolute top-[25%] right-[10%] animate-float-drift text-indigo-400/45">
          <Lightbulb className="h-20 w-20 stroke-[1.2]" />
        </div>
        <div className="absolute bottom-[30%] left-[12%] animate-float-pulse text-rose-400/40">
          <BookOpen className="h-24 w-24 stroke-[1.2]" />
        </div>
        <div className="absolute bottom-[15%] right-[15%] animate-float-orbit text-violet-400/50">
          <Gamepad2 className="h-14 w-14 stroke-[1.5]" />
        </div>
      </div>
    )
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

    return () => {
      disconnectSocket();
    };
  }, []);

  const players = game?.players || [];
  
  // Sort players by accuracy and speed
  const rankedPlayers = [...players]
    .sort((a, b) => {
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
      <div className={`relative min-h-screen ${theme.bg} animate-gradient-bg text-gray-200 p-6 flex flex-col justify-between transition-all duration-700 overflow-hidden`}>
        
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
                <span className="text-[10px] text-gray-400 font-semibold">{second.correctAnswers || 0} Correct ({second.timeCorrect || '0.00'}s)</span>
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
                <span className="text-[10px] text-warning font-bold">{winner.correctAnswers || 0} Correct ({winner.timeCorrect || '0.00'}s)</span>
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
                <span className="text-[10px] text-gray-400 font-semibold">{third.correctAnswers || 0} Correct ({third.timeCorrect || '0.00'}s)</span>
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
