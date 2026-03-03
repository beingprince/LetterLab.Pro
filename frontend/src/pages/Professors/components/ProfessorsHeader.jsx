import { Typography, Button, Box } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function ProfessorsHeader({ onAddClick }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "stretch", sm: "center" },
        gap: 3,
        mb: 3,
      }}
    >
      <Box>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          Professors
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage contacts for smarter email drafting.
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<PersonAddIcon />}
        onClick={onAddClick}
        sx={{
          alignSelf: { xs: "stretch", sm: "flex-start" },
          minWidth: { xs: "100%", sm: "auto" },
          "&:hover": { transform: "none" },
        }}
      >
        Add Professor
      </Button>
    </Box>
  );
}
