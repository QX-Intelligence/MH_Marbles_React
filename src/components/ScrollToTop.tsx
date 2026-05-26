import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Scroll position cache keyed by location.key
const scrollPositions: Record<string, number> = {};

export default function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();
  
  const currentKey = location.key || (location.pathname + location.search);
  const activeKeyRef = useRef(currentKey);
  
  // Default to true to prevent initial mount/restore scroll events from corrupting the cache
  const isRestoringRef = useRef(true);

  // Synchronously lock scroll recording and update the active cache key on any route change
  useLayoutEffect(() => {
    activeKeyRef.current = currentKey;
    isRestoringRef.current = true;
  }, [currentKey]);

  // Save scroll position continuously (skip during restoration/route transitions)
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
    const cacheKey = currentKey;

    if (navigationType !== "POP") {
      // Forward navigation (PUSH/REPLACE) → always scroll to top
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
      // Unlock after brief delay to let any lifecycle scroll events settle
      setTimeout(() => {
        isRestoringRef.current = false;
      }, 50);
      return;
    }

    const targetScrollY = scrollPositions[cacheKey] || 0;

    if (targetScrollY === 0) {
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
      setTimeout(() => {
        isRestoringRef.current = false;
      }, 50);
      return;
    }

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
    const MAX_WAIT_MS = 3000; // give up after 3s

    // Poll via requestAnimationFrame until the document is tall enough to accommodate targetScrollY
    const poll = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );

      // If document is tall enough, or if we have reached the maximum possible scroll height
      if (
        docHeight >= targetScrollY + window.innerHeight ||
        window.scrollY + window.innerHeight >= docHeight - 10
      ) {
        scrollTo(targetScrollY);
        setTimeout(() => {
          isRestoringRef.current = false;
        }, 100);
        return;
      }

      if (elapsed >= MAX_WAIT_MS) {
        scrollTo(Math.min(targetScrollY, docHeight - window.innerHeight));
        setTimeout(() => {
          isRestoringRef.current = false;
        }, 100);
        return;
      }

      rafId = requestAnimationFrame(poll);
    };

    // Start polling on next animation frame
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
      window.removeEventListener("wheel", abort);
      window.removeEventListener("touchmove", abort);
      window.removeEventListener("pointerdown", abort);
    };
  }, [currentKey, navigationType]);

  return null;
}
