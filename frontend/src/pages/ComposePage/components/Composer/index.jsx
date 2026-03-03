import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    Add,
    AttachFile,
    Close,
    Email,
    Subject,
    Send,
    ExpandMore,
    Check,
    ChatBubbleOutline,
} from '@mui/icons-material';
import ProfessorSelectorModal from '../ProfessorSelectorModal';

/**
 * Composer – ChatGPT-style prompt box
 * Pure gray palette, no blue.
 */

/* ──────────── helpers ──────────── */
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const cx = (...c) => c.filter(Boolean).join(' ');

/* inline style object — glass chip spec, no black */
const glassBase = {
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '13px',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    transition: 'all 0.18s ease',
    border: '1px solid rgba(255,255,255,0.40)',
    boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
    color: 'rgba(15,23,42,0.88)',
};
const glassActive = {
    ...glassBase,
    backgroundColor: 'rgba(59,130,246,0.14)',
    border: '1px solid rgba(59,130,246,0.28)',
    boxShadow: '0 10px 30px rgba(15,23,42,0.08), 0 10px 28px rgba(59,130,246,0.14)',
    color: 'rgba(15,23,42,0.88)',
};
const S = {
    pill: { ...glassActive },
    pillLight: { ...glassBase, backgroundColor: 'rgba(255,255,255,0.55)' },
    clearBtn: { padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', color: '#374151' },
    iconBtn: { width: '40px', height: '40px', borderRadius: '9999px', color: '#6b7280' },
    xBtn: { marginLeft: '4px', width: '16px', height: '16px', borderRadius: '9999px', color: 'inherit' },
    closeChip: { marginLeft: '4px', width: '20px', height: '20px', borderRadius: '9999px', color: '#6b7280' },
    menuItem: { width: '100%', padding: '12px 16px', textAlign: 'left', color: 'rgba(15,23,42,0.88)' },
    sendActive: { width: '40px', height: '40px', borderRadius: '9999px', backgroundColor: 'rgba(59,130,246,0.9)', color: '#fff', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,130,246,0.25)' },
    sendDisabled: { width: '40px', height: '40px', borderRadius: '9999px', backgroundColor: '#e5e7eb', color: '#6b7280', cursor: 'not-allowed' },
};

const MODE_DEFS = [
    { id: 'chat', label: 'Chat', icon: ChatBubbleOutline, hint: 'Build context via chat.' },
    { id: 'compose', label: 'Compose', icon: Add, hint: 'Write an email from scratch.' },
    { id: 'pull', label: 'Pull Email', icon: Email, hint: 'Pull + summarize a thread.' },
    { id: 'subject', label: 'Subject', icon: Subject, hint: 'Generate subject lines.' },
];

/* ──────────── hooks ──────────── */
function useOutsideClick(ref, handler, enabled = true) {
    useEffect(() => {
        if (!enabled) return;
        const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) handler?.(e); };
        window.addEventListener('mousedown', fn);
        return () => window.removeEventListener('mousedown', fn);
    }, [ref, handler, enabled]);
}

/* ──────────── sub-components ──────────── */
function AutosizeTextarea({ value, onChange, onKeyDown, placeholder, minRows = 1, maxRows = 7, className }) {
    const ref = useRef(null);
    const resize = () => {
        const el = ref.current;
        if (!el) return;
        el.style.height = '0px';
        const cs = window.getComputedStyle(el);
        const lh = parseFloat(cs.lineHeight || '20');
        const pt = parseFloat(cs.paddingTop || '0');
        const pb = parseFloat(cs.paddingBottom || '0');
        const bt = parseFloat(cs.borderTopWidth || '0');
        const bb = parseFloat(cs.borderBottomWidth || '0');
        const rows = clamp(Math.ceil((el.scrollHeight - pt - pb) / lh), minRows, maxRows);
        el.style.height = `${rows * lh + pt + pb + bt + bb}px`;
    };
    useEffect(() => { resize(); }, [value]);
    return (
        <textarea
            ref={ref}
            rows={minRows}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className={className}
            style={{ resize: 'none', overflow: 'hidden' }}
        />
    );
}

function GrayMenu({ open, anchorRef, children }) {
    const [pos, setPos] = useState({ left: 0, bottom: 0 });
    useEffect(() => {
        if (!open) return;
        const el = anchorRef?.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setPos({ left: r.left, bottom: window.innerHeight - r.top + 8 });
    }, [open, anchorRef]);
    if (!open) return null;
    return (
        <div className="fixed z-[9999]" style={{ left: pos.left, bottom: pos.bottom }}>
            {children}
        </div>
    );
}

