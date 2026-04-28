const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:  { type: String, required: true, maxlength: 5000 },
  read:     { type: Boolean, default: false },
  timestamp:{ type: Date, default: Date.now }
});

// Indexes for conversation queries and inbox
MessageSchema.index({ sender: 1, receiver: 1, timestamp: -1 });
MessageSchema.index({ receiver: 1, read: 1 });

module.exports = mongoose.model('Message', MessageSchema);
