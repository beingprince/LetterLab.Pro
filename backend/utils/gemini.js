
// ACTION: Centralized AI Logic with Gemini Fallback + OpenAI Fallback
// This utility handles Gemini (Primary → Fallback) and OpenAI (Fallback) for robust operation.

import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

// Models (from env; default to stable 2.5-flash)
const GEMINI_MODEL = process.env.GEMINI_MODEL_PRIMARY || "models/gemini-2.5-flash";
const GEMINI_FALLBACK_MODEL = process.env.GEMINI_MODEL_FALLBACK || "models/gemini-2.5-flash";
const OPENAI_MODEL = "gpt-4o-mini"; // Affordable, high-quality fallback

/**
 * Initializes Google Gemini Client
 */
export function ai() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Missing GEMINI_API_KEY");
  return new GoogleGenAI({ apiKey: key });
}

/**
 * Initializes OpenAI Client
 */
function openai() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.warn("⚠️ Valid OPENAI_API_KEY not found. Fallback will not work.");
    return null;
  }
  return new OpenAI({ apiKey: key });
}

/**
 * Safely stitches text from Gemini response chunks
 */
export function safeStitch(response) {
  const parts =
    response?.output?.[0]?.content?.parts ||
    response?.candidates?.[0]?.content?.parts ||
    [];
  return parts.map((p) => p?.text || "").join("");
}

/**
 * Sanitizes and truncates text
 */
export function sanitizeText(s, max = 4000) {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, max);
}

/**
 * CORE GENERATION FUNCTION WITH FALLBACK
 * Tries Primary Gemini → Fallback Gemini → OpenAI.
 */
async function generateWithFallback({ prompt, systemInstruction, temperature = 0.7, jsonMode = false }) {
  const fullPrompt = systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt;
  const geminiModels = [GEMINI_MODEL, GEMINI_FALLBACK_MODEL];
  let lastGeminiErr = null;

  for (const modelName of geminiModels) {
    try {
      console.log("[AI] Gemini model:", modelName);
      const client = ai();
      const config = {
        temperature,
        responseMimeType: jsonMode ? "application/json" : "text/plain"
      };
      const r = await client.models.generateContent({
        model: modelName,
        contents: fullPrompt,
        config
      });
      const text = r?.text ?? safeStitch(r);
      if (text) return text;
      throw new Error("Empty response from Gemini");
    } catch (geminiErr) {
      lastGeminiErr = geminiErr;
      console.warn(`⚠️ Gemini (${modelName}) failed:`, geminiErr.message);
    }
  }

  // 3. Try OpenAI
  console.warn(`⚠️ Gemini failed, switching to OpenAI...`, lastGeminiErr?.message);
  try {
    const oai = openai();
    if (!oai) throw new Error("OpenAI not configured (Missing API Key).");
    const messages = [];
    if (systemInstruction) messages.push({ role: "system", content: systemInstruction });
    messages.push({ role: "user", content: prompt });
    const completion = await oai.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      temperature,
      response_format: jsonMode ? { type: "json_object" } : { type: "text" }
    });
    return completion.choices[0].message.content;
  } catch (openaiErr) {
    console.error(`❌ OpenAI Failed too: ${openaiErr.message}`);
    throw new Error(`All AI services failed. Gemini: ${lastGeminiErr?.message}. OpenAI: ${openaiErr.message}`);
  }
}

/**
 * Analyzes email context to extract structured information (JSON).
 */
