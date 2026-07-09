import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = () => {
  if (!socket) {
    let serverUrl = import.meta.env.VITE_API_URL;
    if (!serverUrl) {
      const host = window.location.hostname;
      if (host.includes('vercel.app') || host.includes('github.io')) {
        serverUrl = 'http://localhost:5000';
      } else {
        serverUrl = `http://${host}:5000`;
      }
    }
    socket = io(serverUrl);
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
