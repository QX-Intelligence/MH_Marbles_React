import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGallery } from '@/contexts/GalleryContext';
import { getOptimizedImageUrl } from '@/lib/utils';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileSticky } from '@/components/MobileSticky';
import SEO from '@/components/SEO';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Spec Row ─────────────────────────────────────────────────────────────────
const SpecRow = ({ label, value }: { label: string; value?: string | number | null }) => {
  if (!value) return null;
  return (
    <div className="flex justify-between items-start border-b border-foreground/[0.05] py-4 gap-4">
      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/30 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm font-serif italic text-foreground/80 text-right leading-snug">{String(value)}</span>
    </div>
  );
};

// ─── Related Product Card ─────────────────────────────────────────────────────
const RelatedCard = ({ tile }: { tile: { id: string | number; name: string; image_url?: string; image?: string; category_name?: string; category?: string | number; finish?: string; fill?: string } }) => (
  <Link
    to={`/product/${tile.id}`}
    className="group relative aspect-[3/4] overflow-hidden bg-foreground/[0.03] block"
  >
    {tile.image_url || tile.image ? (
      <img
        src={getOptimizedImageUrl(tile.image_url || tile.image, 500, 660)}
        alt={tile.name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
      />
    ) : (
      <div className="absolute inset-0" style={{ backgroundColor: tile.fill || '#1a1a18' }} />
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
      <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#C8A96E] mb-1">
        {tile.category_name || String(tile.category || '')} · {tile.finish}
      </p>
      <p className="text-base font-serif text-foreground leading-tight">{tile.name}</p>
    </div>
  </Link>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { backendTiles } = useGallery();

  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const tile = useMemo(
    () => backendTiles.find((t) => String(t.id) === String(id)),
    [backendTiles, id]
  );

  const related = useMemo(() => {
    if (!tile) return [];
    return backendTiles
      .filter(
        (t) =>
          t.id !== tile.id &&
          String(t.category) === String(tile.category)
      )
      .slice(0, 4);
  }, [backendTiles, tile]);

  // Parallax on the hero image
  useEffect(() => {
    if (!imageRef.current || !heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

      // Entrance animation for content
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 }
      );
    });

    return () => ctx.revert();
  }, [tile]);

  // If tiles are still loading, show skeleton; if tile not found after tiles load, redirect
  if (backendTiles.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border border-[#C8A96E]/30 rounded-full animate-spin border-t-[#C8A96E]" />
          <p className="text-[9px] uppercase tracking-[0.4em] text-foreground/30 font-black">Loading</p>
        </div>
      </div>
    );
  }

  if (!tile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <p className="text-[9px] uppercase tracking-[0.4em] text-foreground/30 font-black">Product not found</p>
        <button
          onClick={() => navigate('/collection')}
          className="text-xs uppercase tracking-widest font-black text-[#C8A96E] hover:text-foreground transition-colors"
        >
          ← Back to Collection
        </button>
      </div>
    );
  }

  const imageUrl = tile.image_url || tile.image;

  return (
    <>
      <SEO
        title={`${tile.name} — MH Marbles`}
        description={tile.description || `${tile.name} — a premium ${String(tile.category_name || tile.category || 'stone')} by MH Marbles. ${tile.finish ? `Available in ${tile.finish} finish.` : ''}`}
        type="product"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Collection', item: '/collection' },
          { name: tile.name, item: `/product/${tile.id}` }
        ]}
        productData={{
          price: "Inquire",
          currency: "INR",
          availability: "InStock",
          sku: String(tile.id)
        }}
      />

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        {/* ── Hero ── */}
        <div ref={heroRef} className="relative h-[85vh] md:h-screen w-full overflow-hidden">
          {imageUrl ? (
            <img
              ref={imageRef}
              src={getOptimizedImageUrl(imageUrl, 1920, 2400)}
              alt={tile.name}
              onLoad={() => setImageLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: tile.fill || '#1a1a18' }} />
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />

          {/* Breadcrumb */}
          <div className="absolute top-28 left-6 md:left-16 z-10 flex items-center gap-3">
            <Link
              to="/collection"
              className="text-[8px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-[#C8A96E] transition-colors"
            >
              Collection
            </Link>
            <span className="text-foreground/20 text-[8px]">/</span>
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-foreground/60">
              {tile.category_name || String(tile.category || 'Stone')}
            </span>
          </div>

          {/* Hero Content */}
          <div ref={contentRef} className="absolute bottom-0 left-0 right-0 px-6 md:px-16 pb-12 md:pb-20 z-10">
            <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-end justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-[1px] bg-[#C8A96E]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#C8A96E]">
                    {tile.category_name || String(tile.category || 'Signature Stone')}
                  </span>
                </div>
                <h1 className="text-[12vw] md:text-[8vw] font-serif font-light tracking-tighter leading-[0.85] text-foreground">
                  {tile.name}
                </h1>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/30">
                  {tile.finish || 'Polished'} · {tile.size || 'Custom Format'}
                </span>
                {tile.origin && (
                  <span className="text-sm font-serif italic text-foreground/50">{tile.origin}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Detail Content ── */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left: Description + Specs */}
          <div>
            {/* Description */}
            {tile.description && (
              <div className="mb-12">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#C8A96E] mb-4">
                  Stone Profile
                </p>
                <p className="text-lg md:text-xl font-serif font-light text-foreground/80 leading-relaxed">
                  {tile.description}
                </p>
              </div>
            )}

            {/* Spec Table */}
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-foreground/30 mb-2">
                Technical Specifications
              </p>
              <SpecRow label="Category" value={tile.category_name || String(tile.category || null)} />
              <SpecRow label="Finish" value={tile.finish} />
              <SpecRow label="Dimensions" value={tile.size} />
              <SpecRow label="Thickness" value={tile.thickness ? `${tile.thickness} mm` : null} />
              <SpecRow label="Origin" value={tile.origin} />
              <SpecRow label="Brand / Company" value={tile.brand} />
              <SpecRow label="Colour Profile" value={tile.color} />
              <SpecRow label="Applications" value={Array.isArray(tile.usage) ? tile.usage.join(', ') : tile.usage} />
            </div>
          </div>

          {/* Right: Image Detail + CTA */}
          <div className="flex flex-col gap-8">
            {/* Secondary product image */}
            {imageUrl && (
              <div className="aspect-[4/5] overflow-hidden relative">
                <img
                  src={getOptimizedImageUrl(imageUrl, 900, 1125)}
                  alt={`${tile.name} detail`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border border-foreground/[0.04]" />
              </div>
            )}

            {/* CTA Card */}
            <div className="border border-foreground/[0.07] bg-foreground/[0.01] p-8 md:p-10 flex flex-col gap-6">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#C8A96E] mb-3">
                  Request This Stone
                </p>
                <h3 className="text-2xl md:text-3xl font-serif font-light tracking-tighter text-foreground">
                  Interested in <span className="italic">{tile.name}?</span>
                </h3>
                <p className="text-sm text-foreground/50 font-sans leading-relaxed mt-3">
                  Get in touch with our stone curators for availability, pricing, samples, and technical documentation.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`/contact?inquiry=${encodeURIComponent(tile.name)}&category=${encodeURIComponent(String(tile.category_name || tile.category || ''))}`}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-[#C8A96E] text-[#0C0A08] text-[9px] font-black uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-colors duration-300"
                >
                  Request Inquiry →
                </a>
                <Link
                  to="/collection"
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 border border-foreground/[0.1] text-[9px] font-black uppercase tracking-[0.3em] text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-colors duration-300"
                >
                  Back to Collection
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div className="border-t border-foreground/[0.05] px-6 md:px-16 py-16 md:py-20 max-w-[1400px] mx-auto w-full">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#C8A96E] mb-2">
                  Same Category
                </p>
                <h3 className="text-3xl md:text-4xl font-serif font-light tracking-tighter text-foreground">
                  Related Specimens
                </h3>
              </div>
              <Link
                to="/collection"
                className="hidden md:flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-foreground/30 hover:text-[#C8A96E] transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {related.map((t) => (
                <RelatedCard key={t.id} tile={t} />
              ))}
            </div>
          </div>
        )}

        <Footer />
        <MobileSticky />
      </div>
    </>
  );
};

export default ProductDetail;
