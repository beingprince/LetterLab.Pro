import React from 'react';
import { Paper, Box, Typography, LinearProgress, Button, Chip, useTheme, Divider } from '@mui/material';
import { AccessTime, CalendarToday } from '@mui/icons-material';

const PlanLimits = ({ billing }) => {
    const theme = useTheme();

    const used = billing?.tokensUsed || 0;
    const limit = billing?.tokenLimit || 50;
    const percent = Math.min((used / limit) * 100, 100);

    let color = 'primary';
    if (percent > 90) color = 'error';
    else if (percent > 70) color = 'warning';

    const startDate = billing?.cycleStart ? new Date(billing.cycleStart).toLocaleDateString() : 'N/A';
    const endDate = billing?.cycleEnd ? new Date(billing.cycleEnd).toLocaleDateString() : 'N/A';

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, md: 2.5 }, // 16px -> 20px padding
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
        >
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                        Current Plan (Demo)
                    </Typography>
                    <Chip
                        label={billing?.plan?.toUpperCase() || 'FREE'}
                        color={billing?.plan === 'pro' ? 'primary' : 'default'}
                        size="small"
                        sx={{ fontWeight: 700, borderRadius: '6px', height: 22, fontSize: '10px' }}
                    />
                </Box>

                <Box sx={{ mb: 3.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                            Usage Reset
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.875rem' }}>
                            {used} / {limit} <Typography component="span" variant="caption" color="text.secondary">tokens</Typography>
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={percent}
                        color={color}
                        sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: theme.palette.action.selected
                        }}
                    />
                </Box>

                <Divider sx={{ mb: 3.5, opacity: 0.4 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'action.hover', color: 'text.secondary', display: 'flex' }}>
                            <CalendarToday sx={{ fontSize: 18 }} />
                        </Box>
                        <Box>
                            <Typography variant="caption" display="block" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                                Billing Cycle
                            </Typography>
                            <Typography variant="body2" fontWeight={700}>
                                {startDate} — {endDate}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'action.hover', color: 'text.secondary', display: 'flex' }}>
                            <AccessTime sx={{ fontSize: 18 }} />
                        </Box>
                        <Box>
                            <Typography variant="caption" display="block" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                                Next Reset
                            </Typography>
                            <Typography variant="body2" fontWeight={700}>
                                Daily at Midnight (UTC)
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {billing?.plan !== 'pro' && (
                <Button
                    variant="outlined" // Medium emphasis
                    fullWidth
                    sx={{
                        mt: 3,
                        borderRadius: '10px',
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.2
                    }}
                >
                    Upgrade Plan
                </Button>
            )}
        </Paper>
    );
};

export default PlanLimits;
