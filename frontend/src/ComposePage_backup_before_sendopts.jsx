// frontend/src/ComposePage.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box, Container, Stack, Paper, Typography, IconButton, TextField, Button, Modal, useMediaQuery
} from '@mui/material';
import { keyframes, useTheme } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;
const fadeOut = keyframes` from { opacity: 1; } to { opacity: 0; } `;
const transitionToChat = keyframes`
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.5) translateY(100px); opacity: 0; }
`;
const blink = keyframes` 0%,100%{opacity:1;} 50%{opacity:0;} `;

// --- Guest Modal (unchanged) ---
const GuestModal = ({ open, onSave }) => {
  const [name, setName] = useState(''); const [age, setAge] = useState(''); const [level, setLevel] = useState('');
  const [errors, setErrors] = useState({ name: false, age: false, level: false });
  const handleSave = () => {
    const newErrors = { name: !name.trim(), age: !age.trim(), level: !level.trim() };
    setErrors(newErrors);
    if (!newErrors.name && !newErrors.age && !newErrors.level) onSave({ name, age, level });
  };
  return (
    <Modal
      open={open} disableEscapeKeyDown aria-labelledby="welcome-title"
      sx={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.7)' }}
    >
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: 400 }, bgcolor: 'background.paper', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider'
      }}>
        <Typography id="welcome-title" variant="h6" sx={{ fontWeight: 600 }}>Welcome to LetterLab</Typography>
        <Typography sx={{ mt: 2, color: 'text.secondary' }}>Please provide a few details to get started.</Typography>
        <Stack spacing={2} sx={{ mt: 3 }}>
          <TextField label="Your Name" value={name} onChange={(e)=>{setName(e.target.value); setErrors(p=>({...p,name:false}));}} required error={errors.name} helperText={errors.name ? "Name is required" : ""} fullWidth />
          <TextField label="Your Age" type="number" inputProps={{ min: 1 }} value={age} onChange={(e)=>{setAge(e.target.value); setErrors(p=>({...p,age:false}));}} required error={errors.age} helperText={errors.age ? "Age is required" : ""} fullWidth />
          <TextField label="Level of Study (e.g., Freshman)" value={level} onChange={(e)=>{setLevel(e.target.value); setErrors(p=>({...p,level:false}));}} required error={errors.level} helperText={errors.level ? "Level of study is required" : ""} fullWidth />
          <Button variant="contained" onClick={handleSave} size="large" fullWidth sx={{ mt: 2 }}>Start Writing</Button>
        </Stack>
      </Box>
    </Modal>
  );
};

// --- Streaming modal (unchanged) ---
const StreamingResponseModal = ({ open, text, isFinishing }) => {
  const theme = useTheme();
  return (
    <Modal open={open} aria-label="Generating email" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
      <Box sx={{
        background: 'transparent',
        border: '1px solid',
        borderColor: isFinishing ? 'transparent' : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'),
        borderRadius: 4, p: { xs: 2, sm: 3 }, width: { xs: '92%', sm: '80%', md: '70%' },
        maxHeight: '80vh', overflowY: 'auto',
        animation: isFinishing ? `${fadeOut} 0.5s ease-out forwards` : `${fadeIn} 0.3s ease-out`,
        transition: 'border-color 0.5s ease-out',
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
      }}>
        <Typography variant="body1" sx={{
          whiteSpace: 'pre-wrap', color: 'text.primary',
          animation: isFinishing ? `${transitionToChat} 0.5s ease-in forwards 0.1s` : 'none',
        }}>
          {text}
          {!isFinishing && (
            <span aria-hidden style={{
              display: 'inline-block', width: '10px', height: '1.2em', backgroundColor: 'currentColor',
              marginLeft: '4px', animation: `${blink} 1s infinite`
            }}/>
          )}
        </Typography>
      </Box>
    </Modal>
  );
};

// --- Welcome hero (unchanged) ---
const Glyph = () => (
  <Box component="span" aria-hidden sx={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 28, height: 28, mr: 1.25, borderRadius: '50%',
    border: (t) => `2px solid ${t.palette.primary.main}`, color: (t) => t.palette.primary.main,
    fontWeight: 700, fontSize: 16, lineHeight: 1, transform: 'translateY(2px)',
  }}>✺</Box>
);
const WelcomeHero = ({ show }) => (
  <Box sx={{
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', py: 6, opacity: show ? 1 : 0, transition: 'opacity 0.5s ease-in-out',
  }}>
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: 0.2, display: 'inline-flex', alignItems: 'center', color: 'text.primary' }}>
        <Glyph /> Welcome to LetterLab
      </Typography>
      <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary' }}>
        Start typing below to draft your email. I'll format it professionally.
      </Typography>
    </Box>
  </Box>
);

