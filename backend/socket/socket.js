const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
let io;

module.exports = {
  init: (httpServer) => {
    const { Server } = require('socket.io');

    // Use ALLOWED_ORIGINS (consistent with HTTP CORS)
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || 'http://localhost:5173')
      .split(',')
      .map(o => o.trim());

    io = new Server(httpServer, { 
      cors: { 
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
      } 
    });

    // JWT authentication middleware for socket connections
    io.use((socket, next) => {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        socket.userRole = decoded.role;
        next();
      } catch (err) {
        return next(new Error('Invalid token'));
      }
    });

    io.on('connection', (socket) => {
      logger.info(`Socket connected: ${socket.id} | User: ${socket.userId}`);

      // Auto-join the user's private room (verified via JWT)
      socket.join(socket.userId);

      socket.on('disconnect', () => {
        logger.debug(`Socket disconnected: ${socket.id}`);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) throw new Error('Socket.io not initialized!');
    return io;
  }
};
