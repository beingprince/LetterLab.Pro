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
    setIsDrawerOpen,
    navigate,
    authedUser,
    hasMessages = false, // ✅ Added to support logo fade on interaction
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
                height: { xs: 'calc(72px + env(safe-area-inset-top, 0px))', md: 72 },
                zIndex: 1100,
                background: 'rgba(255,255,255,0.8)',
                borderBottom: 'none',
                borderTop: 'none',
                boxShadow: 'none',
                backdropFilter: 'blur(12px)',
                px: { xs: 1, md: 4 }, // ✅ Reduced horizontal padding on mobile
                pt: 'env(safe-area-inset-top, 0px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}
        >
            <Toolbar
                disableGutters
                sx={{
                    minHeight: '72px !important',
                    display: 'grid',
                    gridTemplateColumns: { xs: '40px 1fr 40px', md: '1fr auto 1fr' }, // ✅ Explicit widths for icons
                    alignItems: 'center',
                    gap: { xs: 1, md: 2 }, // ✅ Tighter gap on mobile
                    height: '100%'
                }}
            >
                {/* 1️⃣ LEFT SECTION */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Mobile Hamburger (xs only) */}
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => setIsDrawerOpen(true)}
                        sx={{ display: { md: 'none' }, minWidth: 40 }} // ✅ Ensure stable width
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Full logo — desktop only */}
                    <Box
                        onClick={() => navigate('/')}
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            alignItems: 'center',
                            gap: 1.5,
                            cursor: 'pointer',
                            userSelect: 'none'
                        }}
                    >
                        <img
                            src="/brand/letterlab-logo.svg"
                            alt="LetterLab.Pro"
                            style={{
                                height: 45,
                                width: 'auto',
                                display: 'block',
                                background: 'transparent',
                                color: 'transparent',
                                filter: 'none',
                                mixBlendMode: 'normal',
                                WebkitUserDrag: 'none',
                                userSelect: 'none',
                            }}
                        />
                    </Box>
                </Box>


                {/* 2️⃣ CENTER SECTION */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    // ✅ Smooth fade transition for mobile logo
                    opacity: (path === '/chat' && hasMessages) ? 0 : 1,
                    visibility: (path === '/chat' && hasMessages) ? 'hidden' : 'visible',
                    transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.5s'
                }}>
                    {/* Favicon — mobile center */}
                    <Box
                        onClick={() => navigate('/')}
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            cursor: 'pointer',
                            userSelect: 'none',
                        }}
                    >
                        <img
                            src="/brand/letterlab-favicon.svg"
                            alt="LetterLab.Pro"
                            style={{
                                height: 60,
                                width: 'auto',
                                display: 'block',
                                background: 'transparent',
                                color: 'transparent',
                                filter: 'none',
                                mixBlendMode: 'normal',
                                WebkitUserDrag: 'none',
                                userSelect: 'none',
                            }}
                        />
                    </Box>

                    {/* Glass nav — desktop only */}
                    <Box sx={{
                        display: { xs: 'none', md: 'flex' },
                        justifyContent: 'center',
                        overflowX: 'auto',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': { display: 'none' },
                        mx: 2
                    }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                // Spec: Dark glass base
                                background: 'rgba(0,0,0,0.04)',
                                backdropFilter: 'blur(18px)',
                                border: '1px solid rgba(0,0,0,0.06)',
                                borderRadius: '999px',
                                p: '6px', // 8px spec minus internal gap feel
                                boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
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
                                            border: '1px solid transparent',
                                            background: isActive ? '#fff' : 'transparent',
                                            borderRadius: '999px',
                                            padding: '8px 18px', // Spec: 10px 18px (reduced slightly for height fit)
                                            cursor: 'pointer',
                                            color: isActive
                                                ? theme.palette.primary.main
                                                : theme.palette.text.secondary,
                                            fontWeight: 500,
                                            fontSize: '14px',
                                            fontFamily: "'Inter', sans-serif",
                                            transition: 'all 0.18s ease',
                                            outline: 'none',
                                            boxShadow: isActive
                                                ? '0 2px 8px rgba(0,0,0,0.06)'
                                                : 'none',
                                            '&:hover': {
                                                color: isActive ? null : theme.palette.text.primary,
                                            }
                                        }}
                                    >
                                        {item.label}
                                    </Box>
                                );
                            })}
                        </Box>
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
                            color: theme.palette.text.secondary,
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
                                display: 'inline-flex',
                                alignItems: 'center',
                                background: 'none',
                                backgroundColor: 'transparent',
                                border: 'none',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                letterSpacing: '0.01em',
                                boxShadow: 'none',
                                bgcolor: theme.palette.primary.main,
                                color: '#fff',
                                padding: '8px 20px',
                                borderRadius: '999px',
                                textDecoration: 'none',
                                transition: 'opacity 0.15s',
                                '&:hover': {
                                    opacity: 0.75,
                                    bgcolor: theme.palette.primary.dark,
                                },
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
                                    background: 'rgba(0,0,0,0.08)',
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
                                background: '#fff',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(0,0,0,0.08)',
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
