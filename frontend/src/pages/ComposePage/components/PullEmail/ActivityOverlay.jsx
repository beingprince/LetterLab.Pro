import React from 'react';
import { motion } from 'framer-motion';

/**
 * ActivityOverlay
 * 
 * ChatGPT-style AI loading overlay with task progress.
 * Shows animated task list with status indicators.
 * Automatically advances through tasks with realistic timing.
 */

const ActivityOverlay = ({ tasks: initialTasks = [], onComplete }) => {
    const [tasks, setTasks] = React.useState(initialTasks);
    const [currentTaskIndex, setCurrentTaskIndex] = React.useState(0);

    // Auto-advance through tasks (same logic, just different presentation)
    React.useEffect(() => {
        if (currentTaskIndex >= tasks.length) {
            const timer = setTimeout(() => {
                onComplete?.();
            }, 600);
            return () => clearTimeout(timer);
        }

        setTasks(prev => prev.map((task, idx) => ({
            ...task,
            status: idx < currentTaskIndex ? 'done' : idx === currentTaskIndex ? 'loading' : 'pending'
        })));

        const timer = setTimeout(() => {
            setCurrentTaskIndex(prev => prev + 1);
        }, 1200); // Slightly slower for "reading" feel

        return () => clearTimeout(timer);
    }, [currentTaskIndex, tasks.length, onComplete]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-black/90 backdrop-blur-md">
            <div className="w-full max-w-lg p-8">
                {/* Console Header */}
                <div className="mb-6 flex items-center gap-2 text-gray-400 dark:text-gray-500 font-mono text-xs tracking-widest uppercase">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    System Processing
                </div>

                {/* Console Output */}
                <div className="font-mono text-sm space-y-3">
                    {tasks.map((task, index) => (
                        <motion.div
                            key={task.label}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{
                                opacity: task.status === 'pending' ? 0.3 : 1,
                                x: 0
                            }}
                            className={`flex items-center gap-3 transition-colors duration-300 ${task.status === 'done' ? 'text-gray-400 dark:text-gray-600' :
                                task.status === 'loading' ? 'text-blue-600 dark:text-blue-400 font-bold' :
                                    'text-gray-300 dark:text-gray-700'
                                }`}
                        >
                            <span className="opacity-50 w-4 text-right">{index + 1}</span>
                            <span>{task.label}</span>
                            {task.status === 'loading' && (
                                <span className="inline-block w-2 H-4 bg-blue-600 dark:bg-blue-400 animate-pulse ml-1">_</span>
                            )}
                            {task.status === 'done' && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="ml-auto text-xs text-gray-300 dark:text-gray-700"
                                >
                                    [OK]
                                </motion.span>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActivityOverlay;
