import { useEffect } from "react";
import { setGlobalState } from "./AnimationController";

/**
 * Hook: connect a scroll container (or window) to a normalized 0..1 progress
 * for the hero scene. Call inside the Hero page.
 */
export const useSceneScrollSync = (refOrWindow = typeof window !== "undefined" ? window : null) => {
  useEffect(() => {
    const el = refOrWindow && refOrWindow.current ? refOrWindow.current : window;
    if (!el) return;

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.9))) : 0;
      // more weight to the first viewport
      setGlobalState({ sceneProgress: progress });
    };

    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [refOrWindow]);
};
