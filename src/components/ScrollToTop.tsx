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

  // 2. Save scroll position while browsing (skip during restoration)
  useEffect(() => {
    const handleScroll = () => {
      if (isRestoringRef.current) return;
      scrollPositions[activeKeyRef.current] = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Handle route changes
  useEffect(() => {
    const cacheKey = location.key || (location.pathname + location.search);

    if (navigationType === "POP") {
      const targetScrollY = scrollPositions[cacheKey] || 0;

      // If target is 0, scroll to top immediately
      if (targetScrollY === 0) {
        const lenis = (window as any).lenis;
        if (lenis) lenis.scrollTo(0, { immediate: true });
        else window.scrollTo(0, 0);
        return;
      }

      isRestoringRef.current = true;

      const performScroll = () => {
        const lenis = (window as any).lenis;
        if (lenis) {
          lenis.scrollTo(targetScrollY, { immediate: true });
          if ((window as any).ScrollTrigger) {
            (window as any).ScrollTrigger.update();
          }
        } else {
          window.scrollTo(0, targetScrollY);
        }
      };

      let observer: ResizeObserver | null = null;
      let timeoutId: number;
      let gsapReadyCleanup: (() => void) | null = null;

      const cleanup = () => {
        observer?.disconnect();
        observer = null;
        gsapReadyCleanup?.();
        gsapReadyCleanup = null;
        window.removeEventListener("wheel", abortRestoration);
        window.removeEventListener("touchmove", abortRestoration);
        window.removeEventListener("pointerdown", abortRestoration);
        clearTimeout(timeoutId);
        setTimeout(() => { isRestoringRef.current = false; }, 50);
      };

      const abortRestoration = () => cleanup();

      window.addEventListener("wheel", abortRestoration, { passive: true });
      window.addEventListener("touchmove", abortRestoration, { passive: true });
      window.addEventListener("pointerdown", abortRestoration, { passive: true });

      // ── Home page: wait for GSAP pin spacers before restoring ──────────────
      // FeaturedProducts dispatches 'gsap-layout-ready' after its onRefresh.
      // Without waiting, we'd land in CategoryMasks (before the spacer exists)
      // instead of TileCategories (after the spacer).
      if (location.pathname === "/") {
        let gsapFired = false;

        const onGSAPReady = () => {
          gsapFired = true;
          performScroll();
          // Give GSAP scrub 100ms to catch up, then start observer
          setTimeout(() => {
            startResizeObserver();
          }, 100);
        };

        window.addEventListener("gsap-layout-ready", onGSAPReady, { once: true });
        gsapReadyCleanup = () => {
          window.removeEventListener("gsap-layout-ready", onGSAPReady);
        };

        // Fallback: if GSAP never fires (e.g. no featured products), 
        // fall through to ResizeObserver after 1500ms
        timeoutId = window.setTimeout(() => {
          if (!gsapFired) {
            startResizeObserver();
          }
        }, 1500);

      } else {
        // ── Non-home pages: use ResizeObserver directly ──────────────────────
        startResizeObserver();
        timeoutId = window.setTimeout(cleanup, 4000);
      }

      function startResizeObserver() {
        performScroll();

        observer = new ResizeObserver(() => {
          performScroll();

          const docHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
          );
          const windowHeight = window.innerHeight;

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

        // Only set a fresh timeout if not already set
        if (!timeoutId) {
          timeoutId = window.setTimeout(cleanup, 4000);
        }
      }

      return () => cleanup();

    } else {
      // Push/Replace: scroll to top
      const lenis = (window as any).lenis;
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
      isRestoringRef.current = false;
    }
  }, [location.pathname, location.search, navigationType]);

  return null;
}
