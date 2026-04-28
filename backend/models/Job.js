const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  source:       { type: String, enum: ['adzuna', 'remotive', 'muse', 'manual'] },
  externalId:   { type: String, unique: true, sparse: true }, // sparse: allows null for manual posts
  title:        { type: String, required: true },
  company:      { type: String },
  location:     { type: String },
  description:  { type: String },
  skills:       [{ type: String }],                      // Extracted from description
  salary: {
    min:        Number,
    max:        Number,
    currency:   { type: String, default: 'INR' }
  },
  jobType:      { type: String, enum: ['full-time', 'part-time', 'remote', 'contract'] },
  applyUrl:     { type: String },
  postedAt:     { type: Date },
  fetchedAt:    { type: Date, default: Date.now },
  isActive:     { type: Boolean, default: true },
  postedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // for manual posts

  // === NEW RECRUITER FIELDS ===
  experienceRequired: { type: String, enum: ['0-1', '2-4', '5-7', '8+', ''] },
  applicationDeadline: { type: Date },
  openings:     { type: Number, default: 1 },

  expiresAt:    { type: Date }  // TTL: auto-delete old scraped jobs
});

// Indexes for common queries
JobSchema.index({ isActive: 1, fetchedAt: -1 });
JobSchema.index({ skills: 1 });
JobSchema.index({ postedBy: 1 });
JobSchema.index({ title: 'text', company: 'text', description: 'text' }); // Full-text search
JobSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL: auto-cleanup expired scraped jobs
JobSchema.index({ jobType: 1 }); // For segmentation queries

module.exports = mongoose.model('Job', JobSchema);
