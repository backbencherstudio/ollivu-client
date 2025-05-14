'use client';

import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket: any;

if (typeof window !== 'undefined') {
  socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
  });
}

export const connectSocket = (userId: string) => {
  if (socket) {
    socket.auth = { userId };
    socket.connect();
  }
};

export { socket };