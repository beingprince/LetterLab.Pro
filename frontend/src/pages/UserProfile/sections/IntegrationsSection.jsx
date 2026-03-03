import React from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Microsoft';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const IntegrationsSection = ({ data, loading }) => {
  if (loading || !data?.integrations) return null;

  const { google, outlook } = data.integrations;

  const handleConnectGoogle = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };
  const handleConnectOutlook = () => {
    window.location.href = `${API_BASE}/api/oauth/outlook/login`;
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 600, mb: 4 }}>
        Connected Accounts
      </Typography>

      <Box sx={{
        p: 2,
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <GoogleIcon sx={{ color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" fontWeight={500}>Google</Typography>
              <Typography variant="caption" color="text.secondary">
                {google?.connected ? (google.email || 'Connected') : 'Not connected'}
              </Typography>
            </Box>
          </Box>
          <Button
            size="small"
            variant={google?.connected ? 'outlined' : 'contained'}
            sx={{ textTransform: 'none', minHeight: 44 }}
            onClick={handleConnectGoogle}
          >
            {google?.connected ? 'Reconnect' : 'Connect'}
          </Button>
        </Box>

        <Divider />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MicrosoftIcon sx={{ color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" fontWeight={500}>Outlook</Typography>
              <Typography variant="caption" color="text.secondary">
                {outlook?.connected ? (outlook.email || 'Connected') : 'Not connected'}
              </Typography>
            </Box>
          </Box>
          <Button
            size="small"
            variant={outlook?.connected ? 'outlined' : 'contained'}
            sx={{ textTransform: 'none', minHeight: 44 }}
            onClick={handleConnectOutlook}
          >
            {outlook?.connected ? 'Reconnect' : 'Connect'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default IntegrationsSection;
