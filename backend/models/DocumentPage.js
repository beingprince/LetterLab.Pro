import mongoose from "mongoose";

const DocumentPageSchema = new mongoose.Schema(
  {
    document_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true, index: true },
    page_number: { type: Number, required: true }, // 1-indexed
    width: { type: Number },
    height: { type: Number },
    image_preview_uri: { type: String },
    extraction_duration_ms: { type: Number },
    has_vision_crops: { type: Boolean, default: false }
  },
  { timestamps: true, versionKey: false }
);

// Compound index to ensure uniqueness per document and page
DocumentPageSchema.index({ document_id: 1, page_number: 1 }, { unique: true });

export default mongoose.models.DocumentPage || mongoose.model('DocumentPage', DocumentPageSchema);
