// frontend/src/HomepageV2.jsx
import React from 'react';
import { Box, Container, Typography, Button, Grid, Chip, Paper } from '@mui/material';

export default function HomepageV2() {
  return (
    <Box component="main" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        {/* Hero */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '2rem', md: '2.75rem' } }}>
            Write academic-grade emails in minutes.
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 720, mx: 'auto', mb: 3 }}>
            Context-aware drafts, session memory, and one-click sending to Gmail or Outlook—privacy-first and zero clutter.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button href="/compose" variant="contained" size="large">Start composing</Button>
            <Button href="/docs" variant="outlined" size="large">Try a sample / Templates</Button>
          </Box>
          <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Chip label="Privacy-first" variant="outlined" size="small" />
            <Chip label="Beta v1.0" variant="outlined" size="small" />
            <Chip label="No ads" variant="outlined" size="small" />
          </Box>
        </Box>

        {/* How it works */}
        <Grid container spacing={2} sx={{ mb: { xs: 6, md: 8 } }}>
          {[
            { t: 'Prompt', d: 'Describe your situation and tone.' },
            { t: 'Draft', d: 'Review, tweak, and pin key lines.' },
            { t: 'Send', d: 'Open prefilled in Gmail/Outlook.' },
          ].map((it, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{idx + 1}. {it.t}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{it.d}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Feature grid */}
        <Grid container spacing={2} sx={{ mb: { xs: 6, md: 8 } }}>
          {[
            { t: 'Session memory', d: 'Keeps context so drafts improve.' },
            { t: 'Pins', d: 'Save key lines across the thread.' },
            { t: 'Tone sliders', d: 'Formal↔Friendly, Short↔Detailed.' },
            { t: 'Privacy-first', d: 'Local cache by default.' },
            { t: 'One-click mail', d: 'Prefilled subject & body.' },
            { t: 'Docs & templates', d: 'Academic scenarios ready.' },
          ].map((it) => (
            <Grid item xs={12} sm={6} md={4} key={it.t}>
              <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>{it.t}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{it.d}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Privacy note */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 6 } }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            By default, drafts store locally. Erase anytime in Settings.{' '}
            <Button href="/privacy" size="small">Privacy Policy</Button>
          </Typography>
        </Box>

        {/* Final CTA */}
        <Box sx={{ textAlign: 'center' }}>
          <Button href="/compose" variant="contained" size="large" sx={{ mr: 2 }}>Start composing</Button>
          <Button href="/docs" variant="outlined" size="large">Explore templates</Button>
        </Box>

        {/* Footer */}
        <Box sx={{ mt: { xs: 6, md: 10 }, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="caption">
            <a href="/docs">Docs</a> • <a href="/privacy">Privacy</a> • <a href="/about">About</a> • <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
            {' '} — v1.0.0-beta.N
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