export default function ComposePage({ headerHeight = 72 }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const FOOTER_PAD = isMobile ? 88 : 96;

  // Chat state (moved from App.jsx)
  const [guestProfile, setGuestProfile] = useState(null);
  const [showGuestModal, setShowGuestModal] = useState(true);
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const chatEndRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [isFinishing, setIsFinishing] = useState(false);
  const scrollAreaRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Load guest profile
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('letterlab_guest_profile');
      if (savedProfile) {
        setGuestProfile(JSON.parse(savedProfile));
        setShowGuestModal(false);
      }
    } catch (e) { console.error('Failed to load guest profile:', e); }
  }, []);
  const handleSaveProfile = (profile) => {
    localStorage.setItem('letterlab_guest_profile', JSON.stringify(profile));
    setGuestProfile(profile);
    setShowGuestModal(false);
  };

  // Scroll indicator logic
  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const max = Math.max(1, scrollHeight - clientHeight);
      setScrollProgress(Math.min(1, Math.max(0, scrollTop / max)));
    };
    const onScroll = () => requestAnimationFrame(update);
    el.addEventListener('scroll', onScroll);
    window.addEventListener('resize', update);
    update();
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, []);

  const handleTrackClick = (e) => {
    const track = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientY - track.top) / track.height;
    const el = scrollAreaRef.current;
    if (!el) return;
    el.scrollTo({ top: (el.scrollHeight - el.clientHeight) * ratio, behavior: 'smooth' });
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [conversation]);

  const handleSendMessage = async () => {
    if (input.trim() === '' || isGenerating || !guestProfile) return;
    const userMessage = { sender: 'user', text: input };
    setConversation(prev => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);
    setStreamingText('');
    setIsFinishing(false);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(`${apiUrl}/generate-email`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: userMessage.text }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const aiText = data?.text || `Error: ${data?.error || 'Generation failed'}`;

      let index = 0;
      const interval = setInterval(() => {
        setStreamingText(aiText.substring(0, index++));
        if (index > aiText.length) {
          clearInterval(interval);
          setIsFinishing(true);
          setTimeout(() => {
            setConversation(prev => [...prev, { sender: 'ai', text: aiText }]);
            setIsGenerating(false);
            setIsFinishing(false);
            setStreamingText('');
          }, 600);
        }
      }, 25);
    } catch (e) {
      console.error('stream error', e);
      setIsFinishing(true);
      setTimeout(() => {
        setConversation(prev => [...prev, { sender: 'ai', text: `Network error: ${e?.message || e}` }]);
        setIsGenerating(false);
        setIsFinishing(false);
        setStreamingText('');
      }, 450);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // PAGE: Compose (scoped overflow hidden here, not globally)
  return (
    <>
      <StreamingResponseModal open={isGenerating} text={streamingText} isFinishing={isFinishing} />
      <GuestModal open={showGuestModal} onSave={handleSaveProfile} />

      <Box sx={{
        height: '100dvh',
        pt: `${headerHeight}px`,
        pb: `${(isMobile ? 88 : 96)}px`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Container
          ref={scrollAreaRef}
          maxWidth="md"
          sx={{
            flex: 1, overflowY: 'auto', pt: 0, pb: { xs: 1, sm: 2 },
            scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': { display: 'none' },
            display: 'flex', flexDirection: 'column', minHeight: 0,
          }}
        >
          <Box sx={{ height: `24px`, flex: '0 0 auto' }} />
          {conversation.length === 0 ? (
            <WelcomeHero show />
          ) : (
            <Stack spacing={2}>
              {conversation.map((msg, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <Paper sx={{
                    p: { xs: 1.25, sm: 1.5 }, maxWidth: '85%',
                    bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper',
                    color: msg.sender === 'user' ? 'white' : 'text.primary',
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word'
                  }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.5 }}>{msg.text}</Typography>
                  </Paper>
                </Box>
              ))}
              <div ref={chatEndRef} />
            </Stack>
          )}
        </Container>

        {/* Custom scroll indicator */}
        <Box
          onClick={handleTrackClick}
          sx={{
            position: 'fixed',
            right: { xs: 6, sm: 10 },
            top: `calc(${headerHeight}px + 16px)`,
            height: `calc(100dvh - ${headerHeight + (isMobile ? 88 : 96) + 32}px)`,
            width: 2,
            bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.16)'),
            borderRadius: 1, zIndex: 1200, cursor: 'pointer'
          }}
          role="presentation" aria-label="scroll progress"
        >
          <Box sx={{
            position: 'absolute', left: '50%', transform: 'translate(-50%, -50%)',
            top: `calc(${scrollProgress * 100}%)`,
            width: 12, height: 12, borderRadius: '50%',
            bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
            border: (t) => `2px solid ${t.palette.primary.main}`,
            transition: 'top 150ms ease-out'
          }} />
        </Box>
      </Box>

      {/* Fixed input bar */}
      <Box sx={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        bgcolor: 'background.default', borderTop: '1px solid', borderColor: 'divider',
      }}>
        <Container maxWidth="md" sx={{ p: { xs: 1, sm: 2 } }}>
          <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', borderRadius: 3, boxShadow: 'none' }}>
            <TextField
              fullWidth variant="standard" multiline maxRows={5}
              value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress}
              placeholder={guestProfile ? "Enter your rough notes here..." : "Please complete your profile first..."}
              InputProps={{ disableUnderline: true, sx: { p: 1.5, fontSize: '0.95rem' } }}
              disabled={isGenerating || !guestProfile}
            />
            <IconButton color="primary" sx={{ p: '10px' }} onClick={handleSendMessage} disabled={isGenerating || !guestProfile} aria-label="send">
              <SendIcon />
            </IconButton>
          </Paper>
          <Typography variant="caption" sx={{ textAlign: 'center', color: 'text.secondary', display: 'block', mt: 1, px: 2 }}>
            LetterLab Pro can make mistakes. Consider checking important information.
          </Typography>
        </Container>
      </Box>
    </>
  );
}
