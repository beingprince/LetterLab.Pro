// frontend/src/App.jsx
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Chip, Avatar, Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined';
import Brightness7OutlinedIcon from '@mui/icons-material/Brightness7Outlined';
import HistoryIcon from '@mui/icons-material/History';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { darkTheme, lightTheme } from './theme';
import { SmartBackground } from './SmartBackground';

import ComposePage from './ComposePage';
import HomepageV2 from './HomepageV2';
import AboutPage from './AboutPage';
import DocsPage from './DocsPage';
import PrivacyPage from './PrivacyPage';
import AnalyticsPage from './AnalyticsPage';
import AuthPage from './AuthPage';
import AccountPage from './AccountPage'; // Account view when logged in

const THEME_KEY = 'llp_theme_mode';

// --- Simple frontend auth gate using localStorage ---
const LS_KEY = 'letterlab_user';
function getAuthUser() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch { return null; }
}

function getInitialMode() {
  if (typeof window !== 'undefined') {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  }
  return 'dark';
}

// Build initials from first + last token of name
function initialsFromName(name) {
  if (!name || typeof name !== 'string') return 'U';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  const ini = `${first}${last}`.toUpperCase();
  return ini || 'U';
}

function App() {
  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === THEME_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        setMode(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  useEffect(() => {
    try { window.localStorage.setItem(THEME_KEY, mode); } catch {}
  }, [mode]);

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode((prev) => {
        const next = prev === 'light' ? 'dark' : 'light';
        try { window.localStorage.setItem(THEME_KEY, next); } catch {}
        return next;
      });
    },
  }), []);

  const [rightMenuAnchorEl, setRightMenuAnchorEl] = useState(null);
  const [versionMenuAnchorEl, setVersionMenuAnchorEl] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const appBarRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  useEffect(() => {
    const el = appBarRef.current; if (!el) return;
    const update = () => setHeaderHeight(Math.round(el.getBoundingClientRect().height || 0));
    let ro = null;
    if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(update); ro.observe(el); }
    window.addEventListener('resize', update);
    update();
    return () => { if (ro) ro.disconnect(); window.removeEventListener('resize', update); };
  }, []);

  // client-side path router
  const [path, setPath] = useState(typeof window !== 'undefined' ? window.location.pathname : '/');
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const navigate = (to) => {
    if (window.location.pathname === to) return;
    window.history.pushState({}, '', to);
    setPath(to);
  };

  // --- Auth tracking + guard ---
  const [authedUser, setAuthedUser] = useState(getAuthUser());

  // Keep auth in sync in this tab
  useEffect(() => {
    const onStorage = (e) => { if (e.key === LS_KEY) setAuthedUser(getAuthUser()); };
    const onFocus = () => setAuthedUser(getAuthUser());
    const onCustom = () => setAuthedUser(getAuthUser());
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);
    window.addEventListener('llp_auth_changed', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('llp_auth_changed', onCustom);
    };
  }, []);

  // Redirect to /account when not logged in
  useEffect(() => {
    const isLoggedIn = !!authedUser;
    if (!isLoggedIn && window.location.pathname !== '/account') {
      navigate('/account');
    }
  }, [authedUser, path]);

  const HOMEPAGE_ENABLED = !!import.meta.env.VITE_HOMEPAGE_V2;

  const renderPage = () => {
    // /account is a special route: show Auth when logged out, Account when logged in
    if (path === '/account') {
      return authedUser ? <AccountPage /> : <AuthPage />;
    }

    // Gate all other routes if not logged in
    if (!authedUser) {
      return <AuthPage />;
    }

    // Logged-in routes
    if (path === '/compose')   return <ComposePage headerHeight={headerHeight} />;
    if (path === '/docs')      return <DocsPage />;
    if (path === '/about')     return <AboutPage />;
    if (path === '/privacy')   return <PrivacyPage />;
    if (path === '/analytics') return <AnalyticsPage />;
    if (HOMEPAGE_ENABLED && path === '/') return <HomepageV2 />;
    return <ComposePage headerHeight={headerHeight} />;
  };

  // Compute avatar content + label
  const avatarInitials = initialsFromName(authedUser?.name);
  const avatarAria = authedUser ? `${authedUser.name} — open account` : 'Sign in';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{
        '*, *::before, *::after': { boxSizing: 'border-box' },
        'html, body, #root': { height: '100%' },
        html: { overflowX: 'hidden', overscrollBehaviorY: 'none' },
        body: {
          margin: 0,
          overflowX: 'hidden',
          // gradient helps glass surfaces read without using background-attachment: fixed
          backgroundImage: theme.palette.mode === 'dark'
            ? 'linear-gradient(170deg, #161B22 0%, #0D1117 100%)'
            : 'linear-gradient(170deg, #F7FAFF 0%, #FFFFFF 60%)',
          backgroundAttachment: 'scroll'
        },
        a: { textDecoration: 'none', color: 'inherit' }
      }} />

      {/* Global fixed background (grid/icons handled by SmartBackground) */}
      <SmartBackground />

      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: {
            background: theme.glass.panel,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            width: 300,
            borderRight: `1px solid ${theme.glass.border}`,
            boxShadow: theme.shadows[1],
          }
        }}
      >
        {/* ADD THIS NEW LIST FOR NAVIGATION */}
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { setIsDrawerOpen(false); navigate('/'); }}>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { setIsDrawerOpen(false); navigate('/compose'); }}>
            <ListItemText primary="Compose" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { setIsDrawerOpen(false); navigate('/docs'); }}>
            <ListItemText primary="Docs" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { setIsDrawerOpen(false); navigate('/analytics'); }}>
            <ListItemText primary="Analytics" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider /> 
      {/* END OF NEW CODE */}

      {/* This is your existing History Box (line 203 in your file) */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>History</Typography>
        <IconButton aria-label="new conversation"><AddCommentOutlinedIcon /></IconButton>
      </Box>
      <Divider />
      {/* ... the rest of your history list ... */}
      
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>History</Typography>
          <IconButton aria-label="new conversation"><AddCommentOutlinedIcon /></IconButton>
        </Box>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => { setIsDrawerOpen(false); navigate('/compose'); }}>
              <ListItemIcon><HistoryIcon sx={{ color: 'text.secondary', minWidth: 40 }} /></ListItemIcon>
              <ListItemText primary="Request for Extension..." />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <AppBar
        ref={appBarRef}
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          // flat top; translucent surface; no radius artifact
          bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(13,17,23,0.55)' : 'rgba(255,255,255,0.65)',
          backdropFilter: 'saturate(1.2) blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          px: { xs: 1, sm: 2 },
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 72 }, position: 'relative' }}>
          <IconButton edge="start" color="inherit" onClick={() => setIsDrawerOpen(true)} sx={{ mr: 2 }} aria-label="open history">
            <MenuIcon />
          </IconButton>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.2, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
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
              v2.0 Beta
            </Button>
            <Menu anchorEl={versionMenuAnchorEl} open={Boolean(versionMenuAnchorEl)} onClose={() => setVersionMenuAnchorEl(null)}>
              <MenuItem>v1.0 Beta</MenuItem>
            </Menu>
          </Box>

          {/* Center menu (Account removed) */}
          <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
            <Button onClick={() => navigate('/')}         size="small" sx={{ textTransform: 'none' }}>Home</Button>
            <Button onClick={() => navigate('/compose')}  size="small" sx={{ textTransform: 'none' }}>Compose</Button>
            <Button onClick={() => navigate('/docs')}     size="small" sx={{ textTransform: 'none' }}>Docs</Button>
            <Button onClick={() => navigate('/analytics')}size="small" sx={{ textTransform: 'none' }}>Analytics</Button>
            {/* Account button removed per request */}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit" aria-label="toggle theme">
            {theme.palette.mode === 'dark' ? <Brightness7OutlinedIcon /> : <Brightness4OutlinedIcon />}
          </IconButton>
          <IconButton onClick={(e) => setRightMenuAnchorEl(e.currentTarget)} aria-label="more"><MoreVertIcon /></IconButton>
          <Chip label="PRO" size="small" variant="outlined" sx={{ mx: 1.5 }} />
          <Tooltip title={authedUser ? authedUser.name : 'Sign in'}>
            <Avatar
              sx={{ width: 32, height: 32, cursor: 'pointer' }}
              onClick={() => navigate('/account')}
              aria-label={avatarAria}
            >
              {avatarInitials}
            </Avatar>
          </Tooltip>

          <Menu anchorEl={rightMenuAnchorEl} open={Boolean(rightMenuAnchorEl)} onClose={() => setRightMenuAnchorEl(null)}>
            <MenuItem onClick={() => navigate('/about')}>About</MenuItem>
            <MenuItem onClick={() => navigate('/privacy')}>Privacy</MenuItem>
          </Menu>
        </Toolbar>
        {/* clean divider line exactly under header (fixes “floating” look) */}
        <Divider />
      </AppBar>

      {/* Page content */}
      <Box
        sx={{
          pt: `${headerHeight}px`,
          // ensure each page fills the viewport height so no phantom scroll or split
          minHeight: '100dvh',
          isolation: 'isolate',     // keep above the fixed background layer
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* gentle page gutter so panels breathe */}
        <Box sx={{ px: { xs: 1.5, sm: 3 }, py: { xs: 2, sm: 3 } }}>
          {renderPage()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
