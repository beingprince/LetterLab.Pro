import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Search, BarChart3, Globe } from 'lucide-react';
import { Box, Typography, Grid } from '@mui/material';

const techStack = [
    { name: "Microsoft Graph", slug: "microsoft", icon: LayoutGrid },
    { name: "Google Workspace", slug: "google", icon: Globe },
    { name: "Microsoft Clarity", slug: "microsoft", icon: BarChart3 },
    { name: "Google Search Console", slug: "google", icon: Search },
    { name: "Google Gemini", slug: "google", icon: Globe },
    { name: "OpenAI GPT-4", slug: "openai", icon: Globe },
];

const ArchitectureBlock = ({ title, items, children }) => (
    <div className="mb-12">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
        <ul className="space-y-3 mb-6">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
        {children}
    </div>
);

const TechItem = ({ tech }) => {
    const [imgError, setImgError] = useState(false);
    const IconFallback = tech.icon;

    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
                {!imgError ? (
                    <img
                        src={`https://cdn.simpleicons.org/${tech.slug}`}
                        alt={tech.name}
                        className="w-5 h-5 opacity-80 dark:invert"
                        onError={() => setImgError(true)}
                        loading="lazy"
                    />
                ) : (
                    <IconFallback className="w-5 h-5 text-slate-500" />
                )}
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{tech.name}</span>
        </div>
    );
};

export default function TechStack() {
    return (
        <section className="py-24 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="max-w-[1200px] mx-auto px-6 lg:px-8">

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24">

                    {/* Left Column: Text Content */}
                    <div className="md:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-12"
                        >
                            <Typography variant="h2" className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                                System Architecture & Integrations
                            </Typography>
                            <Typography className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                LetterLab integrates multiple real-world technologies in a controlled and structured manner.
                            </Typography>
                        </motion.div>

                        <ArchitectureBlock
                            title="Authentication & Email Access"
                            items={[
                                "Google OAuth for Gmail login and scoped email access",
                                "Microsoft Graph API for Outlook authentication and email interaction"
                            ]}
                        />

                        <ArchitectureBlock
                            title="AI & Language Processing"
                            items={[
                                "Google Gemini API",
                                "OpenAI (ChatGPT) API",
                                "Models are used through structured prompts to assist drafting and summarization within defined boundaries."
                            ]}
                        />

                        <ArchitectureBlock
                            title="Analytics & Monitoring"
                            items={[
                                "Google Analytics (usage insights)",
                                "Google Search Console (visibility and indexing performance)",
                                "These tools are used for technical monitoring and performance evaluation — not for commercial tracking purposes."
                            ]}
                        />
                    </div>

                    {/* Right Column: Visual Stack */}
                    <div className="md:col-span-5">
                        <div className="sticky top-24 bg-white dark:bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">Core Technologies</h4>
                            <div className="grid grid-cols-1 gap-3">
                                {techStack.map(tech => (
                                    <TechItem key={tech.name} tech={tech} />
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Frontend & Backend</h4>
                                <div className="flex flex-wrap gap-2">
                                    {["React 18", "Node.js", "TypeScript", "Tailwind CSS", "MongoDB"].map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
