
import React, { useRef, useEffect } from "react";
import { motion, LayoutGroup } from "framer-motion";

export default function WorkflowNav({ steps, activeStepId, onSelect, onHover }) {
    const scrollRef = useRef(null);

    // Auto-scroll on mobile when active step changes (optional UX polish)
    useEffect(() => {
        if (window.innerWidth < 768 && scrollRef.current) {
            const activeEl = scrollRef.current.querySelector(`[data-id="${activeStepId}"]`);
            if (activeEl) {
                activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }
        }
    }, [activeStepId]);

    return (
        <LayoutGroup>
            {/* 
        Container:
        Desktop: Vertical flex
        Mobile: Horizontal scroll snap
      */}
            <div
                ref={scrollRef}
                className="
          flex flex-row md:flex-col 
          gap-4 md:gap-6 
          w-full 
          overflow-x-auto md:overflow-visible 
          snap-x snap-mandatory 
          pb-6 md:pb-0 
          hide-scrollbar
        "
            >
                {steps.map((step) => {
                    const isActive = activeStepId === step.id;
                    const Icon = step.icon;

                    return (
                        <div
                            key={step.id}
                            data-id={step.id}
                            onClick={() => onSelect(step.id)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    onSelect(step.id);
                                }
                            }}
                            onMouseEnter={() => onHover && onHover(step.id)}
                            onMouseLeave={() => onHover && onHover(null)}
                            role="tab"
                            tabIndex={0}
                            aria-selected={isActive}
                            aria-controls={`panel-${step.id}`}
                            className={`
                relative group flex-shrink-0 
                w-[280px] md:w-full 
                snap-center 
                cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2
                rounded-2xl border transition-all duration-300
                ${isActive
                                    ? "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-lg scale-[1.02] opacity-100 z-10"
                                    : "bg-transparent border-transparent opacity-60 hover:opacity-100 dark:opacity-50 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 scale-100 blur-[0.5px] hover:blur-0"
                                }
              `}
                        >
                            {/* Active Accent Line (Desktop) */}
                            {isActive && (
                                <motion.div
                                    layoutId="active-accent"
                                    className="hidden md:block absolute left-0 top-6 bottom-6 w-1 rounded-r-md bg-brand-primary"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                            )}

                            <div className="p-5 md:p-6 flex flex-col md:flex-row gap-4 items-start">

                                {/* Number & Icon */}
                                <div className={`
                  flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                  border transition-colors duration-300
                  ${isActive
                                        ? "bg-brand-primary/10 border-brand-primary/20 text-brand-primary"
                                        : "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-400"}
                `}>
                                    <Icon className="w-5 h-5" />
                                </div>

                                <div className="flex-1 text-left">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-xs font-bold text-neutral-400 select-none">
                                            {step.step}
                                        </span>
                                        <h3 className={`text-lg font-semibold transition-colors ${isActive ? "text-brand-text" : "text-brand-dim"}`}>
                                            {step.title}
                                        </h3>
                                    </div>

                                    {/* Description: Only visible when active */}
                                    <div
                                        className={`
                      overflow-hidden transition-all duration-300 ease-in-out
                      ${isActive ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"}
                    `}
                                    >
                                        <p className="text-sm text-brand-dim leading-relaxed">
                                            {step.summary}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </LayoutGroup>
    );
}
