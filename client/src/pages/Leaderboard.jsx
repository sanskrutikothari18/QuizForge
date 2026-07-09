import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Trophy, ArrowRight, ArrowLeft, Loader2, Award, Users, Crown,
  Cpu, Monitor, Keyboard, Mouse, Database, Server, Wifi, Terminal, Code2,
  Atom, FlaskConical, Dna, Orbit, Telescope, Microscope,
  Globe, Compass, Map, Scroll, Landmark, Anchor, History,
  Sparkles, Lightbulb, Gamepad2, BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import { getLeaderboard, startQuestion, endGame } from '../services/gameService';

// Generate static config for 15 colorful balloons floating in the background
const BALLOONS_CONFIG = Array.from({ length: 15 }).map((_, idx) => {
  const colors = ['#f43f5e', '#3b82f6', '#eab308', '#ec4899', '#10b981', '#a855f7'];
  return {
    color: colors[idx % colors.length],
    left: Math.random() * 90 + 5,
    size: Math.random() * 20 + 25,
    duration: Math.random() * 8 + 8,
    delay: Math.random() * 6,
    drift: Math.random() * 40 - 20,
    rot: Math.random() * 60 - 30,
  };
});
import { useGame } from '../context/GameContext';
import { connectSocket, getSocket, emitJoinRoom, disconnectSocket } from '../services/socketService';



