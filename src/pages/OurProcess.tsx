import React, { useEffect, useRef } from 'react';
import SEO from '@/components/SEO';
import { PageLayout } from '@/components/PageLayout';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BP_STEPS = [
  {
    phase: "01",
    title: "The Digital Twin.",
    data: [
        { label: "Scan Res", val: "12,000 DPI" },
        { label: "Lidar", val: "Active" },
        { label: "Tolerance", val: "0.01mm" }
    ],
    desc: "Before a physical cut is made, the raw slab is laser-scanned to create a 1:1 photorealistic digital twin. This allows architects to perform grain-matching and vein-continuation with absolute mathematical certainty."
  },
  {
    phase: "02",
    title: "Virtual Reality Preview.",
    data: [
        { label: "Engine", val: "Unreal 5" },
        { label: "Lighting", val: "Raytraced" },
        { label: "Scale", val: "1:1 True" }
    ],
    desc: "Clients walk through a hyper-realistic VR simulation of their space, experiencing the exact light interaction with the chosen stone surfaces before any material commitment."
  },
  {
    phase: "03",
    title: "Algorithmic Nesting.",
    data: [
        { label: "Yield Var", val: "< 2%" },
        { label: "AI Model", val: "N-Cut v4" },
        { label: "Waste", val: "Recycled" }
    ],
    desc: "Proprietary AI determines the most efficient cutting paths across the slab, ensuring continuous veining sequences across complex geometric installations while minimizing material waste."
  },
  {
    phase: "04",
    title: "5-Axis Robotic Milling.",
    data: [
        { label: "Spindle", val: "24k RPM" },
        { label: "Coolant", val: "Cryogenic" },
        { label: "Precision", val: "Micron" }
    ],
    desc: "Diamond-tipped five-axis CNC robotics execute the digital blueprint, carving complex monolithic forms and razor-thin architectural cladding with impossible precision."
  }
];

