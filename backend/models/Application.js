const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job:          { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:       { type: String, enum: ['applied', 'viewed', 'shortlisted', 'rejected', 'hired'], default: 'applied' },
  aiScore:      { type: Number },                        // AI match score 0–100
  coverLetter:  { type: String },
  appliedAt:    { type: Date, default: Date.now }
});

// Prevent duplicate applications at DB level
ApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
ApplicationSchema.index({ applicant: 1, appliedAt: -1 });

module.exports = mongoose.model('Application', ApplicationSchema);
