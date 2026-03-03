import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

const PLAN_LABELS = { free: 'Free', pro: 'Pro', demo: 'Demo' };
const PLAN_DESCRIPTIONS = {
  free: 'Daily limits shown below. Upgrade for more.',
  pro: 'Unlimited chat and email drafts.',
  demo: 'Higher limits for E-week trial.',
};

const PlanSection = ({ data, loading }) => {
  if (loading || !data?.user) return null;

  const plan = data.user.plan || 'free';
  const label = PLAN_LABELS[plan] || plan;
  const desc = PLAN_DESCRIPTIONS[plan] || PLAN_DESCRIPTIONS.free;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 600, mb: 4 }}>
        Plan
      </Typography>

      <Box sx={{
        p: 3,
        borderRadius: '16px',
        bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(37,99,235,0.08)' : 'rgba(37,99,235,0.04)',
        border: '1px solid',
        borderColor: 'rgba(37,99,235,0.2)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Typography variant="h6" fontWeight={700}>{label}</Typography>
          <Chip label="Active" size="small" color="success" sx={{ height: 20, fontSize: '10px' }} />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {desc}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Daily usage reset at midnight UTC.
        </Typography>
      </Box>
    </Box>
  );
};

export default PlanSection;
