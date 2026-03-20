import mongoose from "mongoose";

const CitationSchema = new mongoose.Schema({
  page_number: { type: Number, required: true },
  block_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocumentBlock', required: true }
}, { _id: false });

const DocumentChunkSchema = new mongoose.Schema(
  {
    document_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true, index: true },
    chunk_index: { type: Number, required: true },
    text: { type: String, required: true },
    token_count: { type: Number, required: true },
    
    citations: [CitationSchema],
    
    embedding_id: { type: String } // Maps to Pinecone/Vector DB ID
  },
  { timestamps: true, versionKey: false }
);

DocumentChunkSchema.index({ document_id: 1, chunk_index: 1 }, { unique: true });

export default mongoose.models.DocumentChunk || mongoose.model('DocumentChunk', DocumentChunkSchema);
