import mongoose from 'mongoose';

const SystemStatusSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true }, // e.g., 'global_quota'
    globalChatCreditsUsedToday: { type: Number, default: 0 },
    globalEmailSendsUsedToday: { type: Number, default: 0 },
    lastResetAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.SystemStatus || mongoose.model('SystemStatus', SystemStatusSchema);
