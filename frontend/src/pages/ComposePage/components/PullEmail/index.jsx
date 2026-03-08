import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { usePullEmailState, PullEmailStates } from './hooks/usePullEmailState';
import { useFetchThreads } from './hooks/useFetchThreads';
import ThreadProcessingPanel from '../../../../components/progress/ThreadProcessingPanel';
import { useThreadProcessingProgress } from '../../../../hooks/useThreadProcessingProgress';
import ThreadListPanel from './ThreadListPanel';
import AnalysisProgressPanel from '../../../../components/progress/AnalysisProgressPanel';
import { useAnalysisProgress } from '../../../../hooks/useAnalysisProgress';
import SessionExpiredState from '../../../../components/session/SessionExpiredState';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import { TextField, Button, Box, CircularProgress } from '@mui/material';
import SummaryPage from '../../../SummaryPage/SummaryPage';

/**
 * PullEmail - Main Wizard Component
 * 
 * State-driven wizard for Pull Email feature.
 * Starts after professor is selected via ProfessorSelectorModal.
 * Flow: Loading → Pick Thread → Analysis → Summary → Prompt → Draft
 */

import SubjectSelectionPanel from '../SubjectSelectionPanel';
import EmailFinalReview from '../shared/EmailFinalReview';
import { pullStateToArtifact } from '../../adapters/emailDraftArtifact';

