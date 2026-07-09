import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShieldAlert, Zap, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import { connectSocket, emitJoinRoom, disconnectSocket } from '../services/socketService';
import { useGame } from '../context/GameContext';
import { getGame } from '../services/gameService';

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
    const config = JSON.parse(bgStr);
    if (config && typeof config === 'object' && 'url' in config) {
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
  } catch (e) {}
  return {
    url: bgStr,
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

export default function WaitingRoom() {
  const { pin } = useParams();
  const navigate = useNavigate();
  const { playerName, setPin, setPlayerName } = useGame();
  const [players, setPlayers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [bgImage, setBgImage] = useState(localStorage.getItem('last_bg_image') || '');

  // Fetch quiz background image on mount
  useEffect(() => {
    getGame(pin).then(res => {
      if (res.success) {
        // game.backgroundImage is cached directly on GameSession for reliability
        const bg = res.game?.backgroundImage || res.game?.quiz?.backgroundImage || '';
        console.log('[WAITING ROOM] Fetched background length:', bg.length, 'preview:', bg.substring(0, 80));
        setBgImage(bg);
        localStorage.setItem('quiz_global_bg_image', bg);
        localStorage.setItem('last_bg_image', bg);
      }
    }).catch(() => {});
  }, [pin]);

  // Fallback if player refresh and context gets cleared
  const localPlayerName = playerName || localStorage.getItem('guest_playerName') || 'Player';

  useEffect(() => {
    if (!playerName && !localStorage.getItem('guest_playerName')) {
      toast.error('Session expired. Please join the lobby again.');
      navigate('/join');
      return;
    }

    // Persist to localStorage for fallback reload support
    if (playerName) {
      localStorage.setItem('guest_pin', pin);
      localStorage.setItem('guest_playerName', playerName);
    }

    // 1. Establish Socket Connection
    const socket = connectSocket();
    setIsConnected(true);

    // 2. Register Player inside Socket Room (handle reconnects)
    const joinRoom = () => {
      emitJoinRoom(pin, localPlayerName);
    };
    
    socket.on('connect', joinRoom);
    if (socket.connected) {
      joinRoom();
    }

    // 3. Listen to state updates
    socket.on('player_list', (data) => {
      console.log('[SOCKET CLIENT] Received player list:', data.players);
      setPlayers(data.players || []);
    });

    socket.on('question_started', (data) => {
      console.log('[SOCKET CLIENT] Battle started! Redirecting...', data);
      toast.success('Commencing battle! Get ready! ⚔️');
      // Store the global background before navigating
      const globalBg = localStorage.getItem('quiz_global_bg_image') || '';
      const questionBg = data?.question?.backgroundImage || '';
      const resolvedBg = questionBg || globalBg;
      localStorage.setItem('last_bg_image', resolvedBg);
      // Pass full socket data so LiveQuiz gets background immediately without extra API call
      navigate(`/live/${pin}`, { state: { socketQuestionData: data } });
    });

    socket.on('room_closed', ({ message }) => {
      toast.error(message || 'Host closed the room');
      localStorage.removeItem('guest_pin');
      localStorage.removeItem('guest_playerName');
      navigate('/join');
    });

    socket.on('player_connected', ({ username }) => {
      if (username !== localPlayerName) {
        toast(`${username} entered the waiting room`, { icon: '🛡️' });
      }
    });

    socket.on('player_disconnected', ({ username }) => {
      toast.error(`${username} left the lobby`);
    });

    return () => {
      socket.off('connect', joinRoom);
      socket.off('player_list');
      socket.off('question_started');
      socket.off('room_closed');
      socket.off('player_connected');
      socket.off('player_disconnected');
    };
  }, [pin, localPlayerName, playerName, navigate]);

  const bgConfig = parseBgConfig(bgImage);

  return (
    <AnimatedPage>
      <div className="relative min-h-screen text-gray-200 p-6 sm:p-8 flex flex-col items-center justify-center overflow-hidden">
        
        {/* Customized Background Layer */}
        {bgConfig.url ? (
          <div className="fixed inset-0 z-0 pointer-events-none transition-all duration-700">
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
          <div className="absolute inset-0 bg-background z-0 pointer-events-none" />
        )}
        
        {/* Glow Spheres */}
        <div className="absolute top-[10%] left-[10%] h-[350px] w-[350px] bg-glow-primary pointer-events-none opacity-45"></div>
        <div className="absolute bottom-[10%] right-[10%] h-[400px] w-[400px] bg-glow-secondary pointer-events-none opacity-30"></div>



        {/* Waiting card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          className="w-full max-w-xl glass-panel rounded-3xl p-8 sm:p-10 border border-white/5 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>

          {/* Large Loading animation */}
          <div className="mb-8 relative flex items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center relative">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            {/* Pulsing ring */}
            <div className="absolute h-28 w-28 rounded-full border border-secondary/15 animate-ping opacity-25 pointer-events-none"></div>
          </div>

          <h2 className="font-outfit text-3xl font-extrabold text-white">Waiting for Host...</h2>
          <p className="text-sm text-gray-400 mt-2">
            Stay tuned. The host will commence the quiz battle shortly.
          </p>

          {/* Lobby PIN details */}
          <div className="mt-6 inline-flex flex-col items-center px-6 py-2.5 rounded-2xl bg-white/5 border border-white/10 font-bold text-gray-300">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-0.5">Arena PIN</span>
            <span className="font-outfit text-2xl tracking-widest text-secondary">{pin}</span>
          </div>

          {/* Players joined section */}
          <div className="mt-10 pt-8 border-t border-white/5 text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-outfit text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary" />
                Challengers in Arena
              </h3>
              <span className="text-xs font-bold text-white bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-lg">
                {players.length} Ready
              </span>
            </div>

            {players.length === 0 ? (
              <p className="text-xs text-gray-500 italic text-center py-4">Synchronizing player logs...</p>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-1">
                {players.slice(0, 50).map((p, idx) => (
                  <div 
                    key={idx} 
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
                      p.username.toLowerCase() === localPlayerName.toLowerCase()
                        ? 'bg-secondary/10 border-secondary/25 text-secondary font-bold' 
                        : 'bg-white/5 border-white/10 text-gray-300'
                    }`}
                  >
                    <div className={`h-1.5 w-1.5 rounded-full ${p.username.toLowerCase() === localPlayerName.toLowerCase() ? 'bg-secondary' : 'bg-gray-500'}`}></div>
                    <span>{p.username}</span>
                  </div>
                ))}
                {players.length > 50 && (
                  <div className="px-3 py-1.5 rounded-lg border border-dashed border-white/10 bg-white/5 text-xs font-semibold text-gray-400">
                    + {players.length - 50} more challengers...
                  </div>
                )}
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatedPage>
  );
}
