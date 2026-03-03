import React, { useState } from 'react';
import { Paper, Box, Typography, Select, MenuItem, FormControl, useTheme } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UsageOverview = ({ timeseries }) => {
    const theme = useTheme();
    const [range, setRange] = useState(30);

    // Filter data based on range (mock logic for now if data is fixed)
    const data = timeseries?.tokensUsedDaily || [];
    const chartData = data.slice(-range);

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
                flexDirection: 'column'
            }}
        >
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                        Usage Overview
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5, display: 'block' }}>
                        Token consumption over last 30 days
                    </Typography>
                </Box>
                <FormControl size="small">
                    <Select
                        value={range}
                        onChange={(e) => setRange(e.target.value)}
                        sx={{
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            height: 36,
                            minWidth: 120
                        }}
                    >
                        <MenuItem value={7}>Last 7 Days</MenuItem>
                        <MenuItem value={30}>Last 30 Days</MenuItem>
                        <MenuItem value={90}>Last 3 Months</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Chart Container - Flex Grow to fill space */}
            <Box sx={{ flexGrow: 1, width: '100%', height: 300, minHeight: 300, position: 'relative', display: 'block', minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.15} />
                                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: theme.palette.background.paper,
                                borderRadius: '8px',
                                border: '1px solid ' + theme.palette.divider,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={theme.palette.primary.main}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorTokens)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};

export default UsageOverview;
