import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useChat } from './useChat';
import MessageList from './components/MessageList';
import Composer from '../Composer';
import DraftReviewModal from './components/DraftReviewModal';

const ChatInterface = ({ onDraftEmail, onModeChange, onProfessorSelect, jwtToken, onMessagesChange, provider = 'gmail' }) => {
    const {
        messages,
        sendMessage,
        isTyping,
        warnings,
        lastDraft,
        lastMeta,
        isLocked,
        resetAt,
        clearLastDraft
    } = useChat(jwtToken);

    // ✅ Report message count to parent (for hiding greetings)
    useEffect(() => {
        if (onMessagesChange) {
            onMessagesChange(messages);
        }
    }, [messages, onMessagesChange]);

    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [currentDraftContent, setCurrentDraftContent] = useState('');

    // Open draft modal when backend returns draft_email
    useEffect(() => {
        if (lastDraft?.body) {
            setCurrentDraftContent(lastDraft.body);
            setIsReviewOpen(true);
        }
    }, [lastDraft]);

    const handleSend = (text) => {
        if (isLocked) return;
        const draftKeywords = ['write', 'draft', 'email', 'create', 'generate', 'make', 'reply'];
        const isDraftIntent = draftKeywords.some(k => text.toLowerCase().includes(k));
        sendMessage(text, isDraftIntent ? 'email_draft' : 'chat');
    };

    const handleDraftProceed = (finalBody) => {
        setIsReviewOpen(false);
        clearLastDraft();
        onDraftEmail(finalBody, {
            professorName: lastMeta?.professor_name,
            recipientEmail: lastMeta?.recipient_email,
            conversationId: lastMeta?.conversation_id
        });
    };

    const handleDraftClose = () => {
        setIsReviewOpen(false);
        clearLastDraft();
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            pt: '80px',
            pb: '160px'
        }}>

            {/* Quota Warning Banner */}
            {warnings?.length > 0 && (
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bgcolor: warnings.some(w => w.code === 'LOCKED_UNTIL_RESET') ? 'error.light' : 'warning.light',
                    color: warnings.some(w => w.code === 'LOCKED_UNTIL_RESET') ? 'error.dark' : 'warning.dark',
                    py: 1,
                    px: 2,
                    textAlign: 'center',
                    fontSize: '12px',
                    zIndex: 10
                }}>
                    {warnings[0]?.message}
                    {resetAt && (
                        <Typography variant="caption" display="block" sx={{ opacity: 0.9, mt: 0.5 }}>
                            Resets: {new Date(resetAt).toLocaleString('en-US', { timeZone: 'America/Chicago' })}
                        </Typography>
                    )}
                </Box>
            )}

            <MessageList
                messages={messages}
                isTyping={isTyping}
                onUseDraft={(body) => {
                    setCurrentDraftContent(body);
                    setIsReviewOpen(true);
                }}
            />

            <Composer
                currentMode="chat"
                onGenerate={handleSend}
                onModeChange={onModeChange}
                onProfessorSelect={onProfessorSelect}
                disabled={isLocked}
            />

            <DraftReviewModal
                open={isReviewOpen}
                initialContent={currentDraftContent}
                onClose={handleDraftClose}
                onProceed={handleDraftProceed}
            />
        </Box>
    );
};

export default ChatInterface;
