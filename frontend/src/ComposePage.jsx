// frontend/src/ComposePage.jsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Box, Container, Stack, Paper, Typography, IconButton, TextField, Button,
  Modal, useMediaQuery, Menu, MenuItem, Tooltip, Divider
} from '@mui/material';
import { keyframes, useTheme } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';

// --- Reusable GlassBubble ---
const GlassBubble = ({ children, sx = {}, typing = false, reserveCorner = false }) => (
  <Box
    sx={(t) => ({
      position: 'relative', // ensure inner absolute elements anchor correctly
      display: 'inline-flex',
      flexDirection: 'column',
      padding: typing ? '10px 14px' : '14px 18px',
      // reserve space on the right edge when a corner action (triple-dot) exists
      paddingRight: reserveCorner && !typing ? '56px' : undefined,
      borderRadius: 2,
      maxWidth: 'min(920px, 90vw)',
      color: t.palette.text.primary,
      background: t.palette.mode === 'dark'
        ? 'rgba(20,26,34,0.55)'
        : 'rgba(255,255,255,0.65)',
      backdropFilter: 'blur(14px) saturate(120%)',
      WebkitBackdropFilter: 'blur(14px) saturate(120%)',
      border: `1px solid ${t.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.16)'
        : 'rgba(0,0,0,0.12)'}`,
      boxShadow: t.palette.mode === 'dark'
        ? '0 12px 36px rgba(0,0,0,0.35)'
        : '0 10px 28px rgba(0,0,0,0.12)',
      isolation: 'isolate',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      ...sx,
    })}
  >
    {children}
  </Box>
);

// --- Typing dots (visible on glass) ---
const dotAnim = keyframes`
  0%,80%,100% { transform: translateY(0); opacity:.7; }
  40% { transform: translateY(-3px); opacity:1; }
`;
const TypingDots = ({ sx = {} }) => (
  <GlassBubble typing sx={{ alignItems: 'center', gap: 1, ...sx }}>
    {[0, 120, 240].map((delay, i) => (
      <Box
        key={i}
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'currentColor',
          boxShadow: '0 0 0 2px rgba(255,255,255,.85) inset, 0 0 6px rgba(0,0,0,.25)',
          animation: `${dotAnim} 900ms ease-in-out ${delay}ms infinite`,
        }}
      />
    ))}
  </GlassBubble>
);

// --- Simple Animations ---
const fadeIn = keyframes`from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}`;
const fadeOut = keyframes`from{opacity:1}to{opacity:0}`;
const transitionToChat = keyframes`0%{transform:scale(1);opacity:1}100%{transform:scale(.5) translateY(100px);opacity:0}`;

