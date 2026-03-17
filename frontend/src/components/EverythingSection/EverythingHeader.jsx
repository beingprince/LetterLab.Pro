
import React from "react";
import { motion } from "framer-motion";

export default function EverythingHeader() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center mb-16 md:mb-24 px-4"
        >
            <span className="block text-xs font-bold tracking-widest text-brand-dim uppercase mb-4 md:mb-6">
                HOW IT WORKS
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-brand-text leading-[1.1] mb-5">
                From thread to reply — instantly
            </h2>
            <p className="text-lg text-brand-dim font-medium max-w-2xl mx-auto leading-relaxed">
                LetterLab reads your email, finds what matters, and writes the perfect response in seconds.
            </p>
        </motion.div>
    );
}
