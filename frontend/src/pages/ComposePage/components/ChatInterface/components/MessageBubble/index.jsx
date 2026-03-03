import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { keyframes } from '@emotion/react';

// Typing animation keyframes
const typingDot = keyframes`
  0% { opacity: 0.2; transform: translateY(0px); }
  20% { opacity: 1; transform: translateY(-3px); }
  40% { opacity: 0.2; transform: translateY(0px); }
  100% { opacity: 0.2; transform: translateY(0px); }
`;

const MessageBubble = ({ role, content, isTyping, onUseDraft, draftEmail }) => {
    const isUser = role === 'user';

    // Support both: structured draft_email from API and legacy delimiter tags
    let displayContent = content;
    let draftContent = null;
    if (draftEmail?.body) {
        draftContent = draftEmail.body;
    } else if (content && content.includes('---START_DRAFT---')) {
        const parts = content.split('---START_DRAFT---');
        displayContent = parts[0].trim();
        const draftPart = parts[1]?.split('---END_DRAFT---')[0];
        if (draftPart) draftContent = draftPart.trim();
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isUser ? 'flex-end' : 'flex-start',
            maxWidth: '95%', // Horizontal rectangular (wider) as requested
            alignSelf: isUser ? 'flex-end' : 'flex-start',
            mb: 1
        }}>

            {/* Bubble (Text Part) */}
            {(displayContent || isTyping) && (
                <Box sx={{
                    position: 'relative',
                    p: '12px 18px', // More padding for rectangular feel
                    borderRadius: '12px', // Less rounded corners for rectangular feel
                    borderTopRightRadius: isUser ? '2px' : '12px',
                    borderTopLeftRadius: !isUser ? '2px' : '12px',
                    bgcolor: isUser ? 'primary.main' : 'background.paper',
                    color: isUser ? '#fff' : 'text.primary',
                    border: !isUser ? '1px solid' : 'none',
                    borderColor: 'divider',
                    boxShadow: !isUser ? 1 : 1,
                    minWidth: '80px',
                }}>
                    {isTyping ? (
                        <Box sx={{ display: 'flex', gap: 0.5, py: 1, px: 0.5 }}>
                            {[0, 1, 2].map((i) => (
                                <Box key={i} sx={{
                                    width: 6, height: 6, borderRadius: '50%',
                                    bgcolor: 'text.secondary',
                                    animation: `${typingDot} 1.4s infinite ease-in-out both`,
                                    animationDelay: `${i * 0.16}s`
                                }} />
                            ))}
                        </Box>
                    ) : (
                        <Typography
                            variant="body2"
                            color="inherit"
                            sx={{
                                whiteSpace: 'pre-wrap',
                                lineHeight: 1.5,
                                fontSize: '0.95rem'
                            }}
                        >
                            {displayContent}
                        </Typography>
                    )}
                </Box>
            )}

            {/* Draft Launcher (Small) */}
            {draftContent && (
                <Box sx={{ mt: 1 }}>
                    <Button
                        size="small"
                        startIcon={<EditNoteIcon />}
                        onClick={() => onUseDraft(draftContent)}
                        sx={{
                            borderRadius: 4,
                            bgcolor: 'rgba(37, 99, 235, 0.1)',
                            color: 'primary.main',
                            textTransform: 'none',
                            fontWeight: 600,
                            border: '1px solid rgba(37, 99, 235, 0.2)',
                            backdropFilter: 'blur(4px)',
                            '&:hover': {
                                bgcolor: 'rgba(37, 99, 235, 0.2)',
                            }
                        }}
                    >
                        View Draft
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default MessageBubble;
