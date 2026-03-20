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
  
  await extractQueue.add('extract-document', {
    document_id,
    s3_uri,
    tenant_id,
    reply_webhook_url: `${process.env.PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/documents/webhook/python-extract`
  }, {
    jobId, // Idempotency key
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false
  });

  return jobId;
}
