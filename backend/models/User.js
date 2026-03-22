import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    provider: { type: String, enum: ["google", "outlook", "local"], default: "local" },

    // Token Management (legacy; kept for compatibility)
    tokensRemaining: { type: Number, default: 50 },
    tokensTotal: { type: Number, default: 50 },
    lastTokenReset: { type: Date, default: Date.now },
    lockedUntil: { type: Date, default: null },
    quotaWarnedAt: { type: Date, default: null },

    // E-Week: Chat quota (token-based, 5k/day ≈ 50 replies)
    chatTokensLimit: { type: Number, default: 5000 },
    chatTokensRemaining: { type: Number, default: 5000 },
    chatLockedUntil: { type: Date, default: null },
    chatQuotaWarnedAt: { type: Date, default: null },
    chatLastReset: { type: Date, default: Date.now },

    // E-Week: Email quota (count-based, 10/day)
    emailsLimitDaily: { type: Number, default: 10 },
    emailsRemainingToday: { type: Number, default: 10 },
    emailLastReset: { type: Date, default: Date.now },

    // Global Reset Timer
    nextResetAt: { type: Date },

    // Usage Tracking
    usageHistory: [{
      date: { type: Date, default: Date.now },
      tokensUsed: { type: Number, default: 0 },
      emailsGenerated: { type: Number, default: 0 },
      summarizations: { type: Number, default: 0 }
    }],

    // Subscription (free | pro | demo for E-week)
    plan: { type: String, enum: ['free', 'pro', 'demo'], default: 'free' },

    // Display (displayName falls back to name if empty)
    displayName: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },

    // OAuth Refresh Tokens
    outlookRefreshToken: { type: String, select: false },
    outlookAccessToken: { type: String, select: false },
    outlookTokenExpiry: { type: Date, select: false },
    gmailRefreshToken: { type: String, select: false },
    googleAccessToken: { type: String, select: false },
    googleTokenExpiry: { type: Date, select: false },

    // Profile Metadata (Optional)
    jobTitle: { type: String, default: "" },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    phone: { type: String, default: "" },

    ProfileImage: String,

    // 2FA Security
    twoFactorSecret: { type: String, select: false },
    twoFactorEnabled: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare entered password with hash
UserSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
