const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const Message = require('../models/Message');
const User = require('../models/User');
const { validate } = require('../middleware/validate.middleware');
const { validateObjectId } = require('../middleware/validateId.middleware');
const { createNotification } = require('../services/notification.service');
const mongoose = require('mongoose');

// Get all unique conversations — optimized with aggregation
router.get('/inbox', auth, async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const conversations = await Message.aggregate([
      { $match: { $or: [{ sender: userId }, { receiver: userId }] } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ['$sender', userId] }, '$receiver', '$sender']
          },
          latestMessage: { $first: '$content' },
          timestamp: { $first: '$timestamp' },
          read: { $first: '$read' },
          lastReceiver: { $first: '$receiver' },
        }
      },
      { $sort: { timestamp: -1 } },
      { $limit: 50 }
    ]);

    // Populate partner details in one query
    const partnerIds = conversations.map(c => c._id);
    const partners = await User.find({ _id: { $in: partnerIds } }).select('name avatar role').lean();
    const partnerMap = {};
    partners.forEach(p => { partnerMap[p._id.toString()] = p; });

    const inboxList = conversations
      .map(c => ({
        partner: partnerMap[c._id.toString()] || null,
        latestMessage: c.latestMessage,
        timestamp: c.timestamp,
        unread: !c.read && c.lastReceiver.toString() === req.user.id,
      }))
      .filter(c => c.partner);

    res.json(inboxList);
  } catch (err) { next(err); }
});

// Get conversation with a specific user (paginated)
router.get('/:userId', auth, validateObjectId('userId'), async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    })
      .sort({ timestamp: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    // Mark as read
    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user.id, read: false },
      { $set: { read: true } }
    );

    res.json(messages.reverse()); // Return in chronological order
  } catch (err) { next(err); }
});

// Send a message
router.post('/:userId', auth, validateObjectId('userId'), validate('sendMessage'), async (req, res, next) => {
  try {
    const message = await Message.create({
      sender: req.user.id,
      receiver: req.params.userId,
      content: req.body.content
    });

    // Persistent notification for receiver
    await createNotification({
      userId: req.params.userId,
      type: 'new_message',
      title: 'New Message',
      message: `You have a new message.`,
      link: `/messages/${req.user.id}`,
    });

    res.status(201).json(message);
  } catch (err) { next(err); }
});

// Delete own message
router.delete('/message/:messageId', auth, validateObjectId('messageId'), async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    if (message.sender.toString() !== req.user.id)
      return res.status(403).json({ message: 'Can only delete your own messages' });
    await Message.findByIdAndDelete(req.params.messageId);
    res.json({ message: 'Message deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
