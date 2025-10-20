// backend/db.js
import mongoose from "mongoose";

let isConnected = false;

export function mongoState() {
  return { isConnected, readyState: mongoose.connection.readyState };
}

const pickMongoUri = () => {
  const { NODE_ENV, MONGODB_URI, MONGO_URI, MONGODB_URI_DEV, MONGODB_URI_PROD } = process.env;
  return (
    MONGODB_URI ||
    MONGO_URI ||
    (NODE_ENV === "production" ? MONGODB_URI_PROD : MONGODB_URI_DEV)
  );
};

const options = {
  dbName: "LetterLabPro",
  maxPoolSize: 10,
  minPoolSize: 1,
  serverSelectionTimeoutMS: 8000,
  socketTimeoutMS: 30000,
  retryWrites: true,
};

const wireConnectionLogs = (log = true) => {
  mongoose.connection.on("connected", () => {
    isConnected = true;
    if (log) console.log("✅ MongoDB connected");
  });
  mongoose.connection.on("error", (err) => {
    isConnected = false;
    console.error("❌ MongoDB connection error:", err?.message || err);
  });
  mongoose.connection.on("disconnected", () => {
    isConnected = false;
    console.warn("⚠️ MongoDB disconnected");
  });
};

const connectDB = async ({ log = true } = {}) => {
  const uri = pickMongoUri();
  if (!uri) throw new Error("No Mongo URI found.");
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    if (log) console.log("ℹ️ MongoDB already connected");
    return mongoose.connection;
  }
  wireConnectionLogs(log);
  const conn = await mongoose.connect(uri, options);
  return conn;
};

export default connectDB;
