import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { CategoryMasks } from '@/components/CategoryMasks';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { WhyUs } from '@/components/WhyUs';
import { Reviews } from '@/components/Reviews';
import { Contact } from '@/components/Contact';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';
import { MobileSticky } from '@/components/MobileSticky';
import { TileCategories } from '@/components/TileCategories';
import { useGallery } from '@/contexts/GalleryContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Page ──────────────────────────────────────────────────────────────────────
const Index = () => {
  const { backendTiles, brands } = useGallery();

  // Stable refs for scroll-animated sections
  const reserve1Container = useRef<HTMLDivElement>(null);
  const reserve1Text = useRef<HTMLHeadingElement>(null);

  const reserve2Container = useRef<HTMLDivElement>(null);
  const reserve2Text = useRef<HTMLHeadingElement>(null);
  const reserve2Btn = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    const setup = () => {
      // Kill any previously created triggers so we never double-up
      ScrollTrigger.getAll()
        .filter((t) => t.vars.id === 'reserve-scroll-1' || t.vars.id === 'reserve-scroll-2')
        .forEach((t) => t.kill());

      const r1c = reserve1Container.current;
      const r1t = reserve1Text.current;
      const r2c = reserve2Container.current;
      const r2t = reserve2Text.current;

      if (r1c && r1t) {
        gsap.to(r1t, {
          xPercent: -40,
          ease: 'none',
          scrollTrigger: {
            id: 'reserve-scroll-1',
            trigger: r1c,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        });
      }

      if (r2c && r2t) {
        gsap.to(r2t, {
          xPercent: -40,
          ease: 'none',
          scrollTrigger: {
            id: 'reserve-scroll-2',
            trigger: r2c,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        });
      }

      const btn = reserve2Btn.current;
      if (btn) {
        const onMove = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          gsap.to(btn, {
            x: (e.clientX - r.left - r.width / 2) * 0.4,
            y: (e.clientY - r.top - r.height / 2) * 0.4,
            duration: 0.3,
            ease: 'power2.out',
          });
        };
        const onLeave = () =>
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
        btn.addEventListener('mousemove', onMove);
        btn.addEventListener('mouseleave', onLeave);
      }

      ScrollTrigger.refresh();
    };

    timers.push(setTimeout(setup, 400));
    if (backendTiles.length > 0) {
      timers.push(setTimeout(() => ScrollTrigger.refresh(), 1000));
    }

    return () => {
      timers.forEach(clearTimeout);
      ScrollTrigger.getAll()
        .filter((t) => t.vars.id === 'reserve-scroll-1' || t.vars.id === 'reserve-scroll-2')
        .forEach((t) => t.kill());
    };
  }, [backendTiles.length]);

  return (
    <>
      <SEO
        title="Architectural Stone Gallery & Signature Stone Curation"
        description="Curators of the earth's most exquisite architectural statements. Discover our signature collection of Italian marble and exotic stones."
        breadcrumbs={[{ name: 'Home', item: '/' }]}
      />

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <CategoryMasks />
          <FeaturedProducts />
          <TileCategories />

          {/* ── Our Brand Partners Section ── */}
          <section className="py-24 md:py-32 bg-[#f5f3ef] border-t border-[#e0dbd3]">
            <div className="max-w-[1800px] mx-auto px-6 md:px-[6%]">

              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[#8B7340] block mb-4">Distinguished Partners</span>
                  <h2 className="text-4xl md:text-5xl font-serif font-light tracking-tighter leading-none text-[#1a1a1a]">
                    Our <span className="italic text-[#888]">Companies.</span>
                  </h2>
                </div>
                <a
                  href="/companies"
                  className="text-[11px] font-black uppercase tracking-[0.3em] text-[#333] hover:text-[#C8A96E] transition-colors duration-500 flex items-center gap-3 shrink-0 border border-[#ccc] hover:border-[#C8A96E] px-6 py-3"
                >
                  View All →
                </a>
              </div>

              {/* Brands Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 border border-[#ddd]">
                {brands.map((brand, index) => (
                  <motion.a
                    key={brand.id}
                    href={`/collection?brand=${encodeURIComponent(brand.name)}`}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="group border border-[#e5e1da] flex flex-col items-center justify-center gap-4 p-8 min-h-[160px] bg-white hover:bg-[#faf8f5] hover:border-[#C8A96E]/40 transition-all duration-400 select-none outline-none"
                  >
                    {brand.image_url || brand.logo ? (
                      <img
                        src={brand.image_url || brand.logo}
                        alt={brand.name}
                        className="h-12 w-auto object-contain opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                    ) : (
                      <span className="text-4xl font-serif italic text-[#444] group-hover:text-[#C8A96E] transition-colors duration-500">
                        {brand.name.charAt(0)}
                      </span>
                    )}
                    <span className="text-[12px] font-black uppercase tracking-[0.25em] text-[#1a1a1a] group-hover:text-[#C8A96E] transition-colors duration-500 text-center">
                      {brand.name}
                    </span>
                  </motion.a>
                ))}

                {brands.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#999]">Loading partners...</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          <WhyUs />
          <Reviews />

          <div ref={reserve2Container} className="reserve-section-2 min-h-[120vh] bg-[#C8A96E] text-[#0C0A08] relative flex flex-col items-center justify-center overflow-hidden will-change-transform">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none h-full">
              <h2 ref={reserve2Text} className="text-[35vw] font-serif italic opacity-[0.07] whitespace-nowrap">
                Architect's Reserve &mdash; Architect's Reserve &mdash; Architect's Reserve
              </h2>
            </div>
            <div className="text-center px-6 relative z-20">
               <h3 className="text-6xl sm:text-7xl md:text-9xl font-serif font-light tracking-tighter leading-[0.8] mb-12">Request <br /><span className="italic">Excellence.</span></h3>
               <div className="flex flex-col items-center">
                  <a ref={reserve2Btn} href="/contact" className="group inline-flex items-center justify-center w-40 h-40 md:w-56 md:h-56 rounded-full bg-background text-[#C8A96E] text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-700 hover:scale-105 shadow-2xl relative">
                    <div className="absolute inset-0 rounded-full border border-[#C8A96E]/20 scale-110 group-hover:scale-125 transition-transform duration-700" />
                    <span className="leading-relaxed z-10">Request <br/> Access <br/> &rarr;</span>
                  </a>
               </div>
            </div>
          </div>

          <Contact />
          <CTA />
        </main>
        <Footer />
        <MobileSticky />
      </div>
    </>
  );
};

export default Index;
