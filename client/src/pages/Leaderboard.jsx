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
import { connectSocket, getSocket, emitJoinRoom, disconnectSocket } from '../services/socketService';
import { getLeaderboard, startQuestion, endGame } from '../services/gameService';
import { useGame } from '../context/GameContext';

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
            timeLeft: response.question.timeLimit
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

  const theme = getTheme(category);

  return (
    <AnimatedPage>
      <div className={`relative min-h-screen ${theme.bg} animate-gradient-bg text-gray-200 p-6 flex flex-col justify-between transition-all duration-700 overflow-hidden`}>
        
        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 ambient-grid opacity-25 pointer-events-none"></div>

        {/* Glow Spheres */}
        <div className={`absolute top-[10%] left-[10%] h-[350px] w-[350px] rounded-full ${theme.glow1} pointer-events-none filter blur-[100px]`}></div>
        <div className={`absolute bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full ${theme.glow2} pointer-events-none filter blur-[120px]`}></div>

        {/* Dynamic theme ambient elements */}
        {theme.ambientElements}

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
                <span className="text-[10px] text-gray-400 font-semibold">{secondPlace.correctAnswers || 0} Correct ({secondPlace.lastTimeTaken || '0.00'}s)</span>
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
                <span className="text-[10px] text-warning font-bold">{firstPlace.correctAnswers || 0} Correct ({firstPlace.lastTimeTaken || '0.00'}s)</span>
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
                <span className="text-[10px] text-gray-400 font-semibold">{thirdPlace.correctAnswers || 0} Correct ({thirdPlace.lastTimeTaken || '0.00'}s)</span>
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
                  <span className="font-semibold text-gray-400">{player.correctAnswers || 0} Correct ({player.lastTimeTaken || '0.00'}s)</span>
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
