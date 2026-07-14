import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock, HelpCircle, Loader2, ArrowRight, ArrowLeft, XCircle,
  Cpu, Monitor, Keyboard, Mouse, Database, Server, Wifi, Terminal, Code2,
  Atom, FlaskConical, Dna, Orbit, Telescope, Microscope,
  Globe, Compass, Map, Scroll, Landmark, Anchor, History,
  Sparkles, Lightbulb, Gamepad2, BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import { connectSocket, getSocket, emitJoinRoom, disconnectSocket } from '../services/socketService';
import { submitAnswer, getGame, endQuestion } from '../services/gameService';
import { useGame } from '../context/GameContext';
import confetti from 'canvas-confetti';

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

const parseBgConfig = (bgStr) => {
  if (!bgStr) {
    return {
      url: '',
      blur: 0,
      brightness: 100,
      overlayOpacity: 30,
      gradientOverlay: 'none',
      gradientColor1: '#7c3aed',
      gradientColor2: '#06b6d4',
      position: 'center',
      fit: 'cover',
      darkOverlay: true
    };
  }
  try {
    let config = bgStr;
    // Recursively parse string if it's double serialized or nested JSON
    while (typeof config === 'string' && (config.trim().startsWith('{') || config.trim().startsWith('"'))) {
      const parsed = JSON.parse(config);
      if (typeof parsed === 'string' && parsed === config) {
        break; // Prevent infinite loop
      }
      config = parsed;
    }

    if (config && typeof config === 'object') {
      return {
        url: config.url || '',
        blur: typeof config.blur === 'number' ? config.blur : 0,
        brightness: typeof config.brightness === 'number' ? config.brightness : 100,
        overlayOpacity: typeof config.overlayOpacity === 'number' ? config.overlayOpacity : 30,
        gradientOverlay: config.gradientOverlay || 'none',
        gradientColor1: config.gradientColor1 || '#7c3aed',
        gradientColor2: config.gradientColor2 || '#06b6d4',
        position: config.position || 'center',
        fit: config.fit || 'cover',
        darkOverlay: config.darkOverlay !== undefined ? !!config.darkOverlay : true
      };
    }
  } catch (e) { }
  return {
    url: typeof bgStr === 'string' ? bgStr : (bgStr?.url || ''),
    blur: 0,
    brightness: 100,
    overlayOpacity: 30,
    gradientOverlay: 'none',
    gradientColor1: '#7c3aed',
    gradientColor2: '#06b6d4',
    position: 'center',
    fit: 'cover',
    darkOverlay: true
  };
};

