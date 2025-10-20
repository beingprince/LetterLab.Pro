import React, { useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { Box, keyframes, useTheme } from "@mui/material";

/**
 * Bullet-proof Site Background (Portal)
 * - Renders via React Portal under <body> so no app container can hide it
 * - Very high z-index (but pointer-events: none) → never blocks UI
 * - Grid always visible (light + dark)
 * - Strong edge lights (both modes)
 * - Light mode: floating Gmail + AI chips with halo
 * - No backdrop-filter → never blurs text
 */

const floatA = keyframes`
  0%   { transform: translate(-50%, -50%) translate(0, 0); }
  50%  { transform: translate(-50%, -50%) translate(16px, -12px); }
  100% { transform: translate(-50%, -50%) translate(0, 0); }
`;
const floatB = keyframes`
  0%   { transform: translate(-50%, -50%) translate(0, 0); }
  50%  { transform: translate(-50%, -50%) translate(-14px, 14px); }
  100% { transform: translate(-50%, -50%) translate(0, 0); }
`;

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

  // Create a host element once and mount to <body>
  const host = useMemo(() => {
    if (typeof document === "undefined") return null;
    const el = document.createElement("div");
    el.setAttribute("id", "llp-bg-portal");
    // Make sure no CSS elsewhere can clip it
    el.style.position = "fixed";
    el.style.inset = "0";
    el.style.zIndex = "2147483000"; // ~max int
    el.style.zIndex = "0"; // behind your UI so bubbles can backdrop-blur it
    el.style.pointerEvents = "none";
    return el;
  }, []);

  useEffect(() => {
    if (!host || typeof document === "undefined") return;
    document.body.appendChild(host);
    return () => {
      try { document.body.removeChild(host); } catch {}
    };
  }, [host]);

  if (!host) return null;

  /* --------- Grid (clearly visible) --------- */
  const GRID_SIZE = 24;
  const GRID_LINE = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.14)";
  const GRID_OPACITY = isDark ? 0.30 : 0.36;
  const gridImage = `
    linear-gradient(to right, ${GRID_LINE} 1px, transparent 1px),
    linear-gradient(to bottom, ${GRID_LINE} 1px, transparent 1px)
  `;

  /* --------- Edge lights (strong) --------- */
  const auroraTL = isDark ? "rgba(0,163,255,0.36)" : "rgba(22,170,135,0.32)";
  const auroraBR = isDark ? "rgba(139,92,246,0.30)" : "rgba(40,90,160,0.26)";
  const AURORA_OPACITY = isDark ? 0.65 : 0.50;
  const AURORA_BLUR_PX = isDark ? 8 : 7;
  const auroraBackground = `
    radial-gradient(75vmax 55vmax at 8% 10%, ${auroraTL}, transparent 62%),
    radial-gradient(85vmax 65vmax at 92% 88%, ${auroraBR}, transparent 62%)
  `;

  /* --------- Light-mode chips --------- */
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

  const content = (
    <Box
      aria-hidden
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 0,              // our host already sits at max z-index
        pointerEvents: "none",
      }}
    >
      {/* Grid */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: gridImage,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          opacity: GRID_OPACITY,
        }}
      />

      {/* Edge lights */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: auroraBackground,
          filter: `blur(${AURORA_BLUR_PX}px)`,
          opacity: AURORA_OPACITY,
        }}
      />

      {/* Light-mode chips + halos */}
      {!isDark && chips.map(({ id, label, left, top, Icon, anim, dur }, i) => (
        <Box key={id}>
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

  return ReactDOM.createPortal(content, host);
};
