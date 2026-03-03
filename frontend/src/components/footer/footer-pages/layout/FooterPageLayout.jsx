import React from 'react';
import { Box } from '@mui/material';
import { motion, useScroll, useSpring } from 'framer-motion';
import FooterPageHero from './FooterPageHero';
import '../theme.css';
import './FooterPageLayout.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scaleX = useSpring(scrollYProgress, prefersReducedMotion ? { duration: 0 } : { stiffness: 100, damping: 30 });
  return (
    <motion.div
      className="FooterPageLayout__scrollProgress"
      style={{ scaleX }}
      aria-hidden
    />
  );
}

export default function FooterPageLayout({
  slug,
  title,
  lead,
  lastUpdated,
  readingTime,
  children,
  breadcrumbs = true,
  customHero,
}) {
  const segments = slug ? slug.split('/') : [];
  const crumbs = [
    { label: 'Home', href: '/' },
    ...segments.map((segment, i) => {
      const label = segment.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      const path = '/' + segments.slice(0, i + 1).join('/');
      return { label, href: i === segments.length - 1 ? null : path };
    }),
  ];

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="footer-pages FooterPageLayout">
      <ScrollProgressBar />
      <Box component="article" className="FooterPageLayout__container">
        {breadcrumbs && (
          <motion.nav
            aria-label="Breadcrumb"
            className="FooterPageLayout__breadcrumb"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {crumbs.map((c, i) => (
              <span key={i}>
                {i > 0 && <span className="FooterPageLayout__breadcrumb-sep" aria-hidden> / </span>}
                {c.href ? (
                  <a href={c.href} className="FooterPageLayout__breadcrumb-link">{c.label}</a>
                ) : (
                  <span className="FooterPageLayout__breadcrumb-current">{c.label}</span>
                )}
              </span>
            ))}
          </motion.nav>
        )}
        {customHero ? (
          <motion.div
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            variants={prefersReducedMotion ? {} : fadeInUp}
          >
            {customHero}
          </motion.div>
        ) : (
          <motion.div
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            variants={prefersReducedMotion ? {} : fadeInUp}
          >
            <FooterPageHero
              title={title}
              lead={lead}
              lastUpdated={lastUpdated}
              readingTime={readingTime}
            />
          </motion.div>
        )}
        <motion.div
          className="FooterPageLayout__main"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </Box>
    </div>
  );
}
