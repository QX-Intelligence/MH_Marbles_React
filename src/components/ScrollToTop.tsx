import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Scroll position cache keyed by location.key
const scrollPositions: Record<string, number> = {};

export default function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const activeKeyRef = useRef(location.key || (location.pathname + location.search));
  const isRestoringRef = useRef(false);

  // Keep the cache key current
  useEffect(() => {
    activeKeyRef.current = location.key || (location.pathname + location.search);
  }, [location]);

  // Save scroll position continuously (skip during restoration)
  useEffect(() => {
    const handleScroll = () => {
      if (isRestoringRef.current) return;
      scrollPositions[activeKeyRef.current] = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle route changes
  useEffect(() => {
    const cacheKey = location.key || (location.pathname + location.search);

    if (navigationType !== "POP") {
      // Forward navigation → always scroll to top
      const lenis = (window as any).lenis;
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
      isRestoringRef.current = false;
      return;
    }

    const targetScrollY = scrollPositions[cacheKey] || 0;

    if (targetScrollY === 0) {
      const lenis = (window as any).lenis;
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
      return;
    }

    isRestoringRef.current = true;

    const scrollTo = (y: number) => {
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(y, { immediate: true });
        (window as any).ScrollTrigger?.update();
      } else {
        window.scrollTo(0, y);
      }
    };

    let rafId: number;
    let startTime: number | null = null;
    const MAX_WAIT_MS = 4000; // give up after 4s

    // ── Poll via rAF until the document is tall enough ──────────────────────
    // This handles GSAP pin spacers: they inflate the body height AFTER mount.
    // We keep retrying until the document can actually accommodate targetScrollY.
    const poll = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );

      if (docHeight >= targetScrollY + window.innerHeight) {
        // Document is tall enough — scroll and we're done
        scrollTo(targetScrollY);
        isRestoringRef.current = false;
        return;
      }

      if (elapsed >= MAX_WAIT_MS) {
        // Fallback: scroll to whatever we can reach
        scrollTo(Math.min(targetScrollY, docHeight - window.innerHeight));
        isRestoringRef.current = false;
        return;
      }

      // Not ready yet — try again next frame
      rafId = requestAnimationFrame(poll);
    };

    // Start polling next frame (let the page render first)
    rafId = requestAnimationFrame(poll);

    // Abort if user interacts manually
    const abort = () => {
      cancelAnimationFrame(rafId);
      isRestoringRef.current = false;
      window.removeEventListener("wheel", abort);
      window.removeEventListener("touchmove", abort);
      window.removeEventListener("pointerdown", abort);
    };
    window.addEventListener("wheel", abort, { passive: true });
    window.addEventListener("touchmove", abort, { passive: true });
    window.addEventListener("pointerdown", abort, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      isRestoringRef.current = false;
      window.removeEventListener("wheel", abort);
      window.removeEventListener("touchmove", abort);
      window.removeEventListener("pointerdown", abort);
    };
  }, [location.pathname, location.search, navigationType]);

  return null;
}
