const mongoose = require('mongoose');

const GigSchema = new mongoose.Schema({
  freelancer:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:        { type: String, required: true },        // "I will build your React website"
  description:  { type: String, required: true },
  category:     { type: String },                        // "Web Development"
  skills:       [{ type: String }],
  packages: [{
    name:       { type: String, enum: ['basic', 'standard', 'premium'] },
    description: String,
    price:      Number,                                  // In INR
    deliveryDays: Number,
    revisions:  Number
  }],
  images:       [{ type: String }],                      // Cloudinary URLs
  rating:       { type: Number, default: 0 },
  reviewCount:  { type: Number, default: 0 },
  isActive:     { type: Boolean, default: true },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gig', GigSchema);
