// backend/models/Usage.js
import mongoose from "mongoose";

const UsageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: Date, required: true, index: true },
    dailyTokens: { type: Number, default: 0, min: 0 },
    emailsDrafted: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, versionKey: false }
);

UsageSchema.index({ userId: 1, date: 1 }, { unique: true });

UsageSchema.statics.upsertUsage = async function (userId, date, delta) {
  const normalized = new Date(date);
  normalized.setUTCHours(0, 0, 0, 0);
  return this.findOneAndUpdate(
    { userId, date: normalized },
    { $inc: delta },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

const Usage = mongoose.model("Usage", UsageSchema);
export default Usage;
