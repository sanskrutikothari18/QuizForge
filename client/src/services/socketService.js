import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = () => {
  if (!socket) {
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname.match(/^\d+\.\d+\.\d+\.\d+$/) || hostname.endsWith('.local');
    
    if (!isLocal) {
      if (hostname === 'fourisequiz.com' || hostname.endsWith('.fourisequiz.com')) {
        socket = io('https://api.fourisequiz.com');
      } else {
        socket = io(window.location.origin, {
          extraHeaders: {
            'ngrok-skip-browser-warning': 'true',
            'Bypass-Tunnel-Reminder': 'true'
          }
        });
      }
    } else {
      socket = io(`http://${hostname}:5000`);
    }
    console.log('[SOCKET] Connected successfully');
  }
  return socket;
};

export const getSocket = () => {
  return socket || connectSocket();
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('[SOCKET] Disconnected');
  }
};

export const emitJoinRoom = (pin, username) => {
  const currentSocket = getSocket();
  currentSocket.emit('join_room', { pin, username });
};
