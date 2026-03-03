import React from 'react';
import {
    Dialog,
    DialogContent,
    Typography,
    Button,
    Box,
    IconButton,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { Close, Google, Microsoft } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const glassStyles = {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
};

const AuthPromptModal = ({ open, onClose, mode = 'login' }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const title = mode === 'login' ? 'Sign in to LetterLab' : 'Session Expired';
    const description = mode === 'login'
        ? 'Connect your account to access AI-powered email drafting.'
        : 'Please sign in again to refresh your session and continue working.';

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={fullScreen}
            PaperProps={{
                style: {
                    ...glassStyles,
                    borderRadius: fullScreen ? 0 : 24,
                    maxWidth: 400,
                    width: '100%',
                    overflow: 'hidden'
                }
            }}
            TransitionComponent={motion.div}
            TransitionProps={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 20 },
                transition: { duration: 0.3 }
            }}
        >
            <Box sx={{ position: 'relative', p: 1 }}>
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'rgba(0, 0, 0, 0.5)',
                        '&:hover': { color: 'black' }
                    }}
                >
                    <Close />
                </IconButton>
            </Box>

            <DialogContent sx={{ pt: 4, pb: 6, px: 4, textAlign: 'center' }}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
                        }}
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <polyline points="10 17 15 12 10 7" />
                            <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                    </Box>
                </motion.div>

                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1a1a1a' }}>
                    {title}
                </Typography>

                <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.6)', mb: 4, lineHeight: 1.6 }}>
                    {description}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Google />}
                        onClick={() => window.location.href = 'http://localhost:5000/auth/google'}
                        sx={{
                            py: 1.5,
                            borderRadius: '12px',
                            borderColor: 'rgba(0,0,0,0.1)',
                            color: '#1a1a1a',
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 500,
                            background: 'white',
                            '&:hover': {
                                background: '#f8f9fa',
                                borderColor: 'rgba(0,0,0,0.2)',
                            }
                        }}
                    >
                        Sign in with Google
                    </Button>

                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Microsoft />}
                        onClick={() => window.location.href = 'http://localhost:5000/auth/microsoft'}
                        sx={{
                            py: 1.5,
                            borderRadius: '12px',
                            borderColor: 'rgba(0,0,0,0.1)',
                            color: '#1a1a1a',
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 500,
                            background: 'white',
                            '&:hover': {
                                background: '#f8f9fa',
                                borderColor: 'rgba(0,0,0,0.2)',
                            }
                        }}
                    >
                        Sign in with Microsoft
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default AuthPromptModal;
