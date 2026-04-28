const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:       { type: String, enum: [
    'application_status',    // Your application status changed
    'new_message',           // You have a new message
    'new_application',       // New applicant for your job posting
    'order_update',          // Freelance order status change
    'ai_match',              // New AI match results available
    'system',                // System announcement
  ], required: true },
  title:      { type: String, required: true, maxlength: 200 },
  message:    { type: String, required: true, maxlength: 1000 },
  link:       { type: String, default: '' },                    // Frontend route to navigate to
  read:       { type: Boolean, default: false },
  metadata:   { type: mongoose.Schema.Types.Mixed, default: {} }, // Extra context (jobId, orderId, etc.)
  createdAt:  { type: Date, default: Date.now },
  expiresAt:  { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } // 30 day TTL
});

NotificationSchema.index({ user: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL auto-cleanup

module.exports = mongoose.model('Notification', NotificationSchema);
