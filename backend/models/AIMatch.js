const mongoose = require('mongoose');

const AIMatchSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  matches: [{
    job:        { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    score:      Number,                                  // 0–100
    reason:     String,                                  // AI explanation
    missingSkills: [String]                              // Skills to acquire
  }],
  generatedAt:  { type: Date, default: Date.now },
  expiresAt:    { type: Date }                           // TTL: 1 hour
});

AIMatchSchema.index({ user: 1, expiresAt: 1 });
AIMatchSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL: auto-cleanup expired matches

module.exports = mongoose.model('AIMatch', AIMatchSchema);
