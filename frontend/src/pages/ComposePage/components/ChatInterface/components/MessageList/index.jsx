import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import MessageBubble from '../MessageBubble';

const MessageList = ({ messages, isTyping, onUseDraft }) => {
    const listRef = useRef(null);

    // Auto-scroll to bottom on new message
    useEffect(() => {
        if (listRef.current) {
            const { scrollHeight, clientHeight } = listRef.current;
            listRef.current.scrollTo({
                top: scrollHeight - clientHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isTyping]);

    return (
        <Box
            ref={listRef}
            sx={{
                flex: 1,
                overflowY: 'auto', // Scrollable area
                px: { xs: 2, sm: 3 }, // Side padding only
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                scrollBehavior: 'smooth',
                // Keep scrollbar hidden but functional
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' }
            }}
        >

            {messages.map((msg) => (
                <MessageBubble
                    key={msg.id}
                    role={msg.role}
                    content={msg.content}
                    timestamp={msg.timestamp}
                    draftEmail={msg.draftEmail}
                    onUseDraft={onUseDraft}
                />
            ))}

            {isTyping && (
                <MessageBubble role="assistant" isTyping={true} />
            )}
        </Box>
    );
};

export default MessageList;
