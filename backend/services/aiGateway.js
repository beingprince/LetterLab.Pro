/**
 * AI Gateway - Single source of truth for AI generation.
 * Primary: OpenAI (fast, reliable). Fallback: Gemini on 429/5xx/overload.
 * No duplicate fallback logic in routes.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

// Config from env
const GEMINI_MODEL = process.env.GEMINI_MODEL_PRIMARY || 'models/gemini-2.5-flash';
const GEMINI_FALLBACK = process.env.GEMINI_MODEL_FALLBACK || 'models/gemini-2.0-flash';
const OPENAI_MODEL = process.env.OPENAI_MODEL_FALLBACK || 'gpt-4o-mini';
const DEFAULT_MAX_OUTPUT = 4096;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function isFallbackError(err) {
    if (!err) return false;
    const msg = (err.message || '').toLowerCase();
    const code = err.code || err.status || err.statusCode;
    if (code === 429 || code === 403) return true;
    if (typeof code === 'number' && code >= 500) return true;
    if (msg.includes('429') || msg.includes('503') || msg.includes('rate limit') || msg.includes('quota')) return true;
    if (msg.includes('service unavailable') || msg.includes('high demand')) return true;
    if (msg.includes('resource exhausted') || msg.includes('resourceexhausted')) return true;
    if (msg.includes('timeout') || msg.includes('etimedout') || msg.includes('econnreset') || msg.includes('fetch failed')) return true;
    return false;
}

async function tryGemini({ system, prompt, temperature, maxOutputTokens, jsonMode }) {
    const fullPrompt = system ? `${system}\n\n${prompt}` : prompt;
    const models = [GEMINI_MODEL];
    if (GEMINI_FALLBACK && GEMINI_FALLBACK !== GEMINI_MODEL) models.push(GEMINI_FALLBACK);

    for (const modelName of models) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const config = {
                temperature: temperature ?? 0.7,
                maxOutputTokens: maxOutputTokens ?? DEFAULT_MAX_OUTPUT,
            };
            if (jsonMode) config.responseMimeType = 'application/json';

            const result = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
                generationConfig: config,
            });
            const response = result.response;
            const text = response.text?.() ?? '';
            if (!text || !text.trim()) throw new Error('Empty response from Gemini');

            const inputTokens = response.usageMetadata?.promptTokenCount ?? Math.ceil(fullPrompt.length / 4);
            const outputTokens = response.usageMetadata?.candidatesTokenCount ?? Math.ceil(text.length / 4);

            return {
                providerUsed: 'gemini',
                modelUsed: modelName,
                text,
                usage: {
                    inputTokens,
                    outputTokens,
                    totalTokens: inputTokens + outputTokens,
                },
            };
        } catch (e) {
            if (isFallbackError(e)) {
                console.warn(`[aiGateway] Gemini (${modelName}) fallback trigger (429/403/5xx):`, e.message);
                throw e; // go to OpenAI, don't retry another Gemini
            }
            console.warn(`[aiGateway] Gemini (${modelName}) failed:`, e.message);
        }
    }
    throw new Error('All Gemini models failed');
}

async function tryOpenAI({ system, prompt, temperature, maxOutputTokens, jsonMode }) {
    const messages = [
        ...(system ? [{ role: 'system', content: system + (jsonMode ? '\n\nRespond with valid JSON only.' : '') }] : []),
        { role: 'user', content: prompt },
    ];
    const completion = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages,
        temperature: temperature ?? 0.7,
        max_tokens: maxOutputTokens ?? DEFAULT_MAX_OUTPUT,
        response_format: jsonMode ? { type: 'json_object' } : { type: 'text' },
    });
    const text = completion.choices?.[0]?.message?.content ?? '';
    if (!text || !text.trim()) throw new Error('Empty response from OpenAI');

    const inputTokens = completion.usage?.prompt_tokens ?? Math.ceil(((system || '') + (prompt || '')).length / 4);
    const outputTokens = completion.usage?.completion_tokens ?? Math.ceil(text.length / 4);

    return {
        providerUsed: 'openai',
        modelUsed: OPENAI_MODEL,
        text,
        usage: {
            inputTokens,
            outputTokens,
            totalTokens: inputTokens + outputTokens,
        },
    };
}

/**
 * Generate text. Primary: OpenAI. Fallback: Gemini (on 429/5xx/overload).
 * @param {Object} opts
 * @param {string} [opts.purpose] - For logging
 * @param {string} [opts.system] - System instruction
 * @param {string} opts.prompt - User prompt (or full prompt if no system)
 * @param {number} [opts.temperature]
 * @param {number} [opts.maxOutputTokens]
 * @param {boolean} [opts.jsonMode] - Request JSON output
 * @returns {Promise<{ providerUsed, modelUsed, text, usage }>}
 */
export async function generateText({ purpose, system, prompt, temperature, maxOutputTokens, jsonMode = false }) {
    let lastErr;
    try {
        return await tryOpenAI({ system, prompt, temperature, maxOutputTokens, jsonMode });
    } catch (e) {
        lastErr = e;
        if (!isFallbackError(e)) throw e;
    }

    console.log('[aiGateway] OpenAI failed -> Gemini fallback:', lastErr?.message);
    try {
        return await tryGemini({ system, prompt, temperature, maxOutputTokens, jsonMode });
    } catch (geminiErr) {
        console.error('[aiGateway] Both providers failed');
        throw new Error(`AI Generation Failed: ${geminiErr?.message || lastErr?.message}`);
    }
}

/**
 * Generate JSON output. Parses and returns { parsed, text, providerUsed, modelUsed, usage }.
 */
export async function generateTextAsJson({ purpose, system, prompt, temperature, maxOutputTokens }) {
    const result = await generateText({
        purpose,
        system,
        prompt,
        temperature: temperature ?? 0.7,
        maxOutputTokens: maxOutputTokens ?? 1500,
        jsonMode: true,
    });
    let parsed;
    try {
        const clean = (result.text || '').replace(/```json\s?|\s?```/g, '').trim();
        parsed = JSON.parse(clean || '{}');
    } catch {
        // Truncated/malformed JSON - regex extract assistant_text (closing quote optional)
        const raw = (result.text || '').replace(/```json\s?|\s?```/g, '').trim();
        let fallbackText = result.text || 'Invalid JSON response.';
        let fallbackDraft = null;
        if (raw.startsWith('{') && raw.includes('assistant_text')) {
            const m = raw.match(/"assistant_text"\s*:\s*"((?:[^"\\]|\\.)*)"?/);
            if (m) fallbackText = m[1].replace(/\\(.)/g, '$1');
        }
        parsed = { assistant_text: fallbackText, draft_email: fallbackDraft };
    }
    return {
        ...result,
        parsed,
    };
}