// --- Guest info modal ---
const GuestModal = ({ open, onSave }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [level, setLevel] = useState('');
  const [err, setErr] = useState({ name: false, age: false, level: false });

  const handleSave = () => {
    const e = { name: !name.trim(), age: !age.trim(), level: !level.trim() };
    setErr(e);
    if (!e.name && !e.age && !e.level) onSave({ name, age, level });
  };

  return (
    <Modal open={open} disableEscapeKeyDown
      sx={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,.7)' }}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: { xs: '90%', sm: 400 }, bgcolor: 'background.paper',
        boxShadow: '0 8px 32px rgba(0,0,0,.5)',
        p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Welcome to LetterLab</Typography>
        <Typography sx={{ mt: 1.5, color: 'text.secondary' }}>
          Please provide a few details to get started.
        </Typography>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField label="Your Name" value={name}
            onChange={(e) => { setName(e.target.value); setErr(p => ({ ...p, name: false })); }}
            required error={err.name} helperText={err.name ? "Name is required" : ""} fullWidth />
          <TextField label="Your Age" type="number" value={age}
            onChange={(e) => { setAge(e.target.value); setErr(p => ({ ...p, age: false })); }}
            required error={err.age} helperText={err.age ? "Age is required" : ""} fullWidth />
          <TextField label="Level of Study (e.g., Freshman)" value={level}
            onChange={(e) => { setLevel(e.target.value); setErr(p => ({ ...p, level: false })); }}
            required error={err.level} helperText={err.level ? "Level is required" : ""} fullWidth />
          <Button variant="contained" onClick={handleSave} size="large" fullWidth sx={{ mt: 1 }}>
            Start Writing
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

// --- Streaming Modal (real glass + dots) ---
const StreamingResponseModal = ({ open, text, isFinishing }) => {
  const theme = useTheme();
  return (
    <Modal open={open}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
      <Box sx={{
        background: theme.palette.mode === 'dark' ? 'rgba(20,26,34,.55)' : 'rgba(255,255,255,.65)',
        backdropFilter: 'blur(12px) saturate(120%)', WebkitBackdropFilter: 'blur(12px) saturate(120%)',
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.12)',
        borderRadius: 4, p: { xs: 2, sm: 3 },
        width: { xs: '92%', sm: '80%', md: '70%' },
        maxHeight: '80vh', overflowY: 'auto',
        animation: isFinishing ? `${fadeOut} .5s ease-out forwards` : `${fadeIn} .3s ease-out`,
        boxShadow: theme.palette.mode === 'dark' ? '0 12px 36px rgba(0,0,0,.45)' : '0 10px 28px rgba(0,0,0,.15)',
        isolation: 'isolate'
      }}>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'text.primary' }}>
          {text}
        </Typography>
        {!isFinishing && <TypingDots sx={{ mt: 1.25 }} />}
      </Box>
    </Modal>
  );
};

// --- Welcome Hero ---
const Glyph = () => (
  <Box component="span" aria-hidden sx={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 28, height: 28, mr: 1.25, borderRadius: '50%',
    border: (t) => `2px solid ${t.palette.primary.main}`,
    color: (t) => t.palette.primary.main,
    fontWeight: 700, fontSize: 16
  }}>✺</Box>
);
const WelcomeHero = ({ show }) => (
  <Box sx={{
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', py: 6, opacity: show ? 1 : 0, transition: 'opacity .5s'
  }}>
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>
        <Glyph /> Welcome to LetterLab
      </Typography>
      <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary' }}>
        Start typing below to draft your email. I'll format it professionally.
      </Typography>
    </Box>
  </Box>
);

