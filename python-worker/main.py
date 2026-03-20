# python-worker/main.py
# ─────────────────────────────────────────────────────────────────────────────
# This is the Python Microservice skeleton for Document Extraction.
#
# It uses FastAPI to listen for extraction requests from Node.js (BullMQ).
# This service is stateless and designed for high-concurrency extraction tasks.
#
# Architecture:
#   1. Receives document metadata and S3 URI.
#   2. Downloads the file from S3.
#   3. Routes parsing: Native PDF parsing (fitz) or OCR (Tesseract) or Vision (Claude).
#   4. POSTs the structured result back to the Node.js webhook.
# ─────────────────────────────────────────────────────────────────────────────

import time
import requests
from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="LetterLab Document Intelligence - Python Worker")

# ── Pydantic Schemas ──
# Mirrors the Node.js MongoDB structure for consistency.

class Block(BaseModel):
    index: int
    type: str # 'paragraph', 'heading', 'table', 'vision_insight'
    content: str
    bbox: List[float] # [x0, y0, x1, y1]
    confidence: float

class Page(BaseModel):
    page_number: int
    dimensions: dict # { width, height }
    image_url: Optional[str] = None
    blocks: List[Block]

class ExtractionRequest(BaseModel):
    document_id: str
    s3_uri: str
    reply_webhook_url: str
    tenant_id: str

# ── Extraction Logic (Simulation) ──

def run_extraction_pipeline(request: ExtractionRequest):
    """
    Simulated extraction pipeline. In production, this would:
      1. Download from S3: s3.download_file(request.s3_uri)
      2. Parse PDF with PyMuPDF (fitz)
      3. Run OCR/Vision where needed
      4. Prepare the page/block structure
    """
    print(f"[Worker] Starting extraction for Doc: {request.document_id}")
    
    start_time = time.time()
    
    # Progress helper
    def send_progress(p):
        try:
            progress_url = request.reply_webhook_url.replace('/python-extract', '/progress')
            requests.post(progress_url, json={"document_id": request.document_id, "progress": p}, timeout=2)
        except: pass

    # Simulate work with progress updates
    for p in [10, 30, 60, 90]:
        send_progress(p)
        time.sleep(1.5)
    
    # Mock result matching the expected Node.js webhook format
    payload = {
        "document_id": request.document_id,
        "status": "success",
        "duration_ms": int((time.time() - start_time) * 1000),
        "pages": [
            {
                "page_number": 1,
                "dimensions": {"width": 612, "height": 792},
                "blocks": [
                    {
                        "index": 0,
                        "type": "heading",
                        "content": "Quarterly Financial Analysis",
                        "bbox": [50, 50, 550, 100],
                        "confidence": 0.99
                    },
                    {
                        "index": 1,
                        "type": "paragraph",
                        "content": "This document outlines the revenue growth observed in Q3...",
                        "bbox": [50, 120, 550, 200],
                        "confidence": 0.95
                    }
                ]
            }
        ]
    }

    # ── Callback Node.js Webhook ──
    try:
        print(f"[Worker] Sending result to webhook: {request.reply_webhook_url}")
        response = requests.post(request.reply_webhook_url, json=payload, timeout=10)
        response.raise_for_status()
        print(f"[Worker] Callback successful for Doc: {request.document_id}")
    except Exception as e:
        print(f"[Worker] Callback failed: {str(e)}")


# ── API Endpoints ──

@app.post("/extract")
async def extract_document(request: ExtractionRequest, background_tasks: BackgroundTasks):
    """
    Main entry point for extraction requests.
    This works as a "fire-and-forget" endpoint: it validates the request
    and starts the heavy processing in a background task.
    """
    # In production, we'd check if the S3 file actually exists first.
    background_tasks.add_task(run_extraction_pipeline, request)
    
    return {
        "success": True,
        "message": "Extraction job accepted and running in background.",
        "job_id": request.document_id
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "python-worker"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
