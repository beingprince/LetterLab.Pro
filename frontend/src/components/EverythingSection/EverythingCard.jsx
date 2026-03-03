
import React from "react";
import { motion } from "framer-motion";

export default function EverythingCard({ card, index }) {
    const Icon = card.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="rounded-3xl border border-brand-border bg-brand-card shadow-glass overflow-hidden"
        >
            {/* Preview zone */}
            <div className="relative h-44 md:h-48 bg-neutral-100/70 dark:bg-neutral-900/30">
                {/* subtle grid / texture */}
                <div
                    aria-hidden
                    className="absolute inset-0 opacity-[0.35] dark:opacity-[0.18]"
                    style={{
                        backgroundImage:
                            "radial-gradient(currentColor 1px, transparent 1px)",
                        backgroundSize: "18px 18px",
                    }}
                />

                {/* floating little badges */}
                <div className="absolute left-4 top-4">
                    <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/90 dark:bg-black/40 border border-brand-border text-[12px] font-medium text-brand-text shadow-sm">
                        {card.floatingLeft}
                    </span>
                </div>
                <div className="absolute right-4 top-4">
                    <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/90 dark:bg-black/40 border border-brand-border text-[12px] font-medium text-brand-text shadow-sm">
                        {card.floatingRight}
                    </span>
                </div>

                {/* big centered icon circle */}
                <div className="absolute inset-0 grid place-items-center">
                    <div className="relative">
                        <div className="h-24 w-24 rounded-full bg-white/90 dark:bg-black/40 border border-brand-border shadow-sm grid place-items-center">
                            <Icon className="h-10 w-10 text-brand-text" />
                        </div>
                        {/* subtle ring */}
                        <div
                            aria-hidden
                            className="absolute -inset-6 rounded-full border border-white/60 dark:border-white/10"
                        />
                    </div>
                </div>
            </div>

            {/* Text zone */}
            <div className="p-6">
                <h3 className="text-lg font-medium text-brand-text">
                    {card.title}
                </h3>
                <p className="mt-2 text-sm text-brand-dim leading-relaxed">
                    {card.desc}
                </p>
            </div>
        </motion.div>
    );
}
