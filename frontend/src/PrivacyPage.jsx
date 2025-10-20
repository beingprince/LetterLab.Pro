// frontend/src/PrivacyPage.jsx
import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

export default function PrivacyPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>Privacy Policy</Typography>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="body1">
          Default mode stores drafts locally. You can erase local data any time in Settings.
          Full privacy policy content will be published here.
        </Typography>
      </Paper>
    </Container>
  );
}
