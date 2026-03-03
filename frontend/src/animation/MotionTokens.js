// Central motion timings & easings for universal consistency
export const motionTokens = {
  durations: {
    xfast: 0.2,
    fast: 0.35,
    base: 0.6,
    slow: 0.9,
    xslow: 1.25,
  },
  ease: {
    inOut: [0.4, 0, 0.2, 1],
    outSoft: [0.16, 1, 0.3, 1],
    in: [0.12, 0, 0.39, 0],
  },
  spring: {
    gentle: { type: "spring", stiffness: 70, damping: 14, mass: 0.9 },
    soft: { type: "spring", stiffness: 55, damping: 18, mass: 1.1 },
    snappy: { type: "spring", stiffness: 120, damping: 12, mass: 0.7 },
  },
};
