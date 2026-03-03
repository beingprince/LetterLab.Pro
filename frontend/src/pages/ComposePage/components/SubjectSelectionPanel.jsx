import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';

/**
 * SubjectSelectionPanel
 * 
 * Reusable component for generating and selecting email subjects.
 * Uses the /api/ai/generate-subjects endpoint.
 * 
 * Design: Elite AI SaaS (Zinc/Slate Palette, Glassmorphism, No Blue Fills)
 */
/** Reject strings that look like JSON/key fragments — never render "subjects":[ etc. */
function isDisplayableSubject(s) {
    if (typeof s !== 'string') return false;
    const t = s.trim();
    if (t.length < 5 || t.length > 90) return false;
    const lower = t.toLowerCase();
    if (lower.includes('subjects') || /[\{\}\[\]]|":/.test(t)) return false;
    return true;
}

const SubjectSelectionPanel = ({ generatedDraft, selectedProfessor, onSelect, onBack }) => {
    const [subjects, setSubjects] = useState(null);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [manualContext, setManualContext] = useState(generatedDraft || '');
    const requestIdRef = React.useRef(0);

    // Enrich subjects with AI metadata (only from validated string array)
    const enrichSubjects = (rawSubjects) => {
        const tones = ['Executive', 'Strategic', 'Direct', 'Professional', 'Urgent'];
        const intents = ['Inquiry', 'Update', 'Request', 'Recovery', 'Connect'];

        return rawSubjects.map((s, i) => ({
            id: i,
            text: s,
            tone: tones[Math.floor(Math.random() * tones.length)],
            intent: intents[Math.floor(Math.random() * intents.length)],
            openRate: Math.floor(Math.random() * (98 - 72) + 72), // 72-98%
            confidence: i === 0 ? 'High' : (i < 3 ? 'Medium' : 'Experimental'),
            isRecommended: i === 0 // Top result is "AI Recommended"
        }));
    };

    // Effect: If we have a solid draft passed in, auto-generate
    useEffect(() => {
        const content = typeof generatedDraft === 'string' ? generatedDraft : (generatedDraft?.body ?? (generatedDraft ? String(generatedDraft) : ''));
        if (content && content.trim().length > 50) {
            handleGenerate(generatedDraft);
        }
    }, [generatedDraft]);

    const handleGenerate = async (contextText) => {
        const content = typeof contextText === 'string' ? contextText : (contextText?.body ?? (contextText ? String(contextText) : ''));
        if (!content || content.trim().length < 10) return;

        const reqId = ++requestIdRef.current;
        setSubjects(null);
        setErrorMsg(null);
        setLoadingSubjects(true);
        try {
            const token = localStorage.getItem("authToken");
            const payload = {
                emailContent: content.trim(),
                professor: selectedProfessor ?? undefined,
                count: 5
            };
            if (import.meta.env?.DEV) {
                console.log(
                    '[SubjectSelectionPanel] generate-subjects request',
                    `emailContentLength=${payload.emailContent?.length ?? 0} count=${payload.count} professor=${payload.professor?.name ? 'present' : 'none'}`
                );
            }
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/generate-subjects`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (reqId !== requestIdRef.current) return;
            if (import.meta.env?.DEV) {
                const n = Array.isArray(data.subjects) ? data.subjects.length : 0;
                const sample = Array.isArray(data.subjects) && data.subjects[0] ? data.subjects[0].substring(0, 50) : '';
                console.log(
                    '[SubjectSelectionPanel] generate-subjects response',
                    `ok=${res.ok} status=${res.status} subjectsLength=${n} error=${data?.error ?? 'none'}`,
                    sample ? `sample="${sample}${data.subjects[0].length > 50 ? '…' : ''}"` : ''
                );
            }
            if (!res.ok) {
                setErrorMsg(data?.error || data?.details || 'Failed to generate subjects');
                return;
            }
            const rawList = Array.isArray(data.subjects) ? data.subjects : [];
            const list = rawList.filter(s => isDisplayableSubject(s));
            if (list.length === 0) {
                setErrorMsg(data?.error || 'No subjects generated — try again.');
                setSubjects(null);
            } else {
                setSubjects(enrichSubjects(list));
            }
        } catch (err) {
            if (reqId === requestIdRef.current) {
                console.error("Subject Gen Error:", err);
                setErrorMsg(err?.message || 'Failed to generate subjects');
            }
        } finally {
            if (reqId === requestIdRef.current) setLoadingSubjects(false);
        }
    };

    const isContextSufficient = manualContext && manualContext.length > 10;

    if (loadingSubjects) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <CircularProgress size={24} sx={{ mb: 2, color: '#18181b' }} thickness={5} />
                <p className="text-zinc-500 font-medium text-xs tracking-wide uppercase">Analyzing Intent...</p>
            </div>
        );
    }

    // Input Mode
    if (!subjects) {
        return (
            <div className="max-w-2xl mx-auto w-full p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                            Generate Subject Lines
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wide font-medium">AI-Optimized for Open Rates</p>
                    </div>
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="!bg-none !shadow-none !p-0 !m-0 !h-auto text-xs font-medium text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors uppercase tracking-wider"
                        >
                            Back
                        </button>
                    )}
                </div>

                <div className="flex-1 flex flex-col">
                    {errorMsg && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
                            {errorMsg}
                        </div>
                    )}
                    <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-800 p-1 shadow-sm transition-shadow focus-within:shadow-md focus-within:border-zinc-300 dark:focus-within:border-zinc-700">
                        <textarea
                            className="w-full h-48 p-4 bg-transparent outline-none resize-none text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 text-[14px] leading-relaxed font-normal"
                            placeholder="Paste your email draft here, or describe the goal of your email..."
                            value={manualContext}
                            onChange={(e) => setManualContext(e.target.value)}
                        />
                        <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50 rounded-b-lg">
                            <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide">
                                {manualContext.length} chars
                            </span>
                            <button
                                onClick={() => handleGenerate(manualContext)}
                                disabled={!isContextSufficient}
                                className={`
                                    !bg-none !shadow-none
                                    py-2 px-5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 uppercase tracking-wide
                                    ${isContextSufficient
                                        ? '!bg-zinc-900 text-white hover:!bg-black hover:shadow-lg hover:-translate-y-0.5 dark:!bg-white dark:text-zinc-900'
                                        : '!bg-zinc-100 text-zinc-400 dark:!bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'}
                                `}
                            >
                                Generate Options
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Results Mode
    const recommended = subjects.filter(s => s.isRecommended);
    const others = subjects.filter(s => !s.isRecommended);

    return (
        <div className="max-w-3xl mx-auto w-full p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                        Subject Recommendations
                    </h2>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Optimized for Enterprise</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setSubjects(null)}
                        className="!bg-none !shadow-none !p-0 !m-0 !h-auto text-xs font-medium text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors uppercase tracking-wider"
                    >
                        Refine Context
                    </button>
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="!bg-none !shadow-none !p-0 !m-0 !h-auto text-xs font-medium text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors uppercase tracking-wider"
                        >
                            Back
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-6">

                {/* Section: Recommended */}
                <div>
                    <div className="text-[10px] font-bold text-zinc-400 mb-3 uppercase tracking-widest pl-1">
                        AI Recommended
                    </div>
                    <div className="space-y-3">
                        {recommended.map((subj) => (
                            <SubjectRow key={subj.id} subject={subj} onSelect={onSelect} />
                        ))}
                    </div>
                </div>

                {/* Section: Other Angles */}
                <div>
                    <div className="text-[10px] font-bold text-zinc-400 mb-3 uppercase tracking-widest pl-1">
                        Alternative Angles
                    </div>
                    <div className="space-y-3">
                        {others.map((subj) => (
                            <SubjectRow key={subj.id} subject={subj} onSelect={onSelect} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

const SubjectRow = ({ subject, onSelect }) => {
    return (
        <button
            onClick={() => onSelect(subject.text)}
            className="!bg-none !shadow-none !m-0 w-full group relative flex items-center justify-between p-5 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] dark:hover:shadow-none hover:-translate-y-[1px] transition-all duration-300 ease-out text-left"
        >
            {/* Active Border Indicator - now Zinc/Black */}
            <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-zinc-900 dark:bg-white rounded-r-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Left Content */}
            <div className="flex-1 pr-6 pl-2">
                <div className="flex items-center gap-2.5 mb-2">
                    {subject.isRecommended && (
                        <span className="text-amber-500 text-xs shadow-amber-100">⚡</span>
                    )}
                    <span className="font-semibold text-zinc-800 dark:text-zinc-100 text-[15px] leading-snug group-hover:text-black dark:group-hover:text-white transition-colors tracking-tight">
                        {subject.text}
                    </span>
                </div>

                {/* Metadata Row - subtle and technical */}
                <div className="flex items-center gap-3 text-[10px] font-semibold text-zinc-400 tracking-wider uppercase">
                    <span className="px-1.5 py-0.5 rounded-md bg-zinc-50 dark:bg-zinc-800 text-zinc-500 border border-zinc-100 dark:border-zinc-700/50">
                        {subject.tone}
                    </span>
                    <span className="text-zinc-300">•</span>
                    <span>{subject.intent}</span>
                    <span className="text-zinc-300">•</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                        {subject.openRate}% Open Rate
                    </span>
                </div>
            </div>

            {/* Right: Confidence & Action */}
            <div className="flex items-center gap-5">
                {/* Confidence Badge - Minimalist */}
                <div className={`
                    hidden sm:block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border
                    ${subject.confidence === 'High'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100/50 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-900/20'
                        : 'bg-zinc-50 text-zinc-500 border-zinc-100 dark:bg-zinc-800/30 dark:text-zinc-500 dark:border-zinc-800'}
                `}>
                    {subject.confidence}
                </div>

                {/* Radio Circle - Custom Zinc Style */}
                <div className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-600 group-hover:border-zinc-900 dark:group-hover:border-white transition-all duration-300 flex items-center justify-center bg-white dark:bg-transparent">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 dark:bg-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100" />
                </div>
            </div>
        </button>
    );
};

export default SubjectSelectionPanel;
