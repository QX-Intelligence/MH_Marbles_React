import React, { useMemo, useRef, useEffect } from 'react';

import { Tile } from '@/data/tiles';
import { getOptimizedImageUrl } from '@/lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CinematicParallaxCard = React.memo(({ tile, index, total }: { tile: Tile, index: number, total: number }) => {
  const bgTextRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // We expose these refs via a custom property for the parent to animate
  // or we can use generic class selectors if they are unique.
  // For simplicity and robustness with memoization, we'll use class-based targetting within the timeline context.

  const numString = (index + 1).toString().padStart(2, '0');

  return (
    <section 
      id={`parallax-section-${index}`}
      className="absolute inset-0 w-full h-full flex flex-col justify-center bg-[#090807] overflow-hidden text-white"
      style={{ 
        zIndex: index + 10,
        // Start hidden (except first one) and the timeline will reveal them
        clipPath: index === 0 ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
        willChange: 'clip-path'
      }}
    >
      {/* Target Background Number */}
      <div 
        className="parallax-bg-text absolute top-[10%] right-[-5%] text-[40vw] font-serif italic text-white select-none pointer-events-none leading-none z-0 overflow-hidden"
        style={{ opacity: 0.08 }}
      >
        {numString}
      </div>

      <div className="absolute inset-x-0 top-0 h-full z-0 pointer-events-none overflow-hidden">
        {tile.image_url || tile.image ? (
          <img
            className="parallax-image w-full h-[120%] object-cover grayscale-[20%] opacity-50 mix-blend-screen will-change-transform"
            src={getOptimizedImageUrl(tile.image_url || tile.image, 1600, 2000)}
            alt={tile.name}
            style={{ transform: 'translateY(100px) scale(1.1)' }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090807] via-transparent to-transparent" />
      </div>

      <div className="parallax-content relative z-10 w-full max-w-[1800px] mx-auto px-6 md:px-16 pt-24 pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-16">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-[#C8A96E]" />
            <span className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-[#C8A96E]">
              {tile.category_name || String(tile.category || 'Signature')}
            </span>
          </div>
          <h2 className="text-[12vw] md:text-[10vw] font-serif font-normal leading-[0.85] tracking-tighter text-white whitespace-pre-wrap max-w-full md:max-w-[80%]">
            {tile.name.split(' ').join('\n')}
          </h2>
        </div>

        <div className="w-full md:w-[400px] xl:w-[500px] shrink-0 border border-white/10 bg-white/5 backdrop-blur-sm p-8 md:p-10">
          <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-white/10">
            <div className="flex flex-col">
              <span className="text-[8px] font-black tracking-[0.2em] text-white/40 uppercase mb-2">Origin Quarry</span>
              <span className="text-sm md:text-base font-serif italic text-white/90">{tile.origin || tile.brand || 'Global Selection'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black tracking-[0.2em] text-white/40 uppercase mb-2">Finish Types</span>
              <span className="text-sm md:text-base font-serif italic text-white/90">{tile.finish || 'Polished / Honed'}</span>
            </div>
          </div>
          <div className="flex flex-col">
             <span className="text-[8px] font-black tracking-[0.2em] text-white/40 uppercase mb-3">Profile</span>
             <p className="text-sm md:text-base text-white/70 leading-relaxed font-sans">
               {tile.description || `A highly refined architectural ${String(tile.category || 'stone').toLowerCase()} characterized by exquisite veining and superior structural density.`}
             </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-6 md:px-16 mt-auto flex justify-between items-center border-t border-white/10 pt-6 pb-4">
         <div className="flex items-center gap-6">
           <span className="text-[9px] font-black tracking-[0.2em] text-white/40 uppercase">{tile.size ? `${tile.size} Format` : 'Various Formats'}</span>
           <span className="w-1 h-1 rounded-full bg-white/20 hidden md:block" />
           <span className="text-[9px] font-black tracking-[0.2em] text-white/40 uppercase hidden md:block tracking-widest">Premium Selection</span>
         </div>
         <a 
           href={`/product/${tile.id}`}
           className="text-[9px] font-black tracking-[0.2em] text-[#C8A96E] hover:text-white uppercase transition-colors group flex items-center gap-3"
         >
           View Stone Details
           <span className="transition-transform group-hover:translate-x-2">&rarr;</span>
         </a>
      </div>
    </section>
  );
});
CinematicParallaxCard.displayName = 'CinematicParallaxCard';



import { useFeaturedProducts } from '@/hooks/useProducts';

export function FeaturedProducts() {
  const { data: featuredProducts = [] } = useFeaturedProducts();
  const containerRef = useRef<HTMLDivElement>(null);

  const featured = useMemo(() => {
    // Strictly rely on backend API /products/featured/ response
    return featuredProducts.filter(t => t.image_url || t.image).slice(0, 6);
  }, [featuredProducts]);

  useEffect(() => {
    if (featured.length === 0) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${featured.length * 100}%`, // Scroll through each section
          scrub: true,
          pin: true,
          anticipatePin: 1,
          refreshPriority: 5,
        }
      });

      // For each section after the first one, create the curtain reveal
      featured.forEach((_, i) => {
        if (i === 0) {
           // First section parallax logic
           tl.to(`#parallax-section-0 .parallax-image`, { y: -100, scale: 1, ease: "none" }, 0);
           tl.fromTo(`#parallax-section-0 .parallax-bg-text`, { y: 50 }, { y: -150, ease: "none" }, 0);
           return;
        }

        const label = `reveal-${i}`;
        // The curtain reveal (Clip-path)
        tl.to(`#parallax-section-${i}`, {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: "none",
        }, label);

        // Nested Parallax for the newly revealed section
        tl.fromTo(`#parallax-section-${i} .parallax-image`, 
          { y: 100, scale: 1.1 }, 
          { y: -100, scale: 1, ease: "none" }, label);
        
        tl.fromTo(`#parallax-section-${i} .parallax-bg-text`, 
          { y: 50 }, 
          { y: -150, ease: "none" }, label);

        // Content push (staggered in the timeline)
        tl.fromTo(`#parallax-section-${i} .parallax-content`,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, ease: "power2.out", duration: 0.5 }, 
          `${label}+=0.2`);
      });

    }, containerRef);

    return () => ctx.revert();
  }, [featured]);

  if (featured.length === 0) return null;

  return (
    <div 
      ref={containerRef} 
      className="w-full h-screen bg-[#090807] relative overflow-hidden z-[4]"
    >
      {featured.map((tile, i) => (
        <CinematicParallaxCard 
          key={tile.id} 
          tile={tile} 
          index={i} 
          total={featured.length} 
        />
      ))}
    </div>
  );
}

export default FeaturedProducts;
