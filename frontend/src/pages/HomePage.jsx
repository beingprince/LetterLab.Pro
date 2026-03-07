import React, { useState } from "react";
// Force scroll to top before any render — prevents browser restoring a mid-page position
if (typeof window !== 'undefined') {
  if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}
import IntroSequence from "../components/intro/IntroSequence";

// import SectionHero from "../components/SectionHero"; // OLD
// import SaaSHero from "../components/hero/SaaSHero"; // NEW
import HeroSection from "../components/hero/HeroSection"; // LATEST
import SectionEverything from "../components/EverythingSection";
import SectionSupporters from "../components/SectionSupporters";
import SectionTestimonials from "../components/testimonials";
import SectionFeatures from "../components/SectionFeatures";
import SectionFooter from "../components/footer/Footer"; // New Enterprise Footer

export default function HomePage() {
  // Check if user has already seen the intro in this session
  const [introDone, setIntroDone] = useState(() => {
    return sessionStorage.getItem("hasSeenIntro") === "true";
  });

  const handleIntroComplete = () => {
    sessionStorage.setItem("hasSeenIntro", "true");
    setIntroDone(true);
  };

  // Scroll to top on mount — double rAF beats iOS Safari's own scroll-restore pass
  React.useEffect(() => {
    // Disable scroll anchoring for the reset frame
    document.documentElement.style.overflowAnchor = 'none';
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        // Re-enable scroll anchoring
        document.documentElement.style.overflowAnchor = '';
      });
    });
    return () => cancelAnimationFrame(raf);
  }, []);


  return (
    <>
      {!introDone ? (
        <IntroSequence onComplete={handleIntroComplete} />
      ) : (
        <>

          <HeroSection
            onGoToChat={() => window.location.href = '/chat'}
            onWatchDemo={() => console.log("Watch demo")}
          />
          <SectionEverything />
          <SectionSupporters />
          <SectionTestimonials />
          <SectionFeatures />
          <SectionFooter />
        </>
      )}
    </>
  );
}