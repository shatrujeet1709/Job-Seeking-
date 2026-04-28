const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const Notification = require('../models/Notification');

// Get all notifications for the authenticated user
router.get('/', auth, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 20));

    const filter = { user: req.user.id };
    if (unreadOnly === 'true') filter.read = false;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Notification.countDocuments(filter),
      Notification.countDocuments({ user: req.user.id, read: false }),
    ]);

    res.json({
      notifications,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total,
      unreadCount,
    });
  } catch (err) { next(err); }
});

// Mark a single notification as read
router.put('/:id/read', auth, async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { returnDocument: 'after' }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (err) { next(err); }
});

// Mark all notifications as read
router.put('/read-all', auth, async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { $set: { read: true } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) { next(err); }
});

// Delete a single notification
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const result = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!result) return res.status(404).json({ message: 'Notification not found' });
    res.json({ message: 'Notification deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