export default function Leaderboard() {
  const { pin } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { playerName } = useGame();
  const localPlayer = playerName || localStorage.getItem('guest_playerName');

  // Component State
  const [leaderboard, setLeaderboard] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [myRank, setMyRank] = useState(null);
  const [category, setCategory] = useState('general');

  useEffect(() => {
    const hostToken = localStorage.getItem('token');
    const isUserHost = !localPlayer && !!hostToken;
    setIsHost(isUserHost);

    setIsLastQuestion(localStorage.getItem('last_isLastQuestion') === 'true');
    setCategory(localStorage.getItem('last_category') || 'general');

    // 1. Fetch current leaderboard stats
    const fetchLeaderboard = async () => {
      try {
        const response = await getLeaderboard(pin);
        if (response.success) {
          const board = response.leaderboard || [];
          setLeaderboard(board);

          if (localPlayer) {
            const me = board.find(p => p.name.toLowerCase() === localPlayer.toLowerCase());
            if (me) setMyRank(me.rank);
          }
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      }
    };
    fetchLeaderboard();

    // 2. Connect Socket and Listen
    const socket = connectSocket();
    const roleOrName = isUserHost ? 'Host' : localPlayer;
    emitJoinRoom(pin, roleOrName);

    socket.on('question_started', (data) => {
      toast.success('Commencing next question! ⚔️');
      navigate(`/live/${pin}`, { state: { socketQuestionData: data } });
    });

    socket.on('quiz_ended', (data) => {
      toast.success('Battle finished! 🏆');
      navigate(`/final-result/${pin}`);
    });

    socket.on('room_closed', () => {
      navigate('/join');
    });

    return () => {
      socket.off('question_started');
      socket.off('quiz_ended');
      socket.off('room_closed');
    };
  }, [pin, playerName, navigate]);

  const handleNextStep = async () => {
    setIsLoadingNext(true);
    try {
      if (isLastQuestion) {
        // Ends game
        const response = await endGame(pin);
        if (response.success) {
          navigate(`/final-result/${pin}`);
        } else {
          toast.error(response.message || 'Error ending quiz');
        }
      } else {
        // Advances question
        const response = await startQuestion(pin);
        if (response.success) {
          const socketQuestionData = {
            question: response.question,
            questionNumber: response.question.questionNumber,
            totalQuestions: response.question.totalQuestions,
            timeLeft: response.question.timeLimit,
            quizBackgroundImage: response.quizBackgroundImage || ''
          };
          navigate(`/live/${pin}`, { state: { socketQuestionData } });
        } else {
          toast.error(response.message || 'Error commencing question');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Commencement error');
    } finally {
      setIsLoadingNext(false);
    }
  };

  // Sort board players into podium positions
  const firstPlace = leaderboard.find(p => p.rank === 1);
  const secondPlace = leaderboard.find(p => p.rank === 2);
  const thirdPlace = leaderboard.find(p => p.rank === 3);
  const runnersUp = leaderboard.filter(p => p.rank > 3);
  return (
    <AnimatedPage>
      {/* Background with blur and vignette */}
      <div className="relative min-h-screen bg-gradient-to-br from-[#0c051e] via-[#241249] to-[#0a0216] font-outfit overflow-hidden flex flex-col justify-start gap-4 p-6">
        
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
          transition={{ delay: 1, duration: 2.6, ease: "easeInOut", times: [0, 0.1, 0.3, 0.7, 0.85, 1] }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[80vh] bg-gradient-to-b from-white/70 via-white/20 to-transparent z-10 pointer-events-none mix-blend-overlay"
          style={{ clipPath: 'polygon(35% 0, 65% 0, 100% 100%, 0% 100%)' }}
        />
        
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#864CBF]/30 rounded-full blur-[120px] pointer-events-none z-0"></div>

        {/* Header Indicator */}
        <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4 relative z-10">
          <div className="flex items-center gap-2">
            {isHost && (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-200 hover:text-white hover:bg-white/10 transition-all text-xs font-black uppercase tracking-wider mr-2"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Dashboard</span>
              </button>
            )}
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Scoreboard Standings</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1 font-bold text-xs">
            <Users className="h-4 w-4 text-primary" />
            <span>PIN {pin}</span>
          </div>
        </div>

        {/* PODIUM DISPLAY CONTAINER (VISIBLE TO EVERYONE) */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full my-8 space-y-8 animate-fade-in relative z-10">
          
          <h2 className="font-outfit text-2xl sm:text-3.5xl font-black text-center text-white">
            Leaderboard Arena
          </h2>

          <div className="flex items-end justify-center gap-3 sm:gap-6 w-full max-w-lg h-60 mt-8">
            
            {/* 2ND PLACE PODIUM */}
            {secondPlace ? (
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs font-bold text-gray-300 truncate max-w-[80px]">{secondPlace.name}</span>
                <span className="text-[10px] text-gray-400 font-semibold">{secondPlace.totalScore || 0} pts ({secondPlace.lastTimeTaken || '0.00'}s)</span>
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

            {/* 1ST PLACE PODIUM (CROWN & MIDDLE TALL) */}
            {firstPlace ? (
              <div className="flex flex-col items-center flex-1">
                <Crown className="h-5 w-5 text-warning animate-bounce mb-1" />
                <span className="text-sm font-bold text-white truncate max-w-[90px]">{firstPlace.name}</span>
                <span className="text-[10px] text-warning font-bold">{firstPlace.totalScore || 0} pts ({firstPlace.lastTimeTaken || '0.00'}s)</span>
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

            {/* 3RD PLACE PODIUM */}
            {thirdPlace ? (
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs font-bold text-gray-300 truncate max-w-[80px]">{thirdPlace.name}</span>
                <span className="text-[10px] text-gray-400 font-semibold">{thirdPlace.totalScore || 0} pts ({thirdPlace.lastTimeTaken || '0.00'}s)</span>
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

          {/* RUNNERS UP ROW LIST (4TH PLACE+) */}
          {runnersUp.length > 0 && (
            <div className="w-full max-w-md space-y-2 overflow-y-auto max-h-[160px] pr-1">
              {runnersUp.map((player, idx) => (
                <div key={idx} className="glass-panel rounded-xl p-3.5 flex items-center justify-between text-xs border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-gray-500 font-bold">#{player.rank}</span>
                    <span className="font-bold text-gray-300">{player.name}</span>
                  </div>
                  <span className="font-semibold text-gray-400">{player.totalScore || 0} pts ({player.lastTimeTaken || '0.00'}s)</span>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* BOTTOM ACTION LAYOUT */}
        <div className="w-full max-w-md mx-auto mt-auto pt-4 border-t border-white/5">
          {isHost ? (
            <button
              onClick={handleNextStep}
              disabled={isLoadingNext}
              className="w-full btn-premium btn-primary-gradient py-3.5 flex items-center justify-center gap-2 text-sm font-bold shadow-premium-glow"
            >
              {isLoadingNext ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>{isLastQuestion ? 'Show Final Standings' : 'Launch Next Question'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Your Standing</p>
              <h4 className="font-outfit text-base font-extrabold text-white">
                {myRank ? `Rank #${myRank} of ${leaderboard.length}` : 'Calculating rankings...'}
              </h4>
              <p className="text-[9px] text-gray-400 animate-pulse mt-1">Waiting for host to commence next question...</p>
            </div>
          )}
        </div>

      </div>
    </AnimatedPage>
  );
}
