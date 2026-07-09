import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Home, BarChart3, Loader2, RefreshCw, CheckCircle, Save
} from 'lucide-react';
import confetti from 'canvas-confetti';
import AnimatedPage from '../components/AnimatedPage';
import { getGame } from '../services/gameService';
import { saveResult } from '../services/resultService';
import { disconnectSocket } from '../services/socketService';
import toast from 'react-hot-toast';

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
    setIsHost(!localPlayerName && !!hostToken);

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

        confetti({
          particleCount: 4,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
          colors: ['#FFC83D', '#ffffff', '#864CBF'],
          zIndex: 50,
          disableForReducedMotion: true
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
      <div className="relative min-h-screen bg-[#46178F] font-outfit overflow-hidden flex flex-col justify-between">
        
        {/* Radial vignette overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#46178F]/50 to-[#2A0E5C] pointer-events-none z-0"></div>
        
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
            className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] px-10 py-4 mb-auto text-center"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold text-black">Battle Finished!</h1>
            <div className="flex justify-center mt-2">
              <div className="inline-flex items-center gap-1.5 bg-gray-100 px-4 py-1.5 rounded-full text-sm font-bold text-gray-700">
                <span>🎉 Congratulations to all players!</span>
              </div>
            </div>
          </motion.div>

          {/* PODIUM CONTAINER */}
          <div className="flex items-end justify-center w-full max-w-3xl h-[450px] mt-12 mb-8 gap-1 md:gap-4">
            
            {/* 2ND PLACE */}
            <div className="flex flex-col items-center flex-1 z-10 w-1/3">
              {second ? (
                <>
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: [0, -5, 0], opacity: 1 }}
                    transition={{ delay: 1.6, y: { repeat: Infinity, duration: 3, ease: "easeInOut" } }}
                    className="bg-white px-4 py-2 rounded-lg shadow-lg mb-4 text-center transform -rotate-2 w-11/12 max-w-[140px]"
                  >
                    <div className="font-bold text-black text-sm md:text-base truncate">{second.name}</div>
                    <div className="font-black text-gray-600 text-xs md:text-sm">{second.totalScore || 0} pts</div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 1.5 }}
                    className="text-6xl md:text-7xl mb-1 filter drop-shadow-xl"
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
                className="w-full bg-[#6b2cbd] rounded-t-lg flex flex-col items-center justify-start pt-6 relative overflow-hidden shadow-[inset_0_-10px_20px_rgba(0,0,0,0.4),0_10px_20px_rgba(0,0,0,0.5)] border-t-[8px] border-[#9146ff]"
              >
                {/* Silver Medal */}
                <div className="relative flex flex-col items-center mb-2 mt-2">
                  {/* Ribbon */}
                  <div className="w-4 h-5 bg-blue-600 rounded-sm mb-[-4px] z-0 shadow-inner border border-blue-800 flex overflow-hidden">
                    <div className="w-1/3 h-full bg-white/30"></div>
                    <div className="w-1/3 h-full bg-transparent"></div>
                    <div className="w-1/3 h-full bg-white/30"></div>
                  </div>
                  {/* Medal */}
                  <div className="relative z-10 w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 via-gray-300 to-gray-500 flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.3)] border-2 border-[#a8a9ad]">
                    <div className="w-[85%] h-[85%] rounded-full border border-white/60 flex items-center justify-center bg-gradient-to-tr from-gray-500/20 to-transparent">
                      <span className="font-outfit text-lg font-black text-white drop-shadow-md">2</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 1ST PLACE */}
            {winner ? (
              <div className="flex flex-col items-center flex-1 z-20 w-1/3 -mx-2 md:-mx-4">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: [0, -8, 0], opacity: 1 }}
                  transition={{ delay: 3.8, y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } }}
                  className="bg-white px-5 py-3 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.2)] mb-4 text-center z-10 w-[110%] max-w-[180px]"
                >
                  <div className="font-black text-black text-base md:text-xl truncate">{winner.name}</div>
                  <div className="font-black text-[#864CBF] text-sm md:text-base">{winner.totalScore || 0} pts</div>
                </motion.div>
                
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.1 }}
                  transition={{ type: 'spring', delay: 3.6 }}
                  className="text-7xl md:text-8xl mb-1 filter drop-shadow-2xl relative"
                >
                  <motion.div 
                    initial={{ y: -20, opacity: 0, rotate: -15 }}
                    animate={{ y: 0, opacity: 1, rotate: 10 }}
                    transition={{ delay: 4.2, type: 'spring' }}
                    className="absolute -top-3 md:-top-5 lg:-top-6 left-1/2 -translate-x-1/2 text-3xl md:text-4xl lg:text-5xl z-20 drop-shadow-md origin-bottom-left"
                  >
                    👑
                  </motion.div>
                  {winner.avatar ? <Avatar emoji={winner.avatar} className="w-20 h-20 md:w-24 md:h-24" /> : '👤'}
                </motion.div>
                
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: 240 }}
                  transition={{ type: 'spring', stiffness: 50, damping: 12, delay: 3.2 }}
                  className="w-full bg-[#5619ab] rounded-t-lg flex flex-col items-center justify-start pt-6 relative overflow-hidden shadow-[inset_0_-15px_30px_rgba(0,0,0,0.5),0_15px_30px_rgba(0,0,0,0.6)] border-t-[8px] border-[#864CBF]"
                >
                  {/* Gold Medal */}
                  <div className="relative flex flex-col items-center mb-2 mt-2">
                    {/* Ribbon */}
                    <div className="w-5 h-6 bg-red-600 rounded-sm mb-[-6px] z-0 shadow-inner border border-red-800 flex overflow-hidden">
                      <div className="w-1/3 h-full bg-white/30"></div>
                      <div className="w-1/3 h-full bg-transparent"></div>
                      <div className="w-1/3 h-full bg-white/30"></div>
                    </div>
                    {/* Medal */}
                    <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-400 to-amber-600 flex items-center justify-center shadow-[0_4px_15px_rgba(255,200,0,0.5)] border-[3px] border-[#d4af37]">
                      <div className="w-[85%] h-[85%] rounded-full border border-yellow-200/50 flex items-center justify-center bg-gradient-to-tr from-yellow-600/30 to-transparent">
                        <span className="font-outfit text-2xl font-black text-white drop-shadow-md">1</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : <div className="flex-1 w-1/3" />}

            {/* 3RD PLACE */}
            <div className="flex flex-col items-center flex-1 z-10 w-1/3">
              {third ? (
                <>
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: [0, -4, 0], opacity: 1 }}
                    transition={{ delay: 0.8, y: { repeat: Infinity, duration: 3.5, ease: "easeInOut" } }}
                    className="bg-white px-4 py-2 rounded-lg shadow-lg mb-4 text-center transform rotate-2 w-11/12 max-w-[140px]"
                  >
                    <div className="font-bold text-black text-sm md:text-base truncate">{third.name}</div>
                    <div className="font-black text-gray-600 text-xs md:text-sm">{third.totalScore || 0} pts</div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 0.95 }}
                    transition={{ type: 'spring', delay: 0.7 }}
                    className="text-6xl md:text-7xl mb-1 filter drop-shadow-xl"
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
                className="w-full bg-[#783bd1] rounded-t-lg flex flex-col items-center justify-start pt-6 relative overflow-hidden shadow-[inset_0_-10px_20px_rgba(0,0,0,0.3),0_5px_15px_rgba(0,0,0,0.4)] border-t-[8px] border-[#a25eff]"
              >
                {/* Bronze Medal */}
                <div className="relative flex flex-col items-center mb-2 mt-2">
                  {/* Ribbon */}
                  <div className="w-4 h-5 bg-emerald-600 rounded-sm mb-[-4px] z-0 shadow-inner border border-emerald-800 flex overflow-hidden">
                    <div className="w-1/3 h-full bg-white/30"></div>
                    <div className="w-1/3 h-full bg-transparent"></div>
                    <div className="w-1/3 h-full bg-white/30"></div>
                  </div>
                  {/* Medal */}
                  <div className="relative z-10 w-9 h-9 rounded-full bg-gradient-to-br from-[#ffc894] via-[#cd7f32] to-[#8b4513] flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.3)] border-2 border-[#a0522d]">
                    <div className="w-[85%] h-[85%] rounded-full border border-[#ffd8b8]/30 flex items-center justify-center bg-gradient-to-tr from-[#6b3510]/30 to-transparent">
                      <span className="font-outfit text-lg font-black text-white drop-shadow-md">3</span>
                    </div>
                  </div>
                </div>
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
