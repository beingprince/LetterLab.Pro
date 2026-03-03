import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    TextField,
    IconButton,
    Backdrop
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const DraftReviewModal = ({ open, initialContent, onClose, onProceed }) => {
    const [content, setContent] = useState(initialContent);

    useEffect(() => {
        setContent(initialContent);
    }, [initialContent]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    // Glassmorphism
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden'
                }
            }}
            BackdropComponent={Backdrop}
            BackdropProps={{
                sx: {
                    backdropFilter: 'blur(8px)',
                    bgcolor: 'rgba(0, 0, 0, 0.2)'
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pb: 1
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutoAwesomeIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                        Review Draft
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    LetterLab has drafted this email for you. Review and edit the body before generating a subject line.
                </Typography>

                <TextField
                    multiline
                    minRows={10}
                    maxRows={20}
                    fullWidth
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    variant="outlined"
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.5)',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
                            '&:hover fieldset': { borderColor: 'primary.main' },
                            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                        }
                    }}
                />
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button onClick={onClose} color="inherit" sx={{ borderRadius: 3 }}>
                    Keep Chatting
                </Button>
                <Button
                    onClick={() => onProceed(content)}
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    size="large"
                    sx={{
                        borderRadius: 3,
                        px: 4,
                        background: 'linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                    }}
                >
                    Proceed to Subject
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DraftReviewModal;
