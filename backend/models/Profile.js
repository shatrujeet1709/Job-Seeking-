const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  headline:     { type: String },                        // "Full Stack Developer | 2 YOE"
  summary:      { type: String },
  skills:       [{ type: String }],                      // ["React", "Node.js", "Python"]
  education: [{
    degree:     String,                                  // "B.Tech Computer Science"
    institute:  String,
    year:       Number,
    grade:      String
  }],
  experience: [{
    title:      String,
    company:    String,
    from:       Date,
    to:         Date,
    current:    { type: Boolean, default: false },
    description: String
  }],
  certifications: [{
    name:       String,
    issuer:     String,
    year:       Number,
    url:        String
  }],
  resumeUrl:    { type: String },                        // Cloudinary PDF URL
  location:     { type: String },
  linkedin:     { type: String },
  github:       { type: String },
  portfolio:    { type: String },
  preferredRoles: [{ type: String }],                   // ["Backend Developer", "DevOps"]
  expectedSalary: { type: Number },                     // In INR per month
  jobType:      { type: String, enum: ['full-time', 'part-time', 'remote', 'hybrid'] },
  updatedAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', ProfileSchema);
