// src/components/hero/HeroIntro.jsx
// Linear-style background + left-aligned parallax hero for LetterLab Pro

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.6,
      ease: EASE,
    },
  }),
};

export default function HeroIntro() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Background + card scroll transforms
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const spotlightScale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);
  const spotlightOpacity = useTransform(scrollYProgress, [0, 1], [0.9, 0.7]);
  const cardY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const cardShadow = useTransform(
    scrollYProgress,
    [0, 1],
    [
      "0 32px 90px rgba(15,23,42,0.25)",
      "0 24px 70px rgba(15,23,42,0.18)",
    ]
  );

  // Mouse-based parallax for right card
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setPointer({ x, y });
  };

  const rightParallax = {
    x: pointer.x * 14,
    y: pointer.y * 10,
    rotateX: pointer.y * -5,
    rotateY: pointer.x * 8,
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#f4f4f7]"
    >
      {/* Background base */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 -z-30"
      >
        <div
          className="w-full h-full"
          style={{
            background: `
              radial-gradient(
                900px 600px at 20% 0%,
                rgba(255,255,255,0.9),
                rgba(244,244,247,0.0) 70%
              ),
              radial-gradient(
                900px 600px at 80% 100%,
                rgba(228,228,231,0.8),
                rgba(244,244,247,0.0) 70%
              ),
              linear-gradient(180deg, #f4f4f7 0%, #ffffff 100%)
            `,
          }}
        />
      </motion.div>

      {/* Very subtle grid/noise */}
      <div className="pointer-events-none absolute inset-0 -z-20 opacity-[0.09]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.2) 1px, transparent 1px)",
            backgroundSize: "68px 68px",
          }}
        />
      </div>

      {/* Spotlight behind main content */}
      <motion.div
        style={{ scale: spotlightScale, opacity: spotlightOpacity }}
        className="absolute inset-x-0 top-[18%] -z-10 flex justify-start"
      >
        <div className="ml-[8%] w-[min(720px,90vw)] h-72 rounded-[40px] bg-white/85 shadow-[0_40px_120px_rgba(15,23,42,0.18)]" />
      </motion.div>

      {/* Content container */}
      <div className="relative z-10 w-full max-w-6xl px-5 sm:px-6 lg:px-8 py-12 lg:py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                ease: EASE,
                duration: 0.7,
                staggerChildren: 0.08,
              },
            },
          }}
          className="grid gap-10 lg:gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-center"
        >
          {/* LEFT – CONTENT */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            transition={{ ease: EASE, duration: 0.7 }}
            className="space-y-6 lg:space-y-7"
          >
            <motion.div
              variants={fadeUp}
              custom={0.5}
              className="flex flex-wrap items-center gap-3"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-3 py-1.5 text-[11px] font-medium shadow-[0_10px_30px_rgba(15,23,42,0.65)]">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Built for real inboxes, not fake demos.
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/90 border border-slate-200/80 px-3 py-1.5 text-[11px] text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                Gmail
                <span className="text-slate-400">•</span>
                Outlook
                <span className="text-slate-400">•</span>
                Academic email
              </div>
            </motion.div>

            <motion.div variants={fadeUp} custom={1}>
              <h1
                className="font-[Outfit] font-semibold leading-tight tracking-tight text-slate-900"
                style={{ fontSize: "clamp(2.4rem, 4vw, 3.5rem)" }}
              >
                Understand any email thread.
                <br />
                <span className="font-extrabold text-slate-900">
                  In seconds, not hours.
                </span>
              </h1>
            </motion.div>

            <motion.p
              variants={fadeUp}
              custom={1.5}
              className="max-w-xl text-[15px] md:text-[16px] leading-relaxed text-slate-600"
            >
              LetterLab Pro connects securely to your Gmail or Outlook, finds
              the exact conversation you asked about, explains what actually
              happened in plain language, and drafts a reply that sounds like
              you — not a robot. Perfect for students, professors, and anyone
              drowning in &quot;Re: Re: Re:&quot;.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={2}
              className="flex flex-wrap gap-2.5"
            >
              <Chip
                label="Summarize long threads into one clear view"
                colorClass="bg-white text-slate-800 border-slate-200"
                dotColor="bg-emerald-400"
              />
              <Chip
                label="See decisions, deadlines, and next steps"
                colorClass="bg-white text-slate-800 border-slate-200"
                dotColor="bg-sky-400"
              />
              <Chip
                label="Draft replies you can edit and send"
                colorClass="bg-white text-slate-800 border-slate-200"
                dotColor="bg-violet-400"
              />
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={2.5}
              className="space-y-4 pt-1 lg:space-y-3"
            >
              <div className="inline-flex flex-wrap items-center gap-3 rounded-2xl bg-white/95 border border-slate-200/80 px-3 py-2 shadow-[0_18px_40px_rgba(15,23,42,0.14)]">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  animate={{
                    boxShadow: [
                      "0 0 0 rgba(0,0,0,0)",
                      "0 0 18px rgba(15,23,42,0.35)",
                      "0 0 0 rgba(0,0,0,0)",
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold"
                >
                  Connect my email
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-800 border border-slate-200 bg-white hover:bg-slate-50"
                >
                  Watch it explain a thread
                </motion.button>

                <span className="hidden md:inline text-[11px] text-slate-400 pl-1">
                  No auto-sending. You approve every draft before it goes out.
                </span>
              </div>
              <p className="md:hidden text-[11px] text-slate-400">
                No auto-sending. You approve every draft before it goes out.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.15 } },
              }}
              className="mt-2 grid grid-cols-3 gap-3 max-w-md text-left"
            >
              <motion.div variants={fadeUp} custom={3}>
                <StatCard
                  label="Time saved"
                  value="2–5×"
                  description="Faster replies for frequent student & admin messages."
                />
              </motion.div>
              <motion.div variants={fadeUp} custom={3.3}>
                <StatCard
                  label="Cognitive load"
                  value="-60%"
                  description="Less scrolling through confusing chains."
                />
              </motion.div>
              <motion.div variants={fadeUp} custom={3.6}>
                <StatCard
                  label="Inbox types"
                  value="Gmail + O365"
                  description="Designed for academic & work inboxes."
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* RIGHT – PARALLAX PREVIEW CARD */}
          <motion.div style={{ y: cardY }} className="relative mt-2 lg:mt-0">
            <div className="absolute -inset-x-8 -inset-y-8 -z-10 flex items-center justify-center">
              <motion.div
                style={{ scale: spotlightScale, opacity: spotlightOpacity }}
                className="w-72 h-72 md:w-80 md:h-80 rounded-full bg-white/80 blur-3xl"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
              style={{
                boxShadow: cardShadow,
                transform: `
                  translate3d(${rightParallax.x}px, ${rightParallax.y}px, 0)
                  rotateX(${rightParallax.rotateX}deg)
                  rotateY(${rightParallax.rotateY}deg)
                `,
                transformStyle: "preserve-3d",
                transition: "transform 0.1s linear, box-shadow 0.2s ease-out",
              }}
              className="relative mx-auto w-full max-w-md rounded-[28px] bg-white/98 border border-slate-200/80 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/80">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="h-2 w-2 rounded-full bg-amber-300" />
                  <span className="h-2 w-2 rounded-full bg-rose-300" />
                </div>
                <p className="text-[11px] font-medium text-slate-500">
                  Inbox • CSCI 201 – Project 2
                </p>
                <span className="text-[10px] text-slate-400">Gmail</span>
              </div>

              <div className="px-4 pt-2 pb-1 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-[10px] text-slate-700 px-2 py-[3px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  12 messages
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-[10px] text-slate-700 px-2 py-[3px]">
                  Subject:{" "}
                  <span className="font-medium">Extension request</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-[10px] text-slate-700 px-2 py-[3px]">
                  Last reply • 3 hours ago
                </span>
              </div>

              <div className="px-4 pt-1 pb-2">
                <p className="text-[11px] font-medium text-slate-500 mb-1">
                  What this thread is actually about
                </p>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 space-y-0.5">
                  <p className="text-[11px] text-slate-700">
                    • You requested an extension on Project 2 due to overlapping
                    exams.
                  </p>
                  <p className="text-[11px] text-slate-700">
                    • Professor agreed, as long as you confirm a new due date.
                  </p>
                  <p className="text-[11px] text-slate-700">
                    • No final confirmation has been sent yet.
                  </p>
                </div>
              </div>

              <div className="px-4 pt-1 pb-2.5">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[11px] font-medium text-slate-500">
                    LetterLab summary
                  </p>
                  <span className="text-[10px] text-slate-600 bg-slate-100 rounded-full px-2 py-[2px]">
                    1 clear paragraph
                  </span>
                </div>
                <div className="rounded-2xl bg-slate-900 text-slate-50 px-3 py-3">
                  <p className="text-[11px] leading-relaxed text-slate-100">
                    This email thread is about your request to extend the
                    deadline for Project 2. Your professor is open to an
                    extension but needs you to confirm a new submission date and
                    acknowledge that late work may still impact your final
                    grade.
                  </p>
                </div>
              </div>

              <div className="px-4 pb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[11px] font-medium text-slate-500">
                    Draft reply (editable)
                  </p>
                  <span className="text-[10px] text-emerald-500 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-[2px]">
                    Ready to review
                  </span>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5">
                  <p className="text-[11px] text-slate-700 line-clamp-4">
                    Dear Professor,&nbsp;thank you for your flexibility regarding
                    my extension request for Project 2. I would like to confirm
                    the new submission date as{" "}
                    <span className="underline decoration-dotted">
                      Monday, March 18
                    </span>
                    , and I understand this may still affect my final grade. I
                    appreciate your understanding and will make sure the updated
                    project meets the expectations we discussed.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 bg-slate-50/90">
                <button className="px-3 py-1.5 rounded-xl bg-slate-900 text-[11px] font-semibold text-white hover:bg-black transition-colors">
                  Insert into email
                </button>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-slate-500" />
                  Generated from 12 messages in this thread
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 0.95, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
            className="flex flex-col items-center gap-1.5"
          >
            <div className="w-5 h-8 border border-slate-300/90 rounded-full flex items-start justify-center p-1 bg-white/80">
              <motion.div
                animate={{ y: [0, 9, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-1.5 h-1.5 rounded-full bg-slate-500"
              />
            </div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Scroll to see what&apos;s next
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Chip({ label, colorClass, dotColor }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[11px] font-medium rounded-full border px-3 py-1.5 ${colorClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  );
}

function StatCard({ label, value, description }) {
  return (
    <div className="rounded-2xl bg-white/95 border border-slate-200 px-3.5 py-3">
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <p className="font-[Outfit] text-xl font-semibold text-slate-900 leading-tight">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-slate-500">{description}</p>
    </div>
  );
}
