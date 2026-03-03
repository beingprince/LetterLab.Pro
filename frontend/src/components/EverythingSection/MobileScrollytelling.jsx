
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { workflowSteps } from "./data";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/solid";
import WorkflowVisual from "./WorkflowVisual";

export default function MobileScrollytelling() {
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const containerRef = useRef(null);
    const touchStartY = useRef(0);
    const [isLocked, setIsLocked] = useState(false);

    // Intersection Observer to detect entry and reset
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Entered view
                    if (entry.intersectionRatio > 0.6) {
                        setIsLocked(true);
                    }
                } else {
                    // Left view - reset
                    if (entry.boundingClientRect.top > 0) {
                        // Scrolled down out of view (unlikely if locked, but possible via skip)
                    } else {
                        // Scrolled up out of view - reset to 0
                        setActiveStepIndex(0);
                        setIsLocked(false);
                    }
                }
            },
            { threshold: [0.6] }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        return () => observer.disconnect();
    }, []);

    // Scroll/Touch Logic
    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const handleWheel = (e) => {
            if (!isLocked) return;

            // Check for reduced motion
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

            // Scrolling Down
            if (e.deltaY > 0) {
                if (activeStepIndex < 2) {
                    e.preventDefault();
                    // Debounce or threshold? Simplified for now.
                    // Assuming discrete wheel events or throttle needed in real world
                    // For this demo, let's just advance. 
                    // In production, you'd want cooler cooldowns.
                    // Adding a simple timestamp check? 

                    // Let's rely on User intent: direct step advance
                    handleNext();
                } else {
                    // Step 2 (Last step) -> Unlock
                    setIsLocked(false);
                }
            }
            // Scrolling Up
            else if (e.deltaY < 0) {
                if (activeStepIndex > 0) {
                    e.preventDefault();
                    handlePrev();
                } else {
                    // Step 0 -> Unlock to go up
                    setIsLocked(false);
                }
            }
        };

        const handleTouchStart = (e) => {
            touchStartY.current = e.touches[0].clientY;
        };

        const handleTouchMove = (e) => {
            if (!isLocked) return;
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

            const touchY = e.touches[0].clientY;
            const diff = touchStartY.current - touchY;

            // Threshold for swipe
            if (Math.abs(diff) > 50) {
                if (diff > 0) { // Swipe Up (Scroll Down)
                    if (activeStepIndex < 2) {
                        if (e.cancelable) e.preventDefault();
                    }
                } else { // Swipe Down (Scroll Up)
                    if (activeStepIndex > 0) {
                        if (e.cancelable) e.preventDefault();
                    }
                }
            }
        };

        const handleTouchEnd = (e) => {
            if (!isLocked) return;
            const touchY = e.changedTouches[0].clientY;
            const diff = touchStartY.current - touchY;

            if (Math.abs(diff) > 50) {
                if (diff > 0) { // Swipe Up -> Next
                    if (activeStepIndex < 2) {
                        handleNext();
                    } else {
                        setIsLocked(false);
                    }
                } else { // Swipe Down -> Prev
                    if (activeStepIndex > 0) {
                        handlePrev();
                    } else {
                        setIsLocked(false);
                    }
                }
            }
        };

        // Passive false is crucial for preventing default
        element.addEventListener("wheel", handleWheel, { passive: false });
        element.addEventListener("touchstart", handleTouchStart, { passive: true });
        element.addEventListener("touchmove", handleTouchMove, { passive: false });
        element.addEventListener("touchend", handleTouchEnd, { passive: true });

        return () => {
            element.removeEventListener("wheel", handleWheel);
            element.removeEventListener("touchstart", handleTouchStart);
            element.removeEventListener("touchmove", handleTouchMove);
            element.removeEventListener("touchend", handleTouchEnd);
        };
    }, [isLocked, activeStepIndex]);

    const handleNext = () => setActiveStepIndex(prev => Math.min(prev + 1, 2));
    const handlePrev = () => setActiveStepIndex(prev => Math.max(prev - 1, 0));

    const activeStep = workflowSteps[activeStepIndex];

    return (
        <div
            ref={containerRef}
            className="w-full h-[100dvh] flex flex-col relative bg-neutral-50 dark:bg-neutral-900 overflow-hidden"
        >
            {/* Progress Bar & Skip */}
            <div className="absolute top-4 left-6 right-6 z-20 flex justify-between items-center">
                <div className="flex gap-2">
                    {[0, 1, 2].map(idx => (
                        <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeStepIndex ? 'w-8 bg-brand-primary' : 'w-2 bg-neutral-300 dark:bg-neutral-700'}`}
                        />
                    ))}
                </div>
                <button
                    onClick={() => setIsLocked(false)}
                    className="text-xs font-bold text-brand-dim uppercase tracking-wider px-3 py-1 bg-white/50 dark:bg-black/20 rounded-full border border-neutral-200 dark:border-neutral-800 backdrop-blur-sm"
                >
                    Skip
                </button>
            </div>

            {/* Main Content Container */}
            <div className="flex flex-col h-full pt-20 pb-8 px-6 relative z-10">

                {/* 1. Text Area (Top) */}
                <div className="mb-4 shrink-0">
                    <motion.div
                        key={activeStepIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-bold text-brand-primary">0{activeStepIndex + 1}</span>
                            <h3 className="text-2xl font-bold text-brand-text">{activeStep.title}</h3>
                        </div>
                        <p className="text-brand-dim leading-relaxed line-clamp-3">
                            {activeStep.summary}
                        </p>
                    </motion.div>
                </div>

                {/* 2. Visual Content (Expanded Middle) */}
                <div className="flex-1 min-h-0 flex flex-col justify-center py-2">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep.id}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.05, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full"
                        >
                            <WorkflowVisual activeStep={activeStep} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* 3. Hint (Bottom) */}
                <div className="mt-2 flex flex-col items-center gap-2 shrink-0 opacity-60">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-dim">
                        {activeStepIndex === 2 ? "Swipe up to finish" : "Swipe to continue"}
                    </p>
                    <ChevronDownIcon className="w-4 h-4 text-brand-dim animate-bounce" />
                </div>
            </div>
        </div>
    );
}
