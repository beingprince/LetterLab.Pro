import mongoose from 'mongoose';

const SentEmailSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    provider: { type: String, enum: ['gmail', 'outlook'], required: true },
    to: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    threadId: { type: String, default: null },
    mode: { type: String, enum: ['new', 'reply'], default: 'new' },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true, versionKey: false }
);

SentEmailSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.SentEmail || mongoose.model('SentEmail', SentEmailSchema);
