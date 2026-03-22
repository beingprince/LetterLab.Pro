import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

const UsageSection = ({ data, loading }) => {
  if (loading || !data?.quota) return null;

  const q = data.quota;
  // Use "Used" values for progress calculation to show filling bar
  const chatUsed = q.chatTokensUsed ?? 0;
  const chatLimit = q.chatTokensLimit ?? 50000;
  const chatPct = chatLimit > 0 ? Math.round((chatUsed / chatLimit) * 100) : 0;

  const emailUsed = q.emailsUsedToday ?? 0;
  const emailLimit = q.emailsLimitDaily ?? 10;
  const emailPct = emailLimit > 0 ? Math.round((emailUsed / emailLimit) * 100) : 0;

  const nextReset = q.nextResetAtUTC
    ? new Date(q.nextResetAtUTC).toLocaleString('en-US', { timeZone: 'UTC', dateStyle: 'medium', timeStyle: 'short' })
    : 'midnight UTC';

  return (
    <Box>
      <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 600, mb: 4 }}>
        Usage & Limits
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Chat tokens */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" fontWeight={500}>Chat tokens</Typography>
            <Typography variant="body2" color="text.secondary">
              {chatUsed.toLocaleString()} / {chatLimit.toLocaleString()}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={chatPct}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                bgcolor: chatPct < 85 ? 'primary.main' : 'warning.main',
              },
            }}
          />
        </Box>

        {/* Emails today */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" fontWeight={500}>Emails today</Typography>
            <Typography variant="body2" color="text.secondary">
              {emailUsed.toLocaleString()} / {emailLimit.toLocaleString()}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={emailPct}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                bgcolor: emailPct < 85 ? 'primary.main' : 'warning.main',
              },
            }}
          />
        </Box>

        <Typography variant="caption" color="text.secondary">
          Resets: {nextReset}
        </Typography>
      </Box>
    </Box>
  );
};

export default UsageSection;
