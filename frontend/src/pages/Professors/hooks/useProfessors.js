import { useState, useCallback, useEffect } from "react";
import {
  getProfessors,
  createProfessor,
  deleteProfessor,
} from "../api/professorsApi";

export function useProfessors() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProfessors();
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Couldn't load professors.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const add = useCallback(
    async (payload) => {
      const res = await createProfessor(payload);
      await fetch();
      return res;
    },
    [fetch]
  );

  const remove = useCallback(
    async (id) => {
      await deleteProfessor(id);
      setList((prev) => prev.filter((p) => (p._id || p.id) !== id));
    },
    []
  );

  return { list, loading, error, fetch, add, remove };
}
