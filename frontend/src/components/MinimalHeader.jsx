import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined';
import Brightness7OutlinedIcon from '@mui/icons-material/Brightness7Outlined';

const MinimalHeader = ({ theme, mode, toggleColorMode }) => {
    return (
        <AppBar
            position="fixed"
            color="default"
            elevation={0}
            sx={{
                bgcolor: 'transparent',
                backdropFilter: 'none',
                borderBottom: 'none',
                px: { xs: 1, sm: 2 },
            }}
        >
            <Toolbar
                sx={{
                    minHeight: { xs: 64, sm: 72 },
                    // Grid layout to allow true centering of logo while having right-aligned action
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr',
                    alignItems: 'center',
                }}
            >
                {/* Left spacer */}
                <Box />

                {/* Center: Brand Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center' }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 800,
                            letterSpacing: -0.5,
                            fontSize: { xs: '1.25rem', sm: '1.5rem' },
                            color: theme.palette.text.primary,
                        }}
                    >
                        LetterLab
                    </Typography>
                </Box>

                {/* Right: Theme Toggle */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton
                        onClick={toggleColorMode}
                        color="inherit"
                        aria-label="toggle theme"
                        edge="end"
                        sx={{
                            color: theme.palette.text.secondary,
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? 'rgba(255,255,255,0.05)'
                                    : 'rgba(0,0,0,0.05)'
                            }
                        }}
                    >
                        {mode === 'dark' ? (
                            <Brightness7OutlinedIcon />
                        ) : (
                            <Brightness4OutlinedIcon />
                        )}
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default MinimalHeader;
