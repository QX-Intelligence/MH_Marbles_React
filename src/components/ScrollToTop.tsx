import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Cache for scroll positions keyed by location key or path
const scrollPositions: Record<string, number> = {};

export default function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const activeKeyRef = useRef(location.key || (location.pathname + location.search));
  const isRestoringRef = useRef(false);

  // 1. Keep the active key updated
  useEffect(() => {
    activeKeyRef.current = location.key || (location.pathname + location.search);
  }, [location]);

  // 2. Listen to scroll events to update the position for the CURRENT page
  useEffect(() => {
    const handleScroll = () => {
      // Don't save scroll position if we are currently restoring/jumping
      if (isRestoringRef.current) return;
      scrollPositions[activeKeyRef.current] = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 3. Handle route changes
  useEffect(() => {
    const cacheKey = location.key || (location.pathname + location.search);

    if (navigationType === "POP") {
      const targetScrollY = scrollPositions[cacheKey] || 0;

      // If target is 0, scroll to 0 immediately
      if (targetScrollY === 0) {
        const lenis = (window as any).lenis;
        if (lenis) {
          lenis.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo(0, 0);
        }
        return;
      }

      // Mark as restoring to ignore temporary scroll events during jump
      isRestoringRef.current = true;

      const performScroll = () => {
        const lenis = (window as any).lenis;
        if (lenis) {
          lenis.scrollTo(targetScrollY, { immediate: true });
          // Sync GSAP ScrollTrigger
          if ((window as any).ScrollTrigger) {
            (window as any).ScrollTrigger.update();
          }
        } else {
          window.scrollTo(0, targetScrollY);
        }
      };

      // Perform initial scroll check
      performScroll();

      let observer: ResizeObserver | null = null;
      let timeoutId: number;

      const cleanup = () => {
        if (observer) {
          observer.disconnect();
          observer = null;
        }
        window.removeEventListener("wheel", abortRestoration);
        window.removeEventListener("touchmove", abortRestoration);
        window.removeEventListener("pointerdown", abortRestoration);
        clearTimeout(timeoutId);
        
        // Reset restoration flag
        setTimeout(() => {
          isRestoringRef.current = false;
        }, 50);
      };

      const abortRestoration = () => {
        cleanup();
      };

      // If user starts interacting, abort restoration to avoid fighting/jumping
      window.addEventListener("wheel", abortRestoration, { passive: true });
      window.addEventListener("touchmove", abortRestoration, { passive: true });
      window.addEventListener("pointerdown", abortRestoration, { passive: true });

      // Observe height changes dynamically (async data load, GSAP layout shifts)
      observer = new ResizeObserver(() => {
        performScroll();

        const docHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight
        );
        const windowHeight = window.innerHeight;

        // If successfully restored or reached end of page, cleanup observer
        if (
          Math.abs(window.scrollY - targetScrollY) < 5 ||
          window.scrollY + windowHeight >= docHeight - 5
        ) {
          if (Math.abs(window.scrollY - targetScrollY) < 5) {
            cleanup();
          }
        }
      });

      observer.observe(document.body);

      // Safe fallback timeout to release observer
      timeoutId = window.setTimeout(cleanup, 4000);

      return () => {
        cleanup();
      };
    } else {
      // Push/Replace navigation: Reset to top
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
      isRestoringRef.current = false;
    }
  }, [location.pathname, location.search, navigationType]);

  return null;
}
