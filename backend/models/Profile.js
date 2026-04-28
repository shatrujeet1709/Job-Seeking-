const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  // === COMMON FIELDS ===
  headline:     { type: String },                        // "Full Stack Developer | 2 YOE"
  summary:      { type: String },
  skills:       [{ type: String }],                      // ["React", "Node.js", "Python"]
  phone:        { type: String },                        // Contact number
  location:     { type: String },
  linkedin:     { type: String },
  github:       { type: String },
  portfolio:    { type: String },

  // === JOB SEEKER FIELDS ===
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
  resumeUrl:        { type: String },                    // Cloudinary PDF URL
  preferredRoles:   [{ type: String }],                  // ["Backend Developer", "DevOps"]
  preferredLocations: [{ type: String }],                // ["Mumbai", "Remote", "Bangalore"]
  expectedSalary:   { type: Number },                    // In INR per month
  jobType:          { type: String, enum: ['full-time', 'part-time', 'remote', 'hybrid', ''] },
  availability:     { type: String, enum: ['immediately', '2-weeks', '1-month', '3-months', ''] },

  // === RECRUITER FIELDS ===
  companyName:        { type: String },
  companyLogo:        { type: String },                  // Cloudinary URL
  companyWebsite:     { type: String },
  companyDescription: { type: String },
  companySize:        { type: String, enum: ['1-10', '11-50', '51-200', '201-500', '500+', ''] },
  industry:           { type: String },                  // "IT", "Finance", "Healthcare"

  // === FREELANCER FIELDS ===
  professionalTitle:  { type: String },                  // "Full Stack Developer"
  hourlyRate:         { type: Number },                  // In INR per hour
  languages:          [{ type: String }],                // ["English", "Hindi"]
  availabilityStatus: { type: String, enum: ['available', 'busy', 'away', ''] },
  responseTime:       { type: String, enum: ['1-hour', '24-hours', '2-3-days', ''] },

  updatedAt:    { type: Date, default: Date.now }
});

// user is already unique, which creates an index

module.exports = mongoose.model('Profile', ProfileSchema);
