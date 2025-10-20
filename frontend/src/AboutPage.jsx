import React, { useEffect, useRef } from 'react';
import { Box, Container, Typography, Stack, Chip, Grid, Button } from '@mui/material';

// --- SVG Icons for "How it works" section ---
const IconEdit = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);
const IconSparkles = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3L9.5 8.5 4 11l5.5 2.5L12 19l2.5-5.5L20 11l-5.5-2.5z"></path>
    <path d="M5 3v4"></path><path d="M19 17v4"></path>
  </svg>
);
const IconChecklist = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <path d="M15 2l-3 3-3-3"></path><path d="m9 12 2 2 4-4"></path>
  </svg>
);
const IconSend = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

// --- SVG Icons for "Philosophy" section ---
const IconOpenSource = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 8l-4 4 4 4"></path><path d="M17 8l4 4-4 4"></path><path d="M14 4l-4 16"></path></svg>
);
const IconBrain = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7v0A2.5 2.5 0 0 0 7 9.5v0A2.5 2.5 0 0 1 4.5 12v0A2.5 2.5 0 0 1 7 14.5v0A2.5 2.5 0 0 0 9.5 17v0A2.5 2.5 0 0 1 12 19.5v0A2.5 2.5 0 0 1 14.5 17v0A2.5 2.5 0 0 0 17 14.5v0A2.5 2.5 0 0 1 19.5 12v0A2.5 2.5 0 0 1 17 9.5v0A2.5 2.5 0 0 0 14.5 7v0A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 2z"></path></svg>
);
const IconShield = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);
const IconGradCap = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 1.7.7 3.2 2 4.2"></path></svg>
);
const IconRocket = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3.05-3.12-.67-.82-2.32-1.01-3.15-.06zM13 18c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6H7.17M12 11c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6"></path></svg>
);
const IconUsers = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

// Reusable
const FlowStep = ({ icon, text }) => (
  <Stack spacing={2} alignItems="center" textAlign="center" sx={{ flex: 1 }}>
    {icon}
    <Typography variant="h6" sx={{ fontWeight: 600 }}>
      {text}
    </Typography>
  </Stack>
);

