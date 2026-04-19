import React, { useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import gsap from 'gsap';

interface PageLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
}

export function PageLayout({ children, title = "", subtitle = "" }: PageLayoutProps) {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Intro sequence for inner pages
            const tl = gsap.timeline();

            // Animate subtitle line and text
            if (subtitleRef.current) {
                const line = subtitleRef.current.querySelector('.line');
                const text = subtitleRef.current.querySelector('.sub-text');
                
                tl.from(line, {
                    scaleX: 0,
                    transformOrigin: 'left',
                    duration: 1,
                    ease: 'power3.out'
                })
                .from(text, {
                    opacity: 0,
                    x: -20,
                    duration: 0.8,
                    ease: 'power3.out'
                }, "-=0.6");
            }

            // Staggered massive text reveal
            if (titleRef.current) {
                const words = titleRef.current.querySelectorAll('.word-wrap');
                
                tl.from(words, {
                    y: '100%',
                    opacity: 0,
                    rotationZ: 3,
                    duration: 1.4,
                    stagger: 0.15,
                    ease: 'power4.out',
                    clearProps: 'all' // prevents clipping issues later
                }, "-=0.8");
            }

        });

        // Small delay to ensure render is complete before animating
        const timer = setTimeout(() => {
             // Incase we need to re-trigger or fix layout
        }, 50);

        return () => {
            clearTimeout(timer);
            ctx.revert();
        };
    }, []);

    const words = title.split(' ');
    const firstWord = words[0];
    const remainingWords = words.slice(1).join(' ');

    return (
        <div className="min-h-screen bg-background w-full max-w-[100vw] text-foreground transition-colors duration-1000">
            <Header />
            <main className="pt-32 pb-16 md:pt-44 md:pb-24 lg:pt-60 lg:pb-32 w-full">
                
                {/* ── Cinematic Page Header ─────────────────────────────────── */}
                {(title || subtitle) && (
                    <div className="w-full px-6 md:px-[8%] relative z-10">
                        <div className="mb-16 md:mb-24 lg:mb-32 max-w-6xl">
                            
                            {subtitle && (
                                <div ref={subtitleRef} className="flex items-center gap-4 mb-8 overflow-hidden">
                                   <div className="line w-16 h-[1px] bg-[#C8A96E]" />
                                   <span className="sub-text text-[10px] font-sans font-black tracking-[0.8em] uppercase text-[#C8A96E] block">
                                       {subtitle}
                                   </span>
                                </div>
                            )}
                            
                            {title && (
                                <h1 
                                    ref={titleRef} 
                                    className="text-5xl sm:text-7xl md:text-[7.5rem] lg:text-[9rem] font-serif font-light text-foreground leading-[0.85] tracking-tighter"
                                >
                                    {/* Word wrapper for clipping reveals */}
                                    <div className="overflow-hidden pb-4">
                                       <div className="word-wrap inline-block italic text-foreground/90">
                                           {title.split(' ')[0]}
                                       </div>
                                    </div>
                                    <div className="overflow-hidden pb-4">
                                       <div className="word-wrap inline-block font-medium text-[#C8A96E]">
                                           {title.split(' ').slice(1).join(' ')}
                                       </div>
                                    </div>
                                </h1>
                            )}

                        </div>
                    </div>
                )}

                {/* ── Page Content ────────────────────────────────────────── */}
                <div className="w-full relative z-20">
                   {children}
                </div>
                
            </main>
            <Footer />
        </div>
    );
}
