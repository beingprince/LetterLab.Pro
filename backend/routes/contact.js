// backend/routes/contact.js
// POST /api/contact — contact form with validation and simple rate limit

import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { isValidEmail } from '../utils/validation.js';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// In-memory throttle: max 5 submissions per IP per 15 minutes
const throttle = new Map();
const THROTTLE_WINDOW_MS = 15 * 60 * 1000;
const THROTTLE_MAX = 5;

function getClientIp(req) {
  return req.ip || req.connection?.remoteAddress || 'unknown';
}

function checkThrottle(ip) {
  const now = Date.now();
  let rec = throttle.get(ip) || { count: 0, resetAt: now + THROTTLE_WINDOW_MS };
  if (now >= rec.resetAt) {
    rec = { count: 0, resetAt: now + THROTTLE_WINDOW_MS };
  }
  if (rec.count >= THROTTLE_MAX) return false;
  rec.count++;
  throttle.set(ip, rec);
  return true;
}

const CONTACT_STORE = path.resolve(__dirname, '../content/contact-submissions.json');

async function appendSubmission(payload) {
  try {
    let list = [];
    try {
      const raw = await fs.readFile(CONTACT_STORE, 'utf-8');
      list = JSON.parse(raw);
    } catch {
      // file missing or invalid
    }
    list.push({ ...payload, receivedAt: new Date().toISOString() });
    await fs.mkdir(path.dirname(CONTACT_STORE), { recursive: true });
    await fs.writeFile(CONTACT_STORE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('[contact] appendSubmission', err);
  }
}

router.post('/', async (req, res) => {
  const ip = getClientIp(req);
  if (!checkThrottle(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { name, email, topic, message, area } = req.body || {};

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required.' });
  }
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required.' });
  }
  const allowedTopics = ['Feedback', 'Bug', 'Collaboration', 'Other', 'Talent waitlist'];
  if (!topic || typeof topic !== 'string' || !allowedTopics.includes(topic)) {
    return res.status(400).json({ error: 'Please select a valid topic.' });
  }
  const minMessage = topic === 'Talent waitlist' ? 0 : 20;
  if (!message && minMessage > 0) {
    return res.status(400).json({ error: 'Message is required.' });
  }
  if (typeof message === 'string' && message.trim().length < minMessage) {
    return res.status(400).json({ error: 'Message must be at least 20 characters.' });
  }

  await appendSubmission({
    name: name.trim(),
    email: email.trim(),
    topic,
    message: typeof message === 'string' ? message.trim() : '',
    area: area || undefined,
  });

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'letterlab.contact@gmail.com',
        pass: process.env.EMAIL_PASS || 'placeholder_pass',
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'letterlab.contact@gmail.com',
      to: 'princepdsn@gmail.com',
      subject: `LetterLab Contact Form - ${topic}`,
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\nTopic: ${topic}\n\nMessage:\n${typeof message === 'string' ? message.trim() : ''}`
    });
  } catch (error) {
    console.error('[contact] Failed to send email:', error);
  }

  return res.status(200).json({ success: true });
});

export default router;
