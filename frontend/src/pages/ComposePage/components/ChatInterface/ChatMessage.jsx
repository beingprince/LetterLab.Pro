import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy'; // Robot/AI icon placeholder
import PersonIcon from '@mui/icons-material/Person';

const ChatMessage = ({ role, content, isTyping }) => {
    const isUser = role === 'user';

    return (
        <Box sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'flex-start',
            flexDirection: isUser ? 'row-reverse' : 'row',
            alignSelf: isUser ? 'flex-end' : 'flex-start',
            maxWidth: '80%'
        }}>
            {/* Avatar */}
            <Avatar sx={{
                width: 32,
                height: 32,
                bgcolor: isUser ? 'primary.main' : 'secondary.main',
                fontSize: 14
            }}>
                {isUser ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
            </Avatar>

            {/* Bubble */}
            <Box sx={{
                p: 2,
                borderRadius: '16px',
                borderTopRightRadius: isUser ? 0 : '16px',
                borderTopLeftRadius: isUser ? '16px' : 0,
                bgcolor: isUser ? 'primary.light' : 'grey.100', // Adjust colors based on theme later
                color: isUser ? 'primary.contrastText' : 'text.primary',
                boxShadow: 1
            }}>
                {isTyping ? (
                    <Typography variant="body2" sx={{ fontStyle: 'italic', opacity: 0.7 }}>
                        LetterLab is typing...
                    </Typography>
                ) : (
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {content}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default ChatMessage;
