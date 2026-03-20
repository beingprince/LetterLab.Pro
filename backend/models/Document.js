import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    tenant_id: { type: String, required: false },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    filename: { type: String, required: true },
    file_hash: { type: String, index: true }, // Deduplication
    
    // Storage references
    s3_raw_upload_uri: { type: String, required: true },
    s3_raw_extract_uri: { type: String },
    s3_normalized_extract_uri: { type: String },
    
    // Email relations
    source_container_type: { 
      type: String, 
      enum: ["upload", "gmail_attachment", "outlook_attachment", "email_body"],
      default: "upload"
    },
    source_container_id: { type: String },
    thread_id: { type: String },
    
    status: { 
      type: String, 
      enum: ["processing", "completed", "failed", "partial_success"],
      default: "processing"
    },
    
    metadata: {
      mime_type: { type: String },
      total_pages: { type: Number },
      file_size_bytes: { type: Number },
      languages_detected: [{ type: String }],
      has_tables: { type: Boolean, default: false },
      has_images: { type: Boolean, default: false },
      has_handwriting: { type: Boolean, default: false }
    },
    
    // Operational tracking
    pages_succeeded: { type: Number, default: 0 },
    pages_failed: { type: Number, default: 0 },
    processing_progress: { type: Number, default: 0, min: 0, max: 100 },
    retrieval_eligible: { type: Boolean, default: false },
    retrieval_ready_at: { type: Date },
    schema_version: { type: String, default: "v2.1" }
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.models.Document || mongoose.model('Document', DocumentSchema);
