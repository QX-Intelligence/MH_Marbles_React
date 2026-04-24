import React, { useEffect, useRef } from 'react';
import SEO from '@/components/SEO';
import { PageLayout } from '@/components/PageLayout';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TIMELINE = [
    {
        year: "2005",
        title: "The Genesis.",
        desc: "Started Thandur hyd at Suraram, marking a strong beginning for our journey. A legacy built on the solid foundation of natural stone curation and uncompromising quality.",
        img: "/assets/Aboutus/1st-image.png"
    },
    {
        year: "2007",
        title: "Turning Vision.",
        desc: "The introduction of exquisite marble from Rajasthan, a strategic expansion that saw monumental success and solidified our reputation in the high-end architectural market.",
        img: "/assets/Aboutus/2nd-image.png"
    },
    {
        year: "2013",
        title: "Rising Through Adversity.",
        desc: "Expanded our narrative by introducing premium granite from renowned global hubs, including Rajasthan, Bengaluru, Karnataka, and Chimakurti.",
        img: "/assets/Aboutus/3rd-image.png"
    },
    {
        year: "2020",
        title: "Modern Portfolio.",
        desc: "Post-Pandemic Expansion: Introducing a luxurious collection of Vitrified Tiles, Smart Marbles, and Sanitary Ware, masterfully curated from Gujarat (Morbi) and China.",
        img: "/assets/Aboutus/4th-image.png"
    },
    {
        year: "2025",
        title: "Gandi Maisamma.",
        desc: "Celebrating the opening of Branch 2 at Gandi Maisamma. Continuing our legacy by introducing Natural Travertine and Nano White to the modern architectural palette.",
        img: "/assets/Aboutus/5th-image.png"
    }
];



