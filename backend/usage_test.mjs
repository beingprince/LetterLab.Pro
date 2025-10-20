import "dotenv/config";
import mongoose from "mongoose";
import Usage from "./models/Usage.js";

try {
  await mongoose.connect(process.env.MONGO_URI, { dbName: "LetterLabPro" });
  console.log("✅ Connected to MongoDB");

  const demoUserId = new mongoose.Types.ObjectId();

  await Usage.upsertUsage(demoUserId, new Date(), {
    dailyTokens: 200,
    emailsDrafted: 1,
  });

  const docs = await Usage.find({ userId: demoUserId });
  console.log("📊 Found Usage Records:", docs);

  await mongoose.disconnect();
  console.log("🔌 Disconnected");
} catch (err) {
  console.error("❌ Error:", err);
  process.exit(1);
}
