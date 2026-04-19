const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job:          { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:       { type: String, enum: ['applied', 'viewed', 'shortlisted', 'rejected', 'hired'], default: 'applied' },
  aiScore:      { type: Number },                        // AI match score 0–100
  coverLetter:  { type: String },
  appliedAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);
