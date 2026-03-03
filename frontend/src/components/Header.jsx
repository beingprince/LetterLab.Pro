import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Tooltip,
    Divider,
    ListItemIcon,
    alpha,
    useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { clearSession } from './session/sessionUtils';

// Helper for avatar initials
function initialsFromName(name, email) {
    if (name && typeof name === 'string' && name.trim()) {
        const parts = name.trim().split(/\s+/);
        const first = parts[0]?.[0] || '';
        const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
        const ini = `${first}${last}`.toUpperCase();
        if (ini) return ini;
    }
    if (email && typeof email === 'string') {
        return email[0].toUpperCase();
    }
    return 'U';
}

const Header = ({
    appBarRef,
    theme,
    path,
    mode,
    // toggleColorMode, // Removed from new design reqs (moved to settings/dropdown if needed, or just removed from navbar)
    setIsDrawerOpen,
    navigate,
    authedUser,
}) => {
    const [userMenuAnchor, setUserMenuAnchor] = useState(null);

    // avatar string + aria label
    const avatarInitials = initialsFromName(authedUser?.name, authedUser?.email);
    const avatarAria = authedUser
        ? `${authedUser.name || authedUser.email} – open account`
        : 'Sign in';

    // Navigation Items
    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Chat', path: '/chat' },
        { label: 'Professor', path: '/add-professor' },
        { label: 'Docs', path: '/docs' },
        { label: 'Analytics', path: '/analytics' },
    ];

    const handleUserMenuOpen = (event) => {
        setUserMenuAnchor(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchor(null);
    };

    const handleLogout = () => {
        handleUserMenuClose();
        clearSession();
        window.location.href = '/account';
    };

    return (
        <AppBar
            ref={appBarRef}
            position="fixed"
            color="default"
            elevation={0}
            sx={{
                height: 72, // Fixed height per spec
                overflow: "visible",
                zIndex: 1100,
                // Background per spec
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(180deg, rgba(11,17,32,0.92), rgba(17,24,39,0.85))'
                    : 'rgba(255,255,255,0.8)', // Fallback for light mode, slightly translucent
                borderBottom: theme.palette.mode === 'light' ? '1px solid rgba(0,0,0,0.06)' : 'none',
                backdropFilter: 'blur(12px)',
                px: { xs: 2, md: 4 }, // 32px roughly
            }}
        >
            <Toolbar
                disableGutters
                sx={{
                    minHeight: '72px !important',
                    display: 'grid',
                    gridTemplateColumns: { xs: 'auto 1fr auto', md: '1fr auto 1fr' }, // Mobile: Auto-Space-Auto | Desktop: 3-column
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                {/* 1️⃣ LEFT SECTION */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Mobile Hamburger (Visible only on xs) */}
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => setIsDrawerOpen(true)}
                        sx={{ display: { md: 'none' }, mr: 1 }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Logo + Wordmark */}
                    <Box
                        onClick={() => navigate('/')}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            cursor: 'pointer',
                            userSelect: 'none'
                        }}
                    >
                        <img src="/brand/letterlab-logo.svg" alt="LetterLab.Pro" style={{ height: 45 }} />
                    </Box>
                </Box>


                {/* 2️⃣ CENTER SECTION - Segmented Glass Track (Desktop only) */}
                <Box sx={{
                    display: { xs: 'none', md: 'flex' },
                    justifyContent: 'center',
                    flex: 1,
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                    mx: { xs: 0, md: 2 }
                }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            // Spec: Dark glass base
                            background: theme.palette.mode === 'dark'
                                ? 'rgba(17,24,39,0.55)'
                                : 'rgba(0,0,0,0.04)', // Light mode equivalent
                            backdropFilter: 'blur(18px)',
                            border: theme.palette.mode === 'dark'
                                ? '1px solid rgba(255,255,255,0.10)'
                                : '1px solid rgba(0,0,0,0.06)',
                            borderRadius: '999px',
                            p: '6px', // 8px spec minus internal gap feel
                            boxShadow: theme.palette.mode === 'dark'
                                ? '0 18px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)'
                                : '0 10px 30px rgba(0,0,0,0.03)',
                            gap: '4px',
                            whiteSpace: 'nowrap', // Prevent wrapping on mobile
                        }}
                    >
                        {navItems.map((item) => {
                            const isActive = path === item.path;
                            return (
                                <Box
                                    key={item.label}
                                    onClick={() => navigate(item.path)}
                                    component="button" // Use button semantic
                                    sx={{
                                        border: isActive && theme.palette.mode === 'dark'
                                            ? '1px solid rgba(255,255,255,0.10)'
                                            : '1px solid transparent',
                                        background: isActive
                                            ? (theme.palette.mode === 'dark' ? 'rgba(37,99,235,0.18)' : '#fff') // Active BG
                                            : 'transparent',
                                        borderRadius: '999px',
                                        padding: '8px 18px', // Spec: 10px 18px (reduced slightly for height fit)
                                        cursor: 'pointer',
                                        color: isActive
                                            ? (theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main)
                                            : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : theme.palette.text.secondary),
                                        fontWeight: 500,
                                        fontSize: '14px',
                                        fontFamily: "'Inter', sans-serif",
                                        transition: 'all 0.18s ease',
                                        outline: 'none',
                                        boxShadow: isActive
                                            ? (theme.palette.mode === 'dark'
                                                ? '0 10px 22px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -10px 20px rgba(0,0,0,0.25)'
                                                : '0 2px 8px rgba(0,0,0,0.06)')
                                            : 'none',
                                        '&:hover': {
                                            color: isActive
                                                ? null
                                                : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.90)' : theme.palette.text.primary),
                                        }
                                    }}
                                >
                                    {item.label}
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                {/* 3️⃣ RIGHT SECTION */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
                    {/* Plan Indicator (PRO) purely text */}
                    <Typography
                        variant="caption"
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            fontWeight: 600,
                            color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.75)' : 'text.secondary',
                            letterSpacing: '0.05em',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                        }}
                    >
                        PRO
                    </Typography>

                    {/* Auth Section: Avatar or Sign In button */}
                    {!authedUser ? (
                        <Box
                            onClick={() => navigate('/account')}
                            component="button"
                            sx={{
                                background: theme.palette.primary.main,
                                color: '#fff',
                                border: 'none',
                                borderRadius: '999px',
                                px: 3,
                                py: 1,
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    background: theme.palette.primary.dark,
                                    transform: 'translateY(-1px)',
                                }
                            }}
                        >
                            Sign in
                        </Box>
                    ) : (
                        <Tooltip title="Account settings">
                            <Avatar
                                onClick={handleUserMenuOpen}
                                sx={{
                                    width: 36,
                                    height: 36,
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
                                    color: theme.palette.text.primary,
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-1px)',
                                    }
                                }}
                            >
                                {avatarInitials}
                            </Avatar>
                        </Tooltip>
                    )}

                    {/* Admin Dropdown */}
                    <Menu
                        anchorEl={userMenuAnchor}
                        id="account-menu"
                        open={Boolean(userMenuAnchor)}
                        onClose={handleUserMenuClose}
                        onClick={handleUserMenuClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 10px 30px rgba(0,0,0,0.2))',
                                mt: 1.5,
                                minWidth: 200,
                                borderRadius: 3,
                                background: theme.palette.mode === 'dark' ? 'rgba(20,25,35,0.95)' : '#fff',
                                backdropFilter: 'blur(20px)',
                                border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <Box sx={{ px: 2, py: 1.5 }}>
                            <Typography variant="subtitle2" noWrap>
                                {authedUser ? (authedUser.name || 'User') : 'Not signed in'}
                            </Typography>
                            {authedUser?.email && (
                                <Typography variant="caption" color="text.secondary" noWrap>
                                    {authedUser.email}
                                </Typography>
                            )}
                        </Box>
                        <Divider />

                        {authedUser ? [
                            <MenuItem key="profile" onClick={() => navigate('/profile')}>
                                <ListItemIcon>
                                    <PersonOutlineIcon fontSize="small" />
                                </ListItemIcon>
                                Profile
                            </MenuItem>,
                            <MenuItem key="billing" onClick={() => navigate('/account')}>
                                <ListItemIcon>
                                    <CreditCardOutlinedIcon fontSize="small" />
                                </ListItemIcon>
                                Billing & Plans
                            </MenuItem>,
                            <MenuItem key="settings" onClick={() => navigate('/settings')}>
                                <ListItemIcon>
                                    <SettingsOutlinedIcon fontSize="small" />
                                </ListItemIcon>
                                Settings
                            </MenuItem>,
                            <Divider key="div2" />,
                            <MenuItem key="logout" onClick={handleLogout} sx={{ color: 'error.main' }}>
                                <ListItemIcon>
                                    <LogoutOutlinedIcon fontSize="small" color="error" />
                                </ListItemIcon>
                                Sign out
                            </MenuItem>,
                        ] : (
                            <MenuItem onClick={() => navigate('/account')}>
                                <ListItemIcon>
                                    <LogoutOutlinedIcon fontSize="small" />
                                </ListItemIcon>
                                Sign in
                            </MenuItem>
                        )}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
