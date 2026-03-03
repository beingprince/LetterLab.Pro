import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  useTheme,
} from "@mui/material";
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
    const d = new Date(createdAt);
    return d.toLocaleDateString();
  } catch {
    return "";
  }
}

export default function ProfessorsTable({ professors, onDelete }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const glassBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.8)";
  const glassBorder = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.08)";
  const rowHover = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)";

  return (
    <Box
      sx={{
        background: glassBg,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid",
        borderColor: glassBorder,
        borderRadius: "12px",
        boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.25)" : "0 4px 20px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      <TableContainer>
        <Table size="medium" sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "28%", py: 2 }}>Name</TableCell>
              <TableCell sx={{ width: "26%", py: 2 }}>Email</TableCell>
              <TableCell sx={{ width: "20%", py: 2 }}>Department</TableCell>
              <TableCell sx={{ width: "12%", py: 2 }}>Added</TableCell>
              <TableCell align="center" sx={{ width: 80, py: 2 }}>Actions</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
          {professors.map((p) => (
            <TableRow
              key={p._id}
              sx={{
                "&:hover": { bgcolor: rowHover },
                transition: "background-color 0.15s ease",
              }}
            >
              <TableCell sx={{ overflow: "hidden", py: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      flexShrink: 0,
                      fontSize: "0.875rem",
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                    }}
                  >
                    {initials(p.name)}
                  </Avatar>
                  <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</Box>
                </Box>
              </TableCell>
              <TableCell sx={{ overflow: "hidden", py: 2 }}>
                <Box sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.email}</Box>
              </TableCell>
              <TableCell sx={{ overflow: "hidden", maxWidth: 0, py: 2 }}>
                {(p.department || p.university) ? (
                  <Chip
                    size="small"
                    label={p.department || p.university || "—"}
                    sx={{
                      fontWeight: 500,
                      maxWidth: "100%",
                      "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" },
                    }}
                  />
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell sx={{ py: 2 }}>{formatDate(p.createdAt)}</TableCell>
              <TableCell align="center" sx={{ width: 80, py: 2 }}>
                <ProfessorRowActions professor={p} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
  );
}
