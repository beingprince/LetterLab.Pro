import { useState, useCallback } from 'react';

/**
 * Pull Email State Machine
 * 
 * Manages the wizard flow for Pull Email feature.
 * States are linear but allow back navigation.
 */

export const PullEmailStates = {
    LOADING_SUBJECTS: "loading_subjects",
    PICK_THREAD: "pick_thread",
    LOADING_ANALYSIS: "loading_analysis",
    SHOW_SUMMARY: "show_summary",
    ENTER_PROMPT: "enter_prompt",
    LOADING_DRAFT: "loading_draft",
    SHOW_DRAFT: "show_draft",
    SEND_DECISION: "send_decision", // New: Reply vs New Email
    SUBJECT_SELECTION: "subject_selection", // New: Choose subject for new email
    FINAL_PREVIEW: "final_preview", // New: Review before sending
    SENDING: "sending", // New: Sending in progress
    SUCCESS: "success" // New: Done
};

// State transition map for back navigation
const STATE_FLOW = [
    PullEmailStates.LOADING_SUBJECTS,
    PullEmailStates.PICK_THREAD,
    PullEmailStates.LOADING_ANALYSIS,
    PullEmailStates.SHOW_SUMMARY,
    PullEmailStates.ENTER_PROMPT,
    PullEmailStates.LOADING_DRAFT,
    PullEmailStates.SHOW_DRAFT,
    PullEmailStates.SEND_DECISION,
    PullEmailStates.SUBJECT_SELECTION,
    PullEmailStates.FINAL_PREVIEW,
    PullEmailStates.SENDING,
    PullEmailStates.SUCCESS
];

export const usePullEmailState = () => {
    const [currentState, setCurrentState] = useState(PullEmailStates.LOADING_SUBJECTS);
    const [stateData, setStateData] = useState({
        selectedProfessor: null, // Passed from ProfessorSelectorModal
        threads: [],
        selectedThread: null,
        threadAnalysis: null,
        userPrompt: '',
        generatedDraft: null,
        provider: 'gmail', // 'gmail' | 'outlook'
        sendMode: 'reply', // 'reply' | 'new'
        selectedSubject: '', // For new email
        finalBody: '', // Final editable body
        finalTo: '' // Final recipient
    });

    // Navigate to next state
    const goToNextState = useCallback(() => {
        const currentIndex = STATE_FLOW.indexOf(currentState);
        if (currentIndex < STATE_FLOW.length - 1) {
            setCurrentState(STATE_FLOW[currentIndex + 1]);
        }
    }, [currentState]);

    // Navigate to previous state
    const goToPreviousState = useCallback(() => {
        const currentIndex = STATE_FLOW.indexOf(currentState);
        if (currentIndex > 0) {
            // Skip loading states when going back
            let prevIndex = currentIndex - 1;
            while (prevIndex > 0 && STATE_FLOW[prevIndex].includes('LOADING')) {
                prevIndex--;
            }
            setCurrentState(STATE_FLOW[prevIndex]);
        }
    }, [currentState]);

    // Jump to specific state
    const goToState = useCallback((state) => {
        // Allow jumping even if not strictly linear for complex flows like Decision -> Preview skipping Subject
        setCurrentState(state);
    }, []);

    // Update state data
    const updateStateData = useCallback((updates) => {
        setStateData(prev => ({ ...prev, ...updates }));
    }, []);

    // Reset wizard
    const reset = useCallback(() => {
        setCurrentState(PullEmailStates.LOADING_SUBJECTS);
        setStateData({
            selectedProfessor: null,
            threads: [],
            selectedThread: null,
            threadAnalysis: null,
            userPrompt: '',
            generatedDraft: null,
            provider: 'gmail',
            sendMode: 'reply',
            selectedSubject: '',
            finalBody: '',
            finalTo: ''
        });
    }, []);

    // Get current step number (for progress indicator)
    const getCurrentStep = useCallback(() => {
        // Only count non-loading states
        const nonLoadingStates = STATE_FLOW.filter(s => !s.includes('LOADING') && s !== PullEmailStates.SUCCESS && s !== PullEmailStates.SENDING);
        const currentNonLoadingIndex = nonLoadingStates.indexOf(currentState);

        // Cap progress at max steps if we are in sending/success
        if (currentState === PullEmailStates.SUCCESS) return { current: nonLoadingStates.length, total: nonLoadingStates.length };

        return {
            current: currentNonLoadingIndex >= 0 ? currentNonLoadingIndex + 1 : 1,
            total: nonLoadingStates.length
        };
    }, [currentState]);

    // Check if can go back
    const canGoBack = STATE_FLOW.indexOf(currentState) > 0 && currentState !== PullEmailStates.SUCCESS && currentState !== PullEmailStates.SENDING;

    return {
        currentState,
        stateData,
        goToNextState,
        goToPreviousState,
        goToState,
        updateStateData,
        reset,
        getCurrentStep,
        canGoBack
    };
};
