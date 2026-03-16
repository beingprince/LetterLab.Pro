import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Shield, CheckCircle2, AlertTriangle, ArrowRight, ExternalLink, Menu, X } from 'lucide-react';

const POLICY_SECTIONS = [
  { id: '1', title: '1. Information We Collect' },
  { id: '2', title: '2. How We Use Your Information' },
  { id: '3', title: '3. API Services Disclosure (Google & Microsoft)' },
  { id: '4', title: '4. Cookies and Tracking Technologies' },
  { id: '5', title: '5. Data Storage and Retention' },
  { id: '6', title: '6. Third-Party AI Services' },
  { id: '7', title: '7. Account Security' },
  { id: '8', title: '8. Children\'s Privacy' },
  { id: '9', title: '9. Your Rights and Data Deletion' },
  { id: '10', title: '10. Security Measures' },
  { id: '11', title: '11. Changes to This Privacy Policy' },
  { id: '12', title: '12. Contact Information' }
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('');
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    window.scrollTo(0, 0);

    const observers = [];

    // Intersection Observer for Scroll Spy
    const handleIntersect = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerConfig = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver(handleIntersect, observerConfig);

    POLICY_SECTIONS.forEach(section => {
      const el = document.getElementById(section.id);
      if (el) {
        observer.observe(el);
        observers.push(el);
      }
    });

    return () => {
      observers.forEach(el => observer.unobserve(el));
    };
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      setIsMobileTocOpen(false);
      el.scrollIntoView({ behavior: isReducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };

  // Entry animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: isReducedMotion ? 0 : 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  return (
    <motion.div
      className="min-h-screen bg-[#FAFAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900"
      initial={isReducedMotion ? false : "hidden"}
      animate="visible"
      variants={pageVariants}
    >
      {/* 
        Spacing to accommodate global Header 
        Typically the global header is ~72px, adding pt-24 (96px) or pt-[120px] 
      */}
      <div className="pt-24 pb-20 md:pt-32 md:pb-32 px-4 sm:px-5 md:px-6 lg:px-8 mx-auto max-w-7xl">

        {/* HEADER BLOCK */}
        <motion.header variants={itemVariants} className="mb-12 md:mb-16 lg:mb-20 max-w-3xl mx-auto lg:mx-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/60 text-sm font-medium text-slate-600 mb-6 drop-shadow-sm">
            <Shield className="w-4 h-4 text-slate-500" />
            Compliance & Trust
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight text-slate-900 leading-[1.15] mb-4">
            Privacy Policy
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium mb-6">
            LetterLab — <a href="https://letterlab.pro" className="hover:text-blue-600 transition-colors">letterlab.pro</a>
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-slate-500 bg-white border border-slate-200/50 rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Effective Date:</span> March 16, 2026
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Last Updated:</span> March 16, 2026
            </div>
          </div>
        </motion.header>

        {/* MAIN LAYOUT: 12-Column Grid on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

          {/* LEFT RAIL: TOC (Desktop) */}
          <motion.nav
            variants={itemVariants}
            className="hidden lg:block lg:col-span-3 lg:col-start-1 relative"
          >
            <div className="sticky top-32 max-h-[calc(100vh-8rem)] overflow-y-auto pr-6 pb-8 custom-scrollbar">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-5">On this page</h4>
              <ul className="space-y-3">
                {POLICY_SECTIONS.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`text-sm text-left leading-tight w-full transition-all duration-200 ${activeSection === section.id
                        ? 'text-blue-600 font-semibold translate-x-1'
                        : 'text-slate-500 hover:text-slate-800 hover:translate-x-0.5'
                        }`}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.nav>

          {/* MOBILE TOC (Expandable) */}
          <motion.div variants={itemVariants} className="block lg:hidden mb-8">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-slate-800 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Menu className="w-5 h-5 text-slate-500" />
                  On this page
                </div>
                <motion.div
                  animate={{ rotate: isMobileTocOpen ? 180 : 0 }}
                  className="text-slate-400"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </motion.div>
              </button>

              <AnimatePresence>
                {isMobileTocOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-slate-100"
                  >
                    <ul className="p-2 stack-y-1">
                      {POLICY_SECTIONS.map((section) => (
                        <li key={`mobile-${section.id}`}>
                          <button
                            onClick={() => scrollToSection(section.id)}
                            className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors ${activeSection === section.id
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-slate-600 hover:bg-slate-50'
                              }`}
                          >
                            {section.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: MAIN CONTENT */}
          <motion.main
            variants={itemVariants}
            className="lg:col-span-8 lg:col-start-4 xl:col-span-7 xl:col-start-4 max-w-full prose-container pb-24"
          >
            {/* INTRO BLOCK */}
            <section className="mb-14 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                About This Project
              </h2>
              <div className="space-y-4 text-[1.05rem] sm:text-[1.1rem] leading-relaxed text-slate-600">
                <p>
                  LetterLab is a personal, non-commercial project built and maintained by an individual student. It is not a registered company, LLC, or any other business entity. This privacy policy is published in good faith to be transparent with users and to comply with Google API Services requirements. The platform is hosted via Vercel (frontend), Render (backend API), and GoDaddy (domain: letterlab.pro). It is built using React, Vite, Tailwind CSS, and Framer Motion on the frontend, with an Express/Node.js backend.
                </p>
                <p>
                  This Privacy Policy describes how LetterLab ("we," "our," or "the Service"), accessible at <strong>https://letterlab.pro</strong>, collects, uses, stores, and protects your personal information when you use our AI-powered email drafting platform. By accessing or using LetterLab, you agree to the practices described in this policy.
                </p>
              </div>
            </section>

            {/* SPACER BETWEEN INTRO AND SECTIONS */}
            <div className="w-12 h-1 bg-slate-200 rounded-full mb-14" />

            <div className="space-y-16 md:space-y-20">

              {/* SECTION 1 */}
              <section id="1" className="scroll-mt-32">
                <h2 className="text-2xl sm:text-[1.75rem] font-bold text-slate-900 mb-8 tracking-tight">1. Information We Collect</h2>

                <div className="space-y-10">
                  <div>
                    <h3 className="text-[1.15rem] sm:text-xl font-semibold text-slate-800 mb-4">1.1 Information You Provide Directly</h3>
                    <ul className="list-disc pl-5 space-y-2.5 text-[1.05rem] text-slate-600 leading-relaxed marker:text-slate-400">
                      <li>Name and email address provided during account registration.</li>
                      <li>Custom writing tones and instructions you create ("Professors").</li>
                      <li>Prompts and inputs you type into the email drafting interface.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-[1.15rem] sm:text-xl font-semibold text-slate-800 mb-4">1.2 Information Collected via OAuth (Google / Microsoft Graph API)</h3>
                    <p className="text-[1.05rem] text-slate-600 mb-4 leading-relaxed">
                      When you sign in using Google or Microsoft, or when you connect your Gmail or Outlook account, we request access to the following user data, strictly limited to what is necessary to provide the Service:
                    </p>
                    <ul className="list-disc pl-5 space-y-2.5 text-[1.05rem] text-slate-600 leading-relaxed marker:text-slate-400">
                      <li><strong>Basic profile information:</strong> your name, email address, and OAuth Account ID (Google or Microsoft).</li>
                      <li><strong>Email threads (Gmail & Outlook):</strong> content of threads you explicitly select for AI-assisted drafting via the Gmail API or Microsoft Graph API.</li>
                      <li><strong>Email metadata:</strong> subject lines, sender/recipient info, and conversation IDs.</li>
                      <li><strong>Contacts (read-only):</strong> used within the contact picker only; we do not store your contacts in our database.</li>
                      <li><strong>Ability to send emails:</strong> only when you explicitly click "Send" to dispatch a draft you have reviewed and approved.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-[1.15rem] sm:text-xl font-semibold text-slate-800 mb-4">1.3 Account Access & Device Support</h3>
                    <p className="text-[1.05rem] text-slate-600 mb-5 leading-relaxed">
                      LetterLab supports login from any personal device including smartphones and tablets. Authentication is handled via Google OAuth and Microsoft OAuth, so you can sign in using the same account on any device.
                    </p>
                    <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-5 sm:p-6 text-[1.05rem] text-amber-900 leading-relaxed flex gap-4 shadow-sm">
                      <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Important:</strong> LetterLab does not support organizational or institutional email accounts that are restricted or locked by an administrator (e.g., school-managed Google Workspace accounts or company-managed Microsoft accounts). If your account access is controlled by an organization's IT policy, you may be blocked from signing in — this is enforced by your organization, not by LetterLab. Please use a personal Google or Microsoft account.
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[1.15rem] sm:text-xl font-semibold text-slate-800 mb-4">1.4 Automatically Collected Data</h3>
                    <ul className="list-disc pl-5 space-y-2.5 text-[1.05rem] text-slate-600 leading-relaxed marker:text-slate-400">
                      <li>Usage analytics: anonymized actions within the app for product improvement (no email content included).</li>
                      <li>AI token consumption and daily generation quotas tracked per user account.</li>
                      <li>Session authentication tokens (JWT) stored in your browser's localStorage.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-[1.15rem] sm:text-xl font-semibold text-slate-800 mb-4">1.5 Data Collected via Google Analytics 4 (GA4)</h3>
                    <p className="text-[1.05rem] text-slate-600 mb-4 leading-relaxed">
                      We use Google Analytics 4 (GA4) to understand how visitors interact with letterlab.pro. GA4 automatically collects the following when you visit:
                    </p>
                    <ul className="list-disc pl-5 space-y-2.5 text-[1.05rem] text-slate-600 mb-5 leading-relaxed marker:text-slate-400">
                      <li>Pages visited, time spent, and navigation paths.</li>
                      <li>Approximate geographic location (country/region level, derived from IP address).</li>
                      <li>Device type, browser, and operating system.</li>
                      <li>Referring website or search query that brought you to letterlab.pro.</li>
                      <li>Anonymized IP address (Google automatically anonymizes IP data in GA4).</li>
                    </ul>
                    <p className="text-[1.05rem] text-slate-600 leading-relaxed">
                      GA4 uses cookies to collect this data. It is sent to and stored by Google. Google's use of this data is governed by: <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline break-all" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a>. You may opt out at any time: <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline break-all" target="_blank" rel="noopener noreferrer">https://tools.google.com/dlpage/gaoptout</a>.
                    </p>
                  </div>
                </div>
              </section>

              <hr className="border-slate-200" />

              {/* SECTION 2 */}
              <section id="2" className="scroll-mt-32">
                <h2 className="text-2xl sm:text-[1.75rem] font-bold text-slate-900 mb-6 tracking-tight">2. How We Use Your Information</h2>
                <p className="text-[1.05rem] text-slate-600 mb-4 leading-relaxed">
                  We use the information we collect solely to operate and improve LetterLab:
                </p>
                <ul className="list-disc pl-5 space-y-2.5 text-[1.05rem] text-slate-600 leading-relaxed marker:text-slate-400">
                  <li>To authenticate your identity and maintain your session across devices.</li>
                  <li>To retrieve and summarize email threads you select for AI-assisted drafting.</li>
                  <li>To generate email drafts in response to your prompts using AI models.</li>
                  <li>To send emails on your behalf only when you explicitly initiate a send action.</li>
                  <li>To track and enforce daily usage quotas and AI token limits.</li>
                  <li>To analyze aggregated, anonymized site usage (via GA4) to improve the Service.</li>
                </ul>
              </section>

              <hr className="border-slate-200" />

              {/* SECTION 3 */}
              <section id="3" className="scroll-mt-32">
                <h2 className="text-2xl sm:text-[1.75rem] font-bold text-slate-900 mb-6 tracking-tight">3. API Services Disclosure (Google & Microsoft)</h2>
                <p className="text-[1.05rem] text-slate-600 mb-5 leading-relaxed">
                  LetterLab's use of information received from Google APIs adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements. Our use of Microsoft Graph API adheres to the corresponding <a href="https://learn.microsoft.com/en-us/legal/microsoft-apis/terms-of-use" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Microsoft APIs Terms of Use</a>.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
                  <p className="font-semibold text-slate-800 mb-4 text-[1.1rem]">We confirm the following for both Google and Microsoft user data:</p>
                  <ul className="space-y-4 text-[1.05rem] text-slate-700 leading-relaxed">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>We do <strong>NOT</strong> sell your user data to any third party.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>We do <strong>NOT</strong> use your user data for advertising purposes.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>We do <strong>NOT</strong> allow humans to read your email data except as required by law, for security incident response, or if you explicitly request support requiring it.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Email thread content from Gmail or Outlook is processed in memory only and is <strong>NOT</strong> persistently stored in our database.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>OAuth user data is used only to provide the specific features you requested (AI email drafting).</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>We do <strong>NOT</strong> transfer your API user data to third parties except as necessary to provide the Service (passing summarized context to AI models).</span>
                    </li>
                  </ul>
                </div>
              </section>

              <hr className="border-slate-200" />

              {/* SECTION 4 */}
              <section id="4" className="scroll-mt-32">
                <h2 className="text-2xl sm:text-[1.75rem] font-bold text-slate-900 mb-8 tracking-tight">4. Cookies and Tracking Technologies</h2>

                <div className="space-y-10">
                  <div>
                    <h3 className="text-[1.15rem] sm:text-xl font-semibold text-slate-800 mb-4">4.1 Authentication (localStorage)</h3>
                    <p className="text-[1.05rem] text-slate-600 leading-relaxed">
                      LetterLab stores your JWT authentication token and basic session state in your browser's localStorage. This stays on your device and is used only to keep you logged in. We do not use advertising cookies or cross-site tracking technologies.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-[1.15rem] sm:text-xl font-semibold text-slate-800 mb-4">4.2 Google Analytics 4 Cookies</h3>
                    <p className="text-[1.05rem] text-slate-600 mb-4 leading-relaxed">
                      GA4 sets the following first-party cookies on your browser:
                    </p>
                    <ul className="list-disc pl-5 space-y-2.5 text-[1.05rem] text-slate-600 mb-5 leading-relaxed marker:text-slate-400">
                      <li><code>_ga</code> — Distinguishes unique users. Expires after 2 years.</li>
                      <li><code>_ga_&lt;measurement-id&gt;</code> — Maintains session state. Expires after 2 years.</li>
                    </ul>
                    <p className="text-[1.05rem] text-slate-600 leading-relaxed">
                      These cookies do not contain personally identifiable information. You may delete or block them via your browser settings, though this may affect site functionality.
                    </p>
                  </div>
                </div>
              </section>

              <hr className="border-slate-200" />

              {/* SECTION 5 */}
              <section id="5" className="scroll-mt-32">
                <h2 className="text-2xl sm:text-[1.75rem] font-bold text-slate-900 mb-8 tracking-tight">5. Data Storage and Retention</h2>

                <div className="space-y-10">
                  <div>
                    <h3 className="text-[1.15rem] sm:text-xl font-semibold text-slate-800 mb-4">5.1 What We Store</h3>
                    <ul className="list-disc pl-5 space-y-2.5 text-[1.05rem] text-slate-600 leading-relaxed marker:text-slate-400">
                      <li>Your name, email address, and OAuth provider ID in our MongoDB database.</li>
                      <li>Usage quota records (number of emails generated, token counts).</li>
                      <li>Custom writing rules/tones ("Professors") you create and save.</li>
                      <li>Anonymized analytic events for product improvement.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-[1.15rem] sm:text-xl font-semibold text-slate-800 mb-4">5.2 What We Do NOT Store</h3>
                    <ul className="list-disc pl-5 space-y-2.5 text-[1.05rem] text-slate-600 leading-relaxed marker:text-slate-400">
                      <li>Gmail or Outlook email content, thread bodies, or full messages — processed in memory only and discarded after draft generation.</li>
                      <li>Your Google or Microsoft OAuth tokens beyond what is needed for your active session and API requests.</li>
                      <li>Your contact lists retrieved from Google or Microsoft.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-[1.15rem] sm:text-xl font-semibold text-slate-800 mb-4">5.3 Infrastructure & Third-Party Providers</h3>
                    <ul className="space-y-3 text-[1.05rem] text-slate-600">
                      <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                        <span className="font-semibold text-slate-800">Vercel (frontend hosting)</span>
                        <a href="https://vercel.com/legal/privacy-policy" className="text-blue-600 hover:underline break-all inline-flex items-center gap-1 text-[0.95em]" target="_blank" rel="noopener noreferrer">https://vercel.com/legal/privacy-policy<ExternalLink className="w-3 h-3" /></a>
                      </li>
                      <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                        <span className="font-semibold text-slate-800">Render (backend API hosting)</span>
                        <a href="https://render.com/privacy" className="text-blue-600 hover:underline break-all inline-flex items-center gap-1 text-[0.95em]" target="_blank" rel="noopener noreferrer">https://render.com/privacy<ExternalLink className="w-3 h-3" /></a>
                      </li>
                      <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                        <span className="font-semibold text-slate-800">MongoDB Atlas (database)</span>
                        <a href="https://www.mongodb.com/legal/privacy-policy" className="text-blue-600 hover:underline break-all inline-flex items-center gap-1 text-[0.95em]" target="_blank" rel="noopener noreferrer">https://www.mongodb.com/legal/privacy-policy<ExternalLink className="w-3 h-3" /></a>
                      </li>
                      <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                        <span className="font-semibold text-slate-800">GoDaddy (domain registrar)</span>
                        <a href="https://www.godaddy.com/legal/agreements/privacy-policy" className="text-blue-600 hover:underline break-all inline-flex items-center gap-1 text-[0.95em]" target="_blank" rel="noopener noreferrer">https://www.godaddy.com/legal/agreements/privacy-policy<ExternalLink className="w-3 h-3" /></a>
                      </li>
                      <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                        <span className="font-semibold text-slate-800">Google Analytics 4</span>
                        <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline break-all inline-flex items-center gap-1 text-[0.95em]" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy<ExternalLink className="w-3 h-3" /></a>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <hr className="border-slate-200" />

              {/* SECTION 6 */}
              <section id="6" className="scroll-mt-32">
                <h2 className="text-2xl sm:text-[1.75rem] font-bold text-slate-900 mb-6 tracking-tight">6. Third-Party AI Services</h2>
                <p className="text-[1.05rem] text-slate-600 mb-4 leading-relaxed">
                  To generate email drafts, your prompt and a summarized version of any email context you include are sent to:
                </p>
                <ul className="list-disc pl-5 space-y-2.5 text-[1.05rem] text-slate-600 mb-5 leading-relaxed marker:text-slate-400">
                  <li><strong>Google Gemini 2.5 (primary)</strong> — governed by Google's Terms of Service and Privacy Policy.</li>
                  <li><strong>OpenAI GPT-4o-mini (fallback)</strong> — <a href="https://openai.com/policies/privacy-policy" className="text-blue-600 hover:underline break-all" target="_blank" rel="noopener noreferrer">https://openai.com/policies/privacy-policy</a></li>
                </ul>
                <p className="text-[1.05rem] text-slate-600 leading-relaxed font-medium">
                  Raw email thread bodies are summarized before being passed to any AI model. We do not send your full Gmail or Outlook inbox to AI services.
                </p>
              </section>

              <hr className="border-slate-200" />

              {/* SECTION 7 */}
              <section id="7" className="scroll-mt-32">
                <h2 className="text-2xl sm:text-[1.75rem] font-bold text-slate-900 mb-6 tracking-tight">7. Account Security</h2>
                <div className="space-y-5 text-[1.05rem] text-slate-600 leading-relaxed">
                  <p>
                    LetterLab relies on Google OAuth and Microsoft OAuth for authentication — meaning your password is never stored by LetterLab directly. Login is secured by the respective identity provider (Google or Microsoft) and supports sign-in from any personal device, including mobile phones and tablets.
                  </p>
                  <p>
                    LetterLab does not currently offer its own two-factor authentication (2FA). However, if you have 2FA enabled on your Google or Microsoft account, that protection automatically applies when signing in to LetterLab. We recommend enabling 2FA on your Google/Microsoft account for added security.
                  </p>
                  <p className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 italic">
                    <strong>Note:</strong> If your Google or Microsoft account is managed by an organization (school, employer) whose admin has restricted third-party app access, you will not be able to sign in to LetterLab with that account. Please use a personal account instead.
                  </p>
                </div>
              </section>

              <hr className="border-slate-200" />

              {/* SECTION 8 */}
              <section id="8" className="scroll-mt-32">
                <h2 className="text-2xl sm:text-[1.75rem] font-bold text-slate-900 mb-6 tracking-tight">8. Children's Privacy</h2>
                <p className="text-[1.05rem] text-slate-600 leading-relaxed">
                  LetterLab is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.
                </p>
              </section>

              <hr className="border-slate-200" />

              {/* SECTION 9 */}
              <section id="9" className="scroll-mt-32">
                <h2 className="text-2xl sm:text-[1.75rem] font-bold text-slate-900 mb-6 tracking-tight">9. Your Rights and Data Deletion</h2>
                <p className="text-[1.05rem] text-slate-600 mb-4 leading-relaxed">
                  You have the right to:
                </p>
                <ul className="list-disc pl-5 space-y-3 text-[1.05rem] text-slate-600 leading-relaxed marker:text-slate-400">
                  <li>Access the personal information we hold about you.</li>
                  <li>Request correction of inaccurate data.</li>
                  <li>Request deletion of your account and all associated data.</li>
                  <li>Revoke LetterLab's access to your Google account at: <br className="sm:hidden" /><a href="https://myaccount.google.com/permissions" className="text-blue-600 hover:underline break-all" target="_blank" rel="noopener noreferrer">https://myaccount.google.com/permissions</a></li>
                  <li>Revoke LetterLab's access to your Microsoft account at: <br className="sm:hidden" /><a href="https://account.microsoft.com/privacy/app-access" className="text-blue-600 hover:underline break-all" target="_blank" rel="noopener noreferrer">https://account.microsoft.com/privacy/app-access</a></li>
                  <li>Opt out of Google Analytics: <br className="sm:hidden" /><a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline break-all" target="_blank" rel="noopener noreferrer">https://tools.google.com/dlpage/gaoptout</a></li>
                </ul>
              </section>

              <hr className="border-slate-200" />

              {/* SECTION 10 */}
              <section id="10" className="scroll-mt-32">
                <h2 className="text-2xl sm:text-[1.75rem] font-bold text-slate-900 mb-6 tracking-tight">10. Security Measures</h2>
                <p className="text-[1.05rem] text-slate-600 mb-4 leading-relaxed">
                  We take reasonable technical measures to protect your data:
                </p>
                <ul className="list-disc pl-5 space-y-2.5 text-[1.05rem] text-slate-600 mb-6 leading-relaxed marker:text-slate-400">
                  <li>HTTPS enforced across all connections (Vercel + Render).</li>
                  <li>HTTP security headers via Helmet.js (Content-Security-Policy, X-Frame-Options, etc.).</li>
                  <li>Rate limiting on all API endpoints to prevent abuse.</li>
                  <li>Request body size limits (10MB) to prevent data flooding.</li>
                  <li>JWT-based authentication with server-side validation on every protected request.</li>
                  <li>Encrypted storage of sensitive credentials via server-side crypto utilities.</li>
                </ul>
                <p className="text-[1.05rem] text-slate-600 leading-relaxed">
                  No internet-based service is 100% secure. We encourage you to use a strong password and enable 2FA on your linked Google or Microsoft account.
                </p>
              </section>

              <hr className="border-slate-200" />

              {/* SECTION 11 */}
              <section id="11" className="scroll-mt-32">
                <h2 className="text-2xl sm:text-[1.75rem] font-bold text-slate-900 mb-6 tracking-tight">11. Changes to This Privacy Policy</h2>
                <p className="text-[1.05rem] text-slate-600 leading-relaxed">
                  We may update this Privacy Policy from time to time. When we make material changes, we will update the "Last Updated" date at the top of this page. Continued use of LetterLab after changes are posted constitutes your acceptance of the revised policy.
                </p>
              </section>

              {/* SECTION 12 & END BLOCK */}
              <section id="12" className="scroll-mt-32">
                <div className="bg-[#1e293b] text-white rounded-3xl p-8 sm:p-10 shadow-xl overflow-hidden relative">
                  {/* Decorative background flare */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />

                  <h2 className="text-2xl sm:text-[1.75rem] font-bold text-white mb-6 tracking-tight relative z-10">12. Contact Information</h2>
                  <p className="text-[1.1rem] text-slate-300 mb-6 leading-relaxed relative z-10">
                    If you have questions, concerns, or data deletion requests, please contact:
                  </p>

                  <div className="space-y-4 mb-8 relative z-10">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-[1.05rem]">
                      <span className="font-semibold text-slate-100 min-w-[140px]">Entity:</span>
                      <span className="text-slate-300">LetterLab (Personal Student Project)</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-[1.05rem]">
                      <span className="font-semibold text-slate-100 min-w-[140px]">Website:</span>
                      <a href="https://letterlab.pro" className="text-blue-400 hover:text-blue-300 transition-colors">https://letterlab.pro</a>
                    </div>
                    <div className="flex flex-col sm:flex-row items-baseline gap-1 sm:gap-4 text-[1.05rem]">
                      <span className="font-semibold text-slate-100 min-w-[140px]">Contact Email:</span>
                      <a href="mailto:princepdsn@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors font-medium text-lg bg-blue-500/10 px-3 py-1.5 rounded-lg -ml-3 sm:ml-0 mt-2 sm:mt-0">
                        princepdsn@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* Bottom Context Note */}
              <div className="pt-8 text-center sm:text-left text-[0.95rem] text-slate-400 border-t border-slate-200/60 mt-20">
                <p>
                  This privacy policy was prepared for LetterLab (letterlab.pro) — a personal student project — to satisfy Google OAuth verification and Google Analytics 4 disclosure requirements.
                </p>
              </div>

            </div>
          </motion.main>
        </div>
      </div>
    </motion.div>
  );
}
