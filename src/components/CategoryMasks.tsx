import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useTheme } from 'next-themes';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn, getOptimizedImageUrl } from '@/lib/utils';
import { useGallery } from '@/contexts/GalleryContext';
import { categories as staticCategories, initialTiles } from '@/data/tiles';

gsap.registerPlugin(ScrollTrigger);

const getCategoryImage = (categoryId: string): string => {
    // Curated "Flat / 180-Degree" assets for a clean typographic reveal
    const assets: Record<string, string> = {
        marble: '/assets/masks/marble.png',
        granite: '/assets/masks/granite.png',
        vitrified: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2600',
        wooden: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=2600'
    };
    
    if (assets[categoryId]) return assets[categoryId];

    const tile = initialTiles.find(t => t.category === categoryId);
    return tile?.image || 'https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?auto=format&fit=crop&q=80&w=2000';
};

export function CategoryMasks() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { categories: backendCategories } = useGallery();

  const dynamicCategories = useMemo(() => {
    return staticCategories.map(cat => {
      // For the Typographic Masks, we prioritize our curated Hero assets
      const heroImage = getCategoryImage(cat.id);
      
      // We still check for a match to keep the data consistent (IDs/Slugs)
      const match = backendCategories.find(bc => bc.name.toLowerCase() === cat.name.toLowerCase());
      
      return {
        ...cat,
        id: cat.id,
        name: cat.name,
        image_url: heroImage // Prioritizing the curated aesthetic
      };
    });
  }, [backendCategories]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === 'light';
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const fadeOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        if (!containerRef.current) return;

        // One massive master timeline pinned for all categories
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: `+=${dynamicCategories.length * 250}%`, // 250vh per category for much smoother scroll pacing
                scrub: 1,
                pin: true,
                refreshPriority: 10,
            }
        });

        // Initialize layers: Only the first layer is visible. 
        dynamicCategories.forEach((_, i) => {
            const currentSection = sectionRefs.current[i];
            gsap.set(currentSection, { 
                scale: 1, // Fix: Must remain 1 so crossfades work correctly
                opacity: i === 0 ? 1 : 0,
                transformOrigin: "50% 50%",
                zIndex: i + 1 // Ensures next category safely fades in ON TOP of current
            });
            gsap.set(textRefs.current[i], { scale: 1, opacity: 1 });
            gsap.set(imageRefs.current[i], { scale: 1 });
        });

        dynamicCategories.forEach((cat, i) => {
            const currentSection = sectionRefs.current[i];
            const currentMask = textRefs.current[i];
            const currentImg = imageRefs.current[i];
            const nextSection = sectionRefs.current[i + 1];
            
            // Absolute time marker for this category's phase
            const st = i * 1.0; 
            
            // Phase A: The Current Mask zooms and fades
            tl.to(currentMask, { scale: 30, ease: "power2.inOut", duration: 0.5 }, st);
            tl.to(currentMask, { opacity: 0, ease: "power2.in", duration: 0.2 }, st + 0.3);
            
            // Pan the current image so it feels alive
            tl.to(currentImg, { scale: 1.15, duration: 0.8, ease: "none" }, st);

            // Phase B: Explicitly fade out the current section once the next one is ready
            // and the mask has zoomed past.
            if (nextSection) {
                tl.to(currentSection, { opacity: 0, ease: "power1.inOut", duration: 0.3 }, st + 0.8);
                tl.to(nextSection, { opacity: 1, ease: "power1.inOut", duration: 0.3 }, st + 0.7);
            }
        });

        // Final Phase: Fade to Obsidian
        if (fadeOverlayRef.current) {
            tl.to(fadeOverlayRef.current, 
                { opacity: 1, duration: 0.2, ease: "power2.inOut" }, 
                (dynamicCategories.length - 1) * 1.0 + 0.8 
            );
        }

    });

    return () => ctx.revert();
  }, [dynamicCategories]);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-background z-[5]">
        
        {dynamicCategories.map((category, index) => (
            <div 
                key={category.id} 
                ref={el => sectionRefs.current[index] = el}
                className="absolute inset-0 w-full h-full"
            >
                
                {/* The Category Image */}
                <img 
                    ref={el => imageRefs.current[index] = el}
                    src={getOptimizedImageUrl(category.image_url, 1000, 1200)} 
                    alt={category.name} 
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 z-0 w-full h-full object-cover filter contrast-[1.1] saturate-[1.2] will-change-transform" 
                />

                {/* The Typographic Mask (Theme-aware Blend) */}
                <div 
                    ref={el => textRefs.current[index] = el}
                    className="absolute inset-0 z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none bg-background dark:mix-blend-multiply mix-blend-screen will-change-transform"
                >
                    <h2 
                        className="font-serif font-black tracking-[-0.04em] leading-none text-center uppercase whitespace-nowrap text-foreground"
                        style={{ fontSize: 'min(18vw, 25vh)', margin: 0, padding: 0 }}
                    >
                        {category.name}
                    </h2>
                </div>

            </div>
        ))}

        {/* Seamless Fade To Next Section */}
        <div 
            ref={fadeOverlayRef} 
            className="absolute inset-0 z-20 bg-background pointer-events-none will-change-opacity" 
            style={{ opacity: 0 }} 
        />

        {/* Global UX Hint overlay */}
        <div className="absolute bottom-12 right-8 md:bottom-16 md:right-16 z-30 pointer-events-none opacity-40 mix-blend-difference text-foreground">
            <span className="text-[9px] font-bold uppercase tracking-[0.8em]">
                Collection Portal
            </span>
        </div>

    </section>
  );
}

export default CategoryMasks;
