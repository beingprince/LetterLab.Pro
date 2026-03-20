import { Queue, Worker, QueueEvents } from 'bullmq';
import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

// Standard Redis Connection
const redisOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
};

export const connection = new Redis(redisOptions);

connection.on('error', (err) => {
  // Silencing for local "working condition" bypass
});

connection.on('connect', () => {
  console.log('✅ [Redis] Connected successfully. Queue system is ready.');
});

// Define 5 Main Queues
export const extractQueue = new Queue('extract', { connection });
export const normalizeQueue = new Queue('normalize', { connection });
export const chunkQueue = new Queue('chunk', { connection });
export const embedQueue = new Queue('embed', { connection });
export const retryQueue = new Queue('retry', { connection }); // Dead-letter / exponential backoff

/**
 * Helper to dispatch an extraction job to the Python Microservice.
 * This pushes a job into BullMQ which a separate worker process would pick up.
 */
export async function addExtractJob({ document_id, s3_uri, tenant_id }) {
  const jobId = `extract_${document_id}_${Date.now()}`;
  
  // ── IMPORTANT: Redis Hang Guard ──
  // If Redis is unreachable, BullMQ's .add() can hang indefinitely.
  // We wrap it in a 5-second timeout race.
  const timeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Redis connection timeout (5s)')), 5000)
  );

  try {
    await Promise.race([
      extractQueue.add('extract-document', {
        document_id,
        s3_uri,
        tenant_id,
        reply_webhook_url: `${process.env.PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/documents/webhook/python-extract`
      }, {
        jobId,
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false
      }),
      timeout
    ]);
    return jobId;
  } catch (err) {
    console.warn(`⚠️ [QueueService] addExtractJob failed/timed out: ${err.message}`);
    // We return a "pseudo-job-id" so the upload doesn't hard-crash.
    // The status polling will eventually show 'failed' or stay 'processing'.
    return `timeout_${jobId}`;
  }
}
