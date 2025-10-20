// App.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ThemeProvider, keyframes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import {
  AppBar, Toolbar, Typography, Button, Container, Box,
  TextField, Paper, IconButton, Menu, MenuItem, Avatar, Stack, Modal, useMediaQuery,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Chip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined';
import Brightness7OutlinedIcon from '@mui/icons-material/Brightness7Outlined';
import SendIcon from '@mui/icons-material/Send';
import HistoryIcon from '@mui/icons-material/History';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close'; // <-- ADDED
import { darkTheme, lightTheme } from './theme';
import { SmartBackground } from './SmartBackground';
import './App.css';

const GuestModal = ({ open, onSave }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [level, setLevel] = useState('');
  const [errors, setErrors] = useState({ name: false, age: false, level: false });

  const handleSave = () => {
    const newErrors = {
      name: !name.trim(),
      age: !age.trim(),
      level: !level.trim()
    };
    setErrors(newErrors);

    if (!newErrors.name && !newErrors.age && !newErrors.level) {
      onSave({ name, age, level });
    }
  };

  return (
    <Modal
      open={open}
      disableEscapeKeyDown
      aria-labelledby="welcome-title"
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
      }}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: 400 },
        bgcolor: 'background.paper',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        p: 4,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography id="welcome-title" variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          Welcome to LetterLab
        </Typography>
        <Typography sx={{ mt: 2, color: 'text.secondary' }}>
          Please provide a few details to get started.
        </Typography>
        <Stack spacing={2} sx={{ mt: 3 }}>
          <TextField
            label="Your Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors(prev => ({ ...prev, name: false }));
            }}
            required
            error={errors.name}
            helperText={errors.name ? "Name is required" : ""}
            fullWidth
          />
          <TextField
            label="Your Age"
            type="number"
            inputProps={{ min: 1 }}
            value={age}
            onChange={(e) => {
              setAge(e.target.value);
              setErrors(prev => ({ ...prev, age: false }));
            }}
            required
            error={errors.age}
            helperText={errors.age ? "Age is required" : ""}
            fullWidth
          />
          <TextField
            label="Level of Study (e.g., Freshman)"
            value={level}
            onChange={(e) => {
              setLevel(e.target.value);
              setErrors(prev => ({ ...prev, level: false }));
            }}
            required
            error={errors.level}
            helperText={errors.level ? "Level of study is required" : ""}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleSave}
            size="large"
            fullWidth
            sx={{ mt: 2 }}
          >
            Start Writing
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const transitionToChat = keyframes`
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.5) translateY(100px); opacity: 0; }
`;

// NEW: define the blink animation actually used by the caret
const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

// ADDED: neural aura for founder name
const neuralAura = keyframes`
  0% {
    text-shadow:
      0 0 6px rgba(99,102,241,.75),
      0 0 14px rgba(99,102,241,.45),
      0 0 24px rgba(16,185,129,.35);
    filter: hue-rotate(0deg) saturate(120%);
  }
  50% {
    text-shadow:
      0 0 8px rgba(16,185,129,.9),
      0 0 18px rgba(99,102,241,.55),
      0 0 30px rgba(14,165,233,.45);
    filter: hue-rotate(120deg) saturate(140%);
  }
  100% {
    text-shadow:
      0 0 6px rgba(99,102,241,.75),
      0 0 14px rgba(99,102,241,.45),
      0 0 24px rgba(16,185,129,.35);
    filter: hue-rotate(360deg) saturate(120%);
  }
`;

