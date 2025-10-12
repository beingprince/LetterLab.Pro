// backend/test_both_clients.mjs
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenAI } from '@google/genai';

const key = process.env.GEMINI_API_KEY;
if (!key) {
  console.error('❌ No GEMINI_API_KEY in .env');
  process.exit(1);
}

// ---------- 1️⃣ Test old official SDK ----------
async function testOldClient() {
  console.log('\n=== Testing @google/generative-ai (1.5) ===');
  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Say hello in one short line.');
    console.log('✅ Response:', result.response.text());
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

// ---------- 2️⃣ Test new SDK ----------
async function testNewClient() {
  console.log('\n=== Testing @google/genai (2.0) ===');
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: 'Say hello in one short line.',
    });
    // Safely access nested properties
    const text = response.output?.[0]?.content?.[0]?.text || '(no text)';
    console.log('✅ Response:', text);
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

await testOldClient();
await testNewClient();
