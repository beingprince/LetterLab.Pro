// frontend/src/PrivacyPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Typography, Stack, Paper, Divider, Grid } from '@mui/material';
import ShieldMoonIcon from '@mui/icons-material/ShieldMoon';
import GavelIcon from '@mui/icons-material/Gavel';
import LockIcon from '@mui/icons-material/Lock';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function PrivacyPage() {
  const sections = [
    {
      id: "data-collection",
      title: "1. Data Collection",
      content: "We collect only what's necessary to provide our service. This includes account credentials if you sign up, and the email content you process through our AI engines."
    },
    {
      id: "data-usage",
      title: "2. How We Use Data",
      content: "Your data is used exclusively to generate drafts and improve your personal experience. We do not sell your personal information or email contents to third parties."
    },
    {
      id: "security",
      title: "3. Security Protocols",
      content: "We implement standard security practices to protect your information. As LetterLab is a demo platform, please avoid processing highly sensitive or classified data."
    }
  ];

  return (
    <Box sx={{ pb: 10 }}>
      {/* Premium Hero */}
      <Box sx={{
        pt: { xs: 8, md: 12 },
        pb: { xs: 6, md: 8 },
        bgcolor: 'action.hover',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 800, color: 'primary.main' }}>
                  Legal · Trust
                </Typography>
                <Typography variant="h1" sx={{ fontSize: { xs: '32px', md: '48px' }, fontWeight: 800 }}>
                  Privacy Policy
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '18px', maxWidth: 600 }}>
                  We value your trust and are committed to protecting your personal information. Read about how we handle your data with transparency.
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 3, borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Policy Highlights</Typography>
                {[
                  { icon: <LockIcon fontSize="small" color="primary" />, text: "Operational data minimizing storage." },
                  { icon: <ShieldMoonIcon fontSize="small" color="primary" />, text: "No commercial data selling." },
                  { icon: <GavelIcon fontSize="small" color="primary" />, text: "Privacy-centric design." }
                ].map((item, i) => (
                  <Stack key={i} direction="row" spacing={2} alignItems="center">
                    {item.icon}
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.text}</Typography>
                  </Stack>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Grid container spacing={8}>
          {/* ToC Sidebar */}
          <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.disabled' }}>Contents</Typography>
              <Stack spacing={1} sx={{ mt: 2 }}>
                {sections.map(s => (
                  <Typography
                    key={s.id}
                    component="a"
                    href={`#${s.id}`}
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'text.secondary',
                      textDecoration: 'none',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    {s.title}
                  </Typography>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Text Content */}
          <Grid item xs={12} md={9}>
            <Stack spacing={6}>
              {sections.map(s => (
                <Box key={s.id} id={s.id} component={motion.div} variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>{s.title}</Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    {s.content}
                  </Typography>
                  <Divider sx={{ mt: 4 }} />
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
