import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box, Container, Typography, Stack, Chip, Button, Divider,
  Accordion, AccordionSummary, AccordionDetails, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, Snackbar, TextField,
  InputAdornment, Paper, Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';

const PROMPTS = [
  {
    title: 'Request for deadline extension',
    text: `Subject: Request for Extension on [Course/Assignment]

Dear Professor [Last Name],

I hope you’re doing well. I’m writing to request a brief extension for the [assignment/exam/project] due on [date]. Due to [brief, honest reason], I need a bit more time to submit my best work. Would it be possible to submit by [new date]?

Sincerely,
[Your Name]`
  },
  {
    title: 'Absence notification',
    text: `Subject: Absence from [Class] on [Date]

Dear Professor [Last Name],

I wanted to let you know I’ll be unable to attend [class/lab] on [date] due to [reason]. I’ve reviewed the syllabus and will catch up on any missed material.

Best regards,
[Your Name]`
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function DocsPage() {
  const [search, setSearch] = useState('');
  const [openMaster, setOpenMaster] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '' });

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnack({ open: true, msg: 'Copied to clipboard' });
    } catch {
      setSnack({ open: true, msg: 'Copy failed' });
    }
  };

  return (
    <Box sx={{ pb: 10 }}>
      {/* Premium Hero Section */}
      <Box sx={{
        pt: { xs: 8, md: 12 },
        pb: { xs: 6, md: 8 },
        background: (theme) => theme.palette.mode === 'dark'
          ? 'linear-gradient(180deg, rgba(37,99,235,0.05) 0%, transparent 100%)'
          : 'linear-gradient(180deg, rgba(37,99,235,0.02) 0%, transparent 100%)'
      }}>
        <Container maxWidth="md">
          <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <Chip
                label="Resource Center"
                color="primary"
                variant="outlined"
                sx={{ px: 2, py: 2, fontWeight: 700, borderRadius: '999px' }}
              />
            </motion.div>
            <Typography variant="h1" sx={{ fontSize: { xs: '36px', md: '48px' }, fontWeight: 800 }}>
              Documentation
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, fontSize: '18px' }}>
              Everything you need to master LetterLab Pro. From core drafting engine basics to master prompt techniques.
            </Typography>

            <Box sx={{ width: '100%', maxWidth: 500, mt: 2 }}>
              <TextField
                fullWidth
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '16px',
                    bgcolor: 'background.paper',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    '& fieldset': { borderOpacity: 0.1 }
                  }
                }}
              />
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Content Sections */}
      <Container maxWidth="md">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">

          <Stack spacing={6} sx={{ mb: 6 }} component={motion.div} variants={itemVariants}>

            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Section 1 — Overview</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>What is LetterLab Pro?</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 2 }}>
                LetterLab Pro is an AI-assisted academic email drafting platform designed for students and professionals who communicate through Gmail and Outlook. The system analyzes email threads, understands conversation context, and generates structured, professional responses within seconds.
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                Unlike generic AI chat tools, LetterLab works directly with email threads. It extracts the context of previous conversations and helps users compose replies that remain accurate, polite, and aligned with academic communication standards.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>Section 2 — How LetterLab Works</Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Step 1 — Connect Email</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Connect your Gmail or Outlook account securely using OAuth2 authentication.</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Step 2 — Pull Email Thread</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>LetterLab retrieves the selected conversation and extracts key context.</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Step 3 — Generate AI Draft</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>The AI generates a structured reply based on the email context.</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Step 4 — Edit & Send</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>You can review, modify, and send the response directly.</Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>Section 3 — Core Features</Typography>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Thread Context Analysis</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Automatically analyzes the entire conversation before generating replies.</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>AI Email Drafting</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Creates structured and professional responses within seconds.</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Academic Communication Mode</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Optimized specifically for communication with professors and institutions.</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Gmail & Outlook Integration</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Works with both Gmail and Microsoft Outlook through OAuth2.</Typography>
                </Box>
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Section 4 — Best Practices</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>To generate the best drafts:</Typography>
              <Box component="ul" sx={{ color: 'text.secondary', pl: 3, m: 0 }}>
                <Typography component="li" sx={{ mb: 1 }}>Pull the full email thread before drafting</Typography>
                <Typography component="li" sx={{ mb: 1 }}>Keep the prompt concise</Typography>
                <Typography component="li">Review AI responses before sending</Typography>
              </Box>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>Section 5 — Troubleshooting</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'error.main' }}>Email not loading</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Make sure your Gmail or Outlook account is properly connected.</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'error.main' }}>Draft generation fails</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Retry the request or refresh the session.</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Stack>

          <Divider sx={{ mb: 6 }} />

          {/* Detailed FAQs / Guides */}
          <Stack spacing={2} variants={itemVariants} component={motion.div}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Frequently Asked Questions</Typography>

            <Accordion sx={{ borderRadius: '16px !important', overflow: 'hidden', border: '1px solid', borderColor: 'divider', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>How does the AI handle my private information?</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: 'action.hover' }}>
                <Typography variant="body2" color="text.secondary">
                  LetterLab processes email content temporarily to generate drafts. Email data is not stored permanently and is never sold or shared.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ borderRadius: '16px !important', overflow: 'hidden', border: '1px solid', borderColor: 'divider', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Can I use it with Gmail and Outlook?</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: 'action.hover' }}>
                <Typography variant="body2" color="text.secondary">
                  Yes. LetterLab currently supports Gmail and Microsoft Outlook through OAuth2 authentication.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ borderRadius: '16px !important', overflow: 'hidden', border: '1px solid', borderColor: 'divider', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Does LetterLab send emails automatically?</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: 'action.hover' }}>
                <Typography variant="body2" color="text.secondary">
                  No. Users always review and approve drafts before sending.
                </Typography>
              </AccordionDetails>
            </Accordion>

          </Stack>
        </motion.div>
      </Container>

      {/* Master Prompt Library Modal (Keep existing logic available if needed) */}
      <Dialog open={openMaster} onClose={() => setOpenMaster(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Master Prompt Library</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            {PROMPTS.map((p, i) => (
              <Box key={i} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{p.title}</Typography>
                  <IconButton onClick={() => handleCopy(p.text)} size="small"><ContentCopyIcon fontSize="inherit" /></IconButton>
                </Stack>
                <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary', fontSize: '13px' }}>
                  {p.text}
                </Typography>
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenMaster(false)} sx={{ textTransform: 'none' }}>Close</Button>
          <Button variant="contained" onClick={() => window.location.href = '/chat'} sx={{ borderRadius: '999px', textTransform: 'none' }}>
            Try in Chat
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={2000}
        onClose={() => setSnack({ ...snack, open: false })}
        message={snack.msg}
      />
    </Box>
  );
}
