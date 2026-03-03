// src/pages/AboutPage/components.jsx
import { Stack, Typography, Box } from '@mui/material';

export const FlowStep = ({ Icon, text }) => (
  <Stack spacing={2} alignItems="center" textAlign="center" sx={{ flex: 1 }}>
    <Box sx={{ 
      width: 80, 
      height: 80, 
      borderRadius: '24px', 
      background: 'var(--brand-glass-surface)', 
      backdropFilter: 'blur(10px)',
      border: '1px solid var(--brand-border)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: 'var(--brand-primary)'
    }}>
      <Icon />
    </Box>
    <Typography variant="h6" sx={{ fontWeight: 600 }}>{text}</Typography>
  </Stack>
);

export const ValueItem = ({ Icon, title, content }) => (
  <Stack direction="row" spacing={2}>
    <Box sx={{ color: 'var(--brand-primary)', mt: 0.5 }}><Icon /></Box>
    <Stack spacing={0.5}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>{content}</Typography>
    </Stack>
  </Stack>
);