// --- Modal for streaming response ---
const StreamingResponseModal = ({ open, text, isFinishing, theme }) => (
  <Modal
    open={open}
    aria-label="Generating email"
    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
  >
    <Box sx={{
      background: 'transparent',
      border: '1px solid',
      borderColor: isFinishing ? 'transparent' : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'),
      borderRadius: 4,
      p: { xs: 2, sm: 3 },
      width: { xs: '92%', sm: '80%', md: '70%' },
      maxHeight: '80vh',
      overflowY: 'auto',
      animation: isFinishing ? `${fadeOut} 0.5s ease-out forwards` : `${fadeIn} 0.3s ease-out`,
      transition: 'border-color 0.5s ease-out',
      boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
    }}>
      <Typography
        variant="body1"
        sx={{
          whiteSpace: 'pre-wrap',
          color: 'text.primary',
          animation: isFinishing ? `${transitionToChat} 0.5s ease-in forwards 0.1s` : 'none',
        }}
      >
        {text}
        {!isFinishing && (
          <span
            aria-hidden
            style={{
              display: 'inline-block',
              width: '10px',
              height: '1.2em',
              backgroundColor: 'currentColor',
              marginLeft: '4px',
              // use the defined keyframes instead of a missing "blink"
              animation: `${blink} 1s infinite`
            }}
          />
        )}
      </Typography>
    </Box>
  </Modal>
);

// Small decorative glyph used in the welcome hero
const Glyph = () => (
  <Box
    component="span"
    aria-hidden
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 28,
      height: 28,
      mr: 1.25,
      borderRadius: '50%',
      border: (t) => `2px solid ${t.palette.primary.main}`,
      color: (t) => t.palette.primary.main,
      fontWeight: 700,
      fontSize: 16,
      lineHeight: 1,
      transform: 'translateY(2px)',
    }}
  >
    ✺
  </Box>
);

// Centered welcome section (shown only when there are no messages yet)
const WelcomeHero = ({ show }) => (
  <Box
    sx={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      py: 6,
      opacity: show ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out',
    }}
  >
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          letterSpacing: 0.2,
          display: 'inline-flex',
          alignItems: 'center',
          color: 'text.primary',
        }}
      >
        <Glyph />
        Welcome to LetterLab
      </Typography>
      <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary' }}>
        Start typing below to draft your email. I'll format it professionally.
      </Typography>
    </Box>
  </Box>
);

// ADDED: independent list for white tech boxes in founder modal
const TECH_STACK = [
  'React', 'Vite', 'Material UI', 'Custom MUI Theme',
  'JavaScript', 'Node.js', 'Express',
  'MongoDB', 'Mongoose', 'Fetch API', 'CSS',
  'Vercel (FE)', 'Render (BE)', 'GitHub'
];