// --- Helper functions ---
function gmailHref(subject, body) { return `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; }
function outlookHref(subject, body) { return `https://outlook.office.com/mail/deeplink/compose?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; }
async function copyToClipboard(text) { try { await navigator.clipboard.writeText(text); return true; } catch { return false; } }

export default function ComposePage({ headerHeight = 72 }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [guestProfile, setGuestProfile] = useState(null);
  const [showGuestModal, setShowGuestModal] = useState(true);
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [isFinishing, setIsFinishing] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuDraftText, setMenuDraftText] = useState('');
  const chatEndRef = useRef(null);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    try {
      const p = localStorage.getItem('letterlab_guest_profile');
      if (p) { setGuestProfile(JSON.parse(p)); setShowGuestModal(false); }
    } catch { }
  }, []);
  const handleSaveProfile = (profile) => {
    localStorage.setItem('letterlab_guest_profile', JSON.stringify(profile));
    setGuestProfile(profile);
    setShowGuestModal(false);
  };

  const autoscroll = () => {
    try {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } catch {}
  };
  useEffect(() => { autoscroll(); }, [conversation, isGenerating, streamingText]);

  const handleSendMessage = async () => {
    if (input.trim() === '' || isGenerating || !guestProfile) return;
    const userMessage = { sender: 'user', text: input, id: Date.now().toString() };
    setConversation(prev => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);
    setStreamingText('');
    setIsFinishing(false);

    try {
      const res = await fetch('/api/generate-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: userMessage.text })
      });
      const data = await res.json();
      const aiText = data?.text || 'Error generating email';
      let index = 0;
      const interval = setInterval(() => {
        setStreamingText(aiText.substring(0, index++));
        if (index > aiText.length) {
          clearInterval(interval);
          setIsFinishing(true);
          setTimeout(() => {
            setConversation(prev => [...prev, { sender: 'ai', text: aiText, id: Date.now().toString() }]);
            setIsGenerating(false);
            setIsFinishing(false);
            setStreamingText('');
          }, 500);
        }
      }, 25);
    } catch (e) {
      console.error(e);
      setIsGenerating(false);
      setConversation(prev => [...prev, { sender: 'ai', text: 'Network error', id: Date.now().toString() }]);
    }
  };

  const handleKeyPress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } };

  return (
    <>
      <StreamingResponseModal open={isGenerating} text={streamingText} isFinishing={isFinishing} />
      <GuestModal open={showGuestModal} onSave={handleSaveProfile} />

      {/* Page layout */}
      <Box sx={{ height: '100dvh', pt: `${headerHeight}px`, pb: `${isMobile ? 88 : 96}px`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Container ref={scrollAreaRef} maxWidth="md" sx={{
          flex: 1, overflowY: 'auto', pt: 0, pb: { xs: 1, sm: 2 },
          '&::-webkit-scrollbar': { display: 'none' },
        }}>
          <Box sx={{ height: 24 }} />
          {conversation.length === 0 ? (
            <WelcomeHero show />
          ) : (
            <Stack spacing={1.5}>
              {conversation.map((msg) => {
                const isAI = msg.sender === 'ai';
                return (
                  <Box key={msg.id} sx={{ display: 'flex', justifyContent: isAI ? 'flex-start' : 'flex-end' }}>
                    {isAI ? (
                      <GlassBubble reserveCorner>
                        <Typography variant="body2" sx={{ lineHeight: 1.55 }}>{msg.text}</Typography>

                        {/* Corner action anchored to bubble stroke (never overlaps text) */}
                        <Tooltip title="More options">
                          <IconButton
                            size="small"
                            onClick={(e) => { setMenuAnchor(e.currentTarget); setMenuDraftText(msg.text); }}
                            aria-label="more"
                            sx={{
                              position: 'absolute',
                              top: 6,
                              right: 6,
                              zIndex: 2,
                              bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.9)',
                              border: '1px solid',
                              borderColor: 'divider',
                              '&:hover': { bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,1)' },
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </GlassBubble>
                    ) : (
                      <Paper sx={{
                        p: 1.5, maxWidth: '92%',
                        bgcolor: 'primary.main', color: 'white',
                        borderRadius: 2
                      }}>
                        <Typography variant="body2">{msg.text}</Typography>
                      </Paper>
                    )}
                  </Box>
                );
              })}
              <div ref={chatEndRef} />
            </Stack>
          )}
        </Container>
      </Box>

      {/* Input bar */}
      <Box sx={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        bgcolor: 'background.default', borderTop: '1px solid', borderColor: 'divider', zIndex: 2
      }}>
        <Container maxWidth="md" sx={{ p: { xs: 1, sm: 2 } }}>
          <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', borderRadius: 3, boxShadow: 'none' }}>
            <TextField
              fullWidth variant="standard" multiline maxRows={5}
              value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress}
              placeholder={guestProfile ? "Enter your rough notes here..." : "Complete profile first..."}
              InputProps={{ disableUnderline: true, sx: { p: 1.5, fontSize: '0.95rem' } }}
              disabled={isGenerating || !guestProfile}
            />
            <IconButton color="primary" sx={{ p: '10px' }} onClick={handleSendMessage} disabled={isGenerating || !guestProfile}>
              <SendIcon />
            </IconButton>
          </Paper>
        </Container>
      </Box>

      {/* Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)} keepMounted>
        <MenuItem onClick={() => { copyToClipboard(menuDraftText); setMenuAnchor(null); }}>Copy to Clipboard</MenuItem>
        <MenuItem onClick={() => { window.open(gmailHref('LetterLab Draft', menuDraftText), '_blank'); setMenuAnchor(null); }}>Send to Gmail</MenuItem>
        <MenuItem onClick={() => { window.open(outlookHref('LetterLab Draft', menuDraftText), '_blank'); setMenuAnchor(null); }}>Send to Outlook</MenuItem>
      </Menu>
    </>
  );
}
