// backend/models/Conversation.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["system", "user", "assistant"], required: true },
    content: { type: String, required: true, trim: true, maxlength: 20000 },
    tokens: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const ConversationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, trim: true, maxlength: 160, default: "Untitled" },
    messages: {
      type: [MessageSchema],
      default: [],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.every(Boolean),
        message: "Messages must be an array of valid message objects",
      },
    },
    totalTokens: { type: Number, default: 0, min: 0, index: true },

    // pinning & recency
    isPinned: { type: Boolean, default: false, index: true },
    pinnedAt: { type: Date, default: null },
    lastActivityAt: { type: Date, default: Date.now, index: true },

    // soft delete / audit
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true, versionKey: false }
);

ConversationSchema.index({ userId: 1, createdAt: -1 });
ConversationSchema.index({ createdAt: -1 });
ConversationSchema.index({ userId: 1, isPinned: -1, pinnedAt: -1, lastActivityAt: -1 });

ConversationSchema.methods.touchActivity = function () {
  this.lastActivityAt = new Date();
};

const Conversation = mongoose.model("Conversation", ConversationSchema);
export default Conversation;
