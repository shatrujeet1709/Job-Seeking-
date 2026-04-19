const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const Message = require('../models/Message');
const User = require('../models/User');
const { getIO } = require('../socket/socket');

// Get all unique conversations for the current user
router.get('/inbox', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    }).sort({ timestamp: -1 });

    // Group by conversation partner
    const conversations = {};
    for (const msg of messages) {
      const partnerId = msg.sender.toString() === req.user.id ? msg.receiver.toString() : msg.sender.toString();
      if (!conversations[partnerId]) {
        conversations[partnerId] = msg; // keep the latest message
      }
    }

    // Populate partner details
    const inboxList = [];
    for (const [partnerId, latestMsg] of Object.entries(conversations)) {
      const partner = await User.findById(partnerId).select('name avatar role');
      if (partner) {
        inboxList.push({
          partner,
          latestMessage: latestMsg.content,
          timestamp: latestMsg.timestamp,
          unread: !latestMsg.read && latestMsg.receiver.toString() === req.user.id
        });
      }
    }

    res.json(inboxList.sort((a,b) => b.timestamp - a.timestamp));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get conversation with a specific user
router.get('/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    }).sort({ timestamp: 1 });

    // Mark as read
    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user.id, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Send a message
router.post('/:userId', auth, async (req, res) => {
  try {
    const message = await Message.create({
      sender: req.user.id,
      receiver: req.params.userId,
      content: req.body.content
    });

    // Notify receiver
    try {
        const io = getIO();
        io.to(req.params.userId).emit('newMessage', {
            senderId: req.user.id,
            content: req.body.content,
            timestamp: message.timestamp
        });
    } catch(e) { console.error('Socket emit failed', e.message); }

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
