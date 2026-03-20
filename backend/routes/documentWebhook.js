// documentWebhook.js
// ─────────────────────────────────────────────────────────────────────────────
// This is the internal bridge between Node.js and our Python Extract Worker.
//
// How it flows:
//   1. Python finishes parsing a PDF/Doc (using fitz or OCR)
//   2. Python calls this POST endpoint with a payload of pages and blocks
//   3. Node.js validates the data and saves it into document_pages & document_blocks
//   4. Finally, Node updates the main Document status to 'completed'
//
// Once status is 'completed' and 'retrieval_eligible' is true, the user
// can start asking questions about the document in the chat.
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express';
import Document from '../models/Document.js';
import DocumentPage from '../models/DocumentPage.js';
import DocumentBlock from '../models/DocumentBlock.js';

const router = express.Router();

// ── POST /internal/webhooks/python-extract ──
// This is an internal URL called by our Python service.
// ⚠️ In production, this should be protected by a shared secret (API key)
//    to ensure only our workers can post data here.
router.post('/python-extract', async (req, res) => {
  const { document_id, status, pages, error } = req.body;

  if (!document_id) {
    return res.status(400).json({ success: false, message: 'Missing document_id' });
  }

  console.log(`[Webhook] Received extraction result for Doc: ${document_id} | Status: ${status}`);

  try {
    const doc = await Document.findById(document_id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // ────────────────────────────────────────────────────────
    // 1. Handle Case: Extraction Failed
    // ────────────────────────────────────────────────────────
    if (status === 'failed') {
      await Document.findByIdAndUpdate(document_id, {
        status: 'failed',
        error_message: error || 'Python extraction failed unknown error.'
      });
      return res.json({ success: true, message: 'Status updated to failed.' });
    }

    // ────────────────────────────────────────────────────────
    // 2. Handle Case: Success — Save Pages & Blocks
    // ────────────────────────────────────────────────────────
    // We clear any old data (idempotency) and insert the new extracted content.
    await DocumentPage.deleteMany({ document_id });
    await DocumentBlock.deleteMany({ document_id });

    let pagesSucceeded = 0;
    let pagesFailed = 0;

    // Iterate through pages provided by Python
    for (const p of pages) {
      // Create the Page record
      const newPage = await DocumentPage.create({
        document_id: doc._id,
        page_number: p.page_number,
        dimensions: p.dimensions, // { width, height }
        image_preview_s3_uri: p.image_url,
      });

      // Insert all blocks for this page (text zones, tables, etc)
      if (p.blocks && p.blocks.length > 0) {
        const blocksToInsert = p.blocks.map(b => ({
          document_id: doc._id,
          page_id: newPage._id,
          block_type: b.type, // 'text', 'table', 'image'
          raw_content: b.content,
          bbox: b.bbox, // [x0, y0, x1, y1] normalized
          confidence: b.confidence,
          order_index: b.index
        }));
        await DocumentBlock.insertMany(blocksToInsert);
      }

      pagesSucceeded++;
    }

    // ────────────────────────────────────────────────────────
    // 3. Mark Document as Ready for Q&A
    // ────────────────────────────────────────────────────────
    // 'retrieval_eligible: true' allows the user to start chatting with it.
    await Document.findByIdAndUpdate(document_id, {
      status: 'completed',
      retrieval_eligible: true,
      pages_succeeded: pagesSucceeded,
      pages_failed: pagesFailed,
      extraction_duration_ms: req.body.duration_ms || 0
    });

    return res.json({
      success: true,
      message: `Successfully processed ${pagesSucceeded} pages. Document is ready.`
    });
  } catch (err) {
    console.error(`[Webhook] Processing error:`, err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
