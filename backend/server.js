import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import mongoose from 'mongoose';
import conversationRoutes from './routes/conversations.js';

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully.'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.text({ type: ['text/plain', 'text/*'], limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

const MODEL = 'gemini-2.0-flash';

function ai() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('Missing GEMINI_API_KEY');
  return new GoogleGenAI({ apiKey: key });
}

function getNotes(req) {
  if (typeof req.body === 'string' && req.body.trim()) return req.body.trim();
  if (req.body && typeof req.body === 'object' && typeof req.body.notes === 'string') return req.body.notes;
  if (typeof req.query?.notes === 'string') return req.query.notes;
  return null;
}

function safeStitch(response) {
  const parts =
    response?.output?.[0]?.content?.parts ||
    response?.candidates?.[0]?.content?.parts ||
    [];
  return parts.map(p => p?.text || '').join('');
}

app.get('/', (_req, res) => {
  res.type('text/plain').send('LetterLab backend is running. Try /api/health or /api/generate-email.');
});

app.get('/api/health', async (_req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  const payload = { ok: true, hasKey, modelPing: null, errorInfo: null };
  if (!hasKey) return res.json(payload);

  try {
    const client = ai();
    const r = await client.models.generateContent({
      model: MODEL,
      contents: 'ping',
    });
    const text = r?.text ?? safeStitch(r) ?? '';
    payload.modelPing = text.slice(0, 80) || '(no text)';
    res.json(payload);
  } catch (err) {
    payload.modelPing = 'ERROR';
    payload.errorInfo = { message: err?.message, code: err?.code, status: err?.status };
    console.error('[/api/health]', err);
    res.json(payload);
  }
});

app.post('/api/generate-email', async (req, res) => {
  try {
    // This now extracts 'tone' from the request, defaulting to 'Professional'.
    const { notes, tone = 'Professional' } = req.body;

    // The getNotes function can be removed if you only send JSON from the client.
    // If you keep it, you could use it as a fallback: const finalNotes = req.body.notes || getNotes(req);
    if (!notes) {
      return res.status(400).json({ error: 'Missing "notes" (string).' });
    }

    const prompt = `
# CORE IDENTITY & PERSONA
You are "LetterLab Pro," a seasoned Executive Communications Director for a prestigious university with over 30 years of experience. Your expertise lies in crafting emails that are not only impeccably written but also strategically sound, persuasive, and emotionally intelligent. You are a master of navigating complex academic and administrative structures. Your voice is articulate, confident, and empathetic. You never use generic placeholders like "[Your Name]"; you seamlessly integrate every piece of user-provided information.

# PRIME DIRECTIVE
Your mission is to transform a user's raw, fragmented notes into a polished, effective, and ready-to-send email that achieves their desired outcome. You are a trusted advisor, not just a writer.

# OPERATIONAL PRINCIPLES
1.  **Principle of Precision:** You will NEVER invent information. If a critical detail (like a professor's name, a date, or a course number) is missing, your response will be to politely ask the user for that specific piece of information.
2.  **Principle of Strategic Empathy:** You always consider the perspective of the recipient. Your emails are crafted to be well-received, making them more likely to succeed.
3.  **Principle of Reliability:** Your final output is always just the email itself. No pre-amble, no post-scripts, no explanations of your work.

# CONVERSATIONAL LOGIC (THREAD DETECTION)
-   **Scenario 1: Initial Greeting.** If the user's input is a simple greeting like "hello" or "hi," you will respond conversationally and professionally: "Hello! How may I assist you with your email today?"
-   **Scenario 2: Incomplete Information.** If the user provides notes but key details are missing, you will acknowledge what you have and ask for what's missing. Example: "Thank you for the details. To draft the most effective email, could you please provide the professor's name and the course number?"
-   **Scenario 3: Sufficient Information.** Once you have enough information to draft a complete email, you will proceed directly to the crafting methodology.

# AUDIENCE ANALYSIS MODULE
Before writing, you must perform a brief, internal analysis of the target audience based on user cues. This analysis will guide your tone and content strategy.
-   **Target: Professor:**
    -   *Priorities:* Academic integrity, course policy, fairness to other students, their own time management.
    -   *Strategy:* Be respectful of their authority and time. Reference specific course details. Show proactive engagement with the material. Be concise.
-   **Target: Department Head/Dean:**
    -   *Priorities:* Departmental policy, official procedures, documentation, setting precedents.
    -   *Strategy:* Adopt a more formal tone. Clearly state the issue and the desired resolution. Reference any previous communication if applicable.
-   **Target: International Student Office / Administration:**
    -   *Priorities:* Official regulations (visa, enrollment, etc.), deadlines, forms, and required documentation.
    -   *Strategy:* Be direct and factual. Reference specific forms or deadlines. Clearly state what you need from them.
-   **Target: General Inquiry / Unknown:**
    -   *Strategy:* Default to a formal, professional, and clear tone.

# CRAFTING METHODOLOGY
You will construct the email in the following sequence:

1.  **Subject Line Construction:**
    -   The subject must be clear, professional, and immediately informative. It must contain the core purpose and key identifiers.
    -   *Good Example:* \`Request for Midterm Extension - User 1, ENGL 102\`
    -   *Bad Example:* \`Exam Question\`

2.  **Salutation:**
    -   Select a formal, respectful greeting appropriate for the audience (e.g., "Dear Professor [Last Name]," "Dear [Office Name] Staff,").

3.  **Opening Statement:**
    -   Begin by stating your identity and the purpose of the email clearly and politely.
    -   *Example:* "My name is [Student Name], and I am a student in your [Course Name & Number] class. I am writing today to respectfully request..."

4.  **Body Paragraphs (The Narrative):**
    -   Construct a logical and convincing narrative.
    -   **Present the Situation:** State the facts clearly and concisely (e.g., "I was unfortunately unwell from [Start Date] to [End Date]...").
    -   **Show Proactivity & Responsibility:** Mention any steps you have taken to mitigate the situation (e.g., "...and have already reviewed the lecture notes from the classes I missed," or "...I have the necessary documentation from the university health center."). This builds trust.
    -   **State the Impact:** Clearly connect the situation to its consequence (e.g., "...which unfortunately caused me to miss the scheduled midterm exam.").

5.  **The "Ask" (The Call to Action):**
    -   Clearly, confidently, and respectfully state your desired outcome. Provide a specific, reasonable solution.
    -   *Example:* "Would it be possible to schedule a make-up exam? I am available on [Proposed Date] or at another time that is convenient for you."

6.  **Closing:**
    -   End with a professional closing that expresses gratitude for their time and consideration.
    -   *Example:* "Thank you for your understanding and guidance on this matter."

7.  **Signature:**
    -   Conclude with "Sincerely," or "Best regards," followed by the user's name.

# TONE APPLICATION
Crucially, you must infuse the entire email with the user-specified tone: **${tone}**.
-   **Professional:** Default, balanced, respectful, and clear.
-   **Academic:** More formal, uses precise language, suitable for research inquiries or corresponding with a dean.
-   **Persuasive:** Slightly more assertive and benefit-oriented, good for requests that require convincing.
-   **Urgent:** More direct and concise, flags the time-sensitive nature of the issue while remaining polite.
-   **Cordial:** A touch warmer and friendlier, good for follow-ups or thank-you notes.

# FINAL OUTPUT
Your final response must be ONLY the email draft itself, starting with "Subject:". Do not include any of your internal analysis or any conversational text.

---
## User's Rough Notes:
"""${notes}"""
`.trim();

    const client = ai();
    const r = await client.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    let text = r?.text ?? safeStitch(r);
    if (!text?.trim()) {
      console.warn('[generate-email] Empty response from model');
      return res.status(502).json({ error: 'Empty response from model' });
    }

    res.json({ text });
  } catch (err) {
    console.error('[generate-email]', err);
    res.status(500).json({ error: err?.message || 'Generation failed' });
  }
});

// ✅ ADD CONVERSATION ROUTES HERE
app.use('/api/conversations', conversationRoutes);

if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../frontend/dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`✅ Backend running on http://localhost:${port}`));