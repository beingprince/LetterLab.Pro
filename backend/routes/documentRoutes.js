import express from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import Document from '../models/Document.js';
import DocumentJob from '../models/DocumentJob.js';
import { generatePresignedUploadUrl } from '../utils/s3.js';
import { addExtractJob } from '../services/queueService.js';
import { verifyToken } from '../middleware/auth.js'; 

const router = express.Router();

// Error wrapper
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * @route POST /api/v1/documents/upload
 * @desc Phase 1: Generates S3 presigned URL and creates Document record
 */
router.post('/upload', verifyToken, catchAsync(async (req, res) => {
  const { filename, mime_type, file_size_bytes } = req.body;

  if (!filename) {
    return res.status(400).json({ success: false, message: 'filename is required' });
  }

  // 1. Guardrails check
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  if (file_size_bytes && file_size_bytes > MAX_FILE_SIZE) {
    return res.status(400).json({ success: false, message: 'File size exceeds 50MB limit' });
  }

  // Generate unique tenant/document path
  const documentId = new mongoose.Types.ObjectId();
  const tenantId = req.user.tenant_id || req.user._id.toString(); // Fallback to user ID if no tenant
  const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const objectKey = `raw/${tenantId}/${documentId}-${safeFilename}`;

  // 2. Generate Presigned S3 URL
  const { url: uploadUrl, bucket } = await generatePresignedUploadUrl({
    key: objectKey,
    contentType: mime_type || 'application/pdf',
  });

  const s3_raw_upload_uri = `s3://${bucket}/${objectKey}`;

  // 3. Create Document Tracking Record
  const newDocument = new Document({
    _id: documentId,
    tenant_id: tenantId,
    user_id: req.user._id,
    filename: filename,
    s3_raw_upload_uri,
    status: 'processing', // Initially in processing waiting for queue dispatch
    metadata: {
      mime_type,
      file_size_bytes,
    },
    // Tracking source for LetterLab
    source_container_type: req.body.source_container_type || 'upload',
    source_container_id: req.body.source_container_id || null,
    thread_id: req.body.thread_id || null
  });

  await newDocument.save();

  return res.status(201).json({
    success: true,
    data: {
      document_id: documentId,
      upload_url: uploadUrl,
      s3_uri: s3_raw_upload_uri,
      expires_in: 3600
    }
  });
}));

/**
 * @route POST /api/v1/documents/process
 * @desc Phase 2: Called by client after S3 upload succeeds. Pushes document to 'extract' queue.
 */
router.post('/process', verifyToken, catchAsync(async (req, res) => {
  const { document_id } = req.body;

  if (!document_id) {
    return res.status(400).json({ success: false, message: 'document_id is required' });
  }

  // Verify document belongs to user/tenant
  const document = await Document.findOne({
    _id: document_id,
    $or: [{ user_id: req.user._id }, { tenant_id: req.user.tenant_id }]
  });

  if (!document) {
    return res.status(404).json({ success: false, message: 'Document not found' });
  }

  if (document.status !== 'processing') {
    return res.status(400).json({ success: false, message: 'Document pipeline already started' });
  }

  // 1. Dispatch job to BullMQ
  const jobId = await addExtractJob({
    document_id: document._id.toString(),
    s3_uri: document.s3_raw_upload_uri,
    tenant_id: document.tenant_id
  });

  // 2. Create DocumentJob audit record
  const jobRecord = new DocumentJob({
    document_id: document._id,
    job_id: jobId,
    stage: 'extract',
    status: 'queued',
    processor_version: 'v1.0.0', // Tracks provenance
    started_at: new Date()
  });

  await jobRecord.save();

  return res.status(200).json({
    success: true,
    data: {
      message: 'Document extraction queued',
      job_id: jobId
    }
  });
}));

export default router;
