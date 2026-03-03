// backend/models/OTP.js
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // OTP expires after 5 minutes
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3,
  },
});

export default mongoose.models.OTP || mongoose.model('OTP', otpSchema);