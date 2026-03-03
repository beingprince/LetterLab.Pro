import React from "react";
import { motion } from "framer-motion";

// --- INLINE ICON COMPONENTS ---
const IconPlay = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8 text-brand-text"
  >
    <path
      fillRule="evenodd"
      d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653z"
      clipRule="evenodd"
    />
  </svg>
);

const IconZap = () => (
  // Icon for "Summarize"
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 text-brand-text"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconWand = () => (
  // Icon for "Rewrite"
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 text-brand-text"
  >
    <path d="M15 4V2" />
    <path d="M15 16v-2" />
    <path d="M14 9.5 16.5 7" />
    <path d="m11.5 12.5 2.5 2.5" />
    <path d="M9 4.5 7 2" />
    <path d="m12 7.5 2.5-2.5" />
    <path d="M3 21 12 12" />
    <path d="m9 15-2.5 2.5" />
    <path d="M13.5 15 15 16.5" />
    <path d="m3.5 18.5 1.5 1.5" />
    <path d="M7 16.5 5.5 18" />
    <path d="M9.5 12 12 9.5" />
    <path d="M14.5 7 17 4.5" />
  </svg>
);

const IconArrowRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 011.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
      clipRule="evenodd"
    />
  </svg>
);
// --- END OF INLINE ICONS ---

export default function SectionFeatures() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-32 bg-transparent">
      {/* 1. Section Header */}
      <div className="text-center max-w-3xl mx-auto px-6 mb-16">
        <h2 className="label text-brand-dim mb-3">COMPLETE WORKSPACE</h2>
        <h3 className="hero-heading text-3xl md:text-4xl font-semibold mb-5">
          All the tools you need, nothing you don't.
        </h3>
        <p className="hero-description text-sm md:text-base leading-relaxed">
          LetterLab Pro is designed to be your one-stop-shop for perfect,
          professional communication, powered by AI that understands context.
        </p>
      </div>

      {/* 2. Video Showcase */}
      <motion.div
        className="max-w-5xl mx-auto px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      >
        <div className="relative rounded-glass border border-brand-border bg-brand-card/80 shadow-glass backdrop-blur-30 p-4">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-brand-icon-bg bg-200% animate-bg-pan"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 20%, var(--brand-icon-bg) 0%, transparent 40%), radial-gradient(circle at 80% 70%, var(--brand-card) 0%, transparent 40%)',
            }}
          >
            {/* Placeholder for video */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Animated "Play" Button */}
              <button className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-brand-card/80 border border-brand-border backdrop-blur-sm flex items-center justify-center shadow-glass transition-all hover:scale-105">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brand-text/50 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-full w-full items-center justify-center bg-brand-card">
                  <IconPlay />
                </span>
              </button>
            </div>
            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
              <h4 className="text-sm md:text-lg font-semibold text-brand-text">How to Use LetterLab Pro</h4>
              <p className="text-xs md:text-sm text-brand-dim">Full 40-second demo</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Deep-Dive Grid */}
      <motion.div
        className="max-w-5xl mx-auto px-6 mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
      </motion.div>
    </section>
  );
}