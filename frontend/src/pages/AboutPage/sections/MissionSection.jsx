import React from 'react';
import { motion } from 'framer-motion';
import { Server, ShieldCheck, Cpu } from 'lucide-react';

const values = [
    {
        icon: Server,
        title: "Structured Performance",
        desc: "API calls are optimized to avoid redundancy. State transitions are predictable and controlled. Usage tokens are limited to maintain infrastructure sustainability while keeping access free."
    },
    {
        icon: ShieldCheck,
        title: "Responsible Authentication",
        desc: "OAuth integrations operate within official API scopes. User data is processed only for requested functionality. Unnecessary persistence is avoided."
    },
    {
        icon: Cpu,
        title: "Context-Aware AI Assistance",
        desc: "AI integration is designed to assist, not automate decision-making. Language models are used to support drafting clarity while preserving user authorship."
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 24 }, // 24px entrance
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

export default function MissionSection() {
    return (
        <section className="py-24 md:py-32 bg-white dark:bg-[#0F1117]">
            <div className="max-w-[1200px] mx-auto px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl mb-6"
                    >
                        Engineering Principles
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
                    >
                        LetterLab is developed around three practical system principles that ensure stability, security, and user control.
                    </motion.p>
                </div>

                {/* Cards Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {values.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                variants={itemVariants}
                                className="
                  group relative flex flex-col items-start text-left 
                  p-8 rounded-2xl 
                  bg-slate-50 dark:bg-slate-900/50
                  border border-slate-100 dark:border-slate-800
                  hover:border-slate-200 dark:hover:border-slate-700
                  hover:bg-white dark:hover:bg-slate-800
                  hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:hover:shadow-none
                  transition-all duration-300 ease-out
                  h-full
                "
                            >
                                {/* Icon Container - Unlocked from center */}
                                <div className="
                  mb-6 p-3 rounded-xl 
                  bg-white dark:bg-slate-800 
                  border border-slate-100 dark:border-slate-700
                  text-blue-600 dark:text-blue-400
                  group-hover:text-blue-500 group-hover:scale-105
                  shadow-sm
                  transition-all duration-300
                ">
                                    <Icon size={24} strokeWidth={1.5} />
                                </div>

                                {/* Vertical Rhythm: 16px gap */}
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                    {item.title}
                                </h3>

                                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
