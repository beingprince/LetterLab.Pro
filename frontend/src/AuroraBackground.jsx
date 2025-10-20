// =============================================
// File: frontend/src/AuroraBackground.jsx
// Description: Vibrant abstract gradient background with slowly moving blurred blobs
// Usage: Place once near the root (under AppShell) or within a page. It does not intercept clicks.
// =============================================

import React from 'react';
import { Box, keyframes } from '@mui/material';

const floatA = keyframes`
  0% { transform: translate(-10%, -10%) scale(1); }
  50% { transform: translate( 10%, 5%) scale(1.1); }
  100% { transform: translate(-10%, -10%) scale(1); }
`;
const floatB = keyframes`
  0% { transform: translate(20%, 10%) scale(1); }
  50% { transform: translate(-10%, -5%) scale(1.08); }
  100% { transform: translate(20%, 10%) scale(1); }
`;
const floatC = keyframes`
  0% { transform: translate(-5%, 15%) scale(0.95); }
  50% { transform: translate(10%, -10%) scale(1.05); }
  100% { transform: translate(-5%, 15%) scale(0.95); }
`;

export default function AuroraBackground() {
  return (
    <Box sx={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,               // below page content
      pointerEvents: 'none',   // never block clicks/scroll
      background: 'linear-gradient(170deg, #161B22 0%, #0D1117 100%)',
      overflow: 'hidden',
    }}>
      {/* Soft noise overlay */}
      <Box sx={{
        position: 'absolute', inset: 0, opacity: 0.08,
        pointerEvents: 'none',
        background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='table' tableValues='0 0.06'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`
      }} />

      {/* Blurred color blobs */}
      <Box sx={{
        position: 'absolute', width: 420, height: 420, borderRadius: '50%',
        filter: 'blur(100px)', opacity: 0.8,
        background: 'radial-gradient(circle at 30% 30%, #00A3FF, transparent 60%)',
        animation: `${floatA} 18s ease-in-out infinite`,
        top: '-10%', left: '-6%'
      }} />
      <Box sx={{
        position: 'absolute', width: 520, height: 520, borderRadius: '50%',
        filter: 'blur(120px)', opacity: 0.7,
        background: 'radial-gradient(circle at 70% 40%, #8B5CF6, transparent 60%)',
        animation: `${floatB} 22s ease-in-out infinite`,
        bottom: '-12%', right: '-8%'
      }} />
      <Box sx={{
        position: 'absolute', width: 460, height: 460, borderRadius: '50%',
        filter: 'blur(110px)', opacity: 0.75,
        background: 'radial-gradient(circle at 50% 50%, #10B981, transparent 60%)',
        animation: `${floatC} 24s ease-in-out infinite`,
        top: '10%', right: '15%'
      }} />
    </Box>
  );
}
