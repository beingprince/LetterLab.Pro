import React, { useState } from "react";
// Force scroll to top before any render — prevents browser restoring a mid-page position
if (typeof window !== 'undefined') {
  if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}
import IntroSequence from "../components/intro/IntroSequence";
import NavBar from "../components/NavBar";
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

  // Belt-and-suspenders: also scroll on mount in case of SPA navigation
  React.useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      {!introDone ? (
        <IntroSequence onComplete={handleIntroComplete} />
      ) : (
        <>
          <NavBar />
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