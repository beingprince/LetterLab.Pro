import { useState, useCallback, useRef, useEffect } from "react";
import { sanitizeLogMessage } from "../utils/sanitizeProgressLogs";

/** Canonical step IDs (8 internal, 5 displayed) */
const STEP_IDS = [
  "session_check",
  "fetch_thread",
  "extract_context",
  "summarize",
  "draft_format",
];
const STEP_LABELS = {
  session_check: "Session",
  fetch_thread: "Fetch thread",
  extract_context: "Extract context",
  summarize: "Summarize",
  draft_format: "Draft + format",
};
const STEP_MESSAGES = {
  session_check: "Validating session…",
  fetch_thread: "Fetching email thread…",
  extract_context: "Extracting key context…",
  summarize: "Summarizing what matters…",
  draft_format: "Drafting your reply…",
};
const TARGET_PERCENT = {
  session_check: 12,
  fetch_thread: 35,
  extract_context: 55,
  summarize: 75,
  draft_format: 96,
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
  return msg ? msg : null;
}

/**
 * Resolve provider label. Never default to Gmail without explicit signal.
 * Priority: 1) provider param 2) localStorage letterlab_auth_provider 3) outlook token
 */
export function resolveProviderLabel(provider) {
  if (provider === "outlook") return "Outlook";
  if (provider === "gmail") return "Gmail";
  const stored = typeof localStorage !== "undefined" && localStorage.getItem("letterlab_auth_provider");
  if (stored === "outlook") return "Outlook";
  if (stored === "google") return "Gmail";
  const outlookToken = typeof localStorage !== "undefined" && localStorage.getItem("letterlab_outlook_token");
  if (outlookToken) return "Outlook";
  return "Gmail";
}

export function useThreadProcessingProgress(provider) {
  const [steps, setSteps] = useState(() => makeSteps());
  const [percent, setPercentState] = useState(0);
  const [logs, setLogs] = useState([]);
  const [state, setState] = useState("loading");
  const [errorMessage, setErrorMessage] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [activeStepId, setActiveStepId] = useState(null);
  const targetPercentRef = useRef(0);
  const animRef = useRef(null);
  const creepRef = useRef(null);
  const startTimeRef = useRef(null);

  const providerLabel = resolveProviderLabel(provider);

  const currentMessage =
    state === "session_expired"
      ? "Session expired — sign in again"
      : state === "error"
      ? "Request failed. Try again."
      : activeStepId && STEP_MESSAGES[activeStepId]
      ? STEP_MESSAGES[activeStepId]
      : "Starting…";

  const streamLines = logs.map(toStreamLine).filter(Boolean).slice(-6);

  const animateTo = useCallback((target, capAt99 = true) => {
    targetPercentRef.current = capAt99 ? Math.min(99, target) : target;
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
      setPercentState((prev) => (prev >= 98 ? prev : prev + 0.5));
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
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
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

  const finishStep = useCallback(
    (id, meta) => {
      setSteps((prev) =>
        prev.map((s) => ({
          ...s,
          status: s.id === id ? "done" : s.status,
          meta: s.id === id ? meta : s.meta,
        }))
      );
      startCreep();
    },
    [startCreep]
  );

  const failStep = useCallback(
    (id, message, isSessionExpired = false) => {
      stopSmoothProgress();
      setSteps((prev) =>
        prev.map((s) => ({ ...s, status: s.id === id ? "error" : s.status }))
      );
      setErrorMessage(message || "Something went wrong");
      setState(isSessionExpired ? "session_expired" : "error");
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
      prev.map((s) => ({
        ...s,
        status: s.status === "active" ? "done" : s.status,
      }))
    );
  }, [stopSmoothProgress]);

  useEffect(() => {
    if (percent < 8 && state === "loading") animateTo(8);
  }, [state, percent, animateTo]);

  return {
    steps,
    percent,
    logs,
    state,
    errorMessage,
    providerLabel,
    addLog,
    startStep,
    finishStep,
    failStep,
    reset,
    complete,
    currentMessage,
    streamLines,
    elapsedSeconds,
  };
}
