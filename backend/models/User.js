const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:             { type: String, required: true, trim: true },
  email:            { type: String, required: true, unique: true, lowercase: true },
  password:         { type: String, required: true, minlength: 8 },
  role:             { type: String, enum: ['seeker', 'recruiter', 'freelancer', 'admin'], default: 'seeker' },
  avatar:           { type: String, default: '' },             // Cloudinary URL

  // ─── Email Verification ───
  isVerified:       { type: Boolean, default: false },
  emailVerifyToken: { type: String, default: null },
  emailVerifyExpiry:{ type: Date, default: null },

  // ─── Password Reset ───
  resetToken:       { type: String, default: null },
  resetExpiry:      { type: Date, default: null },

  // ─── Token Invalidation ───
  tokenVersion:     { type: Number, default: 0 },              // Increment to invalidate all existing JWTs

  createdAt:        { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
