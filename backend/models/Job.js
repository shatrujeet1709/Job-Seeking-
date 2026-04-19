const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  source:       { type: String, enum: ['adzuna', 'remotive', 'muse', 'manual'] },
  externalId:   { type: String, unique: true },          // ID from external API
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
  postedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // for manual posts
});

module.exports = mongoose.model('Job', JobSchema);