export async function analyzeContext(context) {
  if (!context || context.trim().length === 0) return null;

  const sanitizedContext = sanitizeText(context, 20000);

  const systemPrompt = `
    Act as a helpful student companion.
    
    Your goal is to explain this email thread to a busy college student in **ONE SENTENCE**.
    Focus on: What is the bottom line? Do they need to do something?
    
    **Analyze the email context and return a valid JSON object with EXACTLY these 3 fields:**
    
    1.  **summary** (String): A detailed paragraph (at least 90 words) narrating the **chronological story** of the thread.
        -   **Start**: "The student initiated the conversation by asking..." OR "Professor X emailed regarding..."
        -   **Middle**: Describe the back-and-forth exchange. "The professor replied that... The student then clarified..."
        -   **End**: "The conversation concluded with..." OR "Currently, the student is waiting for..."
        -   **Goal**: Ensure the user understands exactly **who said what** and **who has the ball**.
    2.  **action_required** (Boolean): true if the student needs to reply.
    3.  **sentiment** (String): "Positive", "Negative", or "Neutral".
    
    **Constraint:**
    - Return PURE JSON format.
    - The summary MUST be a single long paragraph (>90 words).
    - USE NAMES ("Student", "Professor X") instead of generic "he/she" where possible for clarity.
  `;

  const userPrompt = `
    **Context:**
    """
    ${sanitizedContext}
    """
  `;

  try {
    const text = await generateWithFallback({
      prompt: userPrompt,
      systemInstruction: systemPrompt,
      jsonMode: true
    });

    console.log("🤖 [AI] Raw Response:", text);
    return JSON.parse(text);
  } catch (err) {
    console.error("[analyzeContext] Fatal Error:", err.message);
    // Return null so frontend handles it gracefully
    return null;
  }
}

/**
 * Summarizes context into a concise strategic summary (Text).
 */
export async function summarizeContext(context) {
  if (!context || context.trim().length === 0) {
    return "No context provided to summarize.";
  }

  const sanitizedContext = sanitizeText(context, 25000);

  const systemPrompt = `
    You are an expert academic assistant and communication strategist.
    Your goal is to analyze the email thread and provide a strategic, concise summary.
    
    **Instructions:**
    1.  **Identify the Core Request/Topic**: What is the main thing happening here?
    2.  **Extract Key Details**: Dates, deadlines, specific requirements.
    3.  **Analyze Sentiment**: Is the professor annoyed, helpful, formal?
    4.  **Highlight Action Items**: What does the user need to do?
    
    **Format:**
    - **Summary**: A 1-2 sentence high-level overview.
    - **Key Details**: Bullet points of critical info.
    - **Tone/Sentiment**: A brief note on how to approach the reply.
  `;

  const userPrompt = `
    **Email Context:**
    """
    ${sanitizedContext}
    """
    
    **CONCISE STRATEGIC SUMMARY:**
  `;

  try {
    return await generateWithFallback({
      prompt: userPrompt,
      systemInstruction: systemPrompt,
      jsonMode: false
    });
  } catch (err) {
    console.error("[summarizeContext] Fatal Error:", err.message);
    return "AI summary unavailable.";
  }
}

/**
 * Generates an email draft based on notes and context (Text).
 */
export async function generateEmailDraft({ notes, context, tone = "Professional" }) {
  const sanitizedNotes = sanitizeText(notes, 4000);
  const sanitizedContext = sanitizeText(context, 15000);

  const systemPrompt = `
    You are **LetterLab Pro**, a world-class executive communications assistant. 
    You possess the writing prowess of a top-tier copywriter and the diplomatic tact of a seasoned academic advisor.
    
    **Your Goal:** 
    Draft a perfect email for a student to send to a professor or academic staff member.
    
    **Guidelines:**
    1.  **Structure**: Clear subject, professional salutation, concise body, appropriate sign-off.
    2.  **Tone Mastery**: Adhere strictly to the requested tone (${tone}).
    3.  **Context Awareness**: Reference provided context naturally.
    4.  **Clarity**: No fluff. Straight to the point.
  `;

  const userPrompt = `
    **Inputs:**
    - **User Notes**: "${sanitizedNotes}"
    - **Tone**: ${tone}
    - **Context**: ${sanitizedContext ? `\n"""${sanitizedContext}"""` : "No previous context provided."}
    
    **Output:**
    Return *only* the email draft. Do not include "Here is your draft".
  `;

  try {
    return await generateWithFallback({
      prompt: userPrompt,
      systemInstruction: systemPrompt,
      jsonMode: false
    });
  } catch (err) {
    console.error("[generateEmailDraft] Fatal Error:", err.message);
    return "AI draft unavailable.";
  }
}