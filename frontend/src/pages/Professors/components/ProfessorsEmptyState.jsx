import { Box, Typography, Button, useTheme } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function ProfessorsEmptyState({ onAddClick }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const glassBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.7)";
  const accentGradient = isDark
    ? "radial-gradient(ellipse 120% 80% at 50% 0%, rgba(59,130,246,0.15) 0%, transparent 60%)"
    : "radial-gradient(ellipse 120% 80% at 50% 0%, rgba(37,99,235,0.08) 0%, transparent 60%)";

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 3,
        background: glassBg,
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid",
        borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
        boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.2)" : "0 4px 24px rgba(0,0,0,0.06)",
        textAlign: "center",
        py: 8,
        px: 4,
      }}
    >
      {/* Soft gradient accent (pure CSS) */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          background: accentGradient,
          pointerEvents: "none",
        }}
      />
      {/* Blurred orb accent */}
      <Box
        sx={{
          position: "absolute",
          top: -40,
          left: "50%",
          transform: "translateX(-50%)",
          width: 200,
          height: 100,
          background: isDark ? "rgba(59,130,246,0.2)" : "rgba(37,99,235,0.12)",
          borderRadius: "50%",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom color="text.primary">
          No professors yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 360, mx: "auto", lineHeight: 1.6 }}>
          Add a professor to start pulling and drafting emails with the right context.
        </Typography>
        <Button variant="contained" startIcon={<PersonAddIcon />} onClick={onAddClick}>
          Add Professor
        </Button>
      </Box>
    </Box>
  );
}
