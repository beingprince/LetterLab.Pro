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
        <h2 className="label text-brand-dim mb-3">HOW IT WORKS</h2>
        <h3 className="hero-heading text-3xl md:text-4xl font-semibold mb-5">
          How LetterLab Works
        </h3>
        <p className="hero-description text-sm md:text-base leading-relaxed">
          From connecting your account to generating professional emails, experience a seamless workflow designed for efficiency.
        </p>
      </div>

      {/* 2. Visual Process Section (Replacing Video) */}
      <motion.div
        id="how-it-works"
        className="max-w-6xl mx-auto px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="group relative bg-brand-card/80 border border-brand-border shadow-glass backdrop-blur-md rounded-2xl p-8 hover:shadow-glass hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-full bg-brand-icon-bg flex items-center justify-center mb-6">
              <IconWand />
            </div>
            <h4 className="text-xl font-bold text-brand-text mb-3">1. Connect Email</h4>
            <p className="text-brand-dim leading-relaxed">
              Securely connect your Gmail or Outlook account using OAuth2 authentication.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative bg-brand-card/80 border border-brand-border shadow-glass backdrop-blur-md rounded-2xl p-8 hover:shadow-glass hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-full bg-brand-icon-bg flex items-center justify-center mb-6">
              <IconZap />
            </div>
            <h4 className="text-xl font-bold text-brand-text mb-3">2. Pull Email Context</h4>
            <p className="text-brand-dim leading-relaxed">
              LetterLab extracts the conversation context from the selected email thread.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative bg-brand-card/80 border border-brand-border shadow-glass backdrop-blur-md rounded-2xl p-8 hover:shadow-glass hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-full bg-brand-icon-bg flex items-center justify-center mb-6">
              <IconPlay />
            </div>
            <h4 className="text-xl font-bold text-brand-text mb-3">3. Generate Professional Reply</h4>
            <p className="text-brand-dim leading-relaxed">
              The AI generates a clear, structured email draft ready for review.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => window.location.href = '/chat'}
            className="inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:-translate-y-1 transition-transform"
          >
            Start Drafting <IconArrowRight />
          </button>
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