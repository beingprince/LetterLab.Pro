import React, { useState, useEffect } from "react";
// Force scroll to top before any render — prevents browser restoring a mid-page position
if (typeof window !== 'undefined') {
  if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}
import IntroSequence from "../components/intro/IntroSequence";

import HeroSection from "../components/hero/HeroSection";
import SectionEverything from "../components/EverythingSection";
import SectionSupporters from "../components/SectionSupporters";
import SectionTestimonials from "../components/testimonials";
import SectionFeatures from "../components/SectionFeatures";
import SectionFooter from "../components/footer/Footer";
import FirstLoginNoticeModal from "../components/FirstLoginNoticeModal";

// ─────────────────────────────────────────────────────────────────────────────
// Storage key — pre-login visitor notice
// ─────────────────────────────────────────────────────────────────────────────
const PRELOGIN_NOTICE_KEY = "letterlab_prelogin_notice_seen";

export default function HomePage() {
  // ── Intro sequence ──────────────────────────────────────────────────────
  const [introDone, setIntroDone] = useState(() => {
    return sessionStorage.getItem("hasSeenIntro") === "true";
  });

  const handleIntroComplete = () => {
    sessionStorage.setItem("hasSeenIntro", "true");
    setIntroDone(true);
  };

  // ── Pre-login notice modal ───────────────────────────────────────────────
  const [noticeOpen, setNoticeOpen] = useState(false);

  useEffect(() => {
    // Only trigger after the welcome animation completes
    if (!introDone) return;

    try {
      if (localStorage.getItem(PRELOGIN_NOTICE_KEY) === "true") return;
    } catch { /* ignore */ }

    // Wait 450ms after animation, then show
    const timer = setTimeout(() => setNoticeOpen(true), 450);
    return () => clearTimeout(timer);
  }, [introDone]);

  const handleCloseNotice = () => {
    try { localStorage.setItem(PRELOGIN_NOTICE_KEY, "true"); } catch { /* ignore */ }
    setNoticeOpen(false);
  };

  // ── Scroll to top on mount ───────────────────────────────────────────────
  React.useEffect(() => {
    document.documentElement.style.overflowAnchor = 'none';
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        document.documentElement.style.overflow = 'visible';
        document.body.style.overflow = 'visible';
        document.documentElement.style.overflowAnchor = '';
      });
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      {!introDone ? (
        <IntroSequence onComplete={handleIntroComplete} />
      ) : (
        <>
          <HeroSection
            onGoToChat={() => window.location.href = '/chat'}
            onWatchDemo={() => console.log("Watch demo")}
          />
          <SectionEverything />
          <SectionSupporters />
          <SectionTestimonials />
          <SectionFeatures />
          <SectionFooter />
        </>
      )}

      {/* Pre-login notice — shown once per device after welcome animation */}
      <FirstLoginNoticeModal
        open={noticeOpen}
        onClose={handleCloseNotice}
      />
    </>
  );
}