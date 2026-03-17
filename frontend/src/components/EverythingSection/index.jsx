import React, { useState, useEffect } from "react";
import EverythingHeader from "./EverythingHeader";
import WorkflowNav from "./WorkflowNav";
import WorkflowVisual from "./WorkflowVisual";
import MobileScrollytelling from "./MobileScrollytelling";
import { workflowSteps } from "./data";

export default function EverythingSection() {
    const [lockedStepId, setLockedStepId] = useState(workflowSteps[0].id);
    const [hoveredStepId, setHoveredStepId] = useState(null);

    // Derived single source of truth for both nav active states and visual panel content
    const activeStepId = hoveredStepId ?? lockedStepId;

    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
    });

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 768px), (pointer: coarse)");
        const checkMobile = (e) => setIsMobile(e.matches);
        mq.addEventListener("change", checkMobile);
        return () => mq.removeEventListener("change", checkMobile);
    }, []);

    const activeStep = workflowSteps.find((s) => s.id === activeStepId);

    // Mobile View
    if (isMobile) {
        return <MobileScrollytelling />;
    }

    // Desktop View (Existing)
    return (
        <section className="w-full py-20 md:py-24 bg-[#f8f9fb] dark:bg-neutral-950/30 overflow-hidden relative">
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <EverythingHeader />

                {/* 
          Main Grid Layout
          Desktop: 12-col grid
          - Left (Nav): 5 cols
          - Right (Visual): 7 cols
          Min-height enforced to prevent layout shift
        */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start min-h-[520px]">
                    {/* Left Navigation */}
                    <div className="lg:col-span-5 flex flex-col justify-center h-full">
                        <WorkflowNav
                            steps={workflowSteps}
                            activeStepId={activeStepId}
                            onSelect={setLockedStepId}
                            onHover={setHoveredStepId}
                        />
                    </div>

                    {/* Right Visual Panel */}
                    <div className="lg:col-span-7 w-full flex justify-center lg:justify-end">
                        <WorkflowVisual activeStep={activeStep} />
                    </div>
                </div>
            </div>
        </section>
    );
}
