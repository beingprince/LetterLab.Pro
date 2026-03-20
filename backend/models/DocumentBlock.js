import mongoose from "mongoose";

const DocumentBlockSchema = new mongoose.Schema(
  {
    document_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true, index: true },
    page_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocumentPage', required: true },
    page_number: { type: Number, required: true },
    order_index: { type: Number, required: true }, // Reading order on the page
    block_index_global: { type: Number, required: true }, // Absolute index across entire document
    
    type: { 
      type: String, 
      enum: ["paragraph", "heading", "list_item", "table", "table_cell", "caption", "form_field", "header", "footer", "image_region", "vision_insight"],
      required: true
    },
    text: { type: String },
    
    source: { 
      type: String,
      enum: ["native", "ocr", "vision", "hybrid"]
    },
    confidence: { type: Number, min: 0, max: 1 },
    bbox: { type: [Number] }, // [x0, y0, x1, y1]
    processor_version: { type: String }
  },
  { timestamps: true, versionKey: false }
);

// Compound index for global upsert logic
DocumentBlockSchema.index({ document_id: 1, block_index_global: 1, processor_version: 1 }, { unique: true });
DocumentBlockSchema.index({ document_id: 1, page_number: 1 });

export default mongoose.models.DocumentBlock || mongoose.model('DocumentBlock', DocumentBlockSchema);
