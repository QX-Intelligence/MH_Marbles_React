import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const SLIDES = [
  {
    label: 'Italian Calacatta',
    image: 'https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?auto=format&fit=crop&q=80&w=1600',
    accent: '#C8A96E',
  },
  {
    label: 'Black Marquina',
    image: 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?auto=format&fit=crop&q=80&w=1600',
    accent: '#B89A5E',
  },
  {
    label: 'Emperador Dark',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1600',
    accent: '#D4AF7A',
  },
];

export function DiagonalHero() {
  const heroRef = useRef<HTMLElement>(null);
  
  // High scroll budget (400vh) to ensure immersive pinning
  const { scrollYProgress } = useScroll({ 
    target: heroRef, 
    offset: ['start start', 'end start'] 
  });

  // Typography - Fade out slowly as reveal proceeds
  const leftPanelOpacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 0.5, 0]);
  const leftPanelX = useTransform(scrollYProgress, [0, 0.8], [0, -150]);
  
  // Image Parallax & Scale
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  // FULL DIAGONAL REVEAL: Sweeps across the entire screen
  // Finishes reveal at 0.85 of the total 400vh scroll budget.
  const sweepX = useTransform(scrollYProgress, [0, 0.85], ["0%", "-110%"]);

  // Materiality "Shine": Dynamic filter punch peaking during reveal
  const brightness = useTransform(scrollYProgress, [0, 0.5, 1], [2.4, 1.5, 1]);
  const contrast = useTransform(scrollYProgress, [0, 0.5, 1], [1.8, 1.4, 1]);

  const slide = SLIDES[0];

  return (
    <section
      ref={heroRef}
      className="relative h-[400vh] w-full bg-background overflow-hidden"
    >
      {/* Sticky Container - Pins content while scrollProgress is < 1 */}
      <div className="sticky top-0 h-screen w-full flex items-stretch overflow-hidden">
        
        {/* ─── LEFT PANEL: Typography ─── */}
        <motion.div
          style={{ 
            opacity: leftPanelOpacity,
            x: leftPanelX
          }}
          className="relative z-30 flex flex-col justify-between w-full md:w-[50%] px-8 sm:px-14 md:px-20 py-10 pt-28 md:pt-32 pointer-events-none"
        >

          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex items-center gap-4 mb-10 md:mb-14"
            >
              <div className="w-8 h-[1px] bg-[#C8A96E]" />
              <span className="text-[10px] font-sans font-black tracking-[0.9em] uppercase text-[#C8A96E]">
                Est. 1980 · Signature Curation
              </span>
            </motion.div>

            <div className="overflow-hidden mb-4">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                className="text-[18vw] sm:text-[5.5rem] md:text-[6.5rem] lg:text-[8.5rem] font-serif font-light text-foreground leading-[0.82] tracking-[-0.03em]"
              >
                Stone
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-4">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
                className="text-[18vw] sm:text-[5.5rem] md:text-[6.5rem] lg:text-[8.5rem] font-serif font-light leading-[0.82] tracking-[-0.03em]"
                style={{ color: slide.accent, transition: 'color 0.8s ease' }}
              >
                Refined
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
                className="text-[18vw] sm:text-[5.5rem] md:text-[6.5rem] lg:text-[8.5rem] font-serif font-light italic text-foreground/20 leading-[0.82] tracking-[-0.03em]"
              >
                Forever.
              </motion.h1>
            </div>
          </div>

          <div className="md:mb-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="text-foreground/40 text-base md:text-lg font-sans font-light leading-relaxed max-w-sm"
            >
              Exquisite marble from the earth's most remote quarries. 
              Unveiled through a cinematic diagonal sweep of materiality and light.
            </motion.p>
          </div>
        </motion.div>

        {/* ─── FULL-SCREEN REVEAL PANEL ─── */}
        <div className="absolute inset-0 z-10 w-full h-full">
          
          {/* Diagonal reveal sweep (Theme-aware Blackout Layer) */}
          <motion.div 
            className="absolute inset-0 z-30 bg-background pointer-events-none" 
            style={{ 
              x: sweepX,
              // We use a CSS variable for the background color in the gradient
              background: 'linear-gradient(105deg, hsl(var(--background)) 0%, hsl(var(--background)) 40%, transparent 65%)',
              width: "250%",
              left: "-10%"
            }} 
          />
          
          {/* Subtle Fixed Overlays */}
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />

          {/* Image Layer */}
          <motion.div
             className="w-full h-full relative"
          >
            <motion.img
              src={slide.image}
              alt={slide.label}
              className="w-full h-full object-cover origin-right shadow-2xl"
              style={{
                y: imageY,
                scale: imageScale,
                filter: useTransform(
                   [brightness, contrast],
                   ([b, c]) => `brightness(${b}) contrast(${c})`
                )
              }}
            />
          </motion.div>

          {/* Slide name tag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute bottom-12 right-12 z-40 text-right"
          >
            <p className="text-[11px] font-sans font-black uppercase tracking-[0.6em] text-foreground/30 mb-2">
              Featured Selection
            </p>
            <p className="font-serif text-xl md:text-4xl text-foreground/90 italic font-semibold">{slide.label}</p>
          </motion.div>
        </div>

        {/* ─── Vertical scroll hint ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-10 left-8 sm:left-14 md:left-20 z-40 flex items-center gap-6"
        >
          <div className="w-[1px] h-20 relative overflow-hidden bg-foreground/10">
            <motion.div
              className="absolute top-0 w-full"
              style={{ background: `linear-gradient(to bottom, ${slide.accent}, transparent)`, height: '50%' }}
              animate={{ y: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.8em] text-foreground/20">Scroll To Reveal</span>
        </motion.div>
      </div>
    </section>
  );
}

export default DiagonalHero;
