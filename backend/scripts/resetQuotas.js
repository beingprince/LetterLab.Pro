#!/usr/bin/env node
/**
 * E-Week: Reset a user's chat and email quotas to defaults.
 * Usage: node scripts/resetQuotas.js <user-email-or-id>
 * Requires: MONGO_URI in .env
 */
import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";

const EMAIL = process.argv[2];
if (!EMAIL) {
  console.error("Usage: node scripts/resetQuotas.js <user-email-or-id>");
  process.exit(1);
}

async function main() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGO_URI");
    process.exit(1);
  }
  await mongoose.connect(uri);

  const isId = mongoose.Types.ObjectId.isValid(EMAIL) && EMAIL.length === 24;
  const user = isId
    ? await User.findById(EMAIL)
    : await User.findOne({ email: EMAIL.toLowerCase() });

  if (!user) {
    console.error("User not found:", EMAIL);
    process.exit(1);
  }

  const chatTotal = user.chatTokensTotal ?? 50000;
  const emailTotal = user.emailsTotalPerDay ?? 10;
  await User.findByIdAndUpdate(user._id, {
    chatTokensRemaining: chatTotal,
    chatLockedUntil: null,
    chatQuotaWarnedAt: null,
    chatLastReset: new Date(),
    emailsRemainingToday: emailTotal,
    emailLastReset: new Date()
  });

  console.log(`✅ Reset quotas for ${user.email || user._id}`);
  console.log(`   chatTokensRemaining: ${chatTotal}`);
  console.log(`   emailsRemainingToday: ${emailTotal}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
