// FirstLoginNoticeModal.jsx
// Premium first-login onboarding notice modal for LetterLab.
// Shows once per device/browser after successful login, then never again.

import React, { useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'letterlab_first_login_notice_seen';

// ─────────────────────────────────────────────────────────────────────────────
// Inline styles (no Tailwind / MUI dependency — fully self-contained)
// ─────────────────────────────────────────────────────────────────────────────
const css = `
@keyframes llp-backdrop-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes llp-modal-in {
  from { opacity: 0; transform: translateY(12px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)   scale(1);    }
}

.llp-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(10, 18, 40, 0.42);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: llp-backdrop-in 220ms ease-out forwards;
}

.llp-modal {
  position: relative;
  width: 520px;
  max-width: calc(100vw - 48px);
  border-radius: 24px;
  padding: 32px 32px 28px 32px;
  background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFF 100%);
  border: 1px solid rgba(88, 112, 255, 0.10);
  box-shadow: 0 24px 80px rgba(26, 39, 86, 0.18);
  text-align: center;
  animation: llp-modal-in 260ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
  outline: none;
}

.llp-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 150ms ease;
  color: #667085;
}
.llp-close:hover {
  background: rgba(20, 28, 60, 0.06);
}
.llp-close:focus-visible {
  outline: 2px solid #4B63F3;
  outline-offset: 2px;
}

.llp-icon-wrap {
  width: 88px;
  height: 88px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(78,110,255,0.14), rgba(78,110,255,0.05));
  border: 1px solid rgba(78,110,255,0.10);
  box-shadow: 0 14px 34px rgba(78,110,255,0.14);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px auto;
}

.llp-title {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: #0F172A;
  margin: 0 0 16px 0;
  font-family: 'Outfit', system-ui, sans-serif;
}

.llp-body {
  font-size: 18px;
  line-height: 1.72;
  color: #475467;
  max-width: 420px;
  margin: 0 auto 14px auto;
  font-family: 'Outfit', system-ui, sans-serif;
}

.llp-support {
  font-size: 15px;
  font-weight: 500;
  color: #667085;
  margin: 0 0 28px 0;
  font-family: 'Outfit', system-ui, sans-serif;
}

.llp-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  min-width: 180px;
  padding: 0 26px;
  border-radius: 16px;
  background: linear-gradient(135deg, #4B63F3 0%, #3153F1 100%);
  color: #FFFFFF;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.01em;
  box-shadow: 0 12px 28px rgba(49, 83, 241, 0.26);
  border: none;
  cursor: pointer;
  transition: transform 150ms ease, box-shadow 150ms ease, opacity 150ms ease;
  font-family: 'Outfit', system-ui, sans-serif;
}
.llp-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 36px rgba(49, 83, 241, 0.34);
}
.llp-cta:active {
  transform: translateY(0);
  opacity: 0.92;
}
.llp-cta:focus-visible {
  outline: 2px solid #4B63F3;
  outline-offset: 3px;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .llp-modal {
    width: 460px;
    max-width: calc(100vw - 40px);
    border-radius: 22px;
    padding: 28px;
  }
  .llp-title  { font-size: 28px; }
  .llp-body   { font-size: 17px; }
  .llp-support { font-size: 14px; }
}

@media (max-width: 480px) {
  .llp-modal {
    width: calc(100vw - 32px);
    max-width: 360px;
    border-radius: 20px;
    padding: 24px 20px 22px 20px;
  }
  .llp-icon-wrap { width: 76px; height: 76px; }
  .llp-title  { font-size: 26px; }
  .llp-body   { font-size: 16px; }
}
`;

// ─────────────────────────────────────────────────────────────────────────────
// Icon — Info shield / email notice feeling
// ─────────────────────────────────────────────────────────────────────────────
function NoticeIcon() {
    return (
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
                fill="rgba(75,99,243,0.12)"
            />
            <path
                d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
                stroke="#4B63F3"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M12 8v4M12 16h.01"
                stroke="#4B63F3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function FirstLoginNoticeModal({ open, onClose }) {
    const modalRef = useRef(null);
    const previousFocusRef = useRef(null);

    // ── Focus trap ────────────────────────────────────────────────────────────
    const getFocusable = useCallback(() => {
        if (!modalRef.current) return [];
        return Array.from(
            modalRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
        ).filter((el) => !el.disabled);
    }, []);

    useEffect(() => {
        if (!open) return;

        // Save previously focused element
        previousFocusRef.current = document.activeElement;

        // Focus modal after paint
        const frame = requestAnimationFrame(() => {
            modalRef.current?.focus();
        });

        // ESC closes
        const onKeyDown = (e) => {
            if (e.key === 'Escape') { onClose(); return; }
            if (e.key === 'Tab') {
                const focusable = getFocusable();
                if (!focusable.length) { e.preventDefault(); return; }
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey) {
                    if (document.activeElement === first) { e.preventDefault(); last.focus(); }
                } else {
                    if (document.activeElement === last) { e.preventDefault(); first.focus(); }
                }
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            cancelAnimationFrame(frame);
            // Restore focus
            previousFocusRef.current?.focus();
        };
    }, [open, onClose, getFocusable]);

    if (!open) return null;

    return (
        <>
            {/* Inject styles once */}
            <style>{css}</style>

            {/* Backdrop */}
            <div
                className="llp-backdrop"
                role="presentation"
                onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            >
                {/* Modal */}
                <div
                    ref={modalRef}
                    className="llp-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="llp-title"
                    aria-describedby="llp-body"
                    tabIndex={-1}
                >
                    {/* Close button */}
                    <button
                        className="llp-close"
                        onClick={onClose}
                        aria-label="Dismiss notice"
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                            <path d="M13.5 4.5L4.5 13.5M4.5 4.5l9 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                        </svg>
                    </button>

                    {/* Icon */}
                    <div className="llp-icon-wrap" aria-hidden="true">
                        <NoticeIcon />
                    </div>

                    {/* Title */}
                    <h2 id="llp-title" className="llp-title">
                        Important sign-in notice
                    </h2>

                    {/* Body */}
                    <p id="llp-body" className="llp-body">
                        Dear User, some organizational or school-managed email accounts may not be supported yet.
                        For the best experience, please use LetterLab with your <strong>personal email account</strong>.
                    </p>

                    {/* Supporting line */}
                    <p className="llp-support">
                        We're actively expanding support for more email providers.
                    </p>

                    {/* CTA */}
                    <button className="llp-cta" onClick={onClose} autoFocus>
                        Got it
                    </button>
                </div>
            </div>
        </>
    );
}
