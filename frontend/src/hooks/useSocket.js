import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

export default function useSocket() {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const socketRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      socketRef.current = io(socketUrl, {
          transports: ['websocket', 'polling']
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to socket server');
        socketRef.current.emit('join', user.id);
      });

      socketRef.current.on('statusUpdate', (data) => {
         toast.success(data.message, { duration: 6000, icon: '🔔' });
      });

      socketRef.current.on('newMessage', (data) => {
         toast.success('You have a new message!', { icon: '💬' });
         // In a real app, you'd dispatch this to Redux to update chat state
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
