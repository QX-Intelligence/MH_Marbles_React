import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGallery } from '@/contexts/GalleryContext';

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    num: '01',
    title: 'Ancient Sourcing',
    body: 'Every slab is hand-selected from quarries that have supplied stone to civilization\'s greatest monuments—Carrara, Estremoz, Marquina.',
    icon: '◈',
  },
  {
    num: '02',
    title: '45 Years of Craft',
    body: 'Four decades of mastering the art of stone curation, building lasting relationships with the world\'s finest quarry masters.',
    icon: '◇',
  },
  {
    num: '03',
    title: 'Singular Slabs',
    body: 'No two slabs are alike. We celebrate each stone\'s unique veining, its billion-year biography etched in mineral.',
    icon: '⬡',
  },
  {
    num: '04',
    title: 'Visionary Spaces',
    body: 'From private residences to landmark commercial projects, our stones have defined India\'s most celebrated interiors.',
    icon: '⬟',
  },
];

const STATS = [
  { value: '45+', label: 'Years of Legacy' },
  { value: '500+', label: 'Unique Textures' },
  { value: '2,000+', label: 'Projects Realized' },
  { value: '12', label: 'Countries Sourced' },
];

export function WhyUs() {
  const { brands } = useGallery();
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        // Stats strip reveal (fires once, no scrub)
        if (statsRef.current) {
            gsap.from(statsRef.current.children, {
                y: 40,
                opacity: 0,
                stagger: 0.1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: statsRef.current,
                    start: "top 85%"
                }
            });
        }

        // Header Title reveal
        gsap.from('.why-title', {
            x: -50,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.why-title',
                start: "top 80%"
            }
        });

        // Pillars stagger reveal
        gsap.from('.why-pillar', {
            x: 50,
            opacity: 0,
            stagger: 0.15,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.why-pillar-container',
                start: "top 75%"
            }
        });



    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="why-us" className="relative overflow-hidden bg-background transition-colors duration-500">
      
      {/* ── PART 1: Stats strip ── */}
      <div className="relative border-y border-border py-12 md:py-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=60&w=1000')] bg-cover bg-center opacity-[0.04] scale-110 origin-bottom"
        />
        <div ref={statsRef} className="relative z-10 w-full px-4 md:px-[8%] grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-x-0 md:divide-x md:divide-border">
          {STATS.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center px-6 py-2">
              <span className="font-serif text-4xl md:text-6xl font-light text-[#C8A96E] tracking-tight italic">
                {s.value}
              </span>
              <span className="mt-3 text-[9px] font-sans font-bold uppercase tracking-[0.5em] text-foreground/20">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── PART 2: Header + Pillars ── */}
      <div className="w-full px-4 md:px-[8%] pt-24 md:pt-36 pb-24 md:pb-36">
        <div className="flex flex-col lg:flex-row gap-16 md:gap-24">

          {/* Sticky label column */}
          <div className="why-title lg:w-[38%] lg:sticky lg:top-32 lg:self-start will-change-transform">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-[1px] bg-[#C8A96E]" />
              <span className="text-[9px] font-sans font-bold tracking-[0.9em] uppercase text-[#C8A96E]">
                Architecture & Soul
              </span>
            </div>

            <h2 className="font-serif font-light text-foreground text-5xl md:text-7xl leading-[0.88] tracking-[-0.02em] mb-8">
              Why the<br />
              <span className="italic text-foreground/30">World Chooses</span><br />
              MH Marble.
            </h2>

            <p className="text-foreground/40 font-sans font-light text-base md:text-lg leading-relaxed max-w-sm">
              For nearly half a century, we have curated a sanctuary of the earth's most exquisite stones — not merely surfaces, but enduring statements.
            </p>

            <div className="relative mt-12 w-full max-w-xs aspect-[4/5] overflow-hidden hidden lg:block border border-border">
              <img
                src="https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?auto=format&fit=crop&q=80&w=800"
                alt="Marble detail"
                className="w-full h-full object-cover opacity-50 grayscale-[30%] hover:scale-105 transition-transform duration-[3s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 pointer-events-none">
                <p className="text-[8px] font-bold uppercase tracking-[0.5em] text-[#C8A96E]/60">
                  Calacatta Gold
                </p>
              </div>
            </div>
          </div>

          {/* Pillars Container */}
          <div className="why-pillar-container lg:w-[62%] flex flex-col gap-0 border-t border-border pt-10 lg:pt-0 lg:border-t-0 will-change-transform">
            {PILLARS.map((p, i) => (
              <div
                key={i}
                className="why-pillar group flex items-start gap-6 md:gap-10 py-10 md:py-14 border-b border-border hover:border-accent/40 transition-colors duration-700 cursor-default"
              >
                <div className="flex-shrink-0 w-10 md:w-16 text-right mt-1">
                  <span className="text-[9px] font-bold font-sans text-foreground/15 uppercase tracking-[0.4em]">{p.num}</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                      <span className="text-xl md:text-2xl text-[#C8A96E]/30 group-hover:rotate-45 transition-transform duration-500">
                          {p.icon}
                      </span>
                      <h3 className="font-serif text-2xl md:text-4xl font-light text-foreground tracking-tight group-hover:text-accent transition-colors duration-700">
                        {p.title}
                      </h3>
                  </div>
                  
                  <p className="text-foreground/35 font-sans font-light text-sm md:text-base leading-relaxed max-w-md group-hover:text-foreground/60 transition-colors duration-500">
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}

export default WhyUs;
