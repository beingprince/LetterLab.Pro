import { motionTokens } from "./MotionTokens";

// Reusable Framer variants
export const variants = {
  fadeInUp: {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: motionTokens.durations.base, ease: motionTokens.ease.outSoft },
    },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: motionTokens.durations.base, ease: motionTokens.ease.outSoft } },
  },
  staggerChildren: (stagger = 0.12) => ({
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
  }),
  typewriter: (msPerChar = 35) => ({
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: { delay: (i || 0) * msPerChar * 0.01, duration: 0.001 },
    }),
  }),
  pulseCTA: {
    animate: {
      boxShadow: [
        "0 0 0 0 rgba(16,185,129,0.65)",
        "0 0 0 16px rgba(16,185,129,0)",
      ],
      transition: { repeat: Infinity, duration: 1.6, ease: "linear" },
    },
  },
};

// Global animation state hooks (simple pub/sub without extra deps)
let listeners = new Set();
let gState = { sceneProgress: 0 }; // 0..1 based on scroll in Hero
export const getGlobalState = () => gState;

export const setGlobalState = (patch) => {
  gState = { ...gState, ...patch };
  listeners.forEach((fn) => fn(gState));
};

export const subscribeGlobalState = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
