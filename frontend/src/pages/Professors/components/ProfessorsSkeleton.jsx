import { Box, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme } from "@mui/material";

export default function ProfessorsSkeleton({ isMobile = false }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const glassBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.7)";
  const useCards = isMobile;

  if (useCards) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={80}
            sx={{
              borderRadius: 2,
              bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
            }}
          />
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: glassBg,
        backdropFilter: "blur(18px)",
        border: "1px solid",
        borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Added</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[1, 2, 3, 4, 5].map((i) => (
            <TableRow key={i}>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Skeleton variant="circular" width={36} height={36} />
                  <Skeleton variant="text" width={120} />
                </Box>
              </TableCell>
              <TableCell><Skeleton variant="text" width={180} /></TableCell>
              <TableCell><Skeleton variant="text" width={100} /></TableCell>
              <TableCell><Skeleton variant="text" width={80} /></TableCell>
              <TableCell align="right"><Skeleton variant="text" width={60} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
  );
}
