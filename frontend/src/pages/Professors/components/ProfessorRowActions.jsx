import { useState } from "react";
import { Box } from "@mui/material";
import { keyframes } from "@mui/system";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const rippleWave = keyframes`
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
`;

export default function ProfessorRowActions({ professor, onDelete }) {
  const [ripple, setRipple] = useState(false);

  const handleClick = () => {
    setRipple(true);
    onDelete(professor);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box
        component="button"
        onClick={handleClick}
        onTouchStart={() => setRipple(true)}
        aria-label="Delete professor"
        sx={{
          position: "relative",
          width: 42,
          height: 42,
          borderRadius: "50%",
          border: "1px solid",
          borderColor: (t) =>
            t.palette.mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.08)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 100%)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxShadow: (t) =>
            t.palette.mode === "dark"
              ? "inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 8px rgba(0,0,0,0.2)"
              : "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 8px rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          overflow: "hidden",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: (t) =>
              t.palette.mode === "dark"
                ? "inset 0 1px 0 rgba(255,255,255,0.15), 0 0 16px rgba(239,68,68,0.25)"
                : "inset 0 1px 0 rgba(255,255,255,0.5), 0 0 16px rgba(239,68,68,0.2)",
          },
          "&:active": {
            transform: "scale(0.95)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)",
            pointerEvents: "none",
          },
          "& .ripple": {
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "rgba(239,68,68,0.3)",
            animation: ripple ? `${rippleWave} 0.5s ease-out forwards` : "none",
            pointerEvents: "none",
          },
        }}
      >
        {ripple && <Box className="ripple" onAnimationEnd={() => setRipple(false)} />}
        <DeleteOutlineIcon
          sx={{
            color: "error.main",
            fontSize: 20,
            position: "relative",
            zIndex: 1,
          }}
        />
      </Box>
    </Box>
  );
}
