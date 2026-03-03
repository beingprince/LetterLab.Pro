// backend/models/Review.js


import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);