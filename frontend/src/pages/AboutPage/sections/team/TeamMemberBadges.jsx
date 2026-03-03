import React from 'react';
import { Box, Chip } from '@mui/material';

/**
 * Role chip for team member. Uses theme palette; neutral styling.
 */
export default function TeamMemberBadges({ role }) {
  if (!role) return null;
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
      <Chip
        label={role}
        size="small"
        variant="outlined"
        sx={{
          fontWeight: 600,
          fontSize: '0.75rem',
          borderColor: 'divider',
          color: 'text.secondary',
        }}
      />
    </Box>
  );
}
