import dotenv from "dotenv";
dotenv.config();
import connectDB, { mongoState } from "../db.js";
import User from "../models/User.js";

async function run() {
  try {
    console.log("Connecting...");
    await connectDB({ log: false });
    const users = await User.find({}, 'name email provider').lean();
    console.log(`\nFound ${users.length} users in the database:`);
    console.log("-----------------------------------------------------");
    users.forEach((user, index) => {
      console.log(`${index + 1}. Name: ${user.name} | Email: ${user.email} | Provider: ${user.provider}`);
    });
    console.log("-----------------------------------------------------");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

run();
