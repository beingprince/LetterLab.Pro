import { useState, useCallback, useRef, useEffect } from "react";
import { sanitizeLogMessage } from "../utils/sanitizeProgressLogs";

const STEP_IDS = ["session", "fetch_threads", "extract_context", "summarize", "format_output"];
const STEP_LABELS = {
  session: "Session",
  fetch_threads: "Fetch threads",
  extract_context: "Extract context",
  summarize: "Summarize",
  format_output: "Format output",
};

const STEP_MESSAGES = {
  session: "Initializing session…",
  fetch_threads: "Fetching email thread…",
  extract_context: "Extracting key context…",
  summarize: "Analyzing conversation…",
  format_output: "Formatting summary…",
};

const TARGET_PERCENT = {
  session: 10,
  fetch_threads: 35,
  extract_context: 55,
  summarize: 70,
  format_output: 96,
};

const ANIM_INTERVAL_MS = 180;
const CREEP_INTERVAL_MS = 350;

function makeSteps(initialStatus = "pending") {
  return STEP_IDS.map((id) => ({
    id,
    label: STEP_LABELS[id] || id,
    status: initialStatus,
    meta: null,
  }));
}

function toStreamLine(log) {
  const msg = log?.message || "";
  if (!msg) return null;
  return msg;
}

export function useAnalysisProgress() {
  const [steps, setSteps] = useState(() => makeSteps());
  const [percent, setPercentState] = useState(0);
  const [etaSeconds, setEtaSeconds] = useState(null);
  const [logs, setLogs] = useState([]);
  const [state, setState] = useState("loading");
  const [errorMessage, setErrorMessage] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [activeStepId, setActiveStepId] = useState(null);
  const targetPercentRef = useRef(0);
  const animRef = useRef(null);
  const creepRef = useRef(null);
  const startTimeRef = useRef(null);

  const currentMessage =
    state === "error"
      ? "Request failed. Try again."
      : activeStepId && STEP_MESSAGES[activeStepId]
      ? STEP_MESSAGES[activeStepId]
      : "Starting…";

  const streamLines = logs
    .map(toStreamLine)
    .filter(Boolean)
    .slice(-6);

  const animateTo = useCallback((target, capAt99 = true) => {
    const capped = capAt99 ? Math.min(99, target) : target;
    targetPercentRef.current = capped;
  }, []);

  const stopSmoothProgress = useCallback(() => {
    if (animRef.current) clearInterval(animRef.current);
    animRef.current = null;
    if (creepRef.current) clearInterval(creepRef.current);
    creepRef.current = null;
  }, []);

  const startSmoothProgress = useCallback(() => {
    stopSmoothProgress();
    animRef.current = setInterval(() => {
      setPercentState((prev) => {
        const target = targetPercentRef.current;
        const diff = target - prev;
        if (Math.abs(diff) < 1) return Math.min(99, target);
        const step = diff > 0 ? Math.min(3, diff) : Math.max(-3, diff);
        return Math.min(99, Math.max(0, prev + step));
      });
    }, ANIM_INTERVAL_MS);
  }, [stopSmoothProgress]);

  const startCreep = useCallback(() => {
    if (creepRef.current) return;
    creepRef.current = setInterval(() => {
      setPercentState((prev) => {
        if (prev >= 98) return prev;
        return prev + 0.5;
      });
    }, CREEP_INTERVAL_MS);
  }, []);

  useEffect(() => {
    if (state === "loading") {
      startSmoothProgress();
      return () => stopSmoothProgress();
    }
  }, [state, startSmoothProgress, stopSmoothProgress]);

  useEffect(() => {
    if (state !== "loading") return;
    startTimeRef.current = startTimeRef.current || Date.now();
    const t = setInterval(() => {
      const s = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsedSeconds(s);
    }, 500);
    return () => clearInterval(t);
  }, [state]);

  const addLog = useCallback((level, message) => {
    const { message: safe } = sanitizeLogMessage(level, message);
    const ts = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLogs((prev) => [...prev, { ts, level, message: safe }]);
  }, []);

  const startStep = useCallback(
    (id) => {
      setActiveStepId(id);
      setSteps((prev) =>
        prev.map((s) => ({
          ...s,
          status:
            s.id === id ? "active" : s.status === "active" ? "done" : s.status,
        }))
      );
      stopSmoothProgress();
      const target = TARGET_PERCENT[id] ?? 50;
      animateTo(target);
      startSmoothProgress();
    },
    [animateTo, startSmoothProgress, stopSmoothProgress]
  );

  const finishStep = useCallback((id, meta) => {
    setSteps((prev) =>
      prev.map((s) => ({
        ...s,
        status: s.id === id ? "done" : s.status,
        meta: s.id === id ? meta : s.meta,
      }))
    );
    startCreep();
  }, [startCreep]);

  const failStep = useCallback(
    (id, message) => {
      stopSmoothProgress();
      setSteps((prev) =>
        prev.map((s) => ({ ...s, status: s.id === id ? "error" : s.status }))
      );
      setErrorMessage(message || "Something went wrong");
      setState("error");
      addLog("error", "Request failed. Try again.");
    },
    [addLog, stopSmoothProgress]
  );

  const reset = useCallback(() => {
    stopSmoothProgress();
    setSteps(makeSteps());
    setPercentState(0);
    targetPercentRef.current = 0;
    setActiveStepId(null);
    setEtaSeconds(null);
    setLogs([]);
    setState("loading");
    setErrorMessage(null);
    setElapsedSeconds(0);
    startTimeRef.current = null;
  }, [stopSmoothProgress]);

  const complete = useCallback(() => {
    stopSmoothProgress();
    setState("success");
    setPercentState(100);
    setSteps((prev) =>
      prev.map((s) => ({ ...s, status: s.status === "active" ? "done" : s.status }))
    );
  }, [stopSmoothProgress]);

  useEffect(() => {
    if (percent < 8 && state === "loading") {
      animateTo(8);
    }
  }, [state, percent, animateTo]);

  return {
    steps,
    percent,
    etaSeconds,
    logs,
    state,
    errorMessage,
    detailsOpen,
    setDetailsOpen,
    setEtaSeconds,
    addLog,
    startStep,
    finishStep,
    failStep,
    setState,
    setErrorMessage,
    reset,
    complete,
    toggleDetails: () => setDetailsOpen((v) => !v),
    currentMessage,
    streamLines,
    elapsedSeconds,
  };
}
