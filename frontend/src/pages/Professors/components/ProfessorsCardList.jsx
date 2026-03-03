import { Box, Card, CardContent, Avatar, Chip, Typography, useTheme } from "@mui/material";
import ProfessorRowActions from "./ProfessorRowActions";

function initials(name) {
  if (!name || typeof name !== "string") return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase().slice(0, 2);
}

function formatDate(createdAt) {
  if (!createdAt) return "";
  try {
    return new Date(createdAt).toLocaleDateString();
  } catch {
    return "";
  }
}

export default function ProfessorsCardList({ professors, onDelete }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const glassBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.7)";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {professors.map((p) => (
        <Card
          key={p._id}
          elevation={0}
          sx={{
            borderRadius: 2,
            border: "1px solid",
            borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
            background: glassBg,
            backdropFilter: "blur(12px)",
          }}
        >
          <CardContent sx={{ py: 2, px: 2, "&:last-child": { pb: 2 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1, minWidth: 0 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    fontSize: "0.875rem",
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                  }}
                >
                  {initials(p.name)}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600} noWrap>
                    {p.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {p.email}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
                    {(p.department || p.university) && (
                      <Chip size="small" label={p.department || p.university} sx={{ fontWeight: 500 }} />
                    )}
                    {formatDate(p.createdAt) && (
                      <Typography variant="caption" color="text.secondary">
                        Added {formatDate(p.createdAt)}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
              <ProfessorRowActions professor={p} onDelete={onDelete} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
