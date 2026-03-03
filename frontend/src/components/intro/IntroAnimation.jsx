// src/components/intro/IntroAnimation.jsx
// Cinematic intro for LetterLab Pro
// - White background
// - "WELCOME TO" zooms in
// - "WE COME T" splits (L and O are NOT in split text)
// - L and O appear and stay
// - Build "LetterLab" wordmark
// - O transforms into PRO badge feel
// - Envelope drop + flash
// - Fade to hero via onComplete()

import { useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

export default function IntroAnimation({ onComplete }) {
  const overlayControls = useAnimationControls();
  const welcomeControls = useAnimationControls();
  const splitTopControls = useAnimationControls();
  const splitBottomControls = useAnimationControls();
  const loRowControls = useAnimationControls();
  const letterWordmarkControls = useAnimationControls();
  const labTailControls = useAnimationControls();
  const proBadgeControls = useAnimationControls();
  const envelopeControls = useAnimationControls();

  useEffect(() => {
    let cancelled = false;

    async function runSequence() {
      if (cancelled) return;

      // 1) WELCOME TO zooms + fades in
      await welcomeControls.start({
        opacity: [0, 1],
        scale: [0.7, 1],
        filter: ["blur(10px)", "blur(0px)"],
        transition: {
          duration: 1.1,
          ease: EASE,
        },
      });

      if (cancelled) return;

      // 2) Hide WELCOME TO, show "WE COME T" split + fade in L/O row
      await Promise.all([
        welcomeControls.start({
          opacity: 0,
          transition: { duration: 0.4, ease: EASE },
        }),
        splitTopControls.start({
          opacity: [0, 1],
          y: [0, -30],
          transition: {
            duration: 0.7,
            ease: EASE,
          },
        }),
        splitBottomControls.start({
          opacity: [0, 1],
          y: [0, 30],
          transition: {
            duration: 0.7,
            ease: EASE,
          },
        }),
        loRowControls.start({
          opacity: [0, 1],
          y: [16, 0],
          transition: {
            duration: 0.8,
            ease: EASE,
            delay: 0.2,
          },
        }),
      ]);

      if (cancelled) return;

      // 3) Split halves move further out + fade, while Letter wordmark appears
      await Promise.all([
        splitTopControls.start({
          opacity: 0,
          y: -70,
          transition: { duration: 0.5, ease: EASE },
        }),
        splitBottomControls.start({
          opacity: 0,
          y: 70,
          transition: { duration: 0.5, ease: EASE },
        }),
        letterWordmarkControls.start({
          opacity: [0, 1],
          x: [-12, 0],
          transition: {
            duration: 0.7,
            ease: EASE,
          },
        }),
      ]);

      if (cancelled) return;

      // 4) "Lab" tail appears after "Letter"
      await labTailControls.start({
        opacity: [0, 1],
        x: [8, 0],
        transition: {
          duration: 0.6,
          ease: EASE,
        },
      });

      if (cancelled) return;

      // 5) O transforms into Pro-ish badge
      await proBadgeControls.start({
        opacity: [0, 1],
        scale: [0.7, 1],
        transition: {
          duration: 0.7,
          ease: EASE,
        },
      });

      if (cancelled) return;

      // 6) Envelope drops
      await envelopeControls.start({
        opacity: [0, 1],
        y: [-80, 0],
        transition: {
          duration: 0.7,
          ease: EASE,
        },
      });

      if (cancelled) return;

      // 7) Envelope flash out, overlay fade
      await envelopeControls.start({
        scale: [1, 1.08, 0.8],
        opacity: [1, 1, 0],
        transition: {
          duration: 0.7,
          ease: "easeInOut",
        },
      });

      if (cancelled) return;

      await overlayControls.start({
        opacity: 0,
        transition: { duration: 0.7, ease: EASE },
      });

      if (!cancelled && onComplete) {
        onComplete();
      }
    }

    runSequence();
    return () => {
      cancelled = true;
    };
  }, [
    welcomeControls,
    splitTopControls,
    splitBottomControls,
    loRowControls,
    letterWordmarkControls,
    labTailControls,
    proBadgeControls,
    envelopeControls,
    overlayControls,
    onComplete,
  ]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
      initial={{ opacity: 1 }}
      animate={overlayControls}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Main block slightly above center */}
        <div className="relative flex flex-col items-center justify-center -translate-y-[6vh] pointer-events-none select-none">
          {/* 1) WELCOME TO main */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, filter: "blur(10px)" }}
            animate={welcomeControls}
            className="text-[clamp(2.6rem,6vw,4.8rem)] font-[Outfit] font-semibold tracking-tight text-slate-900 leading-none"
          >
            WELCOME TO
          </motion.div>

          {/* 2) WE COME T split (L and O intentionally missing) */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Top half */}
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={splitTopControls}
              className="absolute"
              style={{
                clipPath: "inset(0 0 52% 0)",
              }}
            >
              <div className="text-[clamp(2.6rem,6vw,4.8rem)] font-[Outfit] font-semibold tracking-tight text-slate-900 leading-none">
                WE COME T
              </div>
            </motion.div>

            {/* Bottom half */}
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={splitBottomControls}
              className="absolute"
              style={{
                clipPath: "inset(52% 0 0 0)",
              }}
            >
              <div className="text-[clamp(2.6rem,6vw,4.8rem)] font-[Outfit] font-semibold tracking-tight text-slate-900 leading-none">
                WE COME T
              </div>
            </motion.div>
          </div>

          {/* 3) L and O row (L on left, L+etterLab center, O reserved for Pro) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={loRowControls}
            className="mt-0 flex items-baseline gap-8 text-[clamp(2.3rem,5.2vw,4.2rem)] font-[Outfit] font-semibold text-slate-900 leading-none"
          >
            {/* Original L on left */}
            <span className="inline-block">L</span>

            {/* Center word: L + etter + Lab tail */}
            <div className="flex items-baseline gap-1">
              {/* Center L (duplicate) */}
              <span className="inline-block">L</span>

              {/* "etter" part */}
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={letterWordmarkControls}
                className="inline-block"
              >
                etter
              </motion.span>

              {/* "Lab" tail */}
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={labTailControls}
                className="inline-block"
              >
                Lab
              </motion.span>
            </div>

            {/* O for Pro badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={proBadgeControls}
              className="inline-flex items-center"
            >
              <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center">
                <span className="text-white text-xl font-bold">O</span>
              </div>
            </motion.div>
          </motion.div>

          {/* 4) PRO badge below (O transforming idea) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 12 }}
            animate={proBadgeControls}
            className="mt-6 flex items-center gap-3 text-slate-900 font-[Outfit]"
          >
            <div className="px-7 py-2.5 bg-slate-900 text-white rounded-[50px] text-sm font-semibold tracking-[0.18em] uppercase">
              PRO
            </div>
          </motion.div>
        </div>

        {/* 5) Envelope drop near bottom */}
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 1 }}
          animate={envelopeControls}
          className="absolute bottom-[18%] left-1/2 -translate-x-1/2"
        >
          <div className="w-24 h-16 rounded-xl border border-slate-900 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.35)] relative overflow-hidden">
            {/* Envelope flap tint */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-slate-900/5" />
            <svg
              className="absolute inset-0 w-full h-full text-slate-900"
              viewBox="0 0 120 80"
              fill="none"
            >
              <path
                d="M10 15H110V65H10V15Z"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 15L60 45L110 15"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
