import React, { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

const steps = [
  {
    id: 1,
    badge: "01",
    title: "Connect Your Email",
    description: "Sign in securely with your email provider."
  },
  {
    id: 2,
    badge: "02",
    title: "Chat & Refine",
    description: "Converse with the AI assistant to provide context and shape the perfect message."
  },
  {
    id: 3,
    badge: "03",
    title: "Generate Your Reply",
    description: "Get a professional draft in seconds."
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
    <section aria-labelledby="how-it-works-heading" id="how-it-works" className="pt-20 pb-32 md:py-32 bg-brand-bg relative overflow-hidden">
      <motion.div 
        className="max-w-[1120px] mx-auto px-6 lg:px-8"
        {...(shouldReduce ? {} : {
          whileInView: { opacity: 1, y: 0 },
          initial: { opacity: 0, y: 16 },
          viewport: { once: true },
          transition: { duration: 0.45, ease: 'easeOut' }
        })}
      >
        <div className="text-center mb-16 md:mb-24">
          <p role="doc-subtitle" className="font-heading font-semibold text-brand-dim/80 tracking-widest text-xs uppercase mb-4">
            How It Works
          </p>
          <h2 id="how-it-works-heading" className="font-heading text-3xl md:text-5xl font-bold text-brand-text tracking-tight mb-5">
            Write Better Emails Instantly
          </h2>
          <p className="font-body text-brand-dim text-lg max-w-xl mx-auto leading-relaxed">
            Connect your inbox and let LetterLab understand the conversation before crafting a clear, professional reply.
          </p>
        </div>

        <div className="relative">
          {/* Subtle Connector Line (Thin, delicate, background) */}
          <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] z-0 border-t border-brand-border/40" aria-hidden="true" />

          <ol role="list" className="list-none flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-8 relative z-10 p-0 m-0">
            {steps.map((step, index) => {
              return (
                <li 
                  key={step.id} 
                  aria-label={`Step ${step.id}`}
                  className="group outline-none"
                >
                  <motion.div 
                    tabIndex={0} 
                    className="relative bg-white/60 backdrop-blur-md h-full flex flex-col items-start text-left p-8 md:p-10 rounded-[1.25rem] border border-brand-border/60 hover:bg-white hover:border-brand-border hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
                    {...(shouldReduce ? {} : {
                      whileInView: { opacity: 1, y: 0 },
                      initial: { opacity: 0, y: 24 },
                      viewport: { once: true, margin: '-40px' },
                      transition: { duration: 0.5, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] },
                      whileHover: { y: -3, transition: { duration: 0.2, ease: 'easeOut' } },
                    })}
                  >
                    {/* Top-Left: Large Subtle Number */}
                    <div className="font-heading font-bold text-[5rem] md:text-[6rem] leading-none text-brand-text/5 select-none tracking-tighter mb-16 transition-opacity duration-300 group-hover:text-brand-text/10">
                      {step.badge}
                    </div>
                    
                    {/* Bottom-Left: Content */}
                    <div className="mt-auto w-full">
                      <h3 className="font-heading font-semibold text-brand-text text-xl md:text-[1.35rem] mb-3 tracking-tight">
                        {step.title}
                      </h3>
                      <p className="font-body text-[0.95rem] md:text-base text-brand-dim leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>

      </motion.div>
    </section>
  );
};

export default SectionFeatures;