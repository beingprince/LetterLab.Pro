// frontend/src/DocsPage.jsx
import React, { useMemo, useState } from 'react';
import {
  Box, Container, Typography, Stack, Chip, Button, Divider,
  Accordion, AccordionSummary, AccordionDetails, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, Tooltip, Snackbar
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { keyframes } from '@mui/system';

// -----------------------------------------------------
// Small helpers
// -----------------------------------------------------
const goto = (path) => {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
};

async function copy(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}

// -----------------------------------------------------
// Tiny animated SVG “lottie-like” pointers (no deps)
// -----------------------------------------------------
const pulse = keyframes`
  0% { transform: scale(1); opacity:.9; }
  50% { transform: scale(1.08); opacity:1; }
  100% { transform: scale(1); opacity:.9; }
`;
const floatY = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0px); }
`;

function SparkleIcon() {
  return (
    <Box aria-hidden sx={{ display: 'inline-flex', mr: 1, animation: `${pulse} 1.6s ease-in-out infinite` }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l-2.5 5.5L4 11l5.5 2.5L12 19l2.5-5.5L20 11l-5.5-2.5z"/>
      </svg>
    </Box>
  );
}
function HandPointer() {
  return (
    <Box aria-hidden sx={{ display: 'inline-flex', mr: 1, animation: `${floatY} 1.8s ease-in-out infinite` }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 13V7a2 2 0 1 1 4 0v4"/>
        <path d="M12 11V6a2 2 0 1 1 4 0v5"/>
        <path d="M16 10.5V8a2 2 0 1 1 4 0v6a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6v-1.5"/>
      </svg>
    </Box>
  );
}
function MailArrow() {
  return (
    <Box aria-hidden sx={{ display: 'inline-flex', mr: 1, animation: `${floatY} 2s ease-in-out infinite` }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2 11 13" />
        <path d="M22 2 15 22 11 13 2 9 22 2" />
      </svg>
    </Box>
  );
}

// -----------------------------------------------------
// Master Prompt modal content
// -----------------------------------------------------
const PROMPTS = [
  {
    title: 'Request for deadline extension',
    text: `Subject: Request for Extension on [Course/Assignment]

Dear Professor [Last Name],

I hope you’re doing well. I’m writing to request a brief extension for the [assignment/exam/project] due on [date]. Due to [brief, honest reason], I need a bit more time to submit my best work. Would it be possible to submit by [new date]?

I appreciate your consideration and understand if the original deadline must stand. Thank you for your time.

Sincerely,
[Your Name]
[Course/Section]`
  },
  {
    title: 'Absence notification',
    text: `Subject: Absence from [Class] on [Date]

Dear Professor [Last Name],

I wanted to let you know I’ll be unable to attend [class/lab] on [date] due to [reason]. I’ve reviewed the syllabus and will catch up on any missed material. Please let me know if there’s additional work I should complete.

Thank you for your understanding.

Best regards,
[Your Name]
[Course/Section]`
  },
  {
    title: 'Request for recommendation',
    text: `Subject: Request for Recommendation Letter

Dear Professor [Last Name],

I hope you’re well. I’m applying to [program/internship/scholarship] and would be honored if you could write a recommendation letter for me. I took your [course] in [term] and earned [grade], and I particularly valued [specific topic/project].

The deadline is [date]. I can share my resume, transcript, and any materials you need. Please let me know if you’re comfortable writing one.

Thank you for your time and support.

Sincerely,
[Your Name]`
  },
  {
    title: 'Clarification on assignment',
    text: `Subject: Clarification on [Assignment/Topic]

Dear Professor [Last Name],

I’m working on the [assignment/topic] and wanted to clarify a couple of points:
1) [Your question 1]
2) [Your question 2]

If there’s guidance in the slides or reading I missed, I’d appreciate a pointer. Thank you for your help!

