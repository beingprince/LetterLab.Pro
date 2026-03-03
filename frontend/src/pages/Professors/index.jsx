import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Snackbar,
  Alert,
  TablePagination,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import ProfessorsHeader from "./components/ProfessorsHeader";
import ProfessorsToolbar from "./components/ProfessorsToolbar";
import ProfessorsTable from "./components/ProfessorsTable";
import ProfessorsCardList from "./components/ProfessorsCardList";
import DeleteProfessorDialog from "./components/DeleteProfessorDialog";
import ProfessorFormDialog from "./components/ProfessorFormDialog";
import ProfessorsEmptyState from "./components/ProfessorsEmptyState";
import ProfessorsErrorState from "./components/ProfessorsErrorState";
import ProfessorsSkeleton from "./components/ProfessorsSkeleton";

import { useProfessors } from "./hooks/useProfessors";

const PAGE_SIZE = 10;

function filterList(list, search) {
  if (!search || !search.trim()) return list;
  const q = search.trim().toLowerCase();
  return list.filter(
    (p) =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.email && p.email.toLowerCase().includes(q))
  );
}

export default function ProfessorsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { list, loading, error, fetch, add, remove } = useProfessors();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  // OAuth callback: clean ?linked from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("linked")) {
      try {
        localStorage.setItem("llp_mail_connected", "1");
      } catch (_) {}
      window.history.replaceState({}, document.title, "/add-professor");
    }
  }, []);

  const filtered = useMemo(() => filterList(list, search), [list, search]);
  const paginated = useMemo(() => {
    const start = page * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const id = deleteTarget._id || deleteTarget.id;
      await remove(id);
      setDeleteTarget(null);
      setToast({ open: true, message: "Professor deleted", severity: "success" });
    } catch (e) {
      setToast({ open: true, message: "Couldn't delete. Try again.", severity: "error" });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAdd = async (payload) => {
    await add(payload);
    setToast({ open: true, message: "Professor added", severity: "success" });
  };

  return (
    <Box
      sx={{
        maxWidth: 1152,
        mx: "auto",
        width: "100%",
        pt: 2,
        pb: 4,
      }}
    >
      <ProfessorsHeader onAddClick={() => setFormOpen(true)} />
      <ProfessorsToolbar
        search={search}
        onSearchChange={setSearch}
        total={filtered.length}
      />

      {loading && <ProfessorsSkeleton isMobile={isMobile} />}
      {!loading && error && (
        <ProfessorsErrorState message={error} onRetry={fetch} />
      )}
      {!loading && !error && filtered.length === 0 && (
        <ProfessorsEmptyState onAddClick={() => setFormOpen(true)} />
      )}
      {!loading && !error && filtered.length > 0 && (
        <>
          {isMobile ? (
            <ProfessorsCardList professors={paginated} onDelete={setDeleteTarget} />
          ) : (
            <ProfessorsTable professors={paginated} onDelete={setDeleteTarget} />
          )}
          {filtered.length > PAGE_SIZE && (
            <TablePagination
              component="div"
              count={filtered.length}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={PAGE_SIZE}
              rowsPerPageOptions={[PAGE_SIZE]}
              sx={{ mt: 3, px: 0 }}
            />
          )}
        </>
      )}

      <ProfessorFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleAdd}
      />

      <DeleteProfessorDialog
        open={!!deleteTarget}
        professor={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