const PullEmail = ({ onExit, selectedProfessor, provider = 'gmail', onGenerateReply, navigate }) => {
    const applyGreetingAndSignature = ({ draftBody, recipientName, senderName, senderEmail }) => {
        let lines = draftBody.trim().split('\n');

        // 1. Strip any AI-generated greeting from the top (first non-empty line)
        const greetingPattern = /^(Dear|Hello|Hi|Greetings|Hey)\b/i;
        // Remove leading greeting line + any blank lines after it
        if (lines.length > 0 && greetingPattern.test(lines[0].trim())) {
            lines.shift(); // remove greeting line
            while (lines.length > 0 && lines[0].trim() === '') lines.shift(); // remove blank lines after
        }

        // 2. Strip any AI-generated closing/signature from the bottom
        const closings = ['best regards', 'sincerely', 'regards', 'thank you', 'kind regards', 'best,', 'yours truly', 'warm regards'];
        // Walk up from the end, remove closing block
        while (lines.length > 0) {
            const lastLine = lines[lines.length - 1].trim().toLowerCase();
            const isClosingOrName = closings.some(c => lastLine.startsWith(c)) || lastLine === '';
            if (isClosingOrName || (lines.length > 1 && closings.some(c => lines[lines.length - 2].trim().toLowerCase().startsWith(c)))) {
                lines.pop();
            } else {
                break;
            }
        }
        // Also strip the closing phrase line if it's left at the bottom
        while (lines.length > 0 && closings.some(c => lines[lines.length - 1].trim().toLowerCase().startsWith(c))) {
            lines.pop();
        }

        const bodyCore = lines.join('\n').trim();

        // 3. Inject correct greeting (recipient = professor)
        const firstName = recipientName ? recipientName.trim().split(' ')[0] : null;
        const greeting = firstName ? `Hello ${firstName},` : 'Hello,';

        // 4. Inject correct signature (sender = logged-in user)
        const sigName = senderName || 'LetterLab User';
        const sigEmail = senderEmail ? `\n${senderEmail}` : '';
        const signature = `Best regards,\n${sigName}${sigEmail}`;

        return `${greeting}\n\n${bodyCore}\n\n${signature}`;
    };

    const {
        currentState,
        stateData,
        goToNextState,
        goToPreviousState,
        goToState, // ✅ Added missing destructuring
        updateStateData,
        reset,
        getCurrentStep,
        canGoBack
    } = usePullEmailState();

    const { current, total } = getCurrentStep();

    const [threadRetryKey, setThreadRetryKey] = React.useState(0);
    const threadProgress = useThreadProcessingProgress(provider);
    const threadProgressRef = React.useRef(threadProgress);
    const hasFetchStartedRef = React.useRef(false);
    threadProgressRef.current = threadProgress;

    // Fetch threads when professor is selected
    const { threads, loading: threadsLoading, error: threadsError, isAuthError } = useFetchThreads(
        selectedProfessor?.email,
        provider,
        threadRetryKey
    );

    const [sessionExpired, setSessionExpired] = React.useState(false);
    const [draftError, setDraftError] = React.useState(null); // Added for classified errors
    const analysisProgress = useAnalysisProgress();
    const progressRef = React.useRef(analysisProgress);
    progressRef.current = analysisProgress;

    // Initialize with selected professor and provider
    React.useEffect(() => {
        updateStateData({
            selectedProfessor,
            provider
        });
    }, [selectedProfessor, provider, updateStateData]);

    // Update threads in state when fetched
    React.useEffect(() => {
        if (threads.length > 0) {
            updateStateData({ threads });
        }
    }, [threads, updateStateData]);

    // Handle exit
    const handleExit = () => {
        reset();
        onExit?.();
    };

    // Handle thread selection
    const handleSelectThread = (thread) => {
        updateStateData({ selectedThread: thread });
        goToNextState(); // Move to LOADING_ANALYSIS
    };

    const [analysisRetryKey, setAnalysisRetryKey] = React.useState(0);

    // Run analysis when entering LOADING_ANALYSIS
    React.useEffect(() => {
        if (currentState !== PullEmailStates.LOADING_ANALYSIS || !stateData.selectedThread) return;

        let timeoutId = null;
        const threadId = stateData.selectedThread.id;
        const runAnalysis = async () => {
            const { startStep, finishStep, failStep, addLog, complete } = progressRef.current;
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem("authToken");

            if (!token) {
                failStep("session", "Session expired. Please sign in again.");
                return;
            }

            const stripHtml = (html) => {
                const temp = document.createElement('div');
                temp.innerHTML = html || '';
                return (temp.textContent || temp.innerText || "").substring(0, 15000);
            };

            try {
                startStep("session");
                addLog("info", "Starting analysis");
                finishStep("session", "ok");

                startStep("fetch_threads");
                const endpoint = provider === 'outlook'
                    ? `/api/outlook/threads/${threadId}`
                    : `/api/gmail/threads/${threadId}`;
                addLog("info", `Fetching thread ${provider}`);
                const threadRes = await fetch(`${apiBase}${endpoint}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (threadRes.status === 401) {
                    try {
                        window.dispatchEvent(new Event("llp_session_expired"));
                    } catch (_) { }
                    failStep("fetch_threads", "Session expired. Please sign in again.");
                    return;
                }
                if (!threadRes.ok) {
                    addLog("error", `HTTP ${threadRes.status}`);
                    failStep("fetch_threads", "Failed to fetch thread");
                    return;
                }
                const threadData = await threadRes.json();
                finishStep("fetch_threads", `${(threadData.messages?.length || 0)} messages`);

                startStep("extract_context");
                const simplifiedMessages = (threadData.messages || []).map(msg => ({
                    ...msg,
                    body: stripHtml(msg.body)
                }));
                addLog("info", "Context extracted");
                finishStep("extract_context", "ok");

                startStep("summarize");
                addLog("info", "AI analysis");
                const aiRes = await fetch(`${apiBase}/api/ai/analyze-thread-structured`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ threadContent: simplifiedMessages })
                });
                if (aiRes.status === 401) {
                    try {
                        window.dispatchEvent(new Event("llp_session_expired"));
                    } catch (_) { }
                    failStep("summarize", "Session expired. Please sign in again.");
                    return;
                }
                if (!aiRes.ok) {
                    addLog("error", `AI HTTP ${aiRes.status}`);
                    failStep("summarize", "AI analysis failed");
                    return;
                }
                const aiData = await aiRes.json();
                finishStep("summarize", "done");

                startStep("format_output");
                const firstMsg = threadData.messages[0] || {};
                const lastMsg = threadData.messages[threadData.messages.length - 1] || firstMsg;
                const fromStr = firstMsg.from || "";
                const fromName = fromStr.includes('<') ? fromStr.split('<')[0].trim().replace(/"/g, '') : fromStr;
                const fromEmail = fromStr.match(/<(.+)>/)?.[1] || fromStr;
                const realData = {
                    ...aiData,
                    threadId,
                    subject: firstMsg.subject,
                    from: { name: fromName, email: fromEmail },
                    date: new Date(lastMsg.date || 0).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    cc: [],
                    rawMessages: threadData.messages
                };
                addLog("info", "Complete");
                finishStep("format_output", "ok");
                complete();

                updateStateData({ threadAnalysis: realData });
                timeoutId = setTimeout(() => goToNextState(), 350);
            } catch (err) {
                addLog("error", err?.message || "Unknown error");
                failStep("format_output", err?.message || "Analysis failed");
            }
        };

        runAnalysis();
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [currentState, stateData.selectedThread?.id, provider, updateStateData, goToNextState, analysisRetryKey]);

    const handleAnalysisRetry = () => {
        analysisProgress.reset();
        setAnalysisRetryKey((k) => k + 1);
    };

    // Drive thread processing progress from useFetchThreads
    React.useEffect(() => {
        if (currentState !== PullEmailStates.LOADING_SUBJECTS || !selectedProfessor) return;
        const p = threadProgressRef.current;
        p.startStep("session_check");
        p.addLog("info", "Validating session");
        p.finishStep("session_check", "ok");
        p.startStep("fetch_thread");
        p.addLog("info", `Connecting to ${p.providerLabel}…`);
    }, [currentState, selectedProfessor, threadRetryKey]);

    React.useEffect(() => {
        if (currentState !== PullEmailStates.LOADING_SUBJECTS) {
            hasFetchStartedRef.current = false;
            return;
        }
        if (threadsLoading) hasFetchStartedRef.current = true;
    }, [currentState, threadsLoading]);

    React.useEffect(() => {
        if (currentState !== PullEmailStates.LOADING_SUBJECTS || threadsLoading) return;
        if (!hasFetchStartedRef.current) return; // Skip until fetch has actually run (threadsLoading was true at least once)
        const p = threadProgressRef.current;
        if (isAuthError) {
            p.failStep("fetch_thread", "Session expired. Please sign in again.", true);
        } else if (threadsError) {
            p.failStep("fetch_thread", threadsError);
        } else {
            p.finishStep("fetch_thread", `${threads.length} threads`);
            p.complete();
        }
    }, [currentState, threadsLoading, isAuthError, threadsError, threads.length]);

    React.useEffect(() => {
        if (currentState !== PullEmailStates.LOADING_SUBJECTS || threadProgress.state !== "success") return;
        const t = setTimeout(() => goToNextState(), 350);
        return () => clearTimeout(t);
    }, [currentState, threadProgress.state, goToNextState]);

    const handleThreadRetry = () => {
        threadProgress.reset();
        setThreadRetryKey((k) => k + 1);
    };

    // Auto-trigger Draft Generation when entering LOADING_DRAFT
    React.useEffect(() => {
        if (currentState === PullEmailStates.LOADING_DRAFT) {
            const generateDraft = async () => {
                try {
                    const token = localStorage.getItem("authToken");
                    // Prepare context
                    const context = stateData.threadAnalysis?.rawMessages
                        ? JSON.stringify(stateData.threadAnalysis.rawMessages)
                        : `Summary: ${stateData.threadAnalysis?.threadSummary}\nKey Points: ${stateData.threadAnalysis?.keyPoints?.join('\n')}`;

                    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/generate-reply`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            userInput: stateData.userPrompt,
                            context: context,
                            professor: stateData.selectedProfessor,
                            threads: []
                        })
                    });

                    if (res.status === 401) {
                        setSessionExpired(true);
                        return;
                    }
                    if (!res.ok) throw new Error("Failed to generate draft");
                    let data;
                    try {
                        data = await res.json();
                    } catch {
                        throw new Error("Invalid response from server");
                    }

                    // Apply Greeting and Signature (Surgical Injection)
                    const userStr = localStorage.getItem("letterlab_user");
                    const user = userStr ? JSON.parse(userStr) : {};

                    const finalBody = applyGreetingAndSignature({
                        draftBody: data.draft,
                        recipientName: stateData.selectedProfessor?.name,
                        senderName: user.name || user.displayName,
                        senderEmail: user.email
                    });

                    updateStateData({ generatedDraft: finalBody });
                    goToNextState(); // Move to SHOW_DRAFT

                } catch (err) {
                    if (!sessionExpired) {
                        let msg = "Draft generation failed. Please try again.";
                        if (err.message.includes("429") || err.message.includes("402")) {
                            msg = "Draft generation quota reached. Please try again later.";
                        } else if (err.message.includes("401")) {
                            msg = "Your session expired. Please sign in again.";
                        } else if (err.message.includes("fetch") || err.message.includes("Network")) {
                            msg = "Could not reach the server. Please check your connection.";
                        }
                        setDraftError(msg);
                    }
                }
            };
            setDraftError(null);
            generateDraft();
        }
    }, [currentState, stateData, updateStateData, goToNextState, goToPreviousState, sessionExpired]);

    // Auto-trigger Send when entering SENDING state
    React.useEffect(() => {
        if (currentState === PullEmailStates.SENDING) {
            const sendEmail = async () => {
                try {
                    console.log("🚀 Effect triggered: Starting sendEmail...");
                    const token = localStorage.getItem("authToken");
                    const endpoint = stateData.sendMode === 'reply'
                        ? `/api/${stateData.provider}/send/reply`
                        : `/api/${stateData.provider}/send/new`;

                    const payload = stateData.sendMode === 'reply'
                        ? {
                            threadId: stateData.selectedThread.id,
                            body: stateData.finalBody,
                            to: stateData.selectedProfessor.email,
                            subject: `Re: ${stateData.selectedThread.subject}`
                        }
                        : {
                            to: stateData.selectedProfessor.email,
                            subject: stateData.selectedSubject,
                            body: stateData.finalBody
                        };

                    console.log("📤 Sending payload to:", endpoint);
                    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${endpoint}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        body: JSON.stringify(payload)
                    });

                    if (res.status === 401) {
                        setSessionExpired(true);
                        return;
                    }
                    if (!res.ok) {
                        let errMsg = 'Failed to send email';
                        try {
                            const data = await res.json();
                            errMsg = data?.details ? `${data.error}: ${data.details}` : (data?.error || errMsg);
                        } catch (_) { }
                        throw new Error(errMsg);
                    }

                    console.log("✅ Email sent successfully! Transitioning to SUCCESS...");
                    goToState(PullEmailStates.SUCCESS);

                } catch (err) {
                    if (!sessionExpired) {
                        alert(err?.message || "Failed to send email. Please try again.");
                        goToPreviousState();
                    }
                }
            };
            sendEmail();
        }
    }, [currentState, stateData, goToState, goToPreviousState]);

    // Render current state content
    const renderStateContent = () => {
        switch (currentState) {
            case PullEmailStates.LOADING_SUBJECTS:
                return (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full px-4 pt-[100px] pb-8">
                        <ThreadProcessingPanel
                            title="System processing"
                            providerLabel={threadProgress.providerLabel}
                            percent={threadProgress.percent}
                            elapsedSeconds={threadProgress.elapsedSeconds}
                            steps={threadProgress.steps}
                            currentMessage={threadProgress.currentMessage}
                            streamLines={threadProgress.streamLines}
                            state={threadProgress.state}
                            errorMessage={threadProgress.errorMessage}
                            onRetry={handleThreadRetry}
                            onSignIn={() => navigate?.('/account')}
                        />
                    </div>
                );

            case PullEmailStates.PICK_THREAD:
                return (
                    <ThreadListPanel
                        threads={stateData.threads}
                        onSelectThread={handleSelectThread}
                        selectedProfessor={stateData.selectedProfessor}
                    />
                );

            case PullEmailStates.LOADING_ANALYSIS:
                return (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full px-4 pt-[100px] pb-8">
                        <AnalysisProgressPanel
                            title="Analyzing conversation"
                            providerLabel={provider === 'gmail' ? 'Gmail' : 'Outlook'}
                            percent={analysisProgress.percent}
                            etaSeconds={analysisProgress.etaSeconds}
                            elapsedSeconds={analysisProgress.elapsedSeconds}
                            steps={analysisProgress.steps}
                            detailsOpen={analysisProgress.detailsOpen}
                            onToggleDetails={analysisProgress.toggleDetails}
                            logs={analysisProgress.logs}
                            currentMessage={analysisProgress.currentMessage}
                            streamLines={analysisProgress.streamLines}
                            state={analysisProgress.state}
                            errorMessage={analysisProgress.errorMessage}
                            onRetry={handleAnalysisRetry}
                        />
                    </div>
                );

            case PullEmailStates.SHOW_SUMMARY:
                return (
                    <SummaryPage
                        threadId={stateData.selectedThread?.id}
                        isEmbedded={true}
                        provider={stateData.provider}
                        initialData={stateData.threadAnalysis}
                        onDraft={(data) => {
                            updateStateData({ threadAnalysis: data });
                            goToNextState();
                        }}
                    />
                );

            case PullEmailStates.ENTER_PROMPT:
                return (
                    <div className="flex flex-col h-full max-w-2xl mx-auto w-full p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Add Context
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Tell the AI how you want to reply. You can be brief.
                        </p>

                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            placeholder="e.g. Tell him I'll have the report ready by Tuesday, but I need clarification on the dataset."
                            value={stateData.userPrompt}
                            onChange={(e) => updateStateData({ userPrompt: e.target.value })}
                            variant="outlined"
                            sx={{
                                bgcolor: 'background.paper',
                                '& .MuiOutlinedInput-root': { borderRadius: 3 }
                            }}
                        />

                        <div className="mt-auto pt-6 flex justify-end">
                            <Button
                                variant="contained"
                                size="large"
                                onClick={goToNextState}
                                disabled={!stateData.userPrompt.trim()}
                                sx={{
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    px: 4,
                                    py: 1.5,
                                    bgcolor: '#2563EB',
                                    '&:hover': { bgcolor: '#1D4ED8' }
                                }}
                            >
                                Generate Reply
                            </Button>
                        </div>
                    </div>
                );

            case PullEmailStates.LOADING_DRAFT:
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        {draftError ? (
                            <div className="max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                                    <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Drafting failed
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                                    {draftError}
                                </p>
                                <div className="flex flex-col gap-3">
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={() => { setDraftError(null); goToState(PullEmailStates.LOADING_DRAFT); }}
                                        sx={{ borderRadius: 3, textTransform: 'none', py: 1.5, fontWeight: 700, bgcolor: '#2563EB' }}
                                    >
                                        Try Again
                                    </Button>
                                    <Button
                                        variant="text"
                                        fullWidth
                                        onClick={goToPreviousState}
                                        sx={{ borderRadius: 3, textTransform: 'none', color: 'text.secondary' }}
                                    >
                                        Back to Context
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <CircularProgress size={48} sx={{ color: '#2563EB', mb: 4 }} />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Drafting your reply...
                                </h3>
                                <p className="text-gray-500 max-w-sm">
                                    Analyzing the conversation history and your instructions to create the perfect response.
                                </p>
                            </>
                        )}
                    </div>
                );

            case PullEmailStates.SHOW_DRAFT:
                return (
                    <div className="flex flex-col h-full max-w-3xl mx-auto w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Review & Send
                            </h2>
                            <div className="flex gap-2">
                                <Button
                                    startIcon={<ContentCopyIcon />}
                                    onClick={() => navigator.clipboard.writeText(stateData.generatedDraft)}
                                    sx={{ textTransform: 'none', color: 'text.secondary' }}
                                >
                                    Copy
                                </Button>
                            </div>
                        </div>

                        {/* Editable Draft Area - "Edit Email" */}
                        <TextField
                            fullWidth
                            multiline
                            rows={12}
                            value={stateData.generatedDraft}
                            onChange={(e) => updateStateData({ generatedDraft: e.target.value })}
                            variant="outlined"
                            sx={{
                                flex: 1,
                                bgcolor: 'background.paper',
                                '& .MuiOutlinedInput-root': {
                                    height: '100%',
                                    alignItems: 'flex-start',
                                    borderRadius: 3,
                                    fontFamily: '"Outfit", sans-serif',
                                    fontSize: '1rem',
                                    lineHeight: 1.6
                                }
                            }}
                        />

                        <div className="mt-6 flex justify-end gap-3">
                            <Button
                                variant="outlined"
                                onClick={() => goToState(PullEmailStates.ENTER_PROMPT)}
                                sx={{ borderRadius: 2, textTransform: 'none' }}
                            >
                                Edit Context
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => goToNextState()} // To SEND_DECISION
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    px: 4,
                                    bgcolor: '#2563EB', // Primary action color
                                    '&:hover': { bgcolor: '#1D4ED8' }
                                }}
                            >
                                Send Email
                            </Button>
                        </div>
                    </div>
                );

            case PullEmailStates.SEND_DECISION:
                return (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-gray-100 dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                                Send this email
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
                                How would you like to send this message?
                            </p>

                            <div className="space-y-4">
                                {/* Option 1: Reply */}
                                <button
                                    onClick={() => {
                                        updateStateData({
                                            sendMode: 'reply',
                                            finalBody: stateData.generatedDraft, // Use current draft
                                            // Ensure subject stays same for reply, usually "Re: ..." handled by backend but good to know
                                        });
                                        goToState(PullEmailStates.FINAL_PREVIEW); // Skip subject selection
                                    }}
                                    className="w-full flex items-center p-4 rounded-xl border-2 border-transparent bg-blue-50 dark:bg-blue-900/20 hover:border-blue-500 transition-all group text-left"
                                >
                                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mr-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-700">
                                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Reply in Thread</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Reply to the existing conversation</p>
                                    </div>
                                </button>

                                {/* Option 2: New Email */}
                                <button
                                    onClick={() => {
                                        updateStateData({ sendMode: 'new' });
                                        goToNextState(); // To SUBJECT_SELECTION
                                    }}
                                    className="w-full flex items-center p-4 rounded-xl border-2 border-transparent bg-gray-50 dark:bg-gray-700/50 hover:border-gray-400 transition-all group text-left"
                                >
                                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-4 group-hover:bg-gray-300 dark:group-hover:bg-gray-500">
                                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Send as New Email</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Start a fresh conversation</p>
                                    </div>
                                </button>
                            </div>

                            <div className="mt-6 text-center">
                                <button onClick={goToPreviousState} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case PullEmailStates.SUBJECT_SELECTION:
                return (
                    <SubjectSelectionPanel
                        generatedDraft={stateData.generatedDraft}
                        selectedProfessor={stateData.selectedProfessor}
                        onSelect={(subj) => {
                            updateStateData({
                                selectedSubject: subj,
                                finalBody: stateData.generatedDraft
                            });
                            goToNextState(); // To FINAL_PREVIEW
                        }}
                        onBack={goToPreviousState}
                    />
                );

            case PullEmailStates.FINAL_PREVIEW:
                return (
                    <EmailFinalReview
                        artifact={pullStateToArtifact({ stateData, provider })}
                        onSuccess={handleExit}
                        onCancel={goToPreviousState}
                        successButtonText="Return to Dashboard"
                    />
                );

            case PullEmailStates.SENDING:
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <CircularProgress size={48} sx={{ color: '#2563EB', mb: 4 }} />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Sending your email...
                        </h3>
                    </div>
                );

            case PullEmailStates.SUCCESS:
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Email Sent Successfully!
                        </h3>
                        <p className="text-gray-500 mb-8">
                            Your message is on its way.
                        </p>
                        <Button
                            variant="outlined"
                            onClick={handleExit}
                            sx={{ borderRadius: 3, textTransform: 'none', px: 4 }}
                        >
                            Return to Dashboard
                        </Button>
                    </div>
                );

            default:
                return null;
        }
    };

    if (isAuthError || sessionExpired) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-900 overflow-hidden items-center justify-center p-4">
                <SessionExpiredState
                    message="Session expired. Please sign in again."
                    onSignIn={() => { window.location.href = '/account'; }}
                    onBackToHome={() => { onExit?.(); navigate?.('/'); }}
                />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div
                    className="max-w-7xl mx-auto px-4 pb-4"
                    style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 72px)' }}
                >
                    <div className="flex items-center justify-between">
                        {/* Left: Back button */}
                        <div className="flex items-center gap-3">
                            {canGoBack && (
                                <button
                                    onClick={goToPreviousState}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    aria-label="Go back"
                                >
                                    <ArrowBackIcon className="text-gray-600 dark:text-gray-400" />
                                </button>
                            )}
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Pull Email
                                </h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Step {current} of {total}
                                </p>
                            </div>
                        </div>

                        {/* Right: Provider badge + Exit */}
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                                {provider === 'gmail' ? 'Gmail' : 'Outlook'}
                            </span>
                            <button
                                onClick={handleExit}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                aria-label="Exit"
                            >
                                <CloseIcon className="text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${(current / total) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Area - Full Screen/Flex */}
            <div className="flex-1 overflow-hidden relative flex flex-col">
                <AnimatePresence mode="wait">
                    {renderStateContent()}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PullEmail;
