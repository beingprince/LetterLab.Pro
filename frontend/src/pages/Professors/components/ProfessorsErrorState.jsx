import { Box, Typography, Button, useTheme } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function ProfessorsErrorState({ message, onRetry }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const glassBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.7)";

  return (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        px: 4,
        borderRadius: 3,
        background: glassBg,
        backdropFilter: "blur(18px)",
        border: "1px solid",
        borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
      }}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom color="error">
        Couldn&apos;t load professors
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {message}
      </Typography>
      <Button variant="outlined" startIcon={<RefreshIcon />} onClick={onRetry}>
        Retry
      </Button>
    </Box>
  );
}
