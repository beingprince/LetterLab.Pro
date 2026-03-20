// documentUpload.js
// ─────────────────────────────────────────────────────────────────────────────
// This route handles the entire document upload + processing kickoff.
//
// What it does step by step:
//   1. User sends the file from the chat composer
//   2. Multer receives the file in memory (not saved to disk)
//   3. We save a record in MongoDB so we can track its status
//   4. We push it to the BullMQ 'extract' queue so Python can process it
//   5. We return the document_id to the frontend right away (don't wait for processing)
//
// The frontend then polls GET /api/v1/documents/:id/status
// until it sees status = "completed", then Q&A is unlocked.
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import Document from '../models/Document.js';
import DocumentJob from '../models/DocumentJob.js';
import { auth } from '../middleware/auth.js';
import { addExtractJob } from '../services/queueService.js';
import fs from 'fs';
import path from 'path';

// Helper to wrap promises with a timeout
const withTimeout = (promise, ms, label) => {
  const timeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
};

const router = express.Router();

// ── Multer setup ──
// We keep the file in memory as a Buffer instead of saving to disk.
// Max file size is 50MB — anything bigger gets rejected immediately.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (_req, file, cb) => {
    // These are the file types our Document Intelligence Engine supports
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',       // .xlsx
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      'image/jpeg', 'image/png', 'image/heic',
      'text/plain', 'text/csv',
      'message/rfc822', // .eml
      'application/zip',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true); // accept the file
    } else {
      cb(new Error(`File type "${file.mimetype}" is not supported.`), false);
    }
  },
});


// ── POST /api/v1/documents/upload-and-process ──
// Client sends the file as FormData.
// We save a DB record and queue the extraction job in one shot.
router.post(
  '/upload-and-process',
  auth,
  upload.single('document'), // 'document' must match the field name in FormData
  async (req, res) => {
    // If no file came through
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided.' });
    }

    try {
      const documentId = new mongoose.Types.ObjectId();
      const userId = req.user.id;

      // ── Local Storage Fallback ──
      // In development, we save the file to a local 'uploads' folder so the worker can find it.
      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const safeFilename = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      const localPath = path.join(uploadsDir, `${documentId}-${safeFilename}`);
      
      // Save buffer to disk
      fs.writeFileSync(localPath, req.file.buffer);
      console.log(`[documentUpload] Saved raw file to: ${localPath}`);

      const s3_raw_upload_uri = `file://${localPath}`; 
      
      const newDoc = await withTimeout(
        Document.create({
          _id: documentId,
          user_id: userId,
          filename: req.file.originalname,
          s3_raw_upload_uri,
          status: 'processing',
          metadata: {
            mime_type: req.file.mimetype,
            file_size_bytes: req.file.size,
          },
          source_container_type: 'upload',
        }),
        10000,
        'Document.create'
      );

      // Queue the extraction job.
      const jobId = await addExtractJob({
        document_id: documentId.toString(),
        s3_uri: s3_raw_upload_uri,
        tenant_id: userId, 
      });

      // Save the job record so we have a full audit trail
      await withTimeout(
        DocumentJob.create({
          document_id: documentId,
          job_id: jobId,
          stage: 'extract',
          status: 'queued',
          processor_version: 'v1.0.0',
          started_at: new Date(),
        }),
        10000,
        'DocumentJob.create'
      );

      // Return the document_id to the frontend immediately.
      // The file is in the queue — processing begins in background.
      return res.status(201).json({
        success: true,
        data: {
          document_id: documentId,
          filename: req.file.originalname,
          status: 'processing',
          message: 'Your document is being processed. Ask me anything once it is ready.',
        },
      });
    } catch (err) {
      console.error('[documentUpload] Failed:', err.message);
      return res.status(500).json({ success: false, message: 'Upload failed. Please try again.' });
    }
  }
);


// ── GET /api/v1/documents/:id/status ──
// The frontend polls this after upload to know when the document is ready for Q&A.
// Returns: status, filename, retrieval_eligible (true = user can ask questions now)
router.get('/:id/status', auth, async (req, res) => {
  try {
    const doc = await Document.findOne({
      _id: req.params.id,
      user_id: req.user.id, // ensure user can only see their own docs
    }).select('filename status retrieval_eligible pages_succeeded pages_failed');

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found.' });
    }

    return res.json({
      success: true,
      data: {
        document_id: doc._id,
        filename: doc.filename,
        status: doc.status,
        ready: doc.retrieval_eligible,     // this is the key flag — true = Q&A is unlocked
        pages_succeeded: doc.pages_succeeded,
        pages_failed: doc.pages_failed,
      },
    });
  } catch (err) {
    console.error('[documentStatus] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Could not fetch document status.' });
  }
});

export default router;