const HeritagePage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const bgImageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            
            // Massive background zoom attached to whole page scroll
            gsap.to(bgImageRef.current, {
                scale: 1.5,
                yPercent: 20,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bg",
                    end: "bottom bottom",
                    scrub: 1
                }
            });

            // Timeline items - Staggered massive typography reveals with opposite parallax
            gsap.utils.toArray('.heritage-item').forEach((item: unknown, i) => {
                const el = item as HTMLElement;
                const year = el.querySelector('.heritage-year');
                const content = el.querySelector('.heritage-content');
                const image = el.querySelector('.heritage-image');

                const isEven = i % 2 === 0;

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: el,
                        start: "top 80%",
                        end: "top 20%",
                        scrub: 1
                    }
                });

                // The massive year text scrolls opposite to standard scroll
                tl.fromTo(year, 
                    { y: -100, x: isEven ? -100 : 100, opacity: 0 }, 
                    { y: 50, x: 0, opacity: 0.1, ease: "none" }, 0
                );

                // Content block slides up with high impact
                tl.fromTo(content, 
                    { y: 100, opacity: 0 }, 
                    { y: 0, opacity: 1, ease: "power2.out" }, 0.2
                );

                // Supporting image reveals itself with an extreme clip-path
                if (image) {
                    tl.fromTo(image, 
                        { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", scale: 1.2 }, 
                        { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", scale: 1, ease: "power2.inOut" }, 0.1
                    );
                }
            });

        });

        return () => ctx.revert();
    }, []);

    return (
        <>
            <SEO 
                title="Our Heritage | Legacy of Architectural Stone" 
                description="Explore the legacy of MH Marble. From artisanal beginnings in Italy to the forefront of robotic architectural stone carving across four decades."
                breadcrumbs={[
                  { name: 'Home', item: '/' },
                  { name: 'Heritage', item: '/heritage' }
                ]}
            />
            
            <PageLayout title="The Legacy." subtitle="21+ Years">

                
                {/* Immersive Deep Z-Index Container */}
                <div ref={containerRef} className="relative w-full bg-background text-foreground overflow-hidden min-h-screen border-t border-foreground/5 pb-64">
                    
                    {/* Deep Slow-Scrubbing Background */}
                    <div className="absolute inset-0 z-0 opacity-20 sepia-[0.5] mix-blend-screen overflow-hidden pointer-events-none">
                        <img 
                            ref={bgImageRef}
                            src="/assets/Aboutus/1st-image.png"
                            alt="Quarry Legacy" 
                            className="w-full h-[150%] object-cover transform-gpu origin-top"
                        />

                        <div className="absolute inset-0 bg-background/80" />
                    </div>
                    
                    <div className="relative z-10 w-full pt-32 max-w-none">
                        
                        {/* Intro */}
                        <div className="px-6 md:px-[8%] mb-48 text-center max-w-4xl mx-auto">
                            <span className="text-[10px] md:text-xs font-sans font-black tracking-[1em] text-[#C8A96E] uppercase mb-8 block">Origins</span>
                            <h2 className="text-5xl md:text-7xl font-serif font-light leading-[0.9] tracking-tighter mb-10">
                                The Excellence of <br/>
                                <span className="italic text-foreground/50">MH MARBLE.</span>
                            </h2>
                            <p className="text-xl md:text-2xl font-light text-foreground/60 leading-relaxed font-sans">
                                Our legacy was carved by hand before it was ever touched by modernization. 21+ years of relentless pursuit of architectural perfection.
                            </p>
                        </div>

                        {/* Unbounded Massive Timeline */}
                        <div className="flex flex-col gap-64 w-full">
                            {TIMELINE.map((item, index) => {
                                const isEven = index % 2 === 0;

                                return (
                                    <div key={item.year} className={`heritage-item relative w-full flex ${isEven ? 'justify-start' : 'justify-end'} items-center`}>
                                        
                                        {/* Massive Year Text (Deep Parallax) - Breaks bounds intentionally */}
                                        <div className={`heritage-year absolute top-0 ${isEven ? '-left-[10vw]' : '-right-[10vw]'} text-[35vw] font-serif font-bold italic text-foreground leading-none z-0 select-none overflow-hidden max-w-[120vw] whitespace-nowrap`}>
                                            {item.year}
                                        </div>

                                        {/* The Content & Image Cluster */}
                                        <div className={`heritage-content relative z-10 flex flex-col md:flex-row gap-12 w-[90%] md:w-[70%] lg:w-[60%] ${isEven ? 'ml-6 md:ml-[8%]' : 'mr-6 md:mr-[8%] flex-row-reverse'}`}>
                                            
                                            {/* Text Block */}
                                            <div className="flex-1 bg-background/40 backdrop-blur-md p-10 md:p-16 border border-foreground/10 relative">
                                                {/* Corner Accents */}
                                                <div className={`absolute top-0 ${isEven ? 'left-0' : 'right-0'} w-8 h-[1px] bg-[#C8A96E]`} />
                                                <div className={`absolute top-0 ${isEven ? 'left-0' : 'right-0'} w-[1px] h-8 bg-[#C8A96E]`} />

                                                <h3 className="text-4xl md:text-6xl font-serif font-light text-foreground mb-8 leading-[0.9]">
                                                    {item.title}
                                                </h3>
                                                <div className="w-12 h-[1px] bg-foreground/20 mb-8" />
                                                <p className="text-base md:text-lg font-sans font-light text-foreground/60 leading-relaxed">
                                                    {item.desc}
                                                </p>
                                            </div>

                                            {/* Supporting Image Array */}
                                            <div className="flex-1 hidden md:block relative overflow-hidden ring-1 ring-foreground/10">
                                                <img 
                                                    src={item.img} 
                                                    alt={item.title} 
                                                    className="heritage-image w-full h-auto object-contain grayscale-[50%] contrast-125 sepia-[0.2] block"
                                                />
                                            </div>

                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer Cap */}
                    <div className="relative z-10 text-center mt-64 border-t border-foreground/10 pt-32 w-full max-w-3xl mx-auto">
                        <h4 className="text-4xl font-serif font-light italic text-[#C8A96E] mb-6">"The stone remains. Only the methods evolve."</h4>
                        <span className="text-[9px] font-sans font-black uppercase tracking-[0.5em] text-foreground/50 block">M.H. — Founder, 2005</span>

                    </div>

                </div>
            </PageLayout>
        </>
    );
};

export default HeritagePage;
