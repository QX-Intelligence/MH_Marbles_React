import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { useGallery } from '@/contexts/GalleryContext';
import { HeroSlide } from '@/types/gallery';

type SlideData = {
  label: string;
  over: string;
  image: string;
  cta_text: string;
  cta_link: string;
};

export function Hero() {
  const { media } = useGallery();
  const [current, setCurrent] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const topTextRef = useRef<HTMLSpanElement>(null);
  const bottomTextRef = useRef<HTMLSpanElement>(null);

  // Stable refs — interval reads these instead of stale closures
  const currentRef = useRef(0);
  const slidesRef = useRef<SlideData[]>([]);

  /**
   * Map backend HeroSlide[] (from /api/hero_carousel/) → internal SlideData[].
   */
  const slides: SlideData[] = useMemo(() => {
    const carouselSlides = (media as unknown as HeroSlide[] || []).filter(s => s.is_active);

    return [...carouselSlides]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(slide => ({
        label: slide.heading || '',
        over: slide.subtext || '',
        image: slide.image || '',
        cta_text: slide.cta_text || '',
        cta_link: slide.cta_link || '',
      }));
  }, [media]);

  // Keep stable refs in sync
  useEffect(() => { currentRef.current = current; }, [current]);
  useEffect(() => { slidesRef.current = slides; }, [slides]);

  // Interval created ONCE — reads data via stable refs, never stacks
  useEffect(() => {
    // Return early if no slides to avoid errors
    if (slides.length === 0) return;

    // Initial entry animation for the first slide
    if (slideRefs.current[0]) {
      gsap.fromTo(
        slideRefs.current[0],
        { scale: 1.1, filter: 'brightness(0.5)' },
        { scale: 1, filter: 'brightness(1)', duration: 4, ease: 'power2.out' }
      );
    }

    // Only start the rotation interval if we have multiple slides
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      const cur = currentRef.current;
      const allSlides = slidesRef.current;
      if (allSlides.length <= 1) return;

      const nextIdx = (cur + 1) % allSlides.length;
      const currentSlide = slideRefs.current[cur];
      const nextSlide = slideRefs.current[nextIdx];

      if (currentSlide) gsap.set(currentSlide, { zIndex: 1 });
      if (nextSlide) gsap.set(nextSlide, { zIndex: 2 });

      if (nextSlide) {
        gsap.fromTo(
          nextSlide,
          { opacity: 0, scale: 1.05 },
          {
            opacity: 1, scale: 1, duration: 2, ease: 'power2.inOut',
            onComplete: () => {
              if (currentSlide) gsap.set(currentSlide, { opacity: 0, scale: 1, zIndex: 0 });
              setCurrent(nextIdx);
            }
          }
        );
      }

      if (topTextRef.current && bottomTextRef.current) {
        gsap.to([topTextRef.current, bottomTextRef.current], {
          y: -40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.in',
          onComplete: () => {
            if (topTextRef.current && bottomTextRef.current) {
              topTextRef.current.innerText = allSlides[nextIdx].over;
              bottomTextRef.current.innerText = allSlides[nextIdx].label;
              gsap.fromTo(
                [topTextRef.current, bottomTextRef.current],
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }
              );
            }
          }
        });
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]); 

  if (slides.length === 0) {
    return (
      <section className="relative h-screen w-full bg-[#0C0A08] flex items-center justify-center">
        <div className="text-foreground/10 font-sans font-black text-6xl uppercase tracking-widest italic">
          MH Marble
        </div>
      </section>
    );
  }

  const activeCta = slides[current];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-background">

      {/* ── Background Slide Layers ── */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, i) => (
          <div
            key={i}
            ref={el => slideRefs.current[i] = el}
            className="absolute inset-0 w-full h-full will-change-transform"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          >
            {slide.image && (
              <img
                src={slide.image}
                alt={slide.label}
                className="w-full h-full object-cover"
              />
            )}
            {/* Vignettes for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A08]/90 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0C0A08]/40 via-transparent to-[#0C0A08]/40" />
          </div>
        ))}
      </div>

      {/* ── Cinematic Typography + CTA ── */}
      <div className="relative z-20 w-full h-full flex flex-col justify-center items-center text-center px-4">
        <h2 className="flex flex-col items-center">
          <span
            ref={topTextRef}
            className="block font-sans font-black text-[12vw] md:text-[8vw] text-foreground/90 leading-[0.8] tracking-tighter mix-blend-overlay uppercase"
          >
            {slides[current]?.over}
          </span>
          <span
            ref={bottomTextRef}
            className="block font-serif italic text-[8vw] md:text-[5vw] text-accent leading-[1.2] tracking-normal mt-2 drop-shadow-2xl"
          >
            {slides[current]?.label}
          </span>
        </h2>

        {/* Per-slide CTA — only rendered when the backend slide has cta_text + cta_link */}
        {activeCta?.cta_text && activeCta?.cta_link && (
          <a
            href={activeCta.cta_link}
            className="mt-10 inline-flex items-center gap-3 px-8 py-4 border border-accent/60 text-accent text-[10px] font-black uppercase tracking-[0.4em] hover:bg-accent hover:text-background transition-all duration-500"
          >
            {activeCta.cta_text}
            <span className="text-lg leading-none">→</span>
          </a>
        )}
      </div>

      {/* ── Slide Counter + Progress Bar (only shown for multiple slides) ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-12 inset-x-0 z-30 flex justify-center items-center">
          <div className="flex items-center gap-6">
            <div className="text-[10px] font-bold font-sans tracking-[0.4em] text-foreground/50">
              0{current + 1}
            </div>
            <div className="w-16 h-[2px] bg-foreground/20 relative overflow-hidden hidden md:block">
              <div
                key={current}
                className="absolute top-0 left-0 h-full bg-accent animate-[grow_6s_linear_forwards]"
              />
            </div>
            <div className="text-[10px] font-bold font-sans tracking-[0.4em] text-foreground/50">
              0{slides.length}
            </div>
          </div>
        </div>
      )}

      {/* ── Scroll Hint ── */}
      <div className="absolute bottom-12 right-8 md:bottom-16 md:right-16 z-30 hidden md:block">
        <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-foreground/40">
          Scroll to Explore
        </span>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes grow {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}} />
    </section>
  );
}

export default Hero;
