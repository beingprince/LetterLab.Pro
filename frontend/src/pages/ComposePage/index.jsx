import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Composer from './components/Composer';
import OutputDisplay from './components/OutputDisplay';
import PullEmail from './components/PullEmail';
import ChatInterface from './components/ChatInterface';
import EmailFinalReview from './components/shared/EmailFinalReview';
import { chatDraftToArtifact } from './adapters/emailDraftArtifact';
import SubjectSelectionPanel from './components/SubjectSelectionPanel';
import SessionExpiredState from '../../components/session/SessionExpiredState';
import GreetingHeader from './components/shared/GreetingHeader';

import { useGeneration } from './hooks/useGeneration';

const ComposePage = ({ jwtToken, outlookAccessToken, authProvider, navigate }) => {
    const [mode, setMode] = useState('chat'); // 'chat' | 'compose' | 'pull' | 'subject'
    const [email, setEmail] = useState(null); // Used for OutputDisplay (readonly view)
    const [currentPrompt, setCurrentPrompt] = useState('');
    const [selectedProfessor, setSelectedProfessor] = useState(null);
    const [userName, setUserName] = useState('');
    const [promptOverride, setPromptOverride] = useState('');

    // State for Draft Handover
    const [draftText, setDraftText] = useState('');
    const [draftSubject, setDraftSubject] = useState('');
    const [chatContext, setChatContext] = useState(null);
    const [hasChatMessages, setHasChatMessages] = useState(false); // ✅ Track if chat has started

    const { generateEmail, isLoading } = useGeneration(jwtToken);

    // Decode user name from token
    useEffect(() => {
        if (jwtToken) {
            try {
                const decoded = jwtDecode(jwtToken);
                // Look for common name fields
                const name = decoded.name || decoded.given_name || decoded.nickname || '';
                // If full name, take first name
                setUserName(name.split(' ')[0] || 'there');
            } catch (e) {
                console.error("Failed to decode token", e);
                setUserName('there');
            }
        }
    }, [jwtToken]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const handleGenerate = async (prompt) => {
        setCurrentPrompt(prompt);
        const result = await generateEmail(prompt);
        if (result) {
            setEmail(result);
        }
    };

    const handleRegenerate = async () => {
        if (currentPrompt) {
            const result = await generateEmail(currentPrompt);
            if (result) {
                setEmail(result);
            }
        }
    };

    const handlePullEmailReply = (reply) => {
        setDraftText(reply.body);
        setDraftSubject(reply.subject);
        setChatContext({
            professorName: selectedProfessor?.name || 'Recipient',
            recipientEmail: selectedProfessor?.email
        });
        setMode('subject'); // Go to Subject Selection instead of chat
    };

    const handleProfessorSelect = (prof) => {
        setSelectedProfessor(prof);
    };

    // Called when Chat Interface finishes a draft (from Proceed on Email Draft Card)
    const handleChatDraft = (draftBody, context) => {
        setDraftText(draftBody);
        setChatContext(context || null);
        setMode('subject'); // Go to Subject Selection
    };

    // Called when Subject is selected — always show same final review form (Chat, Subject mode, or Compose)
    const handleSubjectSelected = (subject) => {
        setDraftSubject(subject);
        if (chatContext) {
            setMode('chat_send_preview'); // Chat: has recipient from context
        } else if (mode === 'subject' || mode === 'compose') {
            setMode('subject_send_preview'); // Subject mode or Compose: user fills To
        } else {
            setMode('chat');
        }
    };

    // ✅ Strict scroll locking for mobile chat
    useEffect(() => {
        if (mode === 'chat') {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            // Prevent elastic bounce
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.height = '100%';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
        };
    }, [mode]);

    const hasValidToken = !!(jwtToken || localStorage.getItem('authToken'));
    if (!hasValidToken) {
        return (
            <div className="relative min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
                <SessionExpiredState
                    message="Session expired. Please sign in again."
                    onSignIn={() => { window.location.href = '/account'; }}
                    onBackToHome={navigate ? () => navigate('/') : undefined}
                />
            </div>
        );
    }

    return (
        <div
            className={`relative bg-gray-50 dark:bg-gray-900 ${mode === 'chat' ? 'h-[calc(100dvh-var(--total-header-height))] overflow-hidden' : 'min-h-screen overflow-x-hidden overflow-y-auto'}`}
            style={{
                height: mode === 'chat' ? 'calc(100dvh - var(--total-header-height, 72px))' : 'auto'
            }}
        >

            {/* Glassmorphism Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/10 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-pink-400/5 rounded-full blur-[100px]" />
            </div>

            {/* Content */}
            <div className={`relative z-10 
                ${mode === 'chat' ? 'w-full h-full' : 'max-w-7xl mx-auto px-4 pt-14'} 
                ${mode === 'chat' ? '' : 'py-12 pb-48 transition-all duration-500'}
            `}>

                {/* Greeting Header */}
                {mode !== 'subject' && mode !== 'chat_send_preview' && mode !== 'subject_send_preview' && (
                    <GreetingHeader userName={userName} mode={mode} hasMessages={hasChatMessages} />
                )}


                {/* Compose Mode */}
                {mode === 'compose' && (
                    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center transition-all duration-700 ease-in-out">
                        <div className="w-full lg:w-[45%] sticky top-24">
                            <Composer
                                onGenerate={handleGenerate}
                                isLoading={isLoading}
                                initialPrompt={promptOverride}
                            />
                        </div>
                        <div className="w-full lg:w-[55%]">
                            <OutputDisplay
                                email={email}
                                isLoading={isLoading}
                                onRegenerate={handleRegenerate}
                                onProceed={(body) => {
                                    setDraftText(body);
                                    setMode('subject');
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Pull Email Mode */}
                {mode === 'pull' && (
                    <>
                        {selectedProfessor && (
                            <div className="mb-4 flex items-center gap-3 max-w-3xl mx-auto">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <div
                                        className="flex items-center justify-center"
                                        style={{
                                            width: '28px', height: '28px', borderRadius: '8px',
                                            backgroundColor: '#f3f4f6', color: '#374151',
                                            fontSize: '13px', fontWeight: 600,
                                        }}
                                    >
                                        {selectedProfessor.name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {selectedProfessor.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {selectedProfessor.email}
                                    </span>
                                </div>
                                <button
                                    onClick={() => { setMode('chat'); setSelectedProfessor(null); }}
                                    className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
                                >
                                    ← Back
                                </button>
                            </div>
                        )}
                        {selectedProfessor ? (
                            <PullEmail
                                selectedProfessor={selectedProfessor}
                                provider={authProvider || (outlookAccessToken ? 'outlook' : 'gmail')}
                                onExit={() => setMode('chat')}
                                onGenerateReply={handlePullEmailReply}
                                navigate={navigate}
                            />
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
                                    Please select a professor first
                                </p>
                                <button
                                    onClick={() => setMode('chat')}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Go Back
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Subject Creation Mode */}
                {mode === 'subject' && (
                    <div className="flex flex-col pb-24">
                        <SubjectSelectionPanel
                            generatedDraft={draftText}
                            selectedProfessor={chatContext
                                ? { name: chatContext.professorName || 'Recipient', email: chatContext.recipientEmail }
                                : selectedProfessor}
                            onSelect={handleSubjectSelected}
                            onBack={() => { setMode('chat'); setChatContext(null); }}
                        />
                    </div>
                )}

                {/* Chat Send Preview - uses shared EmailFinalReview (same as Pull Email) */}
                {mode === 'chat_send_preview' && chatContext && (
                    <div className="flex flex-col pb-24">
                        <EmailFinalReview
                            artifact={chatDraftToArtifact({
                                draftBody: draftText,
                                selectedSubject: draftSubject,
                                chatContext,
                                provider: authProvider || 'gmail'
                            })}
                            onSuccess={() => {
                                setMode('chat');
                                setChatContext(null);
                                setDraftText('');
                                setDraftSubject('');
                            }}
                            onCancel={() => {
                                setMode('chat');
                                setChatContext(null);
                            }}
                        />
                    </div>
                )}

                {/* Subject mode Send Preview - same EmailFinalReview; user fills To */}
                {mode === 'subject_send_preview' && (
                    <div className="flex flex-col pb-24">
                        <EmailFinalReview
                            artifact={{
                                provider: authProvider || 'gmail',
                                mode: 'new',
                                to: [],
                                subject: draftSubject || '',
                                body: draftText || ''
                            }}
                            onSuccess={() => {
                                setMode('chat');
                                setDraftText('');
                                setDraftSubject('');
                            }}
                            onCancel={() => setMode('subject')}
                        />
                    </div>
                )}



                {/* Chat Mode */}
                {mode === 'chat' && (
                    <div className="h-full relative isolate" style={{ overscrollBehavior: 'none' }}>
                        <ChatInterface
                            onDraftEmail={handleChatDraft}
                            jwtToken={jwtToken}
                            onModeChange={setMode}
                            onProfessorSelect={handleProfessorSelect}
                            provider={authProvider || 'gmail'}
                            onMessagesChange={(msgs) => {
                                setHasChatMessages(msgs.length > 0);
                                // ✅ Signal to App.jsx/Header via storage for logo fade
                                if (msgs.length > 0) {
                                    localStorage.setItem('llp_chat_active', 'true');
                                    window.dispatchEvent(new Event('storage'));
                                } else {
                                    localStorage.removeItem('llp_chat_active');
                                    window.dispatchEvent(new Event('storage'));
                                }
                            }}
                        />
                    </div>
                )}
            </div>
        </div >
    );
};

export default ComposePage;