export default function LiveQuiz() {
  const { pin } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { playerName, setPin, setPlayerName, setCurrentQuestion, setLeaderboard } = useGame();

  // Game state
  const [question, setQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(1);
  const [timeLeft, setTimeLeft] = useState(20);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [category, setCategory] = useState('general');
  const [bgImage, setBgImage] = useState(localStorage.getItem('last_bg_image') || '');

  // Player state
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const localPlayer = playerName || localStorage.getItem('guest_playerName');
    const hostToken = localStorage.getItem('token');
    const hostedPin = localStorage.getItem('current_hosted_pin');

    // Determine user role
    const isUserHost = !!hostToken && (hostedPin === pin || !localPlayer);
    setIsHost(isUserHost);

    if (!localPlayer && !isUserHost) {
      toast.error('Session invalid. Please join again.');
      navigate('/join');
      return;
    }

    // 1. Fetch current question details if reloaded
    const fetchCurrentState = async () => {
      try {
        const response = await getGame(pin);
        if (response.success && response.game) {
          const game = response.game;
          setTotalPlayers(game.players?.length || 0);

          if (game.status === 'active' && game.quiz?.questions) {
            const currentIdx = game.currentQuestion - 1;
            const q = game.quiz.questions[currentIdx];
            setQuestion(q);
            setQuestionNumber(game.currentQuestion);
            setTotalQuestions(game.quiz.questions.length);
            setCategory(game.quiz.category || 'general');
            // Use cached game.backgroundImage (on GameSession) as primary source
            const globalBg = game.backgroundImage || game.quiz.backgroundImage || '';
            const currentBg = q.backgroundImage || globalBg;
            console.log('[FETCH STATE] globalBg length:', globalBg.length, 'preview:', globalBg.substring(0, 80));
            setBgImage(currentBg);
            localStorage.setItem('last_category', game.quiz.category || 'general');
            localStorage.setItem('quiz_global_bg_image', globalBg);
            localStorage.setItem('last_bg_image', currentBg);

            if (game.questionStartTime) {
              const elapsedSeconds = Math.floor((Date.now() - new Date(game.questionStartTime).getTime()) / 1000);
              const limit = q.timeLimit || 20;
              const remaining = Math.max(0, limit - elapsedSeconds);
              setTimeLeft(remaining);
            } else {
              setTimeLeft(q.timeLimit || 20);
            }

            if (!isUserHost && localPlayer) {
              const myPlayerRecord = game.players?.find(p => p.name.toLowerCase() === localPlayer.toLowerCase());
              if (myPlayerRecord) {
                const myAnswer = myPlayerRecord.answers?.find(a => a.questionIndex === currentIdx);
                if (myAnswer) {
                  setHasAnswered(true);
                  localStorage.setItem('last_hasAnswered', 'true');
                  setSelectedIdx(Number(myAnswer.answerIndex));
                }
              }
            }
          } else if (game.status === 'finished') {
            navigate(`/final-result/${pin}`);
          }
        }
      } catch (err) {
        console.error('Error fetching game state:', err);
      }
    };

    if (location.state?.socketQuestionData) {
      const data = location.state.socketQuestionData;
      const q = data.question;
      console.log('[LIVE QUIZ] socketQuestionData received:', {
        quizBackgroundImage: (data.quizBackgroundImage || '').substring(0, 100),
        questionBackgroundImage: (q.backgroundImage || '').substring(0, 100),
      });
      setQuestion(q);
      setQuestionNumber(data.questionNumber);
      setTotalQuestions(data.totalQuestions);
      setTimeLeft(data.timeLeft);
      setCategory(q.category || 'general');
      localStorage.setItem('last_category', q.category || 'general');
      // Use the quiz global bg from the socket payload (teacher's customized bg)
      const globalBg = data.quizBackgroundImage || localStorage.getItem('quiz_global_bg_image') || '';
      localStorage.setItem('quiz_global_bg_image', globalBg);
      const resolvedBg = q.backgroundImage || globalBg;
      console.log('[LIVE QUIZ] resolved bgImage length:', resolvedBg.length, 'preview:', resolvedBg.substring(0, 100));
      setBgImage(resolvedBg);
      localStorage.setItem('last_bg_image', resolvedBg);
      setHasAnswered(false);
      localStorage.setItem('last_hasAnswered', 'false');
      setSelectedIdx(null);
    } else {
      // No socket data — must fetch from server (e.g. page refresh)
      fetchCurrentState();
    }

    // 2. Connect Socket and Register Listeners (handle reconnects)
    const socket = connectSocket();
    const roleOrName = isUserHost ? 'Host' : localPlayer;

    const joinRoom = () => {
      emitJoinRoom(pin, roleOrName);
    };

    socket.on('connect', joinRoom);
    if (socket.connected) {
      joinRoom();
    }

    socket.on('timer_update', ({ timeLeft: time }) => {
      setTimeLeft(time);
    });

    socket.on('player_answered', ({ answeredCount: count, totalPlayers: total }) => {
      setAnsweredCount(count);
      setTotalPlayers(total);
    });

    socket.on('question_started', (data) => {
      console.log('[SOCKET CLIENT] Question started inside LiveQuiz:', data);
      const q = data.question;
      setQuestion(q);
      setQuestionNumber(data.questionNumber);
      setTotalQuestions(data.totalQuestions);
      setTimeLeft(data.timeLeft);
      setCategory(q.category || 'general');
      localStorage.setItem('last_category', q.category || 'general');
      // Update global bg from socket payload (teacher's customized bg)
      const globalBg = data.quizBackgroundImage || localStorage.getItem('quiz_global_bg_image') || '';
      localStorage.setItem('quiz_global_bg_image', globalBg);
      const resolvedBg = q.backgroundImage || globalBg;
      setBgImage(resolvedBg);
      localStorage.setItem('last_bg_image', resolvedBg);
      setHasAnswered(false);
      localStorage.setItem('last_hasAnswered', 'false');
      setSelectedIdx(null);
    });

    socket.on('question_ended', (data) => {
      console.log('[SOCKET CLIENT] Question ended:', data);

      // Save stats to context and local storage for results page
      localStorage.setItem('last_correctAnswerIndex', data.correctAnswerIndex);
      localStorage.setItem('last_answerStats', JSON.stringify(data.answerStats));
      localStorage.setItem('last_leaderboard', JSON.stringify(data.leaderboard));
      localStorage.setItem('last_isLastQuestion', data.isLastQuestion ? 'true' : 'false');
      localStorage.setItem('last_category', category);

      // If player, save if their answer was correct and points earned
      if (!isUserHost) {
        const myData = data.leaderboard?.find(p => p.username?.toLowerCase() === localPlayer?.toLowerCase());
        if (myData) {
          localStorage.setItem('last_isCorrect', myData.lastAnswerCorrect ? 'true' : 'false');
          localStorage.setItem('last_pointsEarned', String(myData.pointsEarned));
          localStorage.setItem('last_score', String(myData.score));
          localStorage.setItem('last_timeTaken', String(myData.lastTimeTaken || '0.00'));
        }
      }

      // Navigate to Answer Result page
      setTimeout(() => {
        navigate(`/result/answer/${pin}`);
      }, 500);
    });

    socket.on('room_closed', () => {
      toast.error('The host terminated the session.');
      navigate('/join');
    });

    return () => {
      socket.off('connect', joinRoom);
      socket.off('timer_update');
      socket.off('player_answered');
      socket.off('question_started');
      socket.off('question_ended');
      socket.off('room_closed');
    };
  }, [pin, playerName, navigate, location.state]);

  const [isEnding, setIsEnding] = useState(false);

  const handleManualEndQuestion = async () => {
    setIsEnding(true);
    toast.loading('Ending question...', { id: 'end-q' });
    try {
      const response = await endQuestion(pin);
      if (response.success) {
        toast.success('Question ended! 🏁');
      } else {
        toast.error(response.message || 'Failed to end question');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error ending question');
    } finally {
      toast.dismiss('end-q');
      setIsEnding(false);
    }
  };

  const handleSelectAnswer = async (index) => {
    if (hasAnswered || isHost) return;

    setHasAnswered(true);
    setSelectedIdx(index);
    toast.loading('Registering answer...', { id: 'submit-ans' });

    try {
      const player = playerName || localStorage.getItem('guest_playerName');
      const response = await submitAnswer(pin, player, index);

      if (response.success) {
        toast.success('Answer locked! 🔒');
        localStorage.setItem('last_hasAnswered', 'true');
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        toast.error(response.message || 'Error locking answer');
        setHasAnswered(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting answer');
      setHasAnswered(false);
    } finally {
      toast.dismiss('submit-ans');
    }
  };

  // Local countdown timer
  useEffect(() => {
    if (!question) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [question]);

  // Host auto-end question logic
  useEffect(() => {
    if (!isHost || !question) return;

    const autoEnd = async () => {
      try {
        await endQuestion(pin);
      } catch (err) {
        console.error('Error auto-ending question:', err);
      }
    };

    const allAnswered = totalPlayers > 0 && answeredCount === totalPlayers;
    const timeIsUp = timeLeft === 0;

    if (allAnswered || timeIsUp) {
      autoEnd();
    }
  }, [timeLeft, answeredCount, totalPlayers, isHost, question, pin]);

  if (!question) {
    return (
      <AnimatedPage>
        <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
          <div className="text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-secondary mx-auto" />
            <p className="text-xs text-gray-400">Synchronizing game board...</p>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  // Answer Options Grid styling variables (Kahoot-style solid colors)
  const optionColors = [
    'bg-[#e21b3c] border-[#e21b3c] hover:bg-[#c91230] text-white shadow-lg cursor-pointer hover:shadow-xl',
    'bg-[#1368ce] border-[#1368ce] hover:bg-[#1059b0] text-white shadow-lg cursor-pointer hover:shadow-xl',
    'bg-[#d89e00] border-[#d89e00] hover:bg-[#b88500] text-white shadow-lg cursor-pointer hover:shadow-xl',
    'bg-[#26890c] border-[#26890c] hover:bg-[#1f6f0a] text-white shadow-lg cursor-pointer hover:shadow-xl'
  ];

  const optionHostColors = [
    'bg-[#e21b3c] border-[#e21b3c] text-white shadow-lg cursor-default',
    'bg-[#1368ce] border-[#1368ce] text-white shadow-lg cursor-default',
    'bg-[#d89e00] border-[#d89e00] text-white shadow-lg cursor-default',
    'bg-[#26890c] border-[#26890c] text-white shadow-lg cursor-default'
  ];

  const optionShapes = [
    // Triangle (Red)
    <svg className="h-5 w-5 sm:h-6 sm:w-6 fill-white stroke-transparent shrink-0" viewBox="0 0 24 24" key="triangle">
      <path d="M12 3l10 17H2L12 3z" />
    </svg>,
    // Diamond (Blue)
    <svg className="h-5 w-5 sm:h-6 sm:w-6 fill-white stroke-transparent shrink-0 rotate-45" viewBox="0 0 24 24" key="diamond">
      <rect x="5" y="5" width="14" height="14" />
    </svg>,
    // Circle (Yellow)
    <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-white shrink-0 shadow-sm" key="circle" />,
    // Square (Green)
    <div className="h-5 w-5 sm:h-6 sm:w-6 rounded bg-white shrink-0 shadow-sm" key="square" />
  ];

  const theme = getTheme(category);
  const bgConfig = parseBgConfig(bgImage);


  return (
    <AnimatedPage>
      <div className="relative h-[100dvh] flex flex-col justify-between gap-3 p-3 sm:p-6 transition-all duration-700 overflow-hidden select-none">

        {/* Customized Background Layer */}
        {bgConfig.url ? (
          <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000 ease-out animate-fade-in">
            <div
              style={{
                backgroundImage: `url(${bgConfig.url})`,
                backgroundPosition: bgConfig.position,
                backgroundSize: bgConfig.fit,
                backgroundRepeat: 'no-repeat',
                filter: `blur(${bgConfig.blur}px) brightness(${bgConfig.brightness}%)`,
                position: 'fixed',
                inset: '-20px',
              }}
            />
            {bgConfig.darkOverlay && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: `rgba(0, 0, 0, ${bgConfig.overlayOpacity / 100})`,
                }}
              />
            )}
            {bgConfig.gradientOverlay !== 'none' && (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    bgConfig.gradientOverlay === 'linear'
                      ? `linear-gradient(135deg, ${bgConfig.gradientColor1}33, ${bgConfig.gradientColor2}33)`
                      : `radial-gradient(circle, ${bgConfig.gradientColor1}33 0%, ${bgConfig.gradientColor2}33 100%)`,
                }}
              />
            )}
          </div>
        ) : (
          <div className={`absolute inset-0 ${theme.bg} z-0 pointer-events-none`} />
        )}

        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 ambient-grid opacity-25 pointer-events-none"></div>

        {/* Glow Spheres */}
        <div className={`absolute top-[10%] left-[20%] h-[350px] w-[350px] rounded-full ${theme.glow1} pointer-events-none filter blur-[100px]`}></div>
        <div className={`absolute bottom-[10%] right-[20%] h-[400px] w-[400px] rounded-full ${theme.glow2} pointer-events-none filter blur-[120px]`}></div>

        {/* Dynamic theme element floaters */}
        {theme.ambientElements}

        {/* Header Indicator */}
        <div className="flex justify-between items-center pb-2 sm:pb-4 relative z-10 shrink-0">
          <div className="flex items-center gap-2">
            {isHost && (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-200 hover:text-white hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-wider mr-1"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Dashboard</span>
              </button>
            )}
            <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl uppercase tracking-wider ${theme.badgeBg}`}>
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest hidden sm:inline">{category}</span>
          </div>

          {/* Timer Display */}
          <div className="flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 px-2.5 py-1 sm:px-4 sm:py-1.5 font-bold shrink-0">
            <Clock className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-secondary animate-pulse" />
            <span className="text-xs sm:text-sm font-mono">{timeLeft}s</span>
          </div>
        </div>

        {/* QUESTION TEXT PANEL */}
        <div className="my-1 sm:my-4 max-w-4xl mx-auto text-center relative z-10 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-gray-200 shadow-xl shrink-0 w-full">
          <h2 className="font-outfit text-lg sm:text-2xl md:text-3.5xl text-gray-900 font-black leading-tight">
            {question.questionText}
          </h2>
        </div>

        {/* CENTRAL STATE VIEW (PROGRESS FOR HOST / WAITING FOR PLAYER) */}
        <div className="flex items-center justify-center max-w-xl mx-auto w-full my-1 sm:my-4 relative z-10 shrink-0">
          {isHost ? (
            /* HOST PANEL */
            <div className={`w-full glass-panel rounded-2xl p-4 border ${theme.cardBorder} text-center space-y-2`}>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">Lobby Statistics</span>
              <div className="font-outfit text-2xl font-extrabold text-white">
                {answeredCount} <span className="text-xs font-medium text-gray-400">/ {totalPlayers} Answered</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/10">
                <div
                  className="bg-primary h-full transition-all duration-500"
                  style={{ width: `${totalPlayers ? (answeredCount / totalPlayers) * 100 : 0}%` }}
                />
              </div>
              <button
                onClick={handleManualEndQuestion}
                disabled={isEnding}
                className="w-full btn-premium btn-primary-gradient py-2 flex items-center justify-center gap-1.5 text-[10px] font-bold shadow-premium-glow cursor-pointer mt-2"
              >
                <span>End Question / Skip to Standings</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ) : hasAnswered ? (
            /* PLAYER WAITING PANEL */
            <div className={`text-center space-y-2 glass-panel rounded-2xl p-5 w-full border ${theme.cardBorder}`}>
              <div className="h-8 w-8 rounded-full bg-secondary/15 border border-secondary/20 flex items-center justify-center mx-auto text-secondary">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
              <h3 className="font-outfit text-sm font-bold text-white">Answer Locked!</h3>
              <p className="text-[10px] text-gray-400">Waiting for other challengers to submit their choices...</p>
            </div>
          ) : timeLeft <= 0 ? (
            /* PLAYER TIME'S UP PANEL */
            <div className={`text-center space-y-2 glass-panel rounded-2xl p-5 w-full border ${theme.cardBorder}`}>
              <div className="h-8 w-8 rounded-full bg-red-500/15 border border-red-500/20 flex items-center justify-center mx-auto text-red-500">
                <XCircle className="h-5 w-5" />
              </div>
              <h3 className="font-outfit text-sm font-bold text-white">Time's Up!</h3>
              <p className="text-[10px] text-gray-400">Waiting for the teacher to end the question...</p>
            </div>
          ) : null}
        </div>

        {/* ANSWERS LAYOUT (HOST SEES ONLY GRID, PLAYER SEES LARGE TAP BUTTONS) */}
        <div className="w-full max-w-5xl mx-auto grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-2 relative z-10 sm:flex-1 mt-2 sm:my-4 pb-2 sm:pb-0">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              disabled={hasAnswered || isHost || timeLeft <= 0}
              onClick={() => handleSelectAnswer(idx)}
              className={`rounded-xl sm:rounded-2xl border-2 px-5 py-4 sm:px-8 sm:py-6 flex items-center justify-between gap-3 sm:gap-5 text-left transition-all active:scale-[0.98] ${isHost
                  ? optionHostColors[idx]
                  : hasAnswered
                    ? selectedIdx === idx
                      ? optionColors[idx] + ' opacity-100 scale-[1.01] ring-2 ring-white/50 border-white'
                      : optionColors[idx] + ' opacity-30 cursor-not-allowed scale-[0.99]'
                    : timeLeft <= 0
                      ? optionColors[idx] + ' opacity-35 cursor-not-allowed scale-[0.99]'
                      : optionColors[idx]
                }`}
            >
              <div className="flex items-center gap-3 sm:gap-5">
                {/* Kahoot Solid White Shape Icon */}
                {optionShapes[idx]}
                <span className="text-xs sm:text-lg md:text-xl font-black tracking-wide text-white line-clamp-1">
                  {opt}
                </span>
              </div>

              {/* Selection Circle Outline on the right */}
              <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 sm:border-3 border-white/70 flex items-center justify-center shrink-0">
                {hasAnswered && selectedIdx === idx && (
                  <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-white" />
                )}
              </div>
            </button>
          ))}
        </div>

      </div>
    </AnimatedPage>
  );
}
