import { Box, TextField, InputAdornment, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function ProfessorsToolbar({ search, onSearchChange, total }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        mb: 3,
        flexWrap: "wrap",
      }}
    >
      <TextField
        size="small"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{
          flex: "1 1 240px",
          maxWidth: 320,
          minWidth: 0,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />
      <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
        Total: {total}
      </Typography>
    </Box>
  );
}
