import mongoose from 'mongoose';

/**
 * Canonical analytics event schema
 * eventType: chat_turn | email_draft_created | subject_generated | summary_generated | thread_read | thread_analyzed | email_sent | reset_cycle
 */
const AnalyticEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  eventType: {
    type: String,
    required: true,
    index: true
    // chat_turn, email_draft_created, subject_generated, summary_generated, thread_read, thread_analyzed, email_sent, reset_cycle
    // Legacy: SUBJECT, REPLY, SUMMARY, THREAD_READ (still supported for backward compat)
  },
  tokensUsed: {
    type: Number,
    default: 0
  },
  usage: {
    inputTokens: { type: Number, default: 0 },
    outputTokens: { type: Number, default: 0 },
    totalTokens: { type: Number, default: 0 },
    provider: { type: String, default: '' },
    model: { type: String, default: '' }
  },
  feature: {
    type: String,
    default: 'unknown'
  },
  meta: {
    type: Object,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

AnalyticEventSchema.index({ userId: 1, createdAt: -1 });
AnalyticEventSchema.index({ userId: 1, eventType: 1, createdAt: -1 });

export default mongoose.models.AnalyticEvent || mongoose.model('AnalyticEvent', AnalyticEventSchema);