function App() {
  const [guestProfile, setGuestProfile] = useState(null);
  const [showGuestModal, setShowGuestModal] = useState(true);
  const [rightMenuAnchorEl, setRightMenuAnchorEl] = useState(null);
  const [versionMenuAnchorEl, setVersionMenuAnchorEl] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mode, setMode] = useState('dark');
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const chatEndRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [isFinishing, setIsFinishing] = useState(false);
  const scrollAreaRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // ADDED: founder modal state
  const [founderOpen, setFounderOpen] = useState(false);

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const FOOTER_PAD = isMobile ? 88 : 96;

  // header height measurement
  const appBarRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Load guest profile on mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('letterlab_guest_profile');
      if (savedProfile) {
        setGuestProfile(JSON.parse(savedProfile));
        setShowGuestModal(false);
      }
    } catch (error) {
      console.error('Failed to load guest profile:', error);
    }
  }, []);

  const handleSaveProfile = (profile) => {
    localStorage.setItem('letterlab_guest_profile', JSON.stringify(profile));
    setGuestProfile(profile);
    setShowGuestModal(false);
  };

  useEffect(() => {
    const el = appBarRef.current;
    if (!el) return;

    const update = () => {
      const h = el.getBoundingClientRect().height || 0;
      setHeaderHeight(Math.round(h));
    };

    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(update);
      ro.observe(el);
    }
    window.addEventListener('resize', update);
    update();

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  // scroll indicator logic
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const colorMode = useMemo(() => ({
    toggleColorMode: () => setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light')),
  }), []);

  // constants aligned with custom scrollbar
  const SCROLLBAR_TOP_INSET = 16;
  const FIRST_BUBBLE_EXTRA_GAP = 8;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{
        'html, body, #root': { height: '100%', overflow: 'hidden' },
        // Mobile-first: use border-box sizing to make widths predictable
        '*, *::before, *::after': { boxSizing: 'border-box' }
      }} />
      <SmartBackground mode={theme.palette.mode} />
      <StreamingResponseModal open={isGenerating} text={streamingText} isFinishing={isFinishing} theme={theme} />
      <GuestModal open={showGuestModal} onSave={handleSaveProfile} />

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: {
            background: theme.palette.mode === 'dark' ? 'rgba(30,30,50,0.8)' : 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            width: 280,
            borderRight: 'none'
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>History</Typography>
          <IconButton aria-label="new conversation"><AddCommentOutlinedIcon /></IconButton>
        </Box>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon><HistoryIcon sx={{ color: 'text.secondary', minWidth: 40 }} /></ListItemIcon>
              <ListItemText primary="Request for Extension..." />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Flat Header */}
      <AppBar
        ref={appBarRef}
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          bgcolor: 'background.default',
          borderBottom: '1px solid',
          borderColor: 'divider',
          borderRadius: 0,
          boxShadow: 'none',
          py: 1,
        }}
      >
        <Toolbar sx={{ borderRadius: 0, minHeight: { xs: 64, sm: 72 }, position: 'relative' }}>
          <IconButton edge="start" color="inherit" onClick={() => setIsDrawerOpen(true)} sx={{ mr: 2 }} aria-label="open history">
            <MenuIcon />
          </IconButton>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 500, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
              LetterLab
            </Typography>
            <Button
              variant="outlined"
              onClick={(e) => setVersionMenuAnchorEl(e.currentTarget)}
              size="small"
              endIcon={<KeyboardArrowDownIcon />}
              sx={{
                textTransform: 'none',
                borderRadius: '999px',
                p: '1px 8px',
                mt: 0.5,
                borderColor: 'divider',
                color: 'text.secondary',
                fontSize: '0.75rem'
              }}
            >
              v1.0 Beta
            </Button>
            <Menu
              anchorEl={versionMenuAnchorEl}
              open={Boolean(versionMenuAnchorEl)}
              onClose={() => setVersionMenuAnchorEl(null)}
            >
              <MenuItem>v1.0 Beta</MenuItem>
              {/* future versions */}
            </Menu>
          </Box>

          {/* ADDED: Center link — absolute centered without removing anything */}
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 1
            }}
          >
            <Button
              onClick={() => setFounderOpen(true)}
              size="small"
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: '999px',
                textTransform: 'none',
                fontWeight: 600,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              About Founder
            </Button>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit" aria-label="toggle theme">
            {theme.palette.mode === 'dark' ? <Brightness7OutlinedIcon /> : <Brightness4OutlinedIcon />}
          </IconButton>

          <IconButton onClick={(e) => setRightMenuAnchorEl(e.currentTarget)} aria-label="more">
            <MoreVertIcon />
          </IconButton>
          <Chip label="PRO" size="small" variant="outlined" sx={{ mx: 1.5 }} />
          <Avatar sx={{ width: 32, height: 32 }}>
            {guestProfile?.name ? guestProfile.name.charAt(0).toUpperCase() : 'G'}
          </Avatar>
          <Menu
            anchorEl={rightMenuAnchorEl}
            open={Boolean(rightMenuAnchorEl)}
            onClose={() => setRightMenuAnchorEl(null)}
          >
            <MenuItem onClick={() => setFounderOpen(true)}>About Founder</MenuItem>
            <MenuItem>Pin Conversation</MenuItem>
            <MenuItem>Settings</MenuItem>
          </Menu>
        </Toolbar>

        {/* ADDED: Mobile center link below toolbar */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'center', pb: 1 }}>
          <Button
            onClick={() => setFounderOpen(true)}
            size="small"
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: '999px',
              textTransform: 'none',
              fontWeight: 600,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            About Founder
          </Button>
        </Box>
      </AppBar>

      {/* ADDED: Founder Modal (no hashtags, all independent white boxes) */}
      <Modal
        open={founderOpen}
        onClose={() => setFounderOpen(false)}
        aria-labelledby="founder-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(0,0,0,.55)',
        }}
      >
        <Box sx={{ position: 'relative', width: { xs: '92%', sm: '680px' }, mx: 'auto' }}>
          {/* Outer stroke */}
          <Box
            sx={{
              border: '1.5px solid',
              borderColor: 'divider',
              borderRadius: 4,
              p: { xs: 1, sm: 1.25 },
              boxShadow: '0 10px 40px rgba(0,0,0,.35)',
            }}
          >
            {/* Inner stroke + heavy blur glass */}
            <Box
              sx={{
                position: 'relative',
                border: '1.5px solid',
                borderColor: 'divider',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              {/* Blur layer */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backdropFilter: 'blur(18px) saturate(140%)',
                  background: (t) =>
                    t.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(255,255,255,.06), rgba(255,255,255,.02))'
                      : 'linear-gradient(135deg, rgba(0,0,0,.06), rgba(0,0,0,.02))',
                  pointerEvents: 'none',
                }}
              />

              {/* Content */}
              <Box sx={{ position: 'relative', p: { xs: 3, sm: 4 } }}>
                <IconButton
                  onClick={() => setFounderOpen(false)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'background.default' },
                  }}
                  aria-label="Close"
                  size="small"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>

                {/* Founder name with neural aura */}
                <Typography
                  id="founder-title"
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    textAlign: 'center',
                    letterSpacing: 0.5,
                    animation: `${neuralAura} 5s ease-in-out infinite`,
                  }}
                >
                  Prince Pudasaini
                </Typography>

                {/* Founder quote */}
                <Typography variant="body1" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
                  “I will tell you my story after the stable v2.0 release. Stay tuned.”
                </Typography>

                {/* Independent white tech element boxes */}
                <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1.25} sx={{ mt: 2.5 }}>
                  {TECH_STACK.map((tech) => (
                    <Box
                      key={tech}
                      sx={{
                        bgcolor: '#ffffff',
                        color: '#000000',
                        borderRadius: '16px',
                        px: 1.25,
                        py: 0.75,
                        fontSize: '.9rem',
                        border: '1px solid rgba(0,0,0,0.08)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                      }}
                    >
                      {tech}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Chat area */}
      <Box sx={{
        height: '100dvh',
        pt: `${headerHeight}px`,
        pb: `${FOOTER_PAD}px`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Container
          ref={scrollAreaRef}
          maxWidth="md"
          sx={{
            flex: 1,
            overflowY: 'auto',
            pt: 0,
            pb: { xs: 1, sm: 2 },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <Box sx={{ height: `24px`, flex: '0 0 auto' }} />

          {conversation.length === 0 ? (
            <WelcomeHero show />
          ) : (
            <Stack spacing={2}>
              {conversation.map((msg, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <Paper sx={{
                    p: { xs: 1.25, sm: 1.5 },
                    maxWidth: '85%',
                    bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper',
                    color: msg.sender === 'user' ? 'white' : 'text.primary',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
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
            height: `calc(100dvh - ${headerHeight + FOOTER_PAD + 32}px)`,
            width: 2,
            bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.16)'),
            borderRadius: 1,
            zIndex: 1200,
            cursor: 'pointer'
          }}
          role="presentation"
          aria-label="scroll progress"
        >
          <Box sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            top: `calc(${scrollProgress * 100}%)`,
            width: 12, height: 12,
            borderRadius: '50%',
            bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
            border: (t) => `2px solid ${t.palette.primary.main}`,
            transition: 'top 150ms ease-out'
          }} />
        </Box>
      </Box>

      {/* Fixed input bar */}
      <Box sx={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        bgcolor: 'background.default',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}>
        <Container maxWidth="md" sx={{ p: { xs: 1, sm: 2 } }}>
          <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', borderRadius: 3, boxShadow: 'none' }}>
            <TextField
              fullWidth
              variant="standard"
              multiline
              maxRows={5}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={guestProfile ? "Enter your rough notes here..." : "Please complete your profile first..."}
              InputProps={{ disableUnderline: true, sx: { p: 1.5, fontSize: '0.95rem' } }}
              disabled={isGenerating || !guestProfile}
            />
            <IconButton color="primary" sx={{ p: '10px' }} onClick={handleSendMessage} disabled={isGenerating || !guestProfile} aria-label="send">
              <SendIcon />
            </IconButton>
          </Paper>
          <Typography
            variant="caption"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              display: 'block',
              mt: 1,
              px: 2,
            }}
          >
            LetterLab Pro can make mistakes. Consider checking important information.
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
