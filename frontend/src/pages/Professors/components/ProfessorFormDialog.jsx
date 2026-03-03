import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";

const INIT = { name: "", email: "", department: "", university: "" };

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
}

export default function ProfessorFormDialog({
  open,
  onClose,
  onSubmit,
  editProfessor = null,
}) {
  const [form, setForm] = useState(INIT);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(
        editProfessor
          ? {
              name: editProfessor.name || "",
              email: editProfessor.email || "",
              department: editProfessor.department || "",
              university: editProfessor.university || "",
            }
          : INIT
      );
      setSubmitError("");
    }
  }, [open, editProfessor]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const name = String(form.name || "").trim();
    const email = String(form.email || "").trim();
    if (!name) {
      setSubmitError("Name is required.");
      return;
    }
    if (!email) {
      setSubmitError("Email is required.");
      return;
    }
    if (!isValidEmail(email)) {
      setSubmitError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        name,
        email: email.toLowerCase(),
        department: (form.department || "").trim() || undefined,
        university: (form.university || "").trim() || undefined,
      });
      onClose();
    } catch (err) {
      setSubmitError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const isAdd = !editProfessor;
  const title = isAdd ? "Add Professor" : "Edit Professor";
  const submitLabel = isAdd ? "Add" : "Save";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSubmitError("")}>
              {submitError}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                name="name"
                label="Name"
                value={form.name}
                onChange={handleChange}
                required
                fullWidth
                autoFocus
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                fullWidth
                disabled={!!editProfessor}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                name="department"
                label="Department"
                value={form.department}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                name="university"
                label="University"
                value={form.university}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? "Saving…" : submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
