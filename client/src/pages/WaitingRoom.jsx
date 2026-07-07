import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShieldAlert, Zap, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import ThemeBackground from '../components/ThemeBackground';
import { connectSocket, emitJoinRoom, disconnectSocket } from '../services/socketService';
import { useGame } from '../context/GameContext';

export default function WaitingRoom() {
  const { pin } = useParams();
  const navigate = useNavigate();
  const { playerName, setPin, setPlayerName } = useGame();
  const [players, setPlayers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

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

    // 2. Register Player inside Socket Room
    emitJoinRoom(pin, localPlayerName);

    // 3. Listen to state updates
    socket.on('player_list', (data) => {
      console.log('[SOCKET CLIENT] Received player list:', data.players);
      setPlayers(data.players || []);
    });

    socket.on('question_started', (data) => {
      console.log('[SOCKET CLIENT] Battle started! Redirecting...', data);
      toast.success('Commencing battle! Get ready! ⚔️');
      navigate(`/live/${pin}`);
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
      socket.off('player_list');
      socket.off('question_started');
      socket.off('room_closed');
      socket.off('player_connected');
      socket.off('player_disconnected');
    };
  }, [pin, localPlayerName, playerName, navigate]);

  return (
    <ThemeBackground>
      <AnimatedPage>
        <div className="relative min-h-screen p-6 sm:p-8 flex flex-col items-center justify-center">

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
                {players.map((p, idx) => (
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
              </div>
            )}
          </div>

        </motion.div>
      </div>
      </AnimatedPage>
    </ThemeBackground>
  );
}
