import React, { useState, useEffect } from "react";
import EverythingHeader from "./EverythingHeader";
import WorkflowNav from "./WorkflowNav";
import WorkflowVisual from "./WorkflowVisual";
import MobileScrollytelling from "./MobileScrollytelling";
import { workflowSteps } from "./data";

export default function EverythingSection() {
    const [activeStepId, setActiveStepId] = useState(workflowSteps[0].id);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            // 768px or coarse pointer (touch)
            setIsMobile(window.matchMedia("(max-width: 768px) or (pointer: coarse)").matches);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const activeStep = workflowSteps.find((s) => s.id === activeStepId);

    // Mobile View
    if (isMobile) {
        return <MobileScrollytelling />;
    }

    // Desktop View (Existing)
    return (
        <section className="relative w-full py-20 md:py-24 px-6 bg-[#f8f9fb] dark:bg-neutral-950/30 overflow-hidden">
            <div className="max-w-[1200px] mx-auto relative z-10">
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
                            onSelect={setActiveStepId}
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
