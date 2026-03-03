// backend/routes/status.js
// GET /api/status — system status for footer badge and /status page

import express from 'express';
import { mongoState } from '../db.js';

const router = express.Router();

router.get('/', (_req, res) => {
  const { isConnected } = mongoState();
  const apiStatus = isConnected ? 'operational' : 'degraded';
  const overall = apiStatus === 'operational' ? 'operational' : 'degraded';

  res.json({
    overall,
    services: {
      api: apiStatus,
      ai: 'operational',
      website: 'operational',
    },
    updatedAt: new Date().toISOString(),
    incidents: [],
  });
});

export default router;
