import React from 'react';
import { Box, Typography, Link } from '@mui/material';

/** Data & Privacy: links only to real pages (/privacy, /terms). No fake Export/Delete until backend exists. */
const DataSection = () => (
  <Box>
    <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 600, mb: 4 }}>
      Data & Privacy
    </Typography>

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Link href="/privacy" color="primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
        Privacy Policy
      </Link>
      <Link href="/terms" color="primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
        Terms of Service
      </Link>
    </Box>
  </Box>
);

export default DataSection;
