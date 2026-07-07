import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = () => {
  if (!socket) {
    const serverUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
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
