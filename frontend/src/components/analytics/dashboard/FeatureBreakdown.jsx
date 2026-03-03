import React from 'react';
import { Paper, Box, Typography, useTheme, alpha, Grid } from '@mui/material';
import { Email, Forum, AutoAwesome, Description } from '@mui/icons-material';

const StatItem = ({ icon: Icon, label, value, color }) => (
    <Box
        sx={{
            p: 2, // 16px padding
            borderRadius: '12px',
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            height: '100%',
            transition: 'all 0.2s',
            '&:hover': {
                bgcolor: (theme) => alpha(color, 0.04),
                borderColor: color,
                transform: 'translateY(-2px)'
            }
        }}
    >
        <Box
            sx={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                display: 'grid',
                placeItems: 'center',
                bgcolor: alpha(color, 0.1),
                color: color
            }}
        >
            <Icon sx={{ fontSize: 18 }} />
        </Box>
        <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>
                {value}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mt: 0.5, display: 'block' }}>
                {label}
            </Typography>
        </Box>
    </Box>
);

const FeatureBreakdown = ({ totals }) => {
    const theme = useTheme();

    // Design Audit Fixes:
    // - Reduce padding
    // - Softer icon backgrounds
    // - Uniform card heights

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, md: 2.5 }, // 16px -> 20px padding
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Box sx={{ mb: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                    Feature Usage
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5, display: 'block' }}>
                    Breakdown of AI generation tools
                </Typography>
            </Box>

            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <StatItem
                        icon={Email}
                        label="Replies Generated"
                        value={totals?.repliesGenerated || 0}
                        color={theme.palette.primary.main}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <StatItem
                        icon={Description}
                        label="Subjects Created"
                        value={totals?.subjectsCreated || 0}
                        color={theme.palette.secondary.main || '#EC4899'}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <StatItem
                        icon={AutoAwesome}
                        label="Summaries"
                        value={totals?.summariesCreated || 0}
                        color="#8B5CF6"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <StatItem
                        icon={Forum}
                        label="Threads Read"
                        value={totals?.threadsRead || 0}
                        color="#10B981"
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};

export default FeatureBreakdown;
