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
    const timers: number[] = [];

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

      // Retry mechanism to wait for the page height to load (since pages load categories/products dynamically)
      let attempts = 0;
      const maxAttempts = 30; // ~500ms maximum wait

      const tryScroll = () => {
        const docHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight
        );
        const windowHeight = window.innerHeight;

        // If the document is tall enough to reach targetScrollY, or we hit max attempts
        if (docHeight - windowHeight >= targetScrollY || attempts >= maxAttempts) {
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
          // Reset the restoring flag in the next frame to let layout settle
          setTimeout(() => {
            isRestoringRef.current = false;
          }, 50);
        } else {
          attempts++;
          requestAnimationFrame(tryScroll);
        }
      };

      requestAnimationFrame(tryScroll);

      // Also schedule correction scrolls after GSAP settles on the home page (at 400ms and 1000ms triggers)
      if (location.pathname === "/") {
        const runCorrection = () => {
          const latestTargetScrollY = scrollPositions[cacheKey] || 0;
          if (latestTargetScrollY > 0) {
            isRestoringRef.current = true;
            const lenis = (window as any).lenis;
            if (lenis) {
              lenis.scrollTo(latestTargetScrollY, { immediate: true });
              if ((window as any).ScrollTrigger) {
                (window as any).ScrollTrigger.update();
              }
            } else {
              window.scrollTo(0, latestTargetScrollY);
            }
            setTimeout(() => {
              isRestoringRef.current = false;
            }, 50);
          }
        };

        timers.push(window.setTimeout(runCorrection, 600));
        timers.push(window.setTimeout(runCorrection, 1200));
      }
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

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [location.pathname, location.search, navigationType]);

  return null;
}
