import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Define the animation variants inline
const variants = {
  staggerChildren: (delay) => ({
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
      },
    },
  }),
  typewriter: (delay) => ({
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: {
        delay: i * delay,
      },
    }),
  }),
};

// --- 1. Email Animation Component ---
function EmailAnimation() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setIsAnimating(true), 200);
    return () => clearTimeout(t1);
  }, []);

  return (
    <>
      <EmailAnimationStyles />
      <div className="letter-image-container">
        <div className={`letter-image ${isAnimating ? "animate" : ""}`}>
          <div className="animated-mail">
            <div className="back-fold"></div>
            <div className="letter">
              <div className="letter-border"></div>
              <div className="letter-title"></div>
              <div className="letter-context"></div>
              <div className="letter-stamp">
                <div className="letter-stamp-inner"></div>
              </div>
            </div>
            <div className="top-fold"></div>
            <div className="body"></div>
            <div className="left-fold"></div>
          </div>
          <div className="shadow"></div>
        </div>
      </div>
    </>
  );
}

// --- 2. Typewriter Animation Component ---
function TypewriterAnimation() {
  const title = "LetterLab Pro".split("");
  const tagline = "Email replies that feel effortless.".split("");
  const [showTagline, setShowTagline] = useState(false);

  const titleDuration = title.length * 35;
  const taglineDelay = titleDuration + 500;

  useEffect(() => {
    const t1 = setTimeout(() => setShowTagline(true), taglineDelay);
    return () => clearTimeout(t1);
  }, [taglineDelay]);

  const typewriterVariant = variants.typewriter(0.035);

  return (
    <div className="typewriter-container text-center">
      <motion.h1
        className="text-5xl md:text-6xl font-bold text-brand-text"
        variants={variants.staggerChildren(0.035)}
        initial="hidden"
        animate="visible"
      >
        {title.map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            variants={typewriterVariant}
            custom={i}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.h1>

      <AnimatePresence>
        {showTagline && (
          <motion.p
            className="text-xl md:text-2xl text-brand-muted mt-6"
            variants={variants.staggerChildren(0.035)}
            initial="hidden"
            animate="visible"
          >
            {tagline.map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                variants={typewriterVariant}
                custom={i}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- 3. Main Intro Sequence Controller ---
export default function IntroSequence({ onComplete }) {
  useEffect(() => {
    // Complete the intro after 3.5 seconds (shorter wait after animation)
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-brand-bg">
      {/* Email Animation at the top */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <EmailAnimation />
      </motion.div>

      {/* Typewriter Animation below */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <TypewriterAnimation />
      </motion.div>
    </div>
  );
}

// --- 4. CSS Styles for Email Animation ---
const EmailAnimationStyles = () => (
  <style>{`
    .letter-image-container {
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: visible;
    }
    .letter-image {
      position: relative;
      width: 200px;
      height: 200px;
      cursor: pointer;
    }
    .animated-mail {
      position: absolute;
      height: 150px;
      width: 200px;
      transition: 0.4s;
    }
    .animated-mail .body {
      position: absolute;
      bottom: 0;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 0 100px 200px;
      border-color: transparent transparent #e95f55 transparent;
      z-index: 2;
    }
    .animated-mail .top-fold {
      position: absolute;
      top: 50px;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 50px 100px 0 100px;
      transform-origin: 50% 0%;
      transition: transform 0.4s 0.4s, z-index 0.2s 0.4s;
      border-color: #cf4a43 transparent transparent transparent;
      z-index: 2;
    }
    .animated-mail .back-fold {
      position: absolute;
      bottom: 0;
      width: 200px;
      height: 100px;
      background: #cf4a43;
      z-index: 0;
    }
    .animated-mail .left-fold {
      position: absolute;
      bottom: 0;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 50px 0 50px 100px;
      border-color: transparent transparent transparent #e15349;
      z-index: 2;
    }
    .animated-mail .letter {
      left: 20px;
      bottom: 0px;
      position: absolute;
      width: 160px;
      height: 60px;
      background: white;
      z-index: 1;
      overflow: hidden;
      transition: 0.4s 0.2s;
    }
    .animated-mail .letter .letter-border {
      height: 10px;
      width: 100%;
      background: repeating-linear-gradient(
        -45deg,
        #cb5a5e,
        #cb5a5e 8px,
        transparent 8px,
        transparent 18px
      );
    }
    .animated-mail .letter .letter-title {
      margin-top: 10px;
      margin-left: 5px;
      height: 10px;
      width: 40%;
      background: #cb5a5e;
    }
    .animated-mail .letter .letter-context {
      margin-top: 10px;
      margin-left: 5px;
      height: 10px;
      width: 20%;
      background: #cb5a5e;
    }
    .animated-mail .letter .letter-stamp {
      margin-top: -30px;
      margin-left: 120px;
      border-radius: 100%;
      height: 30px;
      width: 30px;
      background: #cb5a5e;
      opacity: 0.3;
    }
    .shadow {
      position: absolute;
      top: 200px;
      left: 50%;
      width: 400px;
      height: 30px;
      transition: 0.4s;
      transform: translateX(-50%);
      border-radius: 100%;
      background: radial-gradient(
        rgba(0, 0, 0, 0.5),
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0)
      );
    }

    .letter-image.animate .animated-mail {
      transform: translateY(50px);
    }
    .letter-image.animate .animated-mail .top-fold {
      transition: transform 0.4s, z-index 0.2s;
      transform: rotateX(180deg);
      z-index: 0;
    }
    .letter-image.animate .animated-mail .letter {
      height: 180px;
    }
    .letter-image.animate .shadow {
      width: 250px;
    }
  `}</style>
);