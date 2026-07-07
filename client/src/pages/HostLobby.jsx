import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Play, ShieldAlert, Award, QrCode, ArrowLeft, Loader2, Edit2, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import { getGame as fetchGameDetails, startQuestion } from '../services/gameService';
import { connectSocket, getSocket, emitJoinRoom, disconnectSocket } from '../services/socketService';
import tunnelData from '../tunnel.json';

export default function HostLobby() {
  const { pin } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [customUrl, setCustomUrl] = useState('');
  const [isEditingIp, setIsEditingIp] = useState(false);
  const [ipInput, setIpInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [hostnameUrl, setHostnameUrl] = useState('');
  const [showTunnelGuide, setShowTunnelGuide] = useState(false);

  // Fetch initial game state (e.g. to get QR Code and quiz title)
  const { 
    data: gameData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['game-lobby', pin],
    queryFn: () => fetchGameDetails(pin),
    refetchOnWindowFocus: false,
  });

  const game = gameData?.game;

  // Sync customUrl when game is loaded
  useEffect(() => {
    const hostname = window.location.hostname;
    const isCustomDomain = hostname === 'fourisequiz.com' || hostname.endsWith('.fourisequiz.com');
    const isLocal = hostname === 'localhost' || hostname.match(/^\d+\.\d+\.\d+\.\d+$/) || hostname.endsWith('.local');

    if (isCustomDomain) {
      const activeUrl = `${window.location.origin}/join?pin=${pin}`;
      setCustomUrl(activeUrl);
      setHostnameUrl(activeUrl);
      setIpInput(window.location.host);
    } else if (tunnelData && tunnelData.url) {
      const activeUrl = `${tunnelData.url}/join?pin=${pin}`;
      setCustomUrl(activeUrl);
      setHostnameUrl(activeUrl);
      try {
        const url = new URL(tunnelData.url);
        setIpInput(url.host);
      } catch (e) {
        setIpInput(window.location.host);
      }
    } else if (game?.joinUrl && isLocal) {
      setCustomUrl(game.joinUrl);
      setHostnameUrl(game.hostnameUrl || '');
      // Extract IP:port or hostname from the url
      try {
        const url = new URL(game.joinUrl);
        setIpInput(url.host); // e.g. "192.168.1.43:5173"
      } catch (e) {
        setIpInput(window.location.host);
      }
    } else {
      setCustomUrl(`${window.location.origin}/join?pin=${pin}`);
      setHostnameUrl(`${window.location.hostname}.local:5173/join?pin=${pin}`);
      setIpInput(window.location.host);
    }
  }, [game, pin]);

  // Sync whatsappUrl when customUrl changes
  useEffect(() => {
    const isTunnelActive = tunnelData && tunnelData.url;
    const wifiNotice = isTunnelActive 
      ? `(You can join from any Wi-Fi network!)`
      : `(Ensure your phone is connected to the same Wi-Fi network as the host!)`;

    const shareMessage = `Join my Fourise Quiz Hub arena! 🚀\n\n📌 *Game PIN*: ${pin}\n\n🔗 *Join Link*:\n${customUrl}\n\n${wifiNotice}`;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const baseUrl = isMobile 
      ? 'https://api.whatsapp.com/send' 
      : 'https://web.whatsapp.com/send';
    
    setWhatsappUrl(`${baseUrl}?text=${encodeURIComponent(shareMessage)}`);
  }, [pin, customUrl, hostnameUrl, ipInput]);

  useEffect(() => {
    // Identify as host for this pin in local storage
    localStorage.setItem('current_hosted_pin', pin);

    // 1. Connect Socket
    const socket = connectSocket();

    // 2. Join Room as Host (handle reconnects)
    const joinRoom = () => {
      emitJoinRoom(pin, 'Host');
    };
    
    socket.on('connect', joinRoom);
    if (socket.connected) {
      joinRoom();
    }

    // 3. Listen to player updates
    socket.on('player_list', (data) => {
      console.log('[SOCKET] Received player list:', data.players);
      setPlayers(data.players || []);
    });

    socket.on('player_connected', ({ username }) => {
      toast.success(`${username} joined the battle! ⚔️`);
    });

    socket.on('player_disconnected', ({ username }) => {
      toast.error(`${username} left the lobby`);
    });

    socket.on('question_started', (data) => {
      // Transition host to Live Quiz screen
      navigate(`/live/${pin}`);
    });

    return () => {
      // Clean up event listeners on unmount
      socket.off('connect', joinRoom);
      socket.off('player_list');
      socket.off('player_connected');
      socket.off('player_disconnected');
      socket.off('question_started');
    };
  }, [pin, navigate]);

  const handleStartGame = async () => {
    if (players.length === 0) {
      toast.error('Cannot start the battle without players!');
      return;
    }

    toast.loading('Launching quiz...', { id: 'start-quiz' });
    try {
      const response = await startQuestion(pin);
      if (response.success) {
        toast.success('Battle commenced! 🚀');
        navigate(`/live/${pin}`);
      } else {
        toast.error(response.message || 'Failed to start quiz');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error commencing battle');
    } finally {
      toast.dismiss('start-quiz');
    }
  };

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="flex-1 flex items-center justify-center min-h-[70vh] bg-background">
          <div className="text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="text-xs text-gray-400">Locking PIN coordinates...</p>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  if (error) {
    return (
      <AnimatedPage>
        <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] bg-background text-center px-4">
          <ShieldAlert className="h-12 w-12 text-accent mb-4" />
          <h2 className="font-outfit text-xl font-bold text-white">Lobby Error</h2>
          <p className="text-sm text-gray-400 mt-1 max-w-[280px] leading-relaxed">
            Could not retrieve game lobby details. Verify the PIN is correct.
          </p>
          <button onClick={() => navigate('/dashboard')} className="btn-premium btn-primary-gradient px-4 py-2.5 text-xs font-bold mt-5">
            Return to Dashboard
          </button>
        </div>
      </AnimatedPage>
    );
  }

  const handleSaveIp = () => {
    const trimmed = ipInput.trim();
    if (!trimmed) {
      toast.error('IP/Host cannot be empty');
      return;
    }
    
    let newUrl;
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const base = trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
      if (base.includes('/join')) {
        try {
          const parsed = new URL(base);
          newUrl = `${parsed.origin}/join?pin=${pin}`;
        } catch (e) {
          newUrl = base;
        }
      } else {
        newUrl = `${base}/join?pin=${pin}`;
      }
    } else {
      newUrl = `http://${trimmed}/join?pin=${pin}`;
    }
    
    setCustomUrl(newUrl);
    setIsEditingIp(false);
    toast.success('Join URL updated! 🌐');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(customUrl);
    setCopiedLink(true);
    toast.success('Join link copied! 🔗');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyQRCode = async () => {
    try {
      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(customUrl)}`);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      toast.success('QR Code copied as image! 📋 Paste it into WhatsApp.');
    } catch (err) {
      console.error(err);
      toast.error('Could not copy QR image directly. Share the link instead!');
    }
  };



  return (
    <AnimatedPage>
      <div className="relative min-h-screen bg-background text-gray-200 p-6 sm:p-8 flex flex-col items-center justify-center">
        
        {/* Glow Spheres */}
        <div className="absolute top-[5%] left-[10%] h-[350px] w-[350px] bg-glow-primary pointer-events-none opacity-45"></div>
        <div className="absolute bottom-[5%] right-[10%] h-[400px] w-[400px] bg-glow-secondary pointer-events-none opacity-30"></div>

        {/* Floating Return Button */}
        <div className="w-full max-w-4xl flex justify-start mb-4 relative z-10">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-200 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-xs font-black uppercase tracking-wider"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </button>
        </div>

        <div className="w-full max-w-4xl relative z-10 grid gap-8 md:grid-cols-3 text-left">
          
          {/* LEFT/CENTER PANELS: PIN & QR CODE */}
          <div className="md:col-span-2 space-y-6">
            
            {/* PIN Card */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
              
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Host Lobby Room
                </span>
                <h2 className="font-outfit text-xl font-extrabold text-white mt-2">{game?.quiz?.title || 'Commencing Battle'}</h2>
                <p className="text-xs text-gray-400 max-w-[280px]">Scan the QR or go to Fourise Quiz Hub and enter the PIN below.</p>
              </div>

              <div className="space-y-1 text-center shrink-0">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">LOBBY PIN</span>
                <div className="font-outfit text-4xl sm:text-5xl font-black text-secondary tracking-widest animate-pulse">
                  {pin}
                </div>
              </div>
            </div>

            {/* Players Panel */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/5 min-h-[320px] flex flex-col justify-between">
              
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                  <h3 className="font-outfit text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Users className="h-4.5 w-4.5 text-secondary" />
                    Players Joined
                  </h3>
                  <span className="text-xs font-bold text-white bg-white/5 border border-white/10 px-3 py-1 rounded-xl">
                    {players.length} Joined
                  </span>
                </div>

                {players.length === 0 ? (
                  /* Waiting animation illustration */
                  <div className="py-12 text-center space-y-4">
                    <div className="h-10 w-10 border-2 border-dashed border-gray-600 rounded-full animate-spin mx-auto"></div>
                    <p className="text-xs text-gray-500">Waiting for challengers to join the arena...</p>
                  </div>
                ) : (
                  /* Connected players badge grid */
                  <div className="flex flex-wrap gap-2.5 max-h-[180px] overflow-y-auto pr-1">
                    <AnimatePresence>
                      {players.slice(0, 100).map((player, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white flex items-center gap-2 hover:border-primary/40 transition-colors"
                        >
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span>{player.username}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {players.length > 100 && (
                      <div className="px-3.5 py-2 rounded-xl border border-dashed border-white/10 bg-white/5 text-xs font-bold text-gray-400">
                        + {players.length - 100} more challengers...
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* COMMENCE PLAY BUTTON */}
              <button
                onClick={handleStartGame}
                disabled={players.length === 0}
                className={`w-full btn-premium btn-primary-gradient py-3.5 flex items-center justify-center gap-2 text-sm font-bold shadow-premium-glow ${
                  players.length === 0 ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Commence Battle</span>
              </button>

            </div>
          </div>

          {/* RIGHT PANEL: QR CODE DISPLAY */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/5 flex flex-col justify-center items-center gap-4 text-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Quick Scan</span>
            
            <div className="p-3 bg-white rounded-2xl shadow-premium-glow">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(customUrl)}`} 
                alt={`Lobby Scan QR Code`} 
                className="h-44 w-44 pointer-events-none"
              />
            </div>

            {/* IP/URL Edit & Share Section */}
            <div className="w-full border-t border-white/5 pt-3.5 space-y-3">
              {isEditingIp ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    placeholder="e.g. 192.168.1.113:5173"
                    className="flex-1 bg-white/5 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary font-mono"
                  />
                  <button
                    onClick={handleSaveIp}
                    className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/95 transition-colors shrink-0"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                  <span className="text-[10px] text-gray-300 font-mono truncate select-all flex-1 text-left">
                    {customUrl}
                  </span>
                  <button
                    onClick={() => setIsEditingIp(true)}
                    title="Edit IP address if incorrect"
                    className="text-gray-400 hover:text-white transition-colors shrink-0"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopyLink}
                  className="py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedLink ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                </button>
                <button
                  onClick={handleCopyQRCode}
                  className="py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <QrCode className="h-3.5 w-3.5 text-secondary" />
                  <span>Copy QR</span>
                </button>
              </div>

              {/* WhatsApp Share Button */}
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(37,211,102,0.2)] block"
              >
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.489 0 9.953-4.467 9.957-9.96.002-2.661-1.034-5.163-2.914-7.046C16.435 1.761 13.93 .72 11.267.72 5.783.72 1.32 5.187 1.316 10.68c-.001 1.57.418 3.1 1.215 4.457l-.953 3.486 3.58-.938c1.352.737 2.87 1.129 4.489 1.13z"/>
                </svg>
                <span>Share via WhatsApp</span>
              </a>
              {/* Automated tunnel status indicator */}
              <div className="w-full pt-2.5 border-t border-white/5 text-center">
                {tunnelData && tunnelData.url ? (
                  <div className="bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl p-2.5 text-[10px] flex items-center justify-center gap-1.5 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span>Remote Play Active (Different Wi-Fi supported!)</span>
                  </div>
                ) : (
                  <div className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-xl p-2.5 text-[10px] flex items-center justify-center gap-1.5 font-medium">
                    <span>Local Play Only (Same Wi-Fi network required)</span>
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-[9px] text-gray-500 leading-relaxed max-w-[200px]">
              Point your phone camera to scan the code and instantly connect to the battle lobby.
            </p>
          </div>

        </div>
      </div>
    </AnimatedPage>
  );
}
