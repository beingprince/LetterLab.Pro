import mongoose from "mongoose";

const DocumentJobSchema = new mongoose.Schema(
  {
    document_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true, index: true },
    job_id: { type: String, required: true, unique: true }, // BullMQ job ID for idempotency
    stage: { 
      type: String, 
      enum: ["extract", "normalize", "chunk", "embed"],
      required: true 
    },
    status: { 
      type: String, 
      enum: ["queued", "active", "dispatched", "completed", "failed"],
      default: "queued"
    },
    processor_version: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    started_at: { type: Date },
    completed_at: { type: Date },
    error: { type: mongoose.Schema.Types.Mixed, default: null } // Store Python's structured error
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.models.DocumentJob || mongoose.model('DocumentJob', DocumentJobSchema);
