const Notification = require('../models/Notification');
const logger = require('../utils/logger');

/**
 * Creates a notification and optionally sends it via socket.
 * @param {Object} params - Notification parameters
 * @param {string} params.userId - Target user ID
 * @param {string} params.type - Notification type
 * @param {string} params.title - Notification title
 * @param {string} params.message - Notification message
 * @param {string} [params.link] - Frontend route to navigate to
 * @param {Object} [params.metadata] - Extra context
 */
async function createNotification({ userId, type, title, message, link = '', metadata = {} }) {
  try {
    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      link,
      metadata,
    });

    // Try to send via socket for real-time delivery
    try {
      const { getIO } = require('../socket/socket');
      getIO().to(userId.toString()).emit('notification', {
        id: notification._id,
        type,
        title,
        message,
        link,
        createdAt: notification.createdAt,
      });
    } catch (e) {
      // Socket not available — notification is persisted, user will see it on next load
    }

    return notification;
  } catch (err) {
    logger.error(`Failed to create notification: ${err.message}`);
    return null;
  }
}

module.exports = { createNotification };
