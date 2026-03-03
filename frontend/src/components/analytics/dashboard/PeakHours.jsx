import React from 'react';
import { Paper, Box, Typography, Tooltip, useTheme, Stack } from '@mui/material';

const PeakHours = ({ heatmap }) => {
    const theme = useTheme();

    const maxValue = heatmap?.values?.reduce((max, item) => Math.max(max, item.value), 0) || 1;

    const days = heatmap?.days || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const hours = heatmap?.hours || Array.from({ length: 24 }, (_, i) => i);

    const valueMap = new Map();
    heatmap?.values?.forEach(d => {
        valueMap.set(`${d.day}-${d.hour}`, d.value);
    });

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
            {/* Header section with baseline alignment */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                        When you used LetterLab most (UTC)
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5, display: 'block' }}>
                        Darker squares mean more activity.
                    </Typography>
                </Box>

                {/* Intensity Legend */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase' }}>
                        Low
                    </Typography>
                    <Stack direction="row" spacing={0.4}>
                        {[0.1, 0.3, 0.5, 0.7, 0.9].map((op, i) => (
                            <Box
                                key={i}
                                sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '2px',
                                    bgcolor: theme.palette.primary.main,
                                    opacity: op
                                }}
                            />
                        ))}
                    </Stack>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase' }}>
                        High
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflowX: 'auto', py: 1 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'min-content repeat(24, 1fr)', gap: '3px', minWidth: 500, width: '100%' }}>
                    {/* Header Row (Hours - Reduced clutter) */}
                    <Box />
                    {hours.map(h => (
                        <Typography
                            key={h}
                            variant="caption"
                            sx={{
                                fontSize: 9,
                                textAlign: 'center',
                                color: 'text.secondary',
                                visibility: {
                                    xs: h % 4 === 0 ? 'visible' : 'hidden',
                                    md: h % 2 === 0 ? 'visible' : 'hidden'
                                }
                            }}
                        >
                            {h}
                        </Typography>
                    ))}

                    {/* Data Rows */}
                    {days.map((day, dayIndex) => (
                        <React.Fragment key={day}>
                            <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 700, alignSelf: 'center', color: 'text.secondary', pr: 1.5 }}>
                                {day}
                            </Typography>
                            {hours.map(h => {
                                const val = valueMap.get(`${dayIndex}-${h}`) || 0;
                                const intensity = val > 0 ? 0.2 + (val / maxValue) * 0.8 : 0.05;
                                return (
                                    <Tooltip
                                        key={h}
                                        title={
                                            <Box sx={{ p: 0.5 }}>
                                                <Typography variant="caption" sx={{ display: 'block', fontWeight: 700 }}>
                                                    Activity: {val} events
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                    Time: {h}:00–{h + 1}:00 UTC
                                                </Typography>
                                            </Box>
                                        }
                                        arrow
                                    >
                                        <Box
                                            sx={{
                                                width: '100%',
                                                paddingTop: '100%',
                                                backgroundColor: theme.palette.primary.main,
                                                opacity: intensity,
                                                borderRadius: '3px',
                                                cursor: 'default',
                                                transition: 'all 0.15s',
                                                '&:hover': {
                                                    opacity: 1,
                                                    transform: 'scale(1.25)',
                                                    zIndex: 2,
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                }
                                            }}
                                        />
                                    </Tooltip>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </Box>
            </Box>
        </Paper>
    );
};

export default PeakHours;
