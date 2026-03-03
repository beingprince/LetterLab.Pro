import React from 'react';
import { Box, Typography, Button, Avatar, IconButton, Paper, Divider } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import MinimizeIcon from '@mui/icons-material/Minimize';

const HeroComposerMockup = () => {
    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                maxWidth: '600px', // Constrain width
                aspectRatio: '16/10', // Landscape aspect like a screen
                background: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 40px 80px rgba(0,0,0,0.12), 0 10px 30px rgba(0,0,0,0.06)', // Deep soft shadow
                border: '1px solid rgba(0,0,0,0.06)',
                position: 'relative',
                zIndex: 10,
            }}
        >
            {/* Chrome / Window Header */}
            <Box sx={{
                height: '48px',
                px: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                bgcolor: '#fcfcfc',
            }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151' }}>
                    New Message
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <MinimizeIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
                    <OpenInFullIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
                    <CloseIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
                </Box>
            </Box>

            {/* Inputs Area */}
            <Box sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* TO Field */}
                <Box sx={{ px: 3, py: 1.5, display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <Typography variant="body2" sx={{ color: '#6B7280', width: 60, fontWeight: 500 }}>To</Typography>
                    <Box sx={{
                        bgcolor: '#EEF2FF',
                        color: '#3B82F6',
                        px: 1.5, py: 0.5,
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 500,
                        display: 'flex', alignItems: 'center', gap: 1
                    }}>
                        alex.chen@acme.com
                        <CloseIcon sx={{ fontSize: 12, cursor: 'pointer', opacity: 0.7 }} />
                    </Box>
                </Box>

                {/* SUBJECT Field */}
                <Box sx={{ px: 3, py: 1.5, display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <Typography variant="body2" sx={{ color: '#6B7280', width: 60, fontWeight: 500 }}>Subject</Typography>
                    <Typography variant="body2" sx={{ color: '#111827', fontWeight: 500 }}>
                        Project Roadmap Update - Q2 2026
                    </Typography>
                </Box>

                {/* BODY (Rich Text) */}
                <Box sx={{ p: 3, flex: 1, bgcolor: '#fff' }}>
                    <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.8, fontSize: '15px' }}>
                        Hi Alex,
                        <br /><br />
                        I’ve reviewed the timeline for the Q2 initiatives. Everything looks solid, but I suggest we buffer an extra week for the API integration phase just to be safe.
                        <br /><br />
                        Here are the revised milestones:
                    </Typography>
                    <Box component="ul" sx={{ mt: 1, mb: 2, pl: 2, color: '#374151', fontSize: '15px' }}>
                        <li>✅ Backend Migration (April 10)</li>
                        <li>🔄 Frontend Refresh (May 2)</li>
                        <li>🚀 Beta Launch (May 20)</li>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.8, fontSize: '15px' }}>
                        Let me know if this aligns with your expectations.
                        <br /><br />
                        Best,
                        <br />
                        <span style={{ color: '#111827', fontWeight: 600 }}>Sarah Jenkins</span>
                    </Typography>
                </Box>

                {/* BOTTOM TOOLBAR */}
                <Box sx={{
                    p: 2,
                    px: 3,
                    borderTop: '1px solid rgba(0,0,0,0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: '#FAFAFA' // Slight contrast
                }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            disableElevation
                            endIcon={<SendIcon sx={{ fontSize: 16 }} />}
                            sx={{
                                textTransform: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: 600,
                                bgcolor: '#2563EB',
                                '&:hover': { bgcolor: '#1D4ED8' },
                                px: 3
                            }}
                        >
                            Send
                        </Button>
                        <IconButton size="small"><AttachFileIcon fontSize="small" /></IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 0.5, color: '#6B7280' }}>
                        <IconButton size="small"><FormatBoldIcon fontSize="small" /></IconButton>
                        <IconButton size="small"><FormatItalicIcon fontSize="small" /></IconButton>
                        <IconButton size="small"><FormatUnderlinedIcon fontSize="small" /></IconButton>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default HeroComposerMockup;
