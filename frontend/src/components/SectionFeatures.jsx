import React, { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

// --- INLINE ICONS ---
const IconPlay = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8 text-brand-primary drop-shadow-sm"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653z"
      clipRule="evenodd"
    />
  </svg>
);

const IconZap = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 text-brand-primary drop-shadow-sm"
    aria-hidden="true"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconWand = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 text-brand-primary drop-shadow-sm"
    aria-hidden="true"
  >
    <path d="M15 4V2" />
    <path d="M15 16v-2" />
    <path d="M14 9.5 16.5 7" />
    <path d="m11.5 12.5 2.5 2.5" />
    <path d="M9 4.5 7 2" />
    <path d="m12 7.5 2.5-2.5" />
    <path d="M3 21 12 12" />
    <path d="m9 15-2.5 2.5" />
    <path d="M13.5 15 15 16.5" />
    <path d="m3.5 18.5 1.5 1.5" />
    <path d="M7 16.5 5.5 18" />
    <path d="M9.5 12 12 9.5" />
    <path d="M14.5 7 17 4.5" />
  </svg>
);

const IconArrowRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 011.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
      clipRule="evenodd"
    />
  </svg>
);
// --- END OF INLINE ICONS ---

const steps = [
  {
    id: 1,
    badge: "1",
    icon: <IconPlay />,
    title: "Connect Your Email",
    description: "Sign in securely with your email provider. LetterLab only reads what's needed to help you respond."
  },
  {
    id: 2,
    badge: "2",
    icon: <IconZap />,
    title: "Pull the Context",
    description: "LetterLab scans the email thread to understand the full conversation before writing anything."
  },
  {
    id: 3,
    badge: "3",
    icon: <IconWand />,
    title: "Generate Your Reply",
    description: "Get a clear, professional draft in seconds. Edit it if you like, then send with confidence."
  }
];

export const SectionFeatures = () => {
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const el = document.getElementById('how-it-works')
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (typeof window.gtag !== 'undefined') {
          window.gtag('event', 'section_view', { section_name: 'how_it_works' })
        }
        obs.disconnect()
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section aria-labelledby="how-it-works-heading" id="how-it-works" className="pt-20 pb-32 md:py-32 bg-brand-bg relative">
      <motion.div 
        className="max-w-6xl mx-auto px-6"
        {...(shouldReduce ? {} : {
          whileInView: { opacity: 1, y: 0 },
          initial: { opacity: 0, y: 16 },
          viewport: { once: true },
          transition: { duration: 0.45, ease: 'easeOut' }
        })}
      >
        <div className="text-center mb-20">
          <p role="doc-subtitle" className="font-heading font-semibold text-brand-primary tracking-wider uppercase text-sm mb-4">HOW IT WORKS</p>
          <h2 id="how-it-works-heading" className="font-heading text-4xl md:text-5xl font-bold text-brand-text mb-6">Write Better Emails Instantly</h2>
          <p className="font-body text-brand-dim text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">Connect your inbox and let LetterLab understand the conversation before crafting a clear, professional reply.</p>
        </div>

        <div className="relative">
          {/* Connector Line - Hidden on Mobile */}
          <div className="hidden md:block absolute top-[28px] left-[16.66%] right-[16.66%] z-0 h-1" aria-hidden="true">
             <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <motion.line 
                x1="0" 
                y1="0" 
                x2="100%" 
                y2="0" 
                stroke="#3B82F6" 
                strokeDasharray="6 5" 
                strokeWidth="1.5"
                {...(shouldReduce ? { style: { pathLength: 1, opacity: 1 } } : {
                  initial: { pathLength: 0, opacity: 0 },
                  whileInView: { pathLength: 1, opacity: 1 },
                  viewport: { once: true },
                  transition: { duration: 0.9, ease: 'easeInOut', delay: 0.2 }
                })}
              />
            </svg>
          </div>

          <ol role="list" className="list-none flex flex-col md:grid md:grid-cols-3 gap-8 md:gap-12 relative z-10">
            {steps.map((step, index) => {
              return (
                <li 
                  key={step.id} 
                  aria-label={`Step ${step.id}`}
                  className="group outline-none"
                >
                  <motion.div 
                    tabIndex={0} 
                    className="glass-surface bg-brand-card h-full flex flex-col items-start md:items-center text-left md:text-center p-8 rounded-glass border border-brand-border md:border-t hover:-translate-y-2 hover:shadow-xl hover:bg-white/80 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
                    {...(shouldReduce ? {} : {
                      whileInView: { opacity: 1, y: 0 },
                      initial: { opacity: 0, y: 32 },
                      viewport: { once: true, margin: '-60px' },
                      transition: { duration: 0.5, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] },
                      whileHover: { y: -6, transition: { duration: 0.2, ease: 'easeOut' } },
                      whileTap: { scale: 0.97 }
                    })}
                  >
                    <motion.div 
                      className="w-14 h-14 rounded-full bg-brand-iconBg border border-brand-border relative flex items-center justify-center mb-6 shrink-0"
                      {...(shouldReduce ? {} : {
                        whileHover: { scale: 1.08 }
                      })}
                    >
                      {step.icon}
                      <div className="absolute top-0 right-0 w-5 h-5 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">
                        {step.badge}
                      </div>
                    </motion.div>
                    
                    <h3 className="font-heading font-semibold text-brand-text mb-3 text-xl">{step.title}</h3>
                    <p className="font-body text-sm text-brand-dim leading-relaxed">{step.description}</p>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-20 md:mt-24 flex justify-center pb-8 relative z-20">
          <button
            onClick={() => window.location.href = '/chat'}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-primary via-blue-400 to-brand-primary bg-[size:200%] animate-bg-pan text-white font-heading font-bold rounded-xl shadow-glass hover:shadow-2xl hover:-translate-y-1 transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary focus-visible:outline-none"
          >
            Start Drafting <IconArrowRight />
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default SectionFeatures;