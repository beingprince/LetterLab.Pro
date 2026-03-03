
import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const ScopeItem = ({ text }) => (
    <div className="flex items-start gap-3 mb-3">
        <CheckCircle2 className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
        <Typography className="text-slate-700 dark:text-slate-300 leading-relaxed text-[0.95rem]">
            {text}
        </Typography>
    </div>
);

const FeatureList = ({ title, items }) => (
    <div className="mb-8">
        <Typography variant="h6" className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
            {title}
        </Typography>
        {items.map((item, i) => (
            <ScopeItem key={i} text={item} />
        ))}
    </div>
);

export default function ProjectScope() {
    return (
        <section className="py-24 bg-white dark:bg-[#0F1117]">
            <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">

                    {/* Left Column: Scope & Release Phase */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="mb-12">
                            <Typography variant="h2" className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                                Current Scope
                            </Typography>
                            <Typography className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                The goal is to contribute to academic productivity by reducing drafting friction while maintaining user control.
                            </Typography>

                            <FeatureList
                                title="LetterLab is currently designed for:"
                                items={[
                                    "Students managing academic communication",
                                    "Professors handling structured correspondence"
                                ]}
                            />

                            <div className="p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                                <Typography variant="h6" className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-4">
                                    Limited-Scope Release Phase
                                </Typography>
                                <ul className="space-y-2">
                                    {["Stability testing", "System validation", "Iterative improvement", "Responsible AI usage patterns"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <Typography className="mt-4 text-xs text-slate-500 dark:text-slate-400 italic">
                                    Broader public release will only occur after structured evaluation and technical refinement.
                                </Typography>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Purpose */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="h-full flex flex-col justify-center">
                            <Typography variant="h2" className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                                Purpose of the Project
                            </Typography>

                            <Typography className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                The primary purpose of LetterLab is professional development and applied systems engineering practice.
                            </Typography>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                {[
                                    "Multi-provider OAuth implementation",
                                    "Secure third-party API integration",
                                    "AI model orchestration",
                                    "Responsive frontend architecture",
                                    "Backend service structure",
                                    "Controlled usage systems"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                        <CheckCircle2 className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <Typography className="text-base text-slate-500 dark:text-slate-400">
                                The long-term vision includes a broader public release after structured iteration and technical maturity.
                            </Typography>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
