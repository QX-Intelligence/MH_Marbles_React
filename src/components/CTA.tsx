import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  { label: 'Private Curation', sub: 'Hand-picked from global quarries' },
  { label: 'Flagship Gallery', sub: '500+ Tile in Kukatpally' },
  { label: 'Bespoke Projects', sub: 'Tailored architectural solutions' },
];

export function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const elementsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        // Header Reveal
        if (headerRef.current) {
            gsap.from(headerRef.current, {
                y: 20,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: headerRef.current,
                    start: "top 90%"
                }
            });
        }

        // Title Reveal
        if (titleRef.current) {
            gsap.from(titleRef.current.children, {
                y: 50,
                opacity: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: "top 85%"
                }
            });
        }

        // Elements Reveal
        if (elementsRef.current) {
            gsap.from(elementsRef.current.children, {
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: elementsRef.current,
                    start: "top 80%"
                }
            });
        }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#C8A96E] text-[#0C0A08] overflow-hidden py-24 md:py-32">
      {/* ── Subdued background texture/noise ──────────────── */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* ── Geometric Lines ───────────────────────────────── */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-background/10" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-background/10" />
      <div className="absolute top-0 left-[8%] w-[1px] h-full bg-background/10" />

      <div className="relative z-10 px-6 md:px-[12%] max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div ref={headerRef} className="flex items-center gap-4 mb-20">
          <div className="w-12 h-[2px] bg-background" />
          <span className="text-[10px] font-black font-sans tracking-[0.6em] uppercase text-[#0C0A08]">
            Final Ascent
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-end">
          
          {/* Main Statement */}
          <div className="lg:col-span-8">
            <h2 
              ref={titleRef}
              className="font-serif font-light text-6xl sm:text-7xl md:text-[8rem] lg:text-[10rem] leading-[0.8] tracking-[-0.03em] flex flex-col"
            >
              <span className="block">Define</span>
              <span className="block italic font-medium ml-[10%] opacity-90">Your</span>
              <span className="block ml-[20%]">Space.</span>
            </h2>
          </div>

          {/* Action & Features */}
          <div ref={elementsRef} className="lg:col-span-4 flex flex-col gap-16 lg:pb-6">
            
            <div>
              <p className="text-sm md:text-base font-sans font-medium leading-relaxed opacity-70 mb-8 max-w-sm">
                Reserve a private consultation with our natural stone curators. 
                Experience the weight, temperature, and true scale of our collection.
              </p>

              <a
                href="#contact"
                className="group w-full max-w-[280px] flex items-center justify-between border-b-2 border-[#0C0A08] py-4 text-[11px] font-black uppercase tracking-[0.4em] hover:pr-4 transition-all duration-500"
              >
                <span>Book Viewing</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
              </a>
            </div>

            <div className="flex flex-col gap-6 pt-10 border-t border-[#0C0A08]/10">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <h4 className="font-serif text-xl md:text-2xl font-medium tracking-tight">{f.label}</h4>
                  <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] opacity-40">{f.sub}</p>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default CTA;
