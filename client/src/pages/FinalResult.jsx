import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Home, BarChart3, Loader2, RefreshCw, CheckCircle, Save
, BookOpen, Clock, XCircle, AlertCircle, Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import AnimatedPage from '../components/AnimatedPage';
import { getGame } from '../services/gameService';
import { saveResult } from '../services/resultService';
import { disconnectSocket } from '../services/socketService';
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar';

// Generate static config for 15 colorful balloons floating in the background
const BALLOONS_CONFIG = Array.from({ length: 15 }).map((_, idx) => {
  const colors = ['#f43f5e', '#3b82f6', '#eab308', '#ec4899', '#10b981', '#a855f7'];
  return {
    color: colors[idx % colors.length],
    left: Math.random() * 90 + 5,
    size: Math.random() * 20 + 25, // 25px to 45px
    duration: Math.random() * 8 + 8, // 8s to 16s
    delay: Math.random() * 6, // 0s to 6s
    drift: Math.random() * 40 - 20, // -20px to 20px
    rot: Math.random() * 60 - 30, // -30deg to 30deg
  };
});

export default function FinalResult() {
  const { pin } = useParams();
  const navigate = useNavigate();
  const [isHost, setIsHost] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const localPlayerName = localStorage.getItem('guest_playerName');

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
          console.log('Result save status:', err?.response?.data?.message || err?.message);
          setIsSaved(true); // Stop loop on error/already-saved
        }
      };
      persistResults();
    }
  }, [isHost, sessionId, isSaved]);

  useEffect(() => {
    const hostToken = localStorage.getItem('token');
    let user = null;
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) user = JSON.parse(userStr);
    } catch (e) {}

    if (game && user && game.hostId === user.id) {
      setIsHost(true);
    } else {
      setIsHost(!localPlayerName && !!hostToken);
    }
  }, [game, localPlayerName]);

  useEffect(() => {
    // Confetti logic
    let interval;
    
    // 3rd place confetti (right side)
    const t3 = setTimeout(() => {
      confetti({ particleCount: 50, spread: 70, origin: { x: 0.8, y: 0.6 }, colors: ['#CD7F32', '#ffffff', '#783bd1'] });
    }, 1000); // 3rd place avatar appears around 0.7s

    // 2nd place confetti (left side)
    const t2 = setTimeout(() => {
      confetti({ particleCount: 50, spread: 70, origin: { x: 0.2, y: 0.6 }, colors: ['#C0C0C0', '#ffffff', '#6b2cbd'] });
    }, 1800); // 2nd place avatar appears around 1.5s

    // 1st place dramatic burst and continuous loop
    const t1 = setTimeout(() => {
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      // Massive center burst
      confetti({
        particleCount: 250,
        spread: 120,
        startVelocity: 60,
        origin: { y: 0.7 },
        zIndex: 50,
        colors: ['#FFC83D', '#46178F', '#864CBF', '#ffffff']
      });

      // Continuous loop
      interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        // Standard center sprinkles
        confetti({
          particleCount: 4,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
          colors: ['#FFC83D', '#ffffff', '#864CBF'],
          zIndex: 50,
          disableForReducedMotion: true
        });

        // Dynamic Kahoot-style side fountains
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ['#FFC83D', '#ffffff', '#864CBF', '#06B6D4', '#F43F5E'],
          zIndex: 50
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ['#FFC83D', '#ffffff', '#864CBF', '#06B6D4', '#F43F5E'],
          zIndex: 50
        });
      }, 250);
    }, 3600); // 1st place avatar appears around 3.6s

    return () => {
      clearTimeout(t3);
      clearTimeout(t2);
      clearTimeout(t1);
      if (interval) clearInterval(interval);
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

  const questions = game?.quiz?.questions || [];
  const currentPlayer = rankedPlayers.find(p => p.name?.toLowerCase() === localPlayerName?.toLowerCase());

  const winner = rankedPlayers[0];
  const second = rankedPlayers[1];
  const third = rankedPlayers[2];

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="flex-1 flex items-center justify-center min-h-screen bg-[#46178F]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-white mx-auto" />
            <p className="text-sm font-bold text-white uppercase tracking-widest">Loading Podium...</p>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      {/* Background with blur and vignette */}
      <div className="relative min-h-screen bg-gradient-to-br from-[#0c051e] via-[#241249] to-[#0a0216] font-outfit overflow-hidden flex flex-col justify-between">
        
        {/* Component specific animations and keyframes */}
        <style>{`
          @keyframes sweepLeft {
            0%, 100% { transform: rotate(-35deg) scaleX(0.85); }
            50% { transform: rotate(-15deg) scaleX(1.15); }
          }
          @keyframes sweepRight {
            0%, 100% { transform: rotate(35deg) scaleX(0.85); }
            50% { transform: rotate(15deg) scaleX(1.15); }
          }
          @keyframes floatUpBalloon {
            0% { transform: translateY(110vh) translateX(0) rotate(0deg); opacity: 0; }
            10% { opacity: 0.85; }
            90% { opacity: 0.85; }
            100% { transform: translateY(-20vh) translateX(var(--drift)) rotate(var(--rot)); opacity: 0; }
          }
          @keyframes glowGoldPulse {
            0%, 100% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.4), inset 0 0 15px rgba(255, 215, 0, 0.2); }
            50% { box-shadow: 0 0 45px rgba(255, 215, 0, 0.85), inset 0 0 25px rgba(255, 215, 0, 0.4); }
          }
        `}</style>

        {/* Sweeping stage spotlights */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div 
            className="absolute top-[-20%] left-[10%] w-[320px] h-[120vh] bg-gradient-to-r from-transparent via-white/10 to-transparent origin-top"
            style={{
              transform: 'rotate(-25deg)',
              animation: 'sweepLeft 8s ease-in-out infinite',
            }}
          />
          <div 
            className="absolute top-[-20%] right-[10%] w-[320px] h-[120vh] bg-gradient-to-l from-transparent via-white/10 to-transparent origin-top"
            style={{
              transform: 'rotate(25deg)',
              animation: 'sweepRight 8s ease-in-out infinite',
            }}
          />
        </div>

        {/* Floating celebratory balloons */}
        {BALLOONS_CONFIG.map((b, i) => (
          <div 
            key={i}
            className="absolute pointer-events-none rounded-full"
            style={{
              left: `${b.left}%`,
              width: `${b.size}px`,
              height: `${b.size * 1.3}px`,
              background: `radial-gradient(circle at 30% 30%, ${b.color}99, ${b.color}ff)`,
              boxShadow: 'inset -3px -3px 8px rgba(0,0,0,0.4), 0 6px 12px rgba(0,0,0,0.35)',
              animation: `floatUpBalloon ${b.duration}s linear infinite`,
              animationDelay: `${b.delay}s`,
              '--drift': `${b.drift}px`,
              '--rot': `${b.rot}deg`,
              zIndex: 5,
              bottom: '-10%'
            }}
          >
            <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px]" style={{ borderBottomColor: b.color }} />
            <div className="absolute bottom-[-25px] left-1/2 -translate-x-1/2 w-[1.5px] h-5 bg-white/20" />
          </div>
        ))}

        {/* Radial vignette overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0c051e]/40 to-[#0a0216] pointer-events-none z-0"></div>
        
        {/* Animated Torch Spotlight for Suspense */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0.8, 1, 1, 0] }}
          transition={{ delay: 2.2, duration: 2.6, ease: "easeInOut", times: [0, 0.1, 0.3, 0.7, 0.85, 1] }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[80vh] bg-gradient-to-b from-white/70 via-white/20 to-transparent z-10 pointer-events-none mix-blend-overlay"
          style={{ clipPath: 'polygon(35% 0, 65% 0, 100% 100%, 0% 100%)' }}
        />
        
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#864CBF]/30 rounded-full blur-[120px] pointer-events-none z-0"></div>

        <div className="relative z-10 flex flex-col items-center flex-1 w-full px-4 pt-10 pb-6">
          
          {/* Quiz Title / Battle Finished Card */}
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
            className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] px-10 py-4 mb-auto text-center animate-pulse"
          >
            <h1 className="text-3xl md:text-4xl font-black text-white">Battle Finished!</h1>
            <div className="flex justify-center mt-2">
              <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-sm font-bold text-gray-200">
                <span>🎉 Congratulations to all players!</span>
              </div>
            </div>
          </motion.div>

          {/* PODIUM CONTAINER */}
          <div className="flex items-end justify-center w-full max-w-3xl h-[450px] mt-12 mb-8 gap-1.5 md:gap-4 relative">
            
            {/* 2ND PLACE */}
            <div className="flex flex-col items-center flex-1 z-10 w-1/3">
              {second ? (
                <>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, x: [-8, 8, -8], y: [0, -6, 0], rotate: [-4, 4, -4] }}
                    transition={{ 
                      scale: { type: 'spring', delay: 1.5 }, 
                      x: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
                      y: { repeat: Infinity, duration: 1.1, ease: "easeInOut" },
                      rotate: { repeat: Infinity, duration: 2.2, ease: "easeInOut" }
                    }}
                    className="text-6xl md:text-7xl mb-2 filter drop-shadow-xl relative z-10 select-none cursor-pointer"
                  >
                    {second.avatar ? <Avatar emoji={second.avatar} className="w-16 h-16 md:w-20 md:h-20" /> : '👤'}
                  </motion.div>
                </>
              ) : (
                <div className="h-[96px] md:h-[128px] mb-5"></div>
              )}
                
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: 160 }}
                transition={{ type: 'spring', stiffness: 60, damping: 15, delay: 1.2 }}
                className="w-full bg-gradient-to-b from-[#e0e0e0] via-[#a6a6a6] to-[#6b6b6b] rounded-t-3xl flex flex-col items-center justify-start pt-6 relative overflow-hidden shadow-[0_15px_35px_rgba(255,255,255,0.08)] border-t-[6px] border-[#ffffff]"
              >
                {/* Silver Medal */}
                <div className="relative flex flex-col items-center mb-2 mt-2">
                  <div className="w-4 h-5 bg-blue-600 rounded-sm mb-[-4px] z-0 shadow-inner border border-blue-800 flex overflow-hidden">
                    <div className="w-1/3 h-full bg-white/30"></div>
                    <div className="w-1/3 h-full bg-transparent"></div>
                    <div className="w-1/3 h-full bg-white/30"></div>
                  </div>
                  <div className="relative z-10 w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 via-gray-300 to-gray-500 flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.3)] border-2 border-[#a8a9ad]">
                    <div className="w-[85%] h-[85%] rounded-full border border-white/60 flex items-center justify-center bg-gradient-to-tr from-gray-500/20 to-transparent">
                      <span className="font-outfit text-lg font-black text-white drop-shadow-md">2</span>
                    </div>
                  </div>
                </div>

                {second && (
                  <div className="text-center mt-2 px-2 z-10">
                    <div className="font-black text-white text-xs md:text-sm tracking-tight truncate max-w-[80px] drop-shadow-md">{second.name}</div>
                    <div className="font-black text-gray-200 text-[10px] md:text-xs drop-shadow-sm mt-0.5">{second.totalScore || 0} pts</div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* 1ST PLACE */}
            {winner ? (
              <div className="flex flex-col items-center flex-1 z-20 w-1/3 -mx-2 md:-mx-4">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.15, y: [0, -22, 0, -12, 0], rotate: [0, -6, 6, -4, 4, 0] }}
                  transition={{ 
                    scale: { type: 'spring', delay: 3.6 },
                    y: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
                    rotate: { repeat: Infinity, duration: 1.8, ease: "easeInOut" }
                  }}
                  className="text-7xl md:text-8xl mb-2 filter drop-shadow-2xl relative z-10 select-none cursor-pointer"
                >
                  <motion.div 
                    initial={{ y: -20, opacity: 0, rotate: -15 }}
                    animate={{ y: 0, opacity: 1, rotate: 10 }}
                    transition={{ delay: 4.2, type: 'spring' }}
                    className="absolute -top-3 md:-top-5 lg:-top-6 left-1/2 -translate-x-1/2 text-3xl md:text-4xl lg:text-5xl z-20 drop-shadow-md origin-bottom-left"
                  >
                    👑
                  </motion.div>
                  
                  {/* Golden Trophy floating next to avatar */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute -right-6 bottom-0 text-3xl md:text-4xl filter drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]"
                  >
                    🏆
                  </motion.div>

                  {/* Golden Halo aura behind 1st place */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 blur-xl opacity-50 z-0 animate-pulse" />

                  {winner.avatar ? <Avatar emoji={winner.avatar} className="w-20 h-20 md:w-24 md:h-24 relative z-10" /> : '👤'}
                </motion.div>
                
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: 240 }}
                  transition={{ type: 'spring', stiffness: 50, damping: 12, delay: 3.2 }}
                  className="w-full bg-gradient-to-b from-[#ffd700] via-[#d4af37] to-[#aa7c11] rounded-t-3xl flex flex-col items-center justify-start pt-6 relative overflow-hidden shadow-[0_15px_45px_rgba(255,215,0,0.2)] border-t-[6px] border-[#ffe082]"
                  style={{ animation: 'glowGoldPulse 3s ease-in-out infinite' }}
                >
                  {/* Gold Medal */}
                  <div className="relative flex flex-col items-center mb-2 mt-2">
                    <div className="w-5 h-6 bg-red-600 rounded-sm mb-[-6px] z-0 shadow-inner border border-red-800 flex overflow-hidden">
                      <div className="w-1/3 h-full bg-white/30"></div>
                      <div className="w-1/3 h-full bg-transparent"></div>
                      <div className="w-1/3 h-full bg-white/30"></div>
                    </div>
                    <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-400 to-amber-600 flex items-center justify-center shadow-[0_4px_15px_rgba(255,200,0,0.5)] border-[3px] border-[#d4af37]">
                      <div className="w-[85%] h-[85%] rounded-full border border-yellow-200/50 flex items-center justify-center bg-gradient-to-tr from-yellow-600/30 to-transparent">
                        <span className="font-outfit text-2xl font-black text-white drop-shadow-md">1</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-2 px-2 z-10">
                    <div className="font-extrabold text-white text-sm md:text-lg tracking-tight truncate max-w-[120px] drop-shadow-md">{winner.name}</div>
                    <div className="font-black text-yellow-200 text-xs md:text-sm drop-shadow-sm mt-0.5">{winner.totalScore || 0} pts</div>
                  </div>
                </motion.div>
              </div>
            ) : <div className="flex-1 w-1/3" />}

            {/* 3RD PLACE */}
            <div className="flex flex-col items-center flex-1 z-10 w-1/3">
              {third ? (
                <>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 0.95, y: [0, -10, 0], rotate: [-8, 8, -8] }}
                    transition={{ 
                      scale: { type: 'spring', delay: 0.7 },
                      y: { repeat: Infinity, duration: 1.3, ease: "easeInOut" },
                      rotate: { repeat: Infinity, duration: 1.3, ease: "easeInOut" }
                    }}
                    className="text-6xl md:text-7xl mb-2 filter drop-shadow-xl relative z-10 select-none cursor-pointer"
                  >
                    {third.avatar ? <Avatar emoji={third.avatar} className="w-14 h-14 md:w-16 md:h-16" /> : '👤'}
                  </motion.div>
                </>
              ) : (
                <div className="h-[96px] md:h-[128px] mb-5"></div>
              )}
                
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: 110 }}
                transition={{ type: 'spring', stiffness: 60, damping: 15, delay: 0.5 }}
                className="w-full bg-gradient-to-b from-[#cd7f32] via-[#a05a2c] to-[#5a2e0e] rounded-t-3xl flex flex-col items-center justify-start pt-6 relative overflow-hidden shadow-[0_15px_25px_rgba(205,127,50,0.08)] border-t-[6px] border-[#ffb74d]"
              >
                {/* Bronze Medal */}
                <div className="relative flex flex-col items-center mb-2 mt-2">
                  <div className="w-4 h-5 bg-emerald-600 rounded-sm mb-[-4px] z-0 shadow-inner border border-emerald-800 flex overflow-hidden">
                    <div className="w-1/3 h-full bg-white/30"></div>
                    <div className="w-1/3 h-full bg-transparent"></div>
                    <div className="w-1/3 h-full bg-white/30"></div>
                  </div>
                  <div className="relative z-10 w-9 h-9 rounded-full bg-gradient-to-br from-[#ffc894] via-[#cd7f32] to-[#8b4513] flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.3)] border-2 border-[#a0522d]">
                    <div className="w-[85%] h-[85%] rounded-full border border-[#ffd8b8]/30 flex items-center justify-center bg-gradient-to-tr from-[#6b3510]/30 to-transparent">
                      <span className="font-outfit text-lg font-black text-white drop-shadow-md">3</span>
                    </div>
                  </div>
                </div>

                {third && (
                  <div className="text-center mt-2 px-2 z-10">
                    <div className="font-black text-white text-xs md:text-sm tracking-tight truncate max-w-[80px] drop-shadow-md">{third.name}</div>
                    <div className="font-black text-gray-200 text-[10px] md:text-xs drop-shadow-sm mt-0.5">{third.totalScore || 0} pts</div>
                  </div>
                )}
              </motion.div>
            </div>

          </div>

          {/* RUNNER UPS */}
          {rankedPlayers.length > 3 && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4.6, duration: 0.8 }}
              className="w-full max-w-lg mt-12 mb-6"
            >
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <h3 className="text-white/80 font-bold mb-4 px-2 uppercase tracking-widest text-sm flex items-center gap-2">
                  <span>Runners Up</span>
                  <div className="h-[1px] flex-1 bg-white/20"></div>
                </h3>
                <div className="flex flex-col gap-2">
                  {rankedPlayers.slice(3).map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 5.0 + index * 0.2 }}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 border ${
                        player.name === localPlayerName
                          ? 'bg-[#864CBF]/40 border-[#864CBF] shadow-[0_0_15px_rgba(134,76,191,0.5)] scale-[1.02]'
                          : 'bg-white/5 hover:bg-white/10 border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-white/50 font-black w-6 text-right">{player.rank}</span>
                        <div className="flex justify-center items-center">{player.avatar ? <Avatar emoji={player.avatar} className="w-8 h-8" /> : '👤'}</div>
                        <span className="font-bold text-white text-base md:text-lg">{player.name}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-black text-white">{player.totalScore || 0} pts</span>
                        <span className="text-xs text-white/50">{player.correctAnswers || 0} correct</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

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
        
          {/* ACTIONS */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="w-full max-w-md grid gap-3 mt-auto"
          >
            {isHost ? (
              <>
                {isSaved ? (
                  <Link 
                    to={`/results/${game?.id}`}
                    className="w-full bg-white hover:bg-gray-100 text-[#46178F] py-4 rounded-xl flex items-center justify-center gap-2 text-base font-black shadow-[0_4px_0_#ccc] active:translate-y-1 active:shadow-none transition-all"
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span>View Full Analytics</span>
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
                    className="w-full bg-white hover:bg-gray-100 text-[#46178F] py-4 rounded-xl flex items-center justify-center gap-2 text-base font-black shadow-[0_4px_0_#ccc] active:translate-y-1 active:shadow-none transition-all animate-pulse"
                  >
                    <Save className="h-5 w-5" />
                    <span>Save Results to Dashboard</span>
                  </button>
                )}
                <Link 
                  to="/dashboard"
                  className="w-full bg-black/20 hover:bg-black/30 text-white py-4 rounded-xl flex items-center justify-center gap-2 text-base font-bold transition-all"
                >
                  <Home className="h-5 w-5" />
                  <span>Return to Dashboard</span>
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/join"
                  className="w-full bg-white hover:bg-gray-100 text-[#46178F] py-4 rounded-xl flex items-center justify-center gap-2 text-base font-black shadow-[0_4px_0_#ccc] active:translate-y-1 active:shadow-none transition-all"
                >
                  <RefreshCw className="h-5 w-5" />
                  <span>Play Again</span>
                </Link>
                <Link 
                  to="/"
                  className="w-full bg-black/20 hover:bg-black/30 text-white py-4 rounded-xl flex items-center justify-center gap-2 text-base font-bold transition-all"
                >
                  <Home className="h-5 w-5" />
                  <span>Exit Game</span>
                </Link>
              </>
            )}
          </motion.div>

        </div>
      </div>
    </AnimatedPage>
  );
}
