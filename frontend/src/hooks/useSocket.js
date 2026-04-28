import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

export default function useSocket() {
  const { isAuthenticated, user, token } = useSelector(state => state.auth);
  const socketRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      const authToken = token || localStorage.getItem('token');
      
      socketRef.current = io(socketUrl, {
        transports: ['websocket', 'polling'],
        auth: { token: authToken }, // JWT auth for socket
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to socket server');
        // Room join is now automatic via server-side JWT verification
      });

      socketRef.current.on('connect_error', (err) => {
        console.warn('Socket connection error:', err.message);
      });

      socketRef.current.on('statusUpdate', (data) => {
        toast.success(data.message, { duration: 6000, icon: '🔔' });
      });

      socketRef.current.on('newMessage', (data) => {
        toast.success('You have a new message!', { icon: '💬' });
      });

      socketRef.current.on('orderComplete', (data) => {
        toast.success(data.message, { duration: 6000, icon: '🎉' });
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [isAuthenticated, user]);

  return socketRef.current;
}
