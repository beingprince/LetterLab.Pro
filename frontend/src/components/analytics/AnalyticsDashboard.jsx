import React, { useState } from 'react';
import { Box, Typography, Button, Skeleton, IconButton, useTheme, Fade, Stack, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { Refresh } from '@mui/icons-material';
import { motion } from 'framer-motion';

import { useAnalytics } from '../../hooks/useAnalytics';
import KPICards from './dashboard/KPICards';
import UsageOverview from './dashboard/UsageOverview';
import PeakHours from './dashboard/PeakHours';
import FeatureBreakdown from './dashboard/FeatureBreakdown';
import PlanLimits from './dashboard/PlanLimits';

const DashboardSkeleton = () => (
  <Box sx={{ p: { xs: 2, md: 4 } }}>
    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
      <Skeleton variant="text" width={200} height={40} />
      <Skeleton variant="circular" width={40} height={40} />
    </Box>
    <Grid container spacing={3}>
      {[1, 2, 3, 4].map((i) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
          <Skeleton variant="rectangular" height={140} sx={{ borderRadius: '20px' }} />
        </Grid>
      ))}
      <Grid size={{ xs: 12, md: 7 }}>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '20px' }} />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '20px' }} />
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '20px' }} />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '20px' }} />
      </Grid>
    </Grid>
  </Box>
);

const AnalyticsDashboard = () => {
  const theme = useTheme();
  const { data, loading, error, refetch } = useAnalytics();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500); // minimal spinner time
  };

  if (loading && !data) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h6">Failed to load analytics</Typography>
        <Button onClick={refetch} sx={{ mt: 2 }}>Retry</Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.mode === 'dark' ? '#0D1117' : '#F7FAFF',
        pb: 8
      }}
    >
      <Box
        sx={{
          maxWidth: '1200px', // Standardized 1200px container
          margin: '0 auto',
          px: { xs: 2, sm: 2.5, md: 3, lg: 4 }, // 16px / 20px / 24px / 32px
          pt: { xs: 3.5, md: 5 }, // 28px / 40px
        }}
        component={motion.div}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* HERO BAND */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                Analytics
              </Typography>
              <Chip
                label="Local Session Data"
                size="small"
                variant="outlined"
                sx={{
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  bgcolor: 'action.hover',
                  borderColor: 'divider',
                  color: 'text.secondary',
                  height: '22px'
                }}
              />
            </Stack>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, maxWidth: 650, lineHeight: 1.6 }}>
              Overview of your AI usage and processing activity. These metrics are processed locally for your account session.
            </Typography>
          </Box>

          <IconButton
            onClick={handleRefresh}
            disabled={isRefreshing}
            size="small"
            sx={{
              bgcolor: theme.palette.background.paper,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '8px',
              p: 1,
              mt: 0.5
            }}
          >
            <Refresh
              fontSize="small"
              sx={{
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }}
            />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 4, opacity: 0.5 }} /> {/* Subtle Band Divider */}

        <Fade in={true} timeout={500}>
          <Box>
            {/* KPI BAND */}
            <Box sx={{ mb: 5 }}>
              <KPICards billing={data?.billing} totals={data?.totals} />
            </Box>

            <Divider sx={{ mb: 5, opacity: 0.5 }} />

            {/* MIDDLE BAND: Usage & Plan (7/12 | 5/12) */}
            <Grid container spacing={{ xs: 3, md: 4 }}>
              <Grid size={{ xs: 12, md: 7 }}>
                <UsageOverview timeseries={data?.timeseries} />
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <PlanLimits billing={data?.billing} />
              </Grid>
            </Grid>

            <Divider sx={{ my: 5, opacity: 0.5 }} />

            {/* BOTTOM BAND: Insights (7/12 | 5/12) */}
            <Grid container spacing={{ xs: 3, md: 4 }}>
              <Grid size={{ xs: 12, md: 7 }}>
                <PeakHours heatmap={data?.heatmap} />
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <FeatureBreakdown totals={data?.totals} />
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default AnalyticsDashboard;