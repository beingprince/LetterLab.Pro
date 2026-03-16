import React from "react";
import { motion } from "framer-motion";

// The supporter list is unchanged
const SUPPORTERS = [
  { name: "AITC International", src: "/supporters/aitc.png" },
  { name: "Annapurna Galleries", src: "/supporters/annapurna.png" },
  { name: "Tribhuvan University", src: "/supporters/Tribhuvan_University_logo.svg" }
];

// The animation keyframes are unchanged
const style = `
@keyframes smoothMarquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
`;

export default function SectionSupporters() {
  return (
    // Use brand tokens for padding and text
    <section className="w-full py-16 md:py-20 bg-transparent relative overflow-hidden">
      <style>{style}</style>

      {/* Heading and content */}
      <div className="w-full max-w-3xl mx-auto px-6 text-center space-y-4 mb-10">

        {/* UPDATED: Uses label class and brand-dim token */}
        <h2 className="label text-brand-dim">
          Supported by Innovation & Trust
        </h2>

        {/* GOOD: This already uses hero-heading */}
        <h3 className="hero-heading text-3xl md:text-4xl font-semibold">
          Partners Powering the Future of Communication
        </h3>

        {/* GOOD: This already uses hero-description */}
        <p className="hero-description text-sm md:text-base leading-relaxed">
          We’re grateful for the universities, organizations, and innovation hubs
          that believe in LetterLab Pro’s mission to redefine clarity, tone, and
          productivity.
        </p>
      </div>

      {/* Single smooth marquee line */}
      <div className="relative overflow-hidden mt-10">

        {/* UPDATED: Fades now use the a brand-bg token for a smooth, theme-proof blend */}
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-brand-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-brand-bg to-transparent z-10 pointer-events-none" />

        <div
          className="flex whitespace-nowrap animate-[smoothMarquee_50s_linear_infinite]"
          style={{ willChange: "transform" }}
        >
          {[...SUPPORTERS, ...SUPPORTERS].map((logo, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="inline-flex flex-col items-center justify-center mx-10"
            >
              <img
                src={logo.src}
                alt={logo.name}
                // UPDATED: Replaced hardcoded blue shadow with a neutral white glow
                className="w-20 h-20 md:w-24 md:h-24 object-contain opacity-60 grayscale hover:opacity-100 hover:grayscale-0 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-all duration-700"
              />
              {/* UPDATED: Uses brand-dim and brand-text for theme-proof text */}
              <span className="mt-2 text-[11px] text-brand-dim hover:text-brand-text transition-colors text-center whitespace-normal">
                {logo.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}