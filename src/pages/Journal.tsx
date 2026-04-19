import React, { useEffect, useRef, useState } from 'react';
import SEO from '@/components/SEO';
import { PageLayout } from '@/components/PageLayout';
import { Reviews } from '@/components/Reviews';
import { useGallery } from '@/contexts/GalleryContext';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Image as ImageIcon } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

gsap.registerPlugin(ScrollTrigger);

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

// ─── Component: ImageMagnifier ────────────────────────────────────────────────
const ImageMagnifier = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
    const [showLens, setShowLens] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Dynamic motion values for smooth tracking
    const mouseX = useMotionValue(50);
    const mouseY = useMotionValue(50);

    // Spring physics for buttery smooth damping
    const springConfig = { stiffness: 150, damping: 25, mass: 0.5 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    // Map motion values to background position percentages (TOP LEVEL HOOKS)
    const bgPosX = useTransform(smoothX, v => `${v}%`);
    const bgPosY = useTransform(smoothY, v => `${v}%`);
    const lensX = useTransform(smoothX, v => `${v}%`);
    const lensY = useTransform(smoothY, v => `${v}%`);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        
        // Calculate percentage across the container
        const xPercent = ((e.clientX - left) / width) * 100;
        const yPercent = ((e.clientY - top) / height) * 100;
        
        mouseX.set(xPercent);
        mouseY.set(yPercent);
    };

    return (
        <div 
            ref={containerRef}
            className={cn("relative overflow-hidden cursor-none h-full w-full bg-foreground/5", className)}
            onMouseEnter={() => setShowLens(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setShowLens(false)}
        >
            <img src={src} alt={alt} className="w-full h-full object-cover transition-opacity duration-500" />
            
            <AnimatePresence>
                {showLens && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute inset-0 pointer-events-none z-20"
                    >
                        <motion.div 
                            className="absolute inset-0 border border-[#C8A96E]/20"
                            style={{
                                backgroundImage: `url(${src})`,
                                backgroundPositionX: bgPosX,
                                backgroundPositionY: bgPosY,
                                backgroundSize: '220%', // Slightly reduced for better clarity
                                backgroundRepeat: 'no-repeat',
                            }}
                        />
                        
                        {/* Custom Lens UI (Follower) */}
                        <motion.div 
                            className="absolute w-40 h-40 rounded-full border border-[#C8A96E] shadow-2xl pointer-events-none z-30 flex items-center justify-center bg-[#C8A96E]/5 backdrop-blur-[2px]"
                            style={{
                                left: lensX,
                                top: lensY,
                                x: "-50%",
                                y: "-50%",
                            }}
                        >
                             <div className="w-1 h-1 bg-[#C8A96E] rounded-full opacity-50" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {!showLens && (
                <div className="absolute top-8 right-8 mix-blend-difference pointer-events-none">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50">Exploration Lens</span>
                </div>
            )}
        </div>
    );
};



// ─── Component: JournalEntryCard ──────────────────────────────────────────────
const JournalEntryCard = ({ entry, index }: { entry: any; index: number }) => {
    const initialImage = entry.image_urls && entry.image_urls.length > 0 ? entry.image_urls[0] : '';
    const [activeImage, setActiveImage] = useState(initialImage);

    useEffect(() => {
        if (entry.image_urls?.length) {
            setActiveImage(entry.image_urls[0]);
        }
    }, [entry]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center group">
            {/* Media Side */}
            <div className={`col-span-1 lg:col-span-8 overflow-hidden bg-foreground/5 shadow-2xl ${index % 2 !== 0 ? 'lg:order-2' : ''}`}>
                <div className="flex flex-col gap-1">
                    {/* Primary Media */}
                    <div className="aspect-video w-full relative">
                        {entry.ytUrl ? (
                            <iframe 
                                src={entry.ytUrl.replace('watch?v=', 'embed/').split('&')[0]} 
                                className="absolute inset-0 w-full h-full border-0 grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen 
                            />
                        ) : activeImage ? (
                            <ImageMagnifier 
                                src={activeImage} 
                                alt={entry.title} 
                                className="absolute inset-0 w-full h-full"
                            />
                        ) : (
                            <div className="absolute inset-0 w-full h-full bg-foreground/[0.03] flex items-center justify-center">
                                <span className="text-[10px] uppercase font-black tracking-widest text-foreground/20">Visual record synchronizing...</span>
                            </div>
                        )}
                    </div>

                    {/* Thumbnail Strip */}
                    {entry.image_urls && entry.image_urls.length > 1 && (
                        <div className="grid grid-cols-5 gap-1">
                            {entry.image_urls.slice(0, 10).map((url: string, i: number) => (
                                <div 
                                    key={i} 
                                    onClick={() => setActiveImage(url)}
                                    className={cn(
                                        "aspect-square relative overflow-hidden bg-foreground/5 cursor-pointer transition-all duration-500",
                                        activeImage === url ? "ring-1 ring-inset ring-[#C8A96E]/60 opacity-100" : "opacity-40 hover:opacity-100 grayscale-[60%] hover:grayscale-0"
                                    )}
                                >
                                    <img 
                                        src={url} 
                                        alt={`Thumbnail ${i + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Text Side */}
            <div className={`col-span-1 lg:col-span-4 flex flex-col justify-center ${index % 2 !== 0 ? 'lg:order-1 lg:text-right md:items-end' : ''}`}>
                <div className="flex flex-col space-y-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#C8A96E] block">
                        Case Study // {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-tight leading-[1.1] text-foreground group-hover:text-[#C8A96E] transition-colors duration-500 italic">
                        {entry.title}
                    </h3>
                    <div className="w-12 h-px bg-accent/30 hidden lg:block" />
                    <p className="text-sm md:text-base font-sans font-light text-foreground/50 leading-relaxed max-w-lg">
                        {entry.description}
                    </p>

                </div>
            </div>
        </div>
    );
};

const JournalPage: React.FC = () => {
    const { journal } = useGallery();
    const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
    const quotesRef = useRef<(HTMLHeadingElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Editorial Parallax
            imagesRef.current.forEach((img, i) => {
                if (!img) return;
                gsap.to(img, {
                    yPercent: -20 * (i + 1),
                    ease: "none",
                    scrollTrigger: {
                        trigger: img.parentElement,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
            });

            // Entry Entrance
            const entries = document.querySelectorAll('.journal-entry');
            entries.forEach((entry) => {
                gsap.fromTo(entry,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1, y: 0,
                        duration: 1.5,
                        scrollTrigger: {
                            trigger: entry,
                            start: "top 85%"
                        }
                    }
                );
            });
        });

        return () => ctx.revert();
    }, [journal]);

    return (
        <>
            <SEO 
                title="Journal — MH Marbles | Stones Through Time"
                description="Explore our architectural journal, documenting the transformation of raw stone into timeless spaces. A narrative of craftsmanship and modern vision."
                breadcrumbs={[
                    { name: 'Home', item: '/' },
                    { name: 'Journal', item: '/journal' }
                ]}
            />

            <PageLayout>
                <div className="min-h-screen bg-background text-foreground">
                    <Header />

                    {/* Experimental Hero Section */}
                    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden border-b border-foreground/5">
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-repeat" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3")` }} />
                        </div>
                        
                        <div className="w-full max-w-none px-6 md:px-[8%] relative z-10">
                            <div className="flex flex-col items-center justify-center text-center space-y-8 mb-40 md:mb-64">
                                <span className="text-[10px] md:text-xs font-sans font-black tracking-[1em] uppercase text-[#C8A96E]">Chronicle</span>
                                <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-serif font-light leading-[0.8] tracking-tighter text-foreground">
                                    Stone <span className="italic text-foreground/30">&</span> <br />
                                    Time.
                                </h1>
                            </div>

                            <div className="relative w-full h-[150vh] md:h-[200vh]">
                                <div className="absolute left-1/2 -translate-x-1/2 top-[10%] w-[90%] md:w-[40%] aspect-square z-10 p-4 border border-foreground/5">
                                    <div className="w-full h-full overflow-hidden">
                                        <img 
                                            ref={el => imagesRef.current[0] = el}
                                            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200" 
                                            alt="Architectural space" 
                                            className="w-full h-full object-cover grayscale opacity-80"
                                        />
                                    </div>
                                    <div className="absolute -bottom-10 -right-10 bg-[#C8A96E] text-background p-8 md:p-12 z-20">
                                        <span className="text-[9px] font-black uppercase tracking-[0.5em] block">Volume XXI</span>
                                        <span className="text-3xl font-serif italic mt-2 block">Heritage.</span>
                                    </div>
                                </div>
                                <div className="absolute top-[35%] left-[5%] md:left-[10%] z-30 mix-blend-difference pointer-events-none">
                                    <h2 className="text-6xl md:text-[8rem] font-serif font-light text-[#C8A96E] leading-[0.8] mix-blend-difference">
                                        Beyond<br/>
                                        <span className="text-foreground italic">Form.</span>
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* Dynamic Journal Entries */}
                    <section className="py-24 bg-background">
                        <div className="max-w-[1800px] mx-auto px-6 md:px-[8%]">
                            {journal.length > 0 ? (
                                <div className="space-y-32">
                                    {journal.map((entry, index) => (
                                        <div key={entry.id} className="journal-entry">
                                            <JournalEntryCard entry={entry} index={index} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 border-t border-b border-foreground/5">
                                    <span className="text-[10px] uppercase font-black tracking-[0.5em] text-foreground/30 italic">Archives currently synchronizing with the vision...</span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Minimalist CTA */}
                    <section className="py-32 md:py-48 bg-secondary relative border-t border-foreground/5">
                        <div className="w-full max-w-none px-6 md:px-[8%] relative z-10 text-center">
                            <div className="max-w-4xl mx-auto">
                                <span className="text-[10px] font-sans font-black tracking-[0.8em] uppercase text-[#C8A96E] mb-10 block">Submit Your Narrative</span>
                                <h3 className="text-5xl sm:text-6xl md:text-8xl font-serif font-light leading-[0.9] tracking-tighter mb-10 md:mb-16">
                                    Become part <br />
                                    <span className="italic text-foreground/50">of the story.</span>
                                </h3>
                                <p className="text-base md:text-xl font-sans font-light text-foreground/40 leading-relaxed mb-16 max-w-2xl mx-auto">
                                    We are continually seeking to share the extraordinary ways our stones have transformed architectural spaces.
                                </p>
                                <a href="/contact" className="inline-flex items-center justify-center border border-foreground/20 hover:border-[#C8A96E] hover:bg-[#C8A96E]/10 h-16 md:h-20 px-12 md:px-16 text-[9px] font-black uppercase tracking-[0.5em] transition-all duration-700 text-foreground">
                                    Contact Us
                                </a>
                            </div>
                        </div>
                    </section>

                    <Footer />
                </div>
            </PageLayout>
        </>
    );
};

export default JournalPage;
