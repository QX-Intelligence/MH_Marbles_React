import React, { useEffect, useRef } from 'react';
import SEO from '@/components/SEO';
import { PageLayout } from '@/components/PageLayout';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Atelier = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const getScrollAmount = () => {
                const containerWidth = scrollContainerRef.current?.scrollWidth || 0;
                return -(containerWidth - window.innerWidth);
            };

            const tween = gsap.to(scrollContainerRef.current, {
                x: getScrollAmount,
                ease: "none"
            });

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: () => `+=${getScrollAmount() * -1}`,
                pin: true,
                animation: tween,
                scrub: 1,
                invalidateOnRefresh: true,
                anticipatePin: 1
            });

            // Parallax sub-elements within the horizontal scroll
            gsap.utils.toArray('.atelier-parallax-img').forEach((img: unknown) => {
                const element = img as HTMLElement;
                gsap.to(element, {
                    xPercent: 30,
                    ease: "none",
                    scrollTrigger: {
                        trigger: element.parentNode as HTMLElement,
                        containerAnimation: tween,
                        start: "left right",
                        end: "right left",
                        scrub: true
                    }
                });
            });

            gsap.utils.toArray('.atelier-text-reveal').forEach((text: unknown) => {
                const element = text as HTMLElement;
                gsap.from(element, {
                    y: 100,
                    opacity: 0,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: element,
                        containerAnimation: tween,
                        start: "left 80%",
                        end: "left 50%",
                        scrub: 1
                    }
                });
            });

        });

        return () => ctx.revert();
    }, []);

    return (
        <>
            <SEO 
                title="The Showroom | Art of Precision" 
                description="Experience the high-density craft of architectural stone carving at MH MARBLE. From master selection in the quarries to diamond-jet precision geometry in our atelier."

                breadcrumbs={[
                  { name: 'Home', item: '/' },
                  { name: 'Showroom', item: '/showroom' }
                ]}
            />
            <PageLayout title="The Atelier." subtitle="The Craft of Precision">
                
                {/* Horizontal Scrolling Section */}
                <section ref={sectionRef} className="h-screen w-full bg-background text-foreground overflow-hidden relative border-t border-foreground/5">
                    
                    {/* Background noise and grid */}
                    <div className="absolute inset-0 opacity-[0.03] mix-blend-screen bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-0" />
                    <div className="absolute inset-x-0 top-1/2 w-full h-[1px] bg-foreground/5 pointer-events-none z-0" />

                    {/* Draggable/scrolling container */}
                    <div ref={scrollContainerRef} className="flex h-full w-[400vw] relative z-10 items-center">
                        
                        {/* Intro Panel */}
                        <div className="w-[100vw] h-full flex flex-col justify-center px-6 md:px-[8%] relative shrink-0">
                            <span className="text-[10px] md:text-xs font-sans font-black tracking-[1em] uppercase text-[#C8A96E] mb-8">Phase 01</span>
                            <h2 className="text-6xl sm:text-7xl md:text-[8rem] font-serif font-light leading-[0.85] tracking-tighter mb-10 w-full max-w-4xl">
                                The Master <br />
                                <span className="italic text-foreground/50">Selection.</span>
                            </h2>
                            <p className="text-xl md:text-2xl font-sans font-light text-foreground/60 max-w-xl leading-relaxed">
                                Our curators journey to the earth's deepest veins. Only 1 in 1,000 Tile meets the structural integrity required for our signature collection.
                                <br/><br/>
                                <span className="uppercase tracking-[0.3em] text-[10px] text-[#C8A96E] font-bold">Scroll to enter the Atelier &rarr;</span>
                            </p>
                        </div>

                        {/* Visual Panel 1 */}
                        <div className="w-[80vw] md:w-[60vw] h-[70vh] relative shrink-0 overflow-hidden ring-1 ring-foreground/10 mr-[10vw]">
                            <img 
                                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1200" 
                                alt="Quarry Selection" 
                                className="atelier-parallax-img absolute top-0 -left-[20%] w-[140%] h-full object-cover grayscale-[40%] contrast-125 opacity-80"
                            />
                            <div className="absolute inset-0 border border-foreground/10 m-8 z-20 pointer-events-none" />
                        </div>

                        {/* Transition/Text Panel */}
                        <div className="w-[60vw] md:w-[40vw] h-full flex flex-col justify-center px-12 relative shrink-0">
                            <h3 className="atelier-text-reveal text-4xl md:text-6xl font-serif font-light italic leading-tight text-[#C8A96E]">
                                "Architecture is the profound science of the precise."
                            </h3>
                            <div className="w-16 h-[1px] bg-foreground/20 mt-12 mb-6" />
                            <span className="text-xs tracking-[0.5em] text-foreground/40 uppercase">MH Vision</span>
                        </div>

                        {/* Phase 02 Panel */}
                        <div className="w-[100vw] h-full flex flex-col justify-center px-6 md:px-[8%] relative shrink-0">
                            <div className="flex gap-16 md:gap-32 items-center w-full">
                                <div className="flex-1 space-y-8">
                                    <span className="text-[10px] md:text-xs font-sans font-black tracking-[1em] uppercase text-[#C8A96E]">Phase 02</span>
                                    <h2 className="text-5xl sm:text-6xl md:text-[7rem] font-serif font-light leading-[0.85] tracking-tighter">
                                        Diamond <br />
                                        <span className="italic text-foreground/50">Geometry.</span>
                                    </h2>
                                    <p className="text-lg md:text-xl font-sans font-light text-foreground/60 max-w-lg leading-relaxed">
                                        Using water-jet precision and diamond-tipped mastery, we carve stone to within a fraction of a millimeter.
                                    </p>
                                </div>
                                
                                {/* High Density Stats */}
                                <div className="flex-1 grid grid-cols-2 gap-x-12 gap-y-24 atelier-text-reveal">
                                    <div>
                                        <div className="w-8 h-[1px] bg-[#C8A96E] mb-6" />
                                        <p className="text-4xl md:text-6xl font-serif font-light italic text-foreground mb-4">0.01<span className="text-2xl text-foreground/50">mm</span></p>
                                        <p className="text-[9px] font-sans font-black uppercase tracking-[0.5em] text-[#C8A96E]">Precision Margin</p>
                                    </div>
                                    <div>
                                        <div className="w-8 h-[1px] bg-[#C8A96E] mb-6" />
                                        <p className="text-4xl md:text-6xl font-serif font-light italic text-foreground mb-4">12</p>
                                        <p className="text-[9px] font-sans font-black uppercase tracking-[0.5em] text-[#C8A96E]">Polishing Stages</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Final Grand Visual Panel */}
                         <div className="w-[90vw] h-[80vh] relative shrink-0 overflow-hidden ring-1 ring-foreground/10 mx-[5vw]">
                            <img 
                                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1200" 
                                alt="Diamond Cutting" 
                                className="atelier-parallax-img absolute top-0 -left-[20%] w-[140%] h-full object-cover grayscale-[20%] sepia-[0.2] hue-rotate-[-10deg] contrast-125 opacity-80"
                            />
                            {/* Inner vignette */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#0C0A08_120%)] pointer-events-none" />
                        </div>

                    </div>
                </section>

                {/* Spacer padding after unpinning to give breathing room before footer */}
                <div className="h-32 bg-background" />

            </PageLayout>
        </>
    );
};

export default Atelier;
