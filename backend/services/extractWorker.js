import { Worker } from 'bullmq';
import axios from 'axios';
import { connection } from './queueService.js';
import Document from '../models/Document.js';

/**
 * BullMQ Worker for the 'extract' queue.
 * This worker acts as a bridge between Node.js and the Python FastAPI worker.
 */
const extractWorker = new Worker('extract', async (job) => {
  const { document_id, s3_uri, tenant_id, reply_webhook_url } = job.data;
  
  console.log(`[Worker] Picking up extraction for Doc: ${document_id}`);
  
  try {
    // 1. Call Python FastAPIWorker
    // Note: Python worker usually runs on port 8000
    const pythonWorkerUrl = process.env.PYTHON_WORKER_URL || 'http://localhost:8000/extract';
    
    const response = await axios.post(pythonWorkerUrl, {
      document_id,
      s3_uri,
      tenant_id,
      reply_webhook_url
    });
    
    console.log(`[Worker] Dispatched to Python: ${response.data.message}`);
    return response.data;
  } catch (err) {
    console.error(`[Worker] Failed to dispatch to Python for Doc: ${document_id}`, err.message);
    
    // Update document status to failed if we can't even reach the worker
    await Document.findByIdAndUpdate(document_id, {
      status: 'failed',
      error_message: `Extraction worker unreachable: ${err.message}`
    });
    
    throw err; // Re-throw to let BullMQ handle retries
  }
}, { 
  connection,
  concurrency: 5 
});

extractWorker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} dispatched successfully.`);
});

extractWorker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed: ${err.message}`);
});

console.log('✅ [Worker] Extraction bridge is listening for jobs...');

export default extractWorker;
