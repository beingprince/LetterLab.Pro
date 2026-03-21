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
import fs from 'fs/promises';
import { existsSync, mkdirSync, createReadStream } from 'fs'; // For the multer setup
import path from 'path';
import axios from 'axios';

// Helper to wrap promises with a timeout
const withTimeout = (promise, ms, label) => {
  const timeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
};

const router = express.Router();

// ── Multer setup ──
// We use disk storage now to handle larger files and avoid memory pressure.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
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
      cb(null, true);
    } else {
      cb(new Error(`File type "${file.mimetype}" is not supported.`), false);
    }
  },
});


// ── POST /api/v1/documents/upload-and-process ──
router.post(
  '/upload-and-process',
  auth,
  upload.single('document'),
  async (req, res) => {
    console.log(`🚀 [documentUpload] Starting handle. User: ${req.user?._id || req.user?.id}`);
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided.' });
    }

    try {
      const documentId = new mongoose.Types.ObjectId();
      const userId = req.user.id || req.user._id;

      // 1. URLs for Python Worker
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const host = req.get('host');
      const baseUrl = process.env.PUBLIC_API_URL || `${protocol}://${host}`;
      const pythonWorkerUrl = process.env.PYTHON_WORKER_URL; // Required in prod!
      const webhookUrl = `${baseUrl}/api/v1/documents/webhook/python-extract`;

      // Production Guard
      if (process.env.NODE_ENV === 'production' && !pythonWorkerUrl) {
        throw new Error('PYTHON_WORKER_URL environment variable is missing on Render. Please configure it to point to your Python service.');
      }

      const targetWorkerUrl = pythonWorkerUrl || 'http://localhost:8001/extract';

      // 2. Create Document Record
      await Document.create({
        _id: documentId,
        user_id: userId,
        filename: req.file.originalname,
        s3_raw_upload_uri: `memory://${req.file.originalname}`, // Memory-bound for now
        status: 'processing',
        metadata: {
          mime_type: req.file.mimetype,
          file_size_bytes: req.file.size,
        },
        source_container_type: 'upload',
      });

      // 3. Pipe Data Directly to Python
      console.log(`📡 [documentUpload] Piping memory buffer to ${targetWorkerUrl}...`);
      
      const workerForm = new FormData();
      const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
      workerForm.append('file', blob, req.file.originalname);
      workerForm.append('document_id', documentId.toString());
      workerForm.append('reply_webhook_url', webhookUrl);
      workerForm.append('tenant_id', userId.toString());

      await axios.post(targetWorkerUrl, workerForm, {
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });
      
      console.log(`✅ [documentUpload] Piped successfully.`);

      // 4. Create Audit Job
      await DocumentJob.create({
        document_id: documentId,
        job_id: `direct_${documentId}`,
        stage: 'extract',
        status: 'dispatched',
        processor_version: 'v1.1.0-memory',
        started_at: new Date(),
      });

      return res.status(201).json({
        success: true,
        data: {
          document_id: documentId,
          filename: req.file.originalname,
          status: 'processing',
          message: 'Processing started in memory.',
        },
      });
    } catch (err) {
      console.error('[documentUpload] Failed:', err);
      // Surfacing the exact error for production debugging
      return res.status(500).json({ 
        success: false, 
        message: `Upload failed: ${err.message}`,
        debug: process.env.NODE_ENV === 'production' ? err.message : err.stack 
      });
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
    }).select('filename status retrieval_eligible pages_succeeded pages_failed processing_progress');

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
        processing_progress: doc.processing_progress || 0,
      },
    });
  } catch (err) {
    console.error('[documentStatus] Error:', err.message);
    return res.status(500).json({ success: false, message: 'Could not fetch document status.' });
  }
});

export default router;
