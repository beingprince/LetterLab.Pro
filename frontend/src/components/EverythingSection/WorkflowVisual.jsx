
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function WorkflowVisual({ activeStep }) {
    if (!activeStep) return null;

    return (
        <div className="w-full max-w-[560px] mx-auto h-full md:h-[480px] flex flex-col bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden relative">
            {/* 
        Visual Area: Takes up majority of space.
        Uses a subtle product-surface background.
      */}
            <div className="flex-1 bg-neutral-50/50 dark:bg-neutral-950/30 relative p-6 md:p-8 flex items-center justify-center overflow-hidden">

                {/* Subtle grid pattern for technical feel */}
                <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{
                        backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                        backgroundSize: "32px 32px"
                    }}
                />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeStep.id}
                        initial={{ opacity: 0, y: 10, scale: 1 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 1 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                        className="relative w-full h-full flex items-center justify-center"
                    >
                        {activeStep.id === "context" && <VisualContext />}
                        {activeStep.id === "signal" && <VisualSignal />}
                        {activeStep.id === "response" && <VisualResponse />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* 
        Detail Panel: Bottom section.
        Strict height control.
      */}
            <div className="flex-shrink-0 p-6 md:p-8 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeStep.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-widest text-brand-dim">
                                    {activeStep.label}
                                </span>
                                {/* 
                   Optional badge for "Authorized" or "Secure" 
                   Adds to credibility 
                */}
                                <span className="px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700 text-[10px] uppercase font-bold text-brand-dim">
                                    Verified
                                </span>
                            </div>

                            <p className="text-base text-brand-text font-medium leading-relaxed">
                                {activeStep.scenario}
                            </p>

                            <div className="grid grid-cols-1 gap-2 pt-2">
                                {activeStep.benefits.map((benefit, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <CheckCircleIcon className="w-4 h-4 text-brand-primary/80 flex-shrink-0" />
                                        <span className="text-sm text-brand-dim">
                                            {benefit}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

// --- Visual Subcomponents (Product Mocks) ---

function VisualContext() {
    return (
        <div className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 p-1 flex flex-col gap-1 ring-1 ring-black/5">
            {/* Fake window header */}
            <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                <div className="ml-auto w-16 h-2 rounded bg-neutral-100 dark:bg-neutral-800" />
            </div>
            {/* List Items */}
            <div className="p-3 space-y-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className={`p-3 rounded-lg flex items-center gap-3 transition-colors ${i === 2 ? 'bg-blue-50/50 dark:bg-blue-900/10 ring-1 ring-blue-100 dark:ring-blue-900/30' : 'opacity-50'}`}>
                        <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0" />
                        <div className="space-y-1.5 flex-1">
                            <div className="w-2/3 h-2.5 bg-neutral-200 dark:bg-neutral-700 rounded" />
                            <div className="w-1/2 h-2 bg-neutral-100 dark:bg-neutral-800 rounded" />
                        </div>
                        {i === 2 && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                    </div>
                ))}
            </div>
        </div>
    );
}

function VisualSignal() {
    return (
        <div className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden ring-1 ring-black/5">
            <div className="bg-neutral-50 dark:bg-neutral-950 p-3 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                <div className="text-[10px] font-bold uppercase text-brand-dim tracking-wider">Analysis</div>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <div className="text-[10px] font-medium text-green-600 dark:text-green-400">Live</div>
                </div>
            </div>
            <div className="p-5 space-y-4">
                {/* Extraction visual */}
                <div className="flex gap-4">
                    {/* Source Line */}
                    <div className="w-1 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full opacity-60" />
                    <div className="flex-1 space-y-3">
                        <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400">Action Item</span>
                            </div>
                            <div className="h-2 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded" />
                        </div>

                        <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">Deadline</span>
                            </div>
                            <div className="h-2 w-1/2 bg-neutral-200 dark:bg-neutral-700 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function VisualResponse() {
    return (
        <div className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 p-5 ring-1 ring-black/5 flex flex-col gap-4">
            {/* Tone Selector */}
            <div className="flex justify-between items-center">
                <div className="flex -space-x-1">
                    <div className="w-5 h-5 rounded-full border-2 border-white dark:border-neutral-900 bg-neutral-300" />
                    <div className="w-5 h-5 rounded-full border-2 border-white dark:border-neutral-900 bg-neutral-300" />
                </div>
                <div className="px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-[10px] font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                    Professional Tone
                </div>
            </div>

            {/* Draft Body */}
            <div className="space-y-2">
                <div className="w-1/3 h-2.5 bg-neutral-200 dark:bg-neutral-700 rounded" />
                <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded" />
                <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded" />
                <div className="w-5/6 h-2 bg-neutral-100 dark:bg-neutral-800 rounded" />
            </div>

            {/* Action Button */}
            <div className="self-end mt-2">
                <div className="h-8 px-4 rounded-full bg-brand-primary shadow-sm flex items-center gap-2">
                    <span className="text-[10px] font-bold text-white">Insert Draft</span>
                    <div className="w-3 h-3 bg-white/20 rounded-full" />
                </div>
            </div>
        </div>
    );
}
