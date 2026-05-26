import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { HelmetProvider } from 'react-helmet-async';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient, persister } from '@/lib/queryClient';

gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis smooth scroll
const lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1.2,
    gestureOrientation: 'vertical',
    smoothWheel: true,
});

(window as any).lenis = lenis;

// Synchronize ScrollTrigger with Lenis
lenis.on('scroll', () => ScrollTrigger.update());

function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

createRoot(document.getElementById("root")!).render(
  <PersistQueryClientProvider 
    client={queryClient} 
    persistOptions={{ persister }}
  >
    <HelmetProvider>
      <App />
    </HelmetProvider>
    {/* TanStack Query DevTools — dev only, invisible in production */}
    <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
  </PersistQueryClientProvider>
);