Best,
[Your Name]`
  },
];

export default function DocsPage() {
  const [openMaster, setOpenMaster] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '' });

  const handleCopy = async (text) => {
    const ok = await copy(text);
    setSnack({ open: true, msg: ok ? 'Copied to clipboard' : 'Copy failed' });
  };

  return (
    <Box component="main" sx={{ py: { xs: 5, md: 7 } }}>
      <Container maxWidth="md">
        {/* Header */}
        <Stack spacing={1} alignItems="center" sx={{ textAlign: 'center', mb: 3 }}>
          <Chip label="Docs & FAQs" variant="outlined" />
          <Typography variant="h4" sx={{ fontWeight: 800 }}>How to use LetterLab Pro</Typography>
          <Typography variant="body1" color="text.secondary">
            Quick, practical answers — with animated cues and ready-to-use prompts.
          </Typography>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* FAQs */}
        <Stack spacing={1.25}>
          {/* Create account / Google signup */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                <SparkleIcon /> How do I create an account (including Google signup)?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1.25}>
                <Typography variant="body1">
                  1) Click the <b>avatar</b> on the top-right (or navigate to <code>/account</code>).<br/>
                  2) In the <b>Create Your Account</b> form, fill your details and set a password.<br/>
                  3) Complete the <b>OTP verification</b> step to finish signup.<br/>
                  4) Prefer Google? Click <b>“Sign in with Google”</b> on the login panel to use your Google account.
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button onClick={() => goto('/account')} variant="outlined" startIcon={<OpenInNewIcon />}>
                    Go to Account / Sign in
                  </Button>
                </Stack>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* Writing a good prompt + Master Prompt */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                <HandPointer /> How do I write a great prompt for the email?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1.25}>
                <Typography variant="body1">
                  Think of your prompt as <i>instructions + context</i>. Include:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Who you are and who you’re writing to (student → professor).<br/>
                  • What you need (extension, question, meeting, recommendation, etc.).<br/>
                  • Deadlines or dates, course name/section, and any constraints on tone (polite, concise, formal).
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button variant="contained" onClick={() => setOpenMaster(true)}>
                    Master Prompt Library
                  </Button>
                  <Button variant="outlined" onClick={() => goto('/compose')} startIcon={<OpenInNewIcon />}>
                    Go to Compose
                  </Button>
                </Stack>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* Tokens / Analytics */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                <SparkleIcon /> How do I know if I’m low on tokens? What are “tokens”?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1.25}>
                <Typography variant="body1">
                  In LetterLab, a <b>token</b> is a small chunk of text the AI reads/writes. More text = more tokens.
                  If usage grows, you might notice slower responses or limits.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Check the <b>Analytics</b> page for your usage:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • <b>Total tokens</b> — your cumulative tokens over the selected range.<br/>
                  • <b>Avg daily tokens</b> — typical daily usage.<br/>
                  • <b>Emails drafted</b> — how many emails you generated.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Use the date buttons (7/30/90D) to switch ranges. If your <i>Total tokens</i> keeps spiking and you hit app limits, reduce prompt length or split tasks.
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button onClick={() => goto('/analytics')} variant="outlined" startIcon={<OpenInNewIcon />}>
                    Open Analytics
                  </Button>
                </Stack>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* Change my information */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                <HandPointer /> Can I change my information?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1.25}>
                <Typography variant="body1">
                  Yes. Click your <b>avatar</b> (top-right) → you’ll land on <b>Account &amp; Settings</b>.
                  Click <b>Edit Profile</b> to change your name or email, then <b>Save</b>.
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button onClick={() => goto('/account')} variant="outlined" startIcon={<OpenInNewIcon />}>
                    Open Account & Settings
                  </Button>
                </Stack>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* Send via Gmail / Outlook */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                <MailArrow /> How do I send the email with Gmail or Outlook?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1.25}>
                <Typography variant="body1">
                  After you generate a draft in <b>Compose</b>, click the <b>triple-dot</b> on the AI’s message.
                  You’ll see:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • <b>Send to Gmail</b><br/>
                  • <b>Send to Outlook</b><br/>
                  • <b>Copy to clipboard</b>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose your preferred option. (Gmail/Outlook open with the draft pre-filled; Copy lets you paste anywhere.)
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button onClick={() => goto('/compose')} variant="outlined" startIcon={<OpenInNewIcon />}>
                    Go to Compose
                  </Button>
                </Stack>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* Coming soon */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                <SparkleIcon /> Other things — coming soon
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                More templates, richer analytics breakdown, and direct send with custom signatures are on the way.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Stack>

        {/* Master Prompt Dialog */}
        <Dialog open={openMaster} onClose={() => setOpenMaster(false)} fullWidth maxWidth="md">
          <DialogTitle>Master Prompt Library</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              {PROMPTS.map((p, idx) => (
                <Box key={idx}
                  sx={(t) => ({
                    p: 2,
                    border: '1px solid',
                    borderColor: t.palette.divider,
                    borderRadius: 2,
                    background: t.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)'
                  })}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{p.title}</Typography>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Copy to clipboard">
                        <IconButton onClick={() => handleCopy(p.text)} size="small">
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Open Compose (paste there)">
                        <IconButton onClick={() => goto('/compose')} size="small">
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                  <Box sx={{
                    whiteSpace: 'pre-wrap',
                    fontSize: '.95rem',
                    color: 'text.secondary'
                  }}>
                    {p.text}
                  </Box>
                </Box>
              ))}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenMaster(false)}>Close</Button>
            <Button variant="contained" onClick={() => goto('/compose')}>
              Go to Compose
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snack.open}
          autoHideDuration={1800}
          onClose={() => setSnack(s => ({ ...s, open: false }))}
          message={snack.msg}
        />
      </Container>
    </Box>
  );
}