const FlowConnector = () => (
  <Box sx={{
    color: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center',
    px: { xs: 0, md: 2 }, py: { xs: 2, md: 0 }, transform: { xs: 'rotate(90deg)', md: 'none' }
  }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  </Box>
);

const ValueItem = ({ icon, title, content }) => (
  <Grid item xs={12} md={4}>
    <Stack direction="row" spacing={2}>
      <Box sx={{ color: 'primary.main', mt: 0.5 }}>{icon}</Box>
      <Stack spacing={0.5}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>{content}</Typography>
      </Stack>
    </Stack>
  </Grid>
);

export default function AboutPageHeader() {
  const mainRef = useRef(null);

  // Fix: ensure visible immediately without second click
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      mainRef.current?.focus();
    } catch {}
  }, []);

  return (
    <Box
      ref={mainRef}
      role="main"
      tabIndex={-1}
      sx={{
        outline: 'none',
        position: 'relative',
        zIndex: 1,
        pointerEvents: 'auto',
      }}
    >
      {/* SECTION 1: Main Page Header */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center', overflow: 'hidden', position: 'relative' }}>
        <Box aria-hidden sx={{ position: 'absolute', inset: -120, background: 'radial-gradient(circle at 10% 20%, rgba(0,163,255,.08), transparent 40%)', filter: 'blur(24px)' }} />
        <Container maxWidth="md">
          <Stack spacing={2} alignItems="center">
            <Chip label="Open Source • 2025" variant="outlined" />
            <Typography variant="h2" sx={{ fontWeight: 800, letterSpacing: -1, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
              About LetterLab Pro
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 700, fontWeight: 400 }}>
              We are building a next-generation design tool for students and teachers to draft effective emails quickly, powered by session memory and smart summarization.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* SECTION 2: Founder Block */}
      <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Box component="img" src="https://scontent-dfw5-2.xx.fbcdn.net/v/t39.30808-1/476152507_640321568374848_5505582188393463543_n.jpg?stp=cp6_dst-jpg_s200x200_tt6&_nc_cat=100&ccb=1-7&_nc_sid=1d2534&_nc_ohc=OsuSSiLlpQAQ7kNvwE6n04R&_nc_oc=AdmOtU51hVJaK6bpBp6H2HG-9CAaNaGN9J7oBDtx4wmwBT_aiuM6uEuXSadWUCYtJaA&_nc_zt=24&_nc_ht=scontent-dfw5-2.xx&_nc_gid=SFnymUgsXybi8st8nYcKDA&oh=00_AfeBkj9Ad5OtUSwM5EqDZcQ0PuAB3jG7jsSOeoLBNu29Sw&oe=68FB90B8" alt="Founder of LetterLab Pro" sx={{ width: 160, height: 160, borderRadius: '50%', objectFit: 'cover', mx: 'auto' }} />
            </Grid>
            <Grid item xs={12} md={9}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>Prince Pudasaini</Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>Founder, LetterLab Pro</Typography>
                </Box>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem', fontStyle: 'italic' }}>
                  “LetterLab Pro was born from a simple observation: students and educators spend too much time perfecting the tone and structure of professional emails. We envisioned a tool that acts as an intelligent partner, guiding users toward clear, respectful, and effective communication without sacrificing their unique voice. Our mission is to remove friction from academic correspondence, allowing great ideas and important questions to be the focus.”
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* SECTION 3: How It Works */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'action.hover' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 800, textAlign: 'center', mb: 8 }}>How it works?</Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent="center">
            <FlowStep icon={<IconEdit />} text="Write your prompt" />
            <FlowConnector />
            <FlowStep icon={<IconSparkles />} text="Generate email" />
            <FlowConnector />
            <FlowStep icon={<IconChecklist />} text="Fact check" />
            <FlowConnector />
            <FlowStep icon={<IconSend />} text="Forward to mailing application" />
          </Stack>
        </Container>
      </Box>

      {/* SECTION 4: The LetterLabs Pro Philosophy (Open Layout) */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 8 }}>
            <Chip label="Our Philosophy" variant="outlined" />
            <Typography variant="h3" sx={{ fontWeight: 800 }}>Why LetterLabs Pro?</Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 800, fontWeight: 400 }}>
              Choosing the right tool is key to effective communication. LetterLabs Pro stands out by empowering students and educators with an intelligent, transparent, and community-driven platform designed for academic success.
            </Typography>
          </Stack>

          <Grid container spacing={{ xs: 5, md: 4 }}>
            <Grid item xs={12}>
              <Grid container spacing={{ xs: 5, md: 4 }}>
                <ValueItem icon={<IconOpenSource/>} title="Open Source & Transparent" content="We believe in the power of community. Our code is available for review and contribution, ensuring transparency and allowing the community to help shape the future of the tool." />
                <ValueItem icon={<IconBrain/>} title="Intelligent, Not Intrusive" content="Our AI is designed to be a helpful partner, not an intrusive author. It provides suggestions on tone and clarity, but your unique voice always remains at the center of your writing." />
                <ValueItem icon={<IconShield/>} title="Privacy-Focused" content="We prioritize your data security. Your session data is handled with the highest standards of privacy, and we don't train our models on your private writing. Your work remains confidential." />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={{ xs: 5, md: 4 }}>
                <ValueItem icon={<IconGradCap/>} title="Built for Academia" content="LetterLabs Pro is specifically tailored for the academic world. From crafting emails to professors to drafting research inquiries, our tool understands the nuances of educational communication." />
                <ValueItem icon={<IconRocket/>} title="Continual Improvement" content="As an active open-source project, we are constantly integrating the latest technologies and community feedback. This ensures our tool is not only efficient today but is future-proof." />
                <ValueItem icon={<IconUsers/>} title="Community-Driven" content="Your feedback directly influences our roadmap. This ensures LetterLabs Pro remains aligned with the evolving needs of students and educators who use it every day." />
              </Grid>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Button
              variant="contained"
              size="large"
              href="https://letterlab.pro/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Form Coming Soon.
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
