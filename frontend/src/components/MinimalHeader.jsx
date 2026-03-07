import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const MinimalHeader = ({ theme }) => {
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
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
            </Toolbar>
        </AppBar>
    );
};

export default MinimalHeader;
