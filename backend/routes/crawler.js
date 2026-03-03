import express from 'express';
import { randomUUID } from 'crypto';
import EventEmitter from 'events';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { auth } from '../middleware/auth.js';
import Professor from '../models/Professor.js';
import { listThreads, getAndSummarizeThreads } from '../services/EmailService.js';

const router = express.Router();
const jobEvents = new EventEmitter();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JOBS_FILE = path.join(__dirname, '../jobs.json');

// Helper to read jobs from file
const readJobs = () => {
    try {
        if (!fs.existsSync(JOBS_FILE)) {
            return {};
        }
        const data = fs.readFileSync(JOBS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading jobs file:', error);
        return {};
    }
};

// Helper to write jobs to file
const writeJobs = (jobs) => {
    try {
        fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2));
    } catch (error) {
        console.error('Error writing jobs file:', error);
    }
};

// Helper to update a specific job
const updateJob = (jobId, updateFn) => {
    const jobs = readJobs();
    if (jobs[jobId]) {
        updateFn(jobs[jobId]);
        writeJobs(jobs);
    }
};

// POST /api/crawler/start
// Starts a crawling job (either 'list' or 'analyze')
router.post('/start', auth, async (req, res) => {
    console.log(`[PID:${process.pid}] POST /start received`);
    try {
        const { type, targetEmail, threadIds, outlookAccessToken } = req.body;

        if (!outlookAccessToken) {
            return res.status(400).json({ error: 'Missing outlookAccessToken' });
        }

        if (!type || !['list', 'analyze'].includes(type)) {
            return res.status(400).json({ error: 'Invalid or missing job type. Must be "list" or "analyze".' });
        }

        // Validation based on type
        if (type === 'list') {
            if (!targetEmail) return res.status(400).json({ error: 'Missing targetEmail for list job' });

            // Check if professor exists
            const prof = await Professor.findOne({
                email: targetEmail.toLowerCase(),
                userId: req.user.id
            });
            if (!prof) {
                return res.status(403).json({ error: 'Professor not found in your contacts.' });
            }
        } else if (type === 'analyze') {
            if (!threadIds || !Array.isArray(threadIds) || threadIds.length === 0) {
                return res.status(400).json({ error: 'Missing threadIds for analyze job' });
            }
        }

        // Create Job
        const jobId = randomUUID();
        const job = {
            id: jobId,
            type,
            status: 'pending',
            startTime: Date.now(),
            logs: [],
            result: null,
            error: null
        };

        const jobs = readJobs();
        jobs[jobId] = job;
        writeJobs(jobs);

        console.log(`✅ Job ${jobId} created. Type: ${type}. Saved to ${JOBS_FILE}`);

        // Start Async Process
        if (type === 'list') {
            runListJob(jobId, targetEmail, outlookAccessToken);
        } else {
            runAnalyzeJob(jobId, threadIds, outlookAccessToken);
        }

        res.json({ jobId });

    } catch (error) {
        console.error('Failed to start crawler:', error);
        res.status(500).json({ error: error.message });
    }
});

// Async Worker: List Threads
async function runListJob(jobId, targetEmail, accessToken) {
    const log = (message, stage = 'info') => {
        updateJob(jobId, (job) => {
            job.logs.push({ stage, message, timestamp: Date.now() });
        });
    };

    try {
        log('Connecting to Outlook...', 'connecting');
        log(`Scanning inbox for ${targetEmail}...`, 'reading');

        const threads = await listThreads(accessToken, targetEmail);

        updateJob(jobId, (job) => {
            if (threads.length === 0) {
                job.logs.push({ stage: 'complete', message: 'No threads found.', timestamp: Date.now() });
                job.result = { threads: [] };
            } else {
                job.logs.push({ stage: 'complete', message: `Found ${threads.length} threads.`, timestamp: Date.now() });
                job.result = { threads };
            }
            job.status = 'completed';
        });

    } catch (error) {
        console.error(`List Job ${jobId} failed:`, error);
        updateJob(jobId, (job) => {
            job.logs.push({ stage: 'error', message: error.message || 'An unexpected error occurred.', timestamp: Date.now() });
            job.error = error.message;
            job.status = 'failed';
        });
    }
}

// Async Worker: Analyze Threads
async function runAnalyzeJob(jobId, threadIds, accessToken) {
    const log = (message, stage = 'info') => {
        updateJob(jobId, (job) => {
            job.logs.push({ stage, message, timestamp: Date.now() });
        });
    };

    try {
        log(`Analyzing ${threadIds.length} selected threads...`, 'analyzing');

        const summaryResult = await getAndSummarizeThreads(accessToken, threadIds);

        log('Finalizing summary...', 'generating');

        updateJob(jobId, (job) => {
            job.logs.push({ stage: 'complete', message: 'Analysis complete.', timestamp: Date.now() });
            job.result = summaryResult;
            job.status = 'completed';
        });

    } catch (error) {
        console.error(`Analyze Job ${jobId} failed:`, error);
        updateJob(jobId, (job) => {
            job.logs.push({ stage: 'error', message: error.message || 'An unexpected error occurred.', timestamp: Date.now() });
            job.error = error.message;
            job.status = 'failed';
        });
    }
}

// GET /api/crawler/status/:jobId
// Polling endpoint
router.get('/status/:jobId', auth, (req, res) => {
    const { jobId } = req.params;
    console.log(`[PID:${process.pid}] GET /status/${jobId} received`);

    const jobs = readJobs();
    const job = jobs[jobId];

    if (!job) {
        console.error(`❌ Job ${jobId} not found in file.`);
        return res.status(404).json({ error: 'Job not found' });
    }

    res.json({
        id: job.id,
        status: job.status,
        logs: job.logs,
        result: job.result,
        error: job.error
    });
});

// GET /api/crawler/debug
// Dump all jobs
router.get('/debug', (req, res) => {
    const jobs = readJobs();
    res.json(jobs);
});

export default router;