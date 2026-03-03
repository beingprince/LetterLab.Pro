import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [{
      role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }],
    professorName: { type: String, default: null },
    recipientEmail: { type: String, default: null },
    recipientConfirmed: { type: Boolean, default: false },
    threadId: { type: String, default: null }, // For reply mode
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true, versionKey: false }
);

ConversationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);
