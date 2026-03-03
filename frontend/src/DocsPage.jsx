import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, Container, Typography, Stack, Chip, Button, Divider,
  Accordion, AccordionSummary, AccordionDetails, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, Tooltip, Snackbar,
  TextField, InputAdornment, Paper, Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// -----------------------------------------------------
// Master Prompt content (moved from original)
// -----------------------------------------------------
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

          {/* Quick Actions Grid */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {[
              { title: 'Prompt Library', desc: 'Pre-made high-reply email templates', icon: <AutoAwesomeIcon />, action: () => setOpenMaster(true) },
              { title: 'Quick Start', desc: 'Get your first draft in 30 seconds', icon: <OpenInNewIcon />, path: '/chat' }
            ].map((item, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Paper
                  component={motion.div}
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  sx={{ p: 3, borderRadius: 4, cursor: 'pointer', border: '1px solid', borderColor: 'divider' }}
                  onClick={item.action || (() => window.location.href = item.path)}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{item.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ mb: 6 }} />

          {/* Detailed FAQs / Guides */}
          <Stack spacing={2} variants={itemVariants} component={motion.div}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Frequently Asked Questions</Typography>

            <Accordion sx={{ borderRadius: '16px !important', overflow: 'hidden', border: '1px solid', borderColor: 'divider', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>How does the AI handle my private information?</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: 'action.hover' }}>
                <Typography variant="body2" color="text.secondary">
                  LetterLab prioritizes data minimization. We do not store your email credentials and only process information explicitly provided for drafting purposes.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ borderRadius: '16px !important', overflow: 'hidden', border: '1px solid', borderColor: 'divider', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>Can I use it with Outlook and Gmail?</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: 'action.hover' }}>
                <Typography variant="body2" color="text.secondary">
                  Yes, LetterLab Pro integrates directly with both Microsoft Graph API and Google Workspace for seamless drafting.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </motion.div>
      </Container>

      {/* Master Prompt Library Modal */}
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
