import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { clearSession } from '../../../components/session/sessionUtils';

const LS_KEY = 'letterlab_user';

const SecuritySection = ({ onSignOut }) => {
  const handleSignOut = () => {
    clearSession();
    if (onSignOut) onSignOut();
    else window.location.href = '/account';
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 600, mb: 4 }}>
        Security
      </Typography>

      <Box sx={{
        p: 2,
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
      }}>
        <Box>
          <Typography variant="body2" fontWeight={500}>Active Session</Typography>
          <Typography variant="caption" color="text.secondary">Current device</Typography>
        </Box>
        <Button
          size="small"
          color="error"
          variant="outlined"
          sx={{ borderRadius: '8px', textTransform: 'none', minHeight: 44 }}
          onClick={handleSignOut}
        >
          Sign out
        </Button>
      </Box>
    </Box>
  );
};

export default SecuritySection;
