import { useState, useEffect, useCallback, useRef } from "react";
import { setLastActivityTimestamp, clearSession } from "../components/session/sessionUtils";

const minToMs = (m) => (m ? m * 60 * 1000 : 0);
const warningMin = Number(import.meta.env.VITE_SESSION_WARNING_MIN) || 55;
const expireMin = Number(import.meta.env.VITE_SESSION_EXPIRE_MIN) || 60;
const DEFAULT_WARNING_AT_MS = minToMs(warningMin);
const DEFAULT_EXPIRE_AT_MS = minToMs(expireMin);

const TOKEN_KEY = "authToken";

/**
 * useSessionTimeout
 * Tracks last activity, shows warning dialog at WARNING_AT, auto-logout at EXPIRE_AT.
 * Continue attempts token refresh via /api/auth/me or similar.
 */
export function useSessionTimeout(options = {}) {
  const {
    warningAtMs = DEFAULT_WARNING_AT_MS,
    expireAtMs = DEFAULT_EXPIRE_AT_MS,
    onLogout,
  } = options;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const [continueLoading, setContinueLoading] = useState(false);

  const lastActivityRef = useRef(Date.now());
  const warningTimeRef = useRef(null);
  const expireTimeRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const warningShownRef = useRef(false);

  const clearTokensAndRedirect = useCallback(
    (reason = "expired") => {
      clearSession();
      const url = `/account${reason ? `?reason=${encodeURIComponent(reason)}` : ""}`;
      if (typeof onLogout === "function") {
        onLogout(url);
      } else {
        window.location.href = url;
      }
    },
    [onLogout]
  );

  const resetTimers = useCallback(() => {
    lastActivityRef.current = Date.now();
    warningTimeRef.current = lastActivityRef.current + warningAtMs;
    expireTimeRef.current = lastActivityRef.current + expireAtMs;
    warningShownRef.current = false;
  }, [warningAtMs, expireAtMs]);

  const handleContinue = useCallback(async () => {
    setContinueLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        clearTokensAndRedirect("no_token");
        return;
      }

      const res = await fetch(`${apiBase}/api/professors`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        resetTimers();
        setDialogOpen(false);
      } else if (res.status === 401) {
        clearTokensAndRedirect("expired");
      } else {
        clearTokensAndRedirect("refresh_failed");
      }
    } catch {
      clearTokensAndRedirect("refresh_failed");
    } finally {
      setContinueLoading(false);
    }
  }, [clearTokensAndRedirect, resetTimers]);

  const handleLogOff = useCallback(() => {
    setDialogOpen(false);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    clearTokensAndRedirect("user");
  }, [clearTokensAndRedirect]);

  // Track activity
  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    const onActivity = () => {
      lastActivityRef.current = Date.now();
      setLastActivityTimestamp();
    };
    events.forEach((e) => window.addEventListener(e, onActivity));
    return () => events.forEach((e) => window.removeEventListener(e, onActivity));
  }, []);

  // Initialize and check for warning/expire
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    resetTimers();

    const check = () => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivityRef.current;

      if (timeSinceActivity >= expireAtMs) {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }
        setDialogOpen(false);
        clearTokensAndRedirect("expired");
        return;
      }

      if (timeSinceActivity >= warningAtMs && !warningShownRef.current) {
        warningShownRef.current = true;
        setDialogOpen(true);
        const remaining = Math.ceil((expireTimeRef.current - now) / 1000);
        setCountdownSeconds(Math.max(0, remaining));

        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = setInterval(() => {
          const remaining = Math.ceil((expireTimeRef.current - Date.now()) / 1000);
          setCountdownSeconds((prev) => Math.max(0, remaining));
          if (remaining <= 0) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
            }
            setDialogOpen(false);
            clearTokensAndRedirect("expired");
          }
        }, 1000);
      }
    };

    const interval = setInterval(check, 10000);
    check();

    return () => {
      clearInterval(interval);
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [warningAtMs, expireAtMs, resetTimers, clearTokensAndRedirect]);

  return {
    dialogOpen,
    countdownSeconds,
    continueLoading,
    onContinue: handleContinue,
    onLogOff: handleLogOff,
  };
}
