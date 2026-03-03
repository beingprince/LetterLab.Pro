
import { useState, useEffect, useRef, useCallback } from "react";

export function useTestimonialsCarousel(items, interval = 7000) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef(null);
    const pauseTimeoutRef = useRef(null);
    const touchStartX = useRef(0);

    const count = items.length;

    // Navigation Helpers
    const next = useCallback(() => {
        setActiveIndex((current) => (current + 1) % count);
    }, [count]);

    const prev = useCallback(() => {
        setActiveIndex((current) => (current - 1 + count) % count);
    }, [count]);

    const goTo = useCallback((index) => {
        if (index >= 0 && index < count) {
            setActiveIndex(index);
        }
    }, [count]);

    // Auto-Play Logic
    useEffect(() => {
        if (count <= 1 || isPaused) return;

        timerRef.current = setInterval(next, interval);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [count, isPaused, interval, next]);

    // Pause / Resume Logic
    const pause = useCallback(() => {
        setIsPaused(true);
        if (timerRef.current) clearInterval(timerRef.current);

        // Clear existing resume timer
        if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    }, []);

    const resume = useCallback(() => {
        // Resume after 10s of inactivity
        if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);

        pauseTimeoutRef.current = setTimeout(() => {
            setIsPaused(false);
        }, 10000);
    }, []);

    // Interaction Handlers
    const handlers = {
        onMouseEnter: pause,
        onMouseLeave: resume,
        // Keyboard
        onKeyDown: (e) => {
            if (e.key === "ArrowLeft") {
                pause();
                prev();
                resume();
            } else if (e.key === "ArrowRight") {
                pause();
                next();
                resume();
            }
        },
        // Touch / Swipe
        onTouchStart: (e) => {
            pause();
            touchStartX.current = e.touches[0].clientX;
        },
        onTouchEnd: (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX.current - touchEndX;

            if (Math.abs(diff) > 35) { // Threshold
                if (diff > 0) {
                    next();
                } else {
                    prev();
                }
            }
            resume();
        }
    };

    return {
        activeIndex,
        count,
        next: () => { pause(); next(); resume(); },
        prev: () => { pause(); prev(); resume(); },
        goTo: (idx) => { pause(); goTo(idx); resume(); },
        handlers
    };
}
