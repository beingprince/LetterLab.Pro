import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

export default function DeleteProfessorDialog({
  open,
  professor,
  onClose,
  onConfirm,
  loading,
}) {
  const name = professor?.name ?? "";
  const email = professor?.email ?? "";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          m: { xs: 1.5, sm: 4 },
          width: { xs: "calc(100% - 24px)", sm: "100%" },
          maxHeight: { xs: "calc(100% - 24px)", sm: "calc(100% - 64px)" },
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>Delete professor?</DialogTitle>
      <DialogContent sx={{ px: 3, pt: 0, pb: 2 }}>
        <DialogContentText>
          This removes the professor from your contacts list.
          {name || email ? (
            <>
              <br />
              <strong>{name || email}</strong>
              {name && email && ` — ${email}`}
            </>
          ) : null}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 0, gap: 1 }}>
        <Button onClick={onClose} disabled={loading} variant="outlined" sx={{ minWidth: 80 }}>
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          sx={{ minWidth: 80 }}
        >
          {loading ? "Deleting…" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
