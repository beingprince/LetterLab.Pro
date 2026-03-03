// backend/routes/api.js

import express from 'express';
import { auth } from '../middleware/auth.js';
import * as emailService from '../services/EmailService.js';
import { isValidEmail } from '../utils/validation.js';

const router = express.Router();

// ──────────────────────────────────────────────────────────
// ✅ NEW ROUTE: /pull-subjects-once
// Uses the short-lived Access Token passed from the frontend for a one-time pull.
// ──────────────────────────────────────────────────────────
router.post('/pull-subjects-once', auth, async (req, res) => {
  // 1. INPUT VALIDATION & Token Retrieval
  // outlookAccessToken is temporary, passed in body immediately after OAuth callback
  const { outlookAccessToken, targetEmail } = req.body;

  if (!outlookAccessToken || !targetEmail || !isValidEmail(targetEmail)) {
    return res.status(400).json({ error: "Missing access token or invalid target email." });
  }

  // 2. CORE LOGIC EXECUTION
  try {
    const currentUser = req.user;

    // Call the service function that uses the Access Token directly
    // UPDATED: Use listThreads instead of deprecated function
    const threads = await emailService.listThreads(outlookAccessToken, targetEmail);

    // This response is structured for the ComposePage.jsx chat output
    res.json({
      userName: currentUser.name,
      greeting: `Hey ${currentUser.name}, you have ${threads.length} potential conversations.`,
      conversations: threads
    });

  } catch (error) {
    console.error("One-Time Subject Pull Failed: FULL TRACE", error);

    // Provide user-friendly error messages
    let errorMessage = "Could not retrieve conversations. The token may be invalid or expired.";
    if (error.message.includes('expired') || error.message.includes('invalid')) {
      errorMessage = 'Your Outlook connection has expired. Please re-authenticate via the login page.';
    } else if (error.message.includes('Access Token is missing')) {
      errorMessage = 'Authentication failed. Please try logging in again.';
    }

    res.status(500).json({ error: errorMessage });
  }
});

// ──────────────────────────────────────────────────────────
// ✅ NEW ROUTE: /analyze-thread
// Analyzes a specific thread using Gemini (Sender, Tone, etc.)
// ──────────────────────────────────────────────────────────
router.post('/analyze-thread', auth, async (req, res) => {
  try {
    const { conversationId, outlookAccessToken } = req.body;

    if (!conversationId || !outlookAccessToken) {
      return res.status(400).json({ error: "Missing conversationId or access token." });
    }

    const analysis = await emailService.analyzeThreadContext(outlookAccessToken, conversationId, req.user.id, req.user.email, req.user.name);

    res.json(analysis);

  } catch (error) {
    console.error("Thread Analysis Failed:", error);
    res.status(500).json({ error: "Failed to analyze thread context." });
  }
});


// ──────────────────────────────────────────────────────────
// Gemini Summarization (Legacy/Alternative)
// ──────────────────────────────────────────────────────────

// This route will be used after the user selects a subject number.
router.post('/summarize-thread/:threadId', auth, async (req, res) => {
  try {
    const { threadId } = req.params;
    const { outlookAccessToken } = req.body; // Need token to fetch body

    if (!outlookAccessToken) {
      return res.status(400).json({ error: "Missing access token." });
    }

    // Call service to get summary (and track usage)
    const result = await emailService.getAndSummarizeThreads(
      outlookAccessToken,
      [threadId],
      req.user.id // Pass userId for tracking
    );

    res.json(result);

  } catch (error) {
    console.error("Summarization Failed:", error);
    res.status(500).json({ error: "Failed to summarize thread." });
  }
});

// NEW ROUTE: Generate Email Draft
router.post('/generate-draft', auth, async (req, res) => {
  try {
    const { notes, context, tone } = req.body;

    const draft = await emailService.generateEmailDraft({
      notes,
      context,
      tone
    }, req.user.id);

    res.json({ draft });

  } catch (error) {
    console.error("Draft Generation Failed:", error);
    res.status(500).json({ error: "Failed to generate draft." });
  }
});

// 📨 Fetch Outlook conversation thread (direct service call — no localhost dependency)
export async function fetchOutlookThread(email, accessToken) {
  try {
    const threads = await emailService.listThreads(accessToken, email);
    return threads || [];
  } catch (err) {
    console.error("❌ Failed to fetch Outlook thread:", err);
    throw err;
  }
}



export default router;