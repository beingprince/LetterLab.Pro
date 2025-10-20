import React, { useMemo } from "react";
import { Box, keyframes, useTheme } from "@mui/material";

/**
 * LetterLabs Pro — Sitewide Background (Grid + Edge Lights + Chips)
 * - Grid (subtle but visible) in both themes
 * - Stronger edge lights (clearly visible, Account-page vibe)
 * - Floating chips (Gmail + AI) with local halos (light mode)
 * - No backdrop-filter (never blurs text)
 * - pointer-events: none; zIndex: 0
 */

/* Gentle float */
const floatA = keyframes`
  0%   { transform: translate(-50%, -50%) translate(0px, 0px); }
  50%  { transform: translate(-50%, -50%) translate(16px, -12px); }
  100% { transform: translate(-50%, -50%) translate(0px, 0px); }
`;
const floatB = keyframes`
  0%   { transform: translate(-50%, -50%) translate(0px, 0px); }
  50%  { transform: translate(-50%, -50%) translate(-14px, 14px); }
  100% { transform: translate(-50%, -50%) translate(0px, 0px); }
`;

/* Minimal inline icons */
const GmailIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <path fill={color} d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"/>
  </svg>
);
const AISparkIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <path fill={color} d="M12 2l1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7L12 2z"/>
  </svg>
);

export const SmartBackground = () => {
  const { palette } = useTheme();
  const isDark = palette.mode === "dark";

  /* ---------- Grid (visible, calm) ---------- */
  const GRID_SIZE = 24; // px
  const GRID_LINE = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.14)";
  const GRID_OPACITY = isDark ? 0.24 : 0.32; // bump for clarity
  const gridImage = `
    linear-gradient(to right, ${GRID_LINE} 1px, transparent 1px),
    linear-gradient(to bottom, ${GRID_LINE} 1px, transparent 1px)
  `;

  /* ---------- Edge lights (now stronger) ---------- */
  // Dark: blue + violet; Light: mint/teal + ink-blue
  const auroraTL = isDark ? "rgba(0,163,255,0.28)" : "rgba(22,170,135,0.26)";
  const auroraBR = isDark ? "rgba(139,92,246,0.24)" : "rgba(40,90,160,0.20)";
  const AURORA_OPACITY = isDark ? 0.55 : 0.42; // overall intensity
  const AURORA_BLUR = isDark ? 6 : 5;          // soften edges a little more in dark

  // Two bigger spots + one very soft mid tint for continuity
  const auroraBackground = `
    radial-gradient(70vmax 50vmax at 10% 12%, ${auroraTL}, transparent 60%),
    radial-gradient(80vmax 60vmax at 92% 88%, ${auroraBR}, transparent 60%),
    radial-gradient(120vmax 90vmax at 50% 50%, ${isDark ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.16)"} , transparent 70%)
  `;

  /* ---------- Chips (light mode) ---------- */
  const chipBg  = "rgba(255,255,255,0.94)";
  const chipBr  = "rgba(0,0,0,0.12)";
  const chipTxt = "rgba(0,0,0,0.80)";
  const chipInnerBg = "rgba(0,0,0,0.06)";

  const chips = useMemo(
    () => [
      { id: "gmail", label: "Gmail", left: "14%", top: "22%", Icon: GmailIcon, anim: floatA, dur: 7.2 },
      { id: "ai",    label: "AI",    left: "86%", top: "78%", Icon: AISparkIcon, anim: floatB, dur: 7.8 },
    ],
    []
  );

  return (
    <Box
      aria-hidden
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 0,             // behind UI; if you still don't see it, try zIndex: 1
        pointerEvents: "none", // never intercept clicks
      }}
    >
      {/* 1) Grid (bottom-most) */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: gridImage,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          opacity: GRID_OPACITY,
        }}
      />

      {/* 2) Edge lights (self-blur, no text blur) */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: auroraBackground,
          filter: `blur(${AURORA_BLUR}px)`,
          opacity: AURORA_OPACITY,
        }}
      />

      {/* 3) Light-mode floating chips + halos */}
      {!isDark && chips.map(({ id, label, left, top, Icon, anim, dur }, i) => (
        <Box key={id}>
          {/* halo */}
          <Box
            sx={{
              position: "absolute",
              left,
              top,
              width: 120,
              height: 120,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.28) 45%, rgba(255,255,255,0.10) 70%, transparent 100%)",
              filter: "blur(18px)",
              opacity: 0.95,
            }}
          />
          {/* chip */}
          <Box
            sx={{
              position: "absolute",
              left,
              top,
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              padding: "8px 12px",
              borderRadius: "999px",
              background: chipBg,
              border: `1px solid ${chipBr}`,
              color: chipTxt,
              boxShadow: "0 8px 26px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.08)",
              animation: `${anim} ${dur}s ${i * 0.2}s ease-in-out infinite`,
            }}
          >
            <Box
              sx={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background: chipInnerBg,
                border: `1px solid ${chipBr}`,
              }}
            >
              <Icon size={14} color={chipTxt} />
            </Box>
            <Box component="span" sx={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 0.2 }}>
              {label}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