const OurProcess = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            
            // Draw the central glowing blueprint line based on scroll depth
            gsap.to(lineRef.current, {
                scaleY: 1,
                transformOrigin: "top center",
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top center",
                    end: "bottom bottom",
                    scrub: true
                }
            });

            // Reveal each step organically as the line passes it
            gsap.utils.toArray('.blueprint-step').forEach((step: unknown, i) => {
                const el = step as HTMLElement;
                const number = el.querySelector('.bp-number');
                const content = el.querySelector('.bp-content');
                const dataGrid = el.querySelector('.bp-data');
                const node = el.querySelector('.bp-node');

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: el,
                        start: "top 60%", // Triggers right as the line reaches it
                        end: "top 40%",
                        scrub: 1
                    }
                });

                // Node lights up
                tl.fromTo(node, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2, ease: "back.out(2)" }, 0);
                
                // Number sliding out
                tl.fromTo(number, { x: (i as number) % 2 === 0 ? 50 : -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 0.1);
                
                // Main content reveals 
                tl.fromTo(content, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 0.2);
                
                // Data grid staggers in
                if(dataGrid && dataGrid.children) {
                    tl.fromTo(dataGrid.children, { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 }, 0.3);
                }
            });

        });

        return () => ctx.revert();
    }, []);

    return (
        <>
            <SEO 
                title="Our Process | The Architecture of Stone & Robotic Precision" 
                description="Discover how MH Marbles merges ancient terrestrial materials with bleeding-edge robotic fabrication. Learn about our Digital Twin scanning and 5-axis robotic milling process." 
                breadcrumbs={[
                  { name: 'Home', item: '/' },
                  { name: 'Our Process', item: '/process' }
                ]}
            />
            
            <PageLayout title="The Blueprint." subtitle="Algorithmic Craft">
                
                {/* Immersive Blueprint Environment */}
                <div className="bg-[#050403] relative border-t border-foreground/5 pb-64 overflow-hidden pt-32" ref={containerRef}>
                    
                    {/* Grid Background pattern (Blueprint vibe) */}
                    <div className="absolute inset-0 z-0 mix-blend-screen opacity-10"
                         style={{
                             backgroundImage: `linear-gradient(#C8A96E 1px, transparent 1px), linear-gradient(90deg, #C8A96E 1px, transparent 1px)`,
                             backgroundSize: `40px 40px`
                         }}
                    />

                    {/* The Central Animated Line */}
                    <div className="absolute left-[8%] md:left-1/2 top-40 bottom-0 w-[1px] bg-foreground/10 z-10 -translate-x-1/2">
                        <div 
                            ref={lineRef}
                            className="w-full h-full bg-[#C8A96E] shadow-[0_0_15px_#C8A96E]" 
                            style={{ transform: 'scaleY(0)' }}
                        />
                    </div>

                    <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-[8%]">
                        
                        {/* Header Area */}
                        <div className="mb-48 md:mb-64 md:text-center ml-12 md:ml-0">
                            <span className="text-[10px] md:text-xs font-mono font-black tracking-[0.5em] text-[#C8A96E] uppercase mb-6 block">
                                SEQUENCE_INIT
                            </span>
                            <h2 className="text-4xl md:text-7xl font-serif font-light text-foreground tracking-tighter mix-blend-difference mb-8">
                                Eradicating Error.<br/>
                                <span className="italic text-foreground/40">Elevating Form.</span>
                            </h2>
                            <p className="font-mono text-[10px] md:text-xs text-foreground/30 uppercase tracking-[0.2em] max-w-xl md:mx-auto">
                                We replace physical guesswork with digital absolute certainty. Below is the operational sequence of the MH Vision atelier.
                            </p>
                        </div>

                        {/* Steps */}
                        <div className="flex flex-col gap-32 md:gap-64">
                            {BP_STEPS.map((step, index) => {
                                const isEven = index % 2 === 0;
                                
                                return (
                                    <div key={step.phase} className={`blueprint-step relative flex w-full ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
                                        
                                        {/* Node on the line */}
                                        <div className="absolute left-0 md:left-1/2 top-0 w-3 h-3 bg-[#050403] border-2 border-[#C8A96E] rounded-full -translate-x-[5.5px] z-30 bp-node shadow-[0_0_20px_#C8A96E]" />

                                        {/* Content Wrapper */}
                                        <div className={`w-full md:w-[45%] pl-12 md:pl-0 ${isEven ? 'md:pr-16 text-left' : 'md:pl-16 md:text-left'}`}>
                                            
                                            {/* Phase Number */}
                                            <div className="bp-number font-mono text-8xl md:text-[10rem] font-light text-foreground/5 tracking-tighter leading-none mb-[-40px] md:mb-[-60px] select-none">
                                                {step.phase}
                                            </div>

                                            {/* Data Box */}
                                            <div className="bp-content bg-background border border-foreground/10 p-8 md:p-12 relative backdrop-blur-md">
                                                <div className="absolute top-0 left-0 w-4 h-[1px] bg-[#C8A96E]" />
                                                <div className="absolute top-0 left-0 w-[1px] h-4 bg-[#C8A96E]" />
                                                
                                                <h3 className="text-3xl md:text-4xl font-serif text-foreground mb-6">
                                                    {step.title}
                                                </h3>
                                                <p className="text-sm font-sans font-light text-foreground/50 leading-relaxed mb-10">
                                                    {step.desc}
                                                </p>

                                                {/* Grid Data Parameters */}
                                                <div className="bp-data grid grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-foreground/5">
                                                    {step.data.map((d, i) => (
                                                        <div key={i} className="flex flex-col space-y-2">
                                                            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-foreground/30">{d.label}</span>
                                                            <span className="font-mono text-[11px] text-[#C8A96E]">{d.val}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                    </div>
                </div>

            </PageLayout>
        </>
    );
};

export default OurProcess;