/* ──────────── main component ──────────── */
const Composer = ({ onGenerate, isLoading = false, currentMode = 'chat', onModeChange, onProfessorSelect, promptOverride, onTextChange, initialBody = '', initialSubject = '', disabled = false }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const barBg = isDark ? 'rgba(17,24,39,0.9)' : 'rgba(255,255,255,0.92)';
    const barBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.08)';

    const [text, setText] = useState(initialBody);
    const [toolsOpen, setToolsOpen] = useState(false);
    const [profModalOpen, setProfModalOpen] = useState(false);
    const [attachments, setAttachments] = useState([]);

    // Handle external prompt updates
    useEffect(() => {
        if (promptOverride) setText(promptOverride);
    }, [promptOverride]);

    // Handle initial body updates
    useEffect(() => {
        if (initialBody) setText(initialBody);
    }, [initialBody]);

    const toolsBtnRef = useRef(null);
    const toolsMenuRef = useRef(null);

    useOutsideClick(toolsMenuRef, () => setToolsOpen(false), toolsOpen);

    const selectedMode = useMemo(() => MODE_DEFS.find((m) => m.id === currentMode) || MODE_DEFS[0], [currentMode]);
    const canSend = text.trim().length > 0 && !isLoading && !disabled;

    const removeAttachment = (id) => setAttachments((prev) => prev.filter((a) => a.id !== id));

    const send = () => {
        const content = text.trim();
        if (!content || isLoading) return;
        onGenerate?.(content);
        setText('');
        setAttachments([]);
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    };

    const scopedCSS = `
.cc-scope button, .cc-scope a.button-primary {
  background-image: none !important;
  background-color: transparent;
  box-shadow: none !important;
  color: inherit;
  padding: 0;
  font-weight: normal;
  font-size: inherit;
  border-radius: 0;
}
.cc-scope button:hover, .cc-scope a.button-primary:hover {
  background-image: none !important;
  box-shadow: none !important;
}
.cc-chip-pill:hover, .cc-chip-light:hover {
  background-color: rgba(255,255,255,0.62) !important;
}
.cc-chip-pill.cc-chip-active:hover {
  background-color: rgba(59,130,246,0.20) !important;
}
.cc-chip-pill:focus-visible, .cc-chip-light:focus-visible {
  outline: 2px solid rgba(59,130,246,0.5);
  outline-offset: 2px;
}
.dark .cc-scope .cc-chip-pill, .dark .cc-scope .cc-chip-light {
  color: rgba(249,250,251,0.9);
  border-color: rgba(255,255,255,0.12);
}
.dark .cc-scope .cc-chip-pill {
  background-color: rgba(59,130,246,0.18) !important;
  border-color: rgba(59,130,246,0.35) !important;
}
.dark .cc-scope .cc-chip-light {
  background-color: rgba(255,255,255,0.08) !important;
}
.dark .cc-scope .cc-chip-light:hover {
  background-color: rgba(255,255,255,0.12) !important;
}
.dark .cc-scope .cc-chip-pill.cc-chip-active:hover {
  background-color: rgba(59,130,246,0.24) !important;
}
@media (prefers-color-scheme: dark) {
  .cc-scope .cc-chip-pill, .cc-scope .cc-chip-light {
    color: rgba(249,250,251,0.9);
    border-color: rgba(255,255,255,0.12);
  }
  .cc-scope .cc-chip-pill {
    background-color: rgba(59,130,246,0.18) !important;
    border-color: rgba(59,130,246,0.35) !important;
  }
  .cc-scope .cc-chip-light {
    background-color: rgba(255,255,255,0.08) !important;
  }
  .cc-scope .cc-chip-light:hover {
    background-color: rgba(255,255,255,0.12) !important;
  }
  .cc-scope .cc-chip-pill.cc-chip-active:hover {
    background-color: rgba(59,130,246,0.24) !important;
  }
}`;

    return (
        <>
            <style>{scopedCSS}</style>

            <div
                className="cc-scope"
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    background: barBg,
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderTop: `1px solid ${barBorder}`,
                }}
            >
                <div className="max-w-3xl mx-auto px-4 py-4">
                    {/* ── Mode pills row ── */}
                    <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                            {/* Mode Pill — click to reopen menu */}
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={() => { setToolsOpen(true); }}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setToolsOpen(true); } }}
                                className="cc-chip-pill cc-chip-active inline-flex items-center gap-2 select-none cursor-pointer"
                                style={S.pill}
                            >
                                {(() => { const Icon = selectedMode.icon; return <Icon sx={{ fontSize: 16 }} />; })()}
                                {selectedMode.label}
                                {/* X to reset to Chat */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); onModeChange?.('chat'); }}
                                    className="flex items-center justify-center transition-colors"
                                    style={S.xBtn}
                                    title="Reset to Chat"
                                >
                                    <Close sx={{ fontSize: 12 }} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Composer container ── */}
                    <div className="rounded-3xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                        <div className="flex items-center gap-2 px-3 py-2.5">
                            {/* + Tools button */}
                            <button
                                ref={toolsBtnRef}
                                onClick={() => { setToolsOpen((v) => !v); }}
                                className="flex items-center justify-center transition-colors"
                                style={S.iconBtn}
                            >
                                <Add sx={{ fontSize: 22 }} />
                            </button>

                            {/* Textarea section */}
                            <div className="flex-1">
                                {attachments.length > 0 && (
                                    <div className="flex flex-wrap gap-2 px-2 pb-2">
                                        {attachments.map((a) => (
                                            <span
                                                key={a.id}
                                                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
                                            >
                                                <AttachFile sx={{ fontSize: 16 }} />
                                                {a.name}
                                                <button
                                                    onClick={() => removeAttachment(a.id)}
                                                    className="flex items-center justify-center transition-colors"
                                                    style={S.closeChip}
                                                >
                                                    <Close sx={{ fontSize: 14 }} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <AutosizeTextarea
                                    value={text}
                                    onChange={(e) => {
                                        setText(e.target.value);
                                        onTextChange?.(e.target.value);
                                    }}
                                    onKeyDown={onKeyDown}
                                    placeholder="Describe what you want to write..."
                                    minRows={1}
                                    maxRows={7}
                                    className={cx(
                                        'w-full bg-transparent outline-none border-0',
                                        'text-[15px] leading-6',
                                        'px-2 py-2',
                                        'placeholder-gray-500 dark:placeholder-gray-400'
                                    )}
                                />
                            </div>

                            {/* Right actions */}
                            <div className="flex items-center gap-1 pb-1">
                                <button
                                    onClick={send}
                                    disabled={!canSend}
                                    className="flex items-center justify-center transition-colors"
                                    style={canSend ? S.sendActive : S.sendDisabled}
                                >
                                    <Send sx={{ fontSize: 18 }} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Tools Menu popup ── */}
                    <GrayMenu open={toolsOpen} anchorRef={toolsBtnRef}>
                        <div
                            ref={toolsMenuRef}
                            className="w-[320px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl"
                        >
                            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                                <div className="text-sm font-medium" style={{ color: 'rgba(15,23,42,0.88)' }}>Tools</div>
                                <div className="text-xs" style={{ color: '#6b7280' }}>Pick a mode</div>
                            </div>

                            {MODE_DEFS.map((m) => {
                                const Icon = m.icon;
                                const active = m.id === currentMode;
                                return (
                                    <button
                                        key={m.id}
                                        onClick={() => {
                                            setToolsOpen(false);
                                            if (m.id === 'pull') {
                                                setProfModalOpen(true);
                                            } else {
                                                onModeChange?.(m.id);
                                            }
                                        }}
                                        className="flex items-start gap-3 transition-colors"
                                        style={S.menuItem}
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                    >
                                        <div style={{ paddingTop: '2px' }}>
                                            <Icon sx={{ fontSize: 20, color: '#374151' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div className="flex items-center justify-between gap-2">
                                                <div style={{ fontSize: '14px', color: 'rgba(15,23,42,0.88)' }}>{m.label}</div>
                                                {active && <Check sx={{ fontSize: 18, color: 'rgba(15,23,42,0.88)' }} />}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{m.hint}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </GrayMenu>
                </div>

                {/* Professor Selector Modal */}
                <ProfessorSelectorModal
                    open={profModalOpen}
                    onClose={() => setProfModalOpen(false)}
                    onSelect={(prof) => {
                        setProfModalOpen(false);
                        onModeChange?.('pull');
                        onProfessorSelect?.(prof);
                    }}
                />
            </div>
        </>
    );
};

export default Composer;
