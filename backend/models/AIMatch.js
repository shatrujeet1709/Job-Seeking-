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

module.exports = mongoose.model('AIMatch', AIMatchSchema);
