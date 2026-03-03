import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  const res = await ai.models.list();

  console.log("\n=== RAW models.list() TYPE ===");
  console.log(typeof res);

  console.log("\n=== RAW models.list() KEYS ===");
  console.log(res && typeof res === "object" ? Object.keys(res) : res);

  // Try common shapes
  const candidates =
    Array.isArray(res) ? res :
    Array.isArray(res?.models) ? res.models :
    Array.isArray(res?.data) ? res.data :
    Array.isArray(res?.items) ? res.items :
    null;

  if (candidates) {
    console.log("\n=== AVAILABLE MODELS ===\n");
    for (const m of candidates) console.log(m.name || m.id || JSON.stringify(m));
    return;
  }

  // If it’s a pager/async iterable, try iterating it safely
  if (res && typeof res[Symbol.asyncIterator] === "function") {
    console.log("\n=== AVAILABLE MODELS (async iterable) ===\n");
    for await (const m of res) console.log(m.name || m.id || JSON.stringify(m));
    return;
  }

  // If it’s a sync iterable
  if (res && typeof res[Symbol.iterator] === "function") {
    console.log("\n=== AVAILABLE MODELS (iterable) ===\n");
    for (const m of res) console.log(m.name || m.id || JSON.stringify(m));
    return;
  }

  console.log("\n=== FULL RAW RESPONSE (truncated) ===");
  console.log(JSON.stringify(res, null, 2).slice(0, 6000));
}

main().catch((err) => {
  console.error("\nERROR:", err?.message || err);
  process.exit(1);
});