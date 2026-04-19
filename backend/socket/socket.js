let io;

module.exports = {
  init: (httpServer) => {
    const { Server } = require('socket.io');
    io = new Server(httpServer, { 
        cors: { 
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST']
        } 
    });

    io.on('connection', (socket) => {
      console.log('🔌 Client connected:', socket.id);

      socket.on('join', (userId) => {
        socket.join(userId); // Join private room = userId
        console.log(`User ${userId} joined their room`);
      });

      socket.on('disconnect', () => {
        console.log('🔌 Disconnected:', socket.id);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) throw new Error('Socket.io not initialized!');
    return io;
  }
};
