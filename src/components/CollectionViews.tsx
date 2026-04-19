/**
 * CollectionViews.tsx — 4 premium product display layouts
 */
import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { useGallery } from '@/contexts/GalleryContext';
import { getOptimizedImageUrl, cn } from '@/lib/utils';
import { Tile } from '@/data/tiles';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useTiles = () => {
  const { backendTiles } = useGallery();
  return backendTiles;
};

const imgUrl = (tile: Tile, w = 800, h = 1000) =>
  getOptimizedImageUrl(tile.image_url || tile.image, w, h);

// ─────────────────────────────────────────────────────────────────────────────
// VIEW 1: VOGUE MASONRY — Asymmetric editorial grid with parallax
// ─────────────────────────────────────────────────────────────────────────────
export const ImmersiveFullscreen: React.FC = () => {
  const tiles = useTiles();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || tiles.length === 0) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.masonry-item');
      items.forEach((item, i) => {
        const speed = 1 + (i % 3) * 0.15; // varying speeds for parallax
        gsap.fromTo(item,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 95%',
              end: 'bottom 20%',
              scrub: speed,
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    });
    return () => ctx.revert();
  }, [tiles.length]);

  if (tiles.length === 0) return (
    <div className="py-40 text-center opacity-30 uppercase tracking-[0.5em] text-[10px]">No specimens in archive</div>
  );

  return (
    <div ref={containerRef} className="w-full bg-background py-24 md:py-48 px-6 md:px-12">
      <div className="max-w-[1700px] mx-auto grid grid-cols-4 md:grid-cols-12 gap-y-24 md:gap-y-48 gap-x-8 md:gap-x-16">
        {tiles.map((tile, i) => {
          // Asymmetric logic: alternating spans
          const isWide = i % 5 === 0;
          const isTall = i % 3 === 0;
          const colSpan = isWide ? 'md:col-span-8' : 'md:col-span-4';
          const rowSpan = isTall ? 'md:row-span-2' : '';
          const alignSelf = i % 2 === 0 ? 'place-self-start' : 'place-self-end';

          return (
            <div
              key={tile.id}
              className={`masonry-item group relative flex flex-col ${colSpan} ${rowSpan} ${alignSelf} w-full`}
            >
              <a href={`/product/${tile.id}`} className="block overflow-hidden relative border border-border">
                <div className={`aspect-[4/5] md:aspect-auto ${isTall ? 'h-[600px]' : 'h-[400px]'} w-full overflow-hidden`}>
                   {tile.image_url || tile.image ? (
                    <img
                      src={imgUrl(tile, 1200, 1500)}
                      alt={tile.name}
                      loading={i < 4 ? "eager" : "lazy"}
                      fetchPriority={i < 4 ? "high" : "low"}
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-110 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-foreground/5" />
                  )}
                </div>
                
                {/* Floating Index */}
                <span className="absolute top-6 left-6 text-[10px] font-black font-mono text-foreground/70 tracking-tighter">
                  {String(i + 1).padStart(3, '0')}
                </span>

                {/* Corner Accents */}
                <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-border group-hover:border-accent/40 transition-colors duration-500" />
              </a>

              <div className="mt-8 flex flex-col gap-2 max-w-sm">
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-accent">
                  {tile.category_name || 'Specimen'}
                </span>
                <h3 className="text-3xl md:text-5xl font-serif font-light tracking-tighter text-foreground leading-[0.85] transition-transform duration-500 group-hover:translate-x-2">
                  {tile.name}
                </h3>
                <div className="h-[1px] w-12 bg-foreground/10 group-hover:w-24 group-hover:bg-accent transition-all duration-700 mt-2" />
                <div className="flex justify-between items-center mt-4">
                   <p className="text-[8px] uppercase tracking-widest text-foreground/70 font-black">
                    {tile.finish} · {tile.origin}
                  </p>
                  <span className="text-[10px] text-accent opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-transform duration-500">
                    Discover &rarr;
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// VIEW 2: CURATOR'S GALLERY — Symmetrical minimal grid with detail lens
// ─────────────────────────────────────────────────────────────────────────────
export const GalleryCard = React.memo(({ tile, i }: { tile: Tile, i: number }) => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = useMemo(() => {
    return tile.image_urls && tile.image_urls.length > 0 ? tile.image_urls : [tile.image_url || tile.image || ''];
  }, [tile.image_urls, tile.image_url, tile.image]);

  useEffect(() => {
    let interval: any;
    if (isHovered && images.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 1500);
    } else if (!isHovered) {
      setCurrentIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      className="group relative flex flex-col bg-background border border-border overflow-hidden transition-all duration-700 hover:bg-foreground/5"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a href={`/product/${tile.id}`} 
         className="block relative aspect-[3/2] overflow-hidden bg-foreground/5"
      >
        {images[0] ? (
          <>
            <img
              src={getOptimizedImageUrl(images[currentIndex], 900, 600)}
              alt={tile.name}
              loading={i < 6 ? "eager" : "lazy"}
              fetchPriority={i < 6 ? "high" : "low"}
              decoding="async"
              className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-105 blur-[2px] brightness-50' : 'scale-100 blur-0 brightness-100'}`}
            />
            {/* Magnifying Lens */}
            <div
              className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-2 border-accent/50 rounded-full shadow-[0_0_50px_rgba(200,169,110,0.3)] z-10"
              style={{
                width: '160px',
                height: '160px',
                left: `${mousePos.x}%`,
                top: `${mousePos.y}%`,
                transform: 'translate(-50%, -50%)',
                overflow: 'hidden',
              }}
            >
              <img
                src={getOptimizedImageUrl(images[currentIndex], 1800, 1200)}
                alt=""
                className="absolute max-w-none"
                style={{
                  width: '400%',
                  height: '400%',
                  left: `${-mousePos.x * 4 + 50}%`,
                  top: `${-mousePos.y * 4 + 50}%`,
                  transform: 'translate(-12.5%, -12.5%)'
                }}
              />
            </div>
            {/* Dots indicator */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                    {images.map((_, dotIdx) => (
                        <div 
                            key={dotIdx} 
                            className={cn(
                                "w-1 h-1 rounded-full transition-all duration-300",
                                dotIdx === currentIndex ? "bg-accent scale-150" : "bg-white/30"
                            )} 
                        />
                    ))}
                </div>
            )}
          </>
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: tile.fill || '#1a1a18' }} />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </a>

      <div className="p-8 flex flex-col gap-1 relative">
        <div className="absolute top-0 left-8 right-8 h-[1px] bg-foreground/5 group-hover:bg-accent/30 transition-colors duration-500" />
        <span className="text-[8px] font-black uppercase tracking-[0.6em] text-accent/80 mb-2">
          {String(i + 1).padStart(2, '0')} — {tile.category_name || 'Specimen'}
        </span>
        <h3 className="text-2xl font-serif font-light text-foreground tracking-tight group-hover:text-accent transition-colors duration-500">
          {tile.name}
        </h3>
        <div className="flex justify-between items-end mt-6">
          <div className="flex flex-col gap-1">
            <span className="text-[7px] uppercase tracking-[0.3em] text-foreground/60 font-black">Technical Data</span>
            <span className="text-[9px] uppercase tracking-widest text-foreground/70 font-bold">{tile.finish} · {tile.size || 'Custom'}</span>
          </div>
          <span className="text-[7px] font-black uppercase tracking-[0.4em] text-foreground/60 group-hover:text-foreground transition-colors">
            Details &rarr;
          </span>
        </div>
      </div>
    </div>
  );
});

export const ScatteredFreeform: React.FC = () => {
  const tiles = useTiles();

  if (tiles.length === 0) return null;

  return (
    <div className="w-full bg-background py-24 md:py-40">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 mb-24 flex flex-col md:flex-row items-end justify-between gap-8">
        <div className="max-w-2xl">
          <p className="text-[10px] tracking-[0.6em] uppercase font-black text-accent mb-6">Archive Selection II</p>
          <h2 className="text-6xl md:text-8xl font-serif font-light tracking-tighter text-foreground leading-[0.85]">
            Symmetry <br />
            <span className="italic text-foreground/60">& Precision.</span>
          </h2>
        </div>
        <div className="flex flex-col items-end gap-4 text-right">
          <p className="text-[9px] tracking-widest uppercase text-foreground/70 font-black">
            Manual Curation · {tiles.length} Specimens
          </p>
          <div className="w-32 h-[1px] bg-foreground/10" />
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
        {tiles.map((tile, i) => (
          <GalleryCard key={tile.id} tile={tile} i={i} />
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// VIEW 3: ARCHITECT'S INDEX — Technical list with ghost previews
// ─────────────────────────────────────────────────────────────────────────────
export const FilmStrip: React.FC = () => {
  const tiles = useTiles();
  const [hoveredTile, setHoveredTile] = useState<Tile | null>(null);

  if (tiles.length === 0) return null;

  return (
    <div className="w-full bg-background min-h-screen relative overflow-hidden">
      {/* Ghost Preview Layer */}
      <div className="absolute inset-0 z-0">
        {tiles.map((tile) => (
          <div
            key={`ghost-${tile.id}`}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${hoveredTile?.id === tile.id ? 'opacity-10' : 'opacity-0'}`}
          >
            {tile.image_url || tile.image ? (
              <img
                src={imgUrl(tile, 1920, 1080)}
                alt=""
                className="w-full h-full object-cover scale-110"
              />
            ) : (
              <div className="w-full h-full" style={{ backgroundColor: tile.fill }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-8 md:px-16 py-24 md:py-40">
        <div className="mb-24">
          <p className="text-[10px] tracking-[0.6em] uppercase font-black text-accent mb-6">Archive Selection III</p>
          <h2 className="text-6xl md:text-8xl font-serif font-light tracking-tighter text-foreground leading-[0.85]">
            Technical <br />
            <span className="italic text-foreground/60">Inventory.</span>
          </h2>
        </div>

        {/* Index Table */}
        <div className="w-full border-t border-border">
          {/* Header */}
          <div className="hidden md:grid grid-cols-12 py-6 border-b border-border px-4">
            <div className="col-span-1 text-[9px] font-black uppercase tracking-widest text-accent">Ref</div>
            <div className="col-span-4 text-[9px] font-black uppercase tracking-widest text-foreground/70">Specimen Name</div>
            <div className="col-span-2 text-[9px] font-black uppercase tracking-widest text-foreground/70">Origin</div>
            <div className="col-span-2 text-[9px] font-black uppercase tracking-widest text-foreground/70">Finish</div>
            <div className="col-span-2 text-[9px] font-black uppercase tracking-widest text-foreground/70">Format</div>
            <div className="col-span-1 text-right text-[9px] font-black uppercase tracking-widest text-foreground/70">Action</div>
          </div>

          {/* Rows */}
          {tiles.map((tile, i) => (
            <a
              key={tile.id}
              href={`/product/${tile.id}`}
              className="grid grid-cols-4 md:grid-cols-12 py-8 md:py-10 border-b border-border px-4 items-center group hover:bg-foreground/5 transition-colors duration-300"
              onMouseEnter={() => setHoveredTile(tile)}
              onMouseLeave={() => setHoveredTile(null)}
            >
              <div className="col-span-1 font-mono text-[10px] text-foreground/60 group-hover:text-accent transition-colors">
                {String(i + 1).padStart(3, '0')}
              </div>
              
              <div className="col-span-3 md:col-span-4 flex items-center gap-6">
                <div className="w-12 h-12 shrink-0 border border-border overflow-hidden hidden md:block">
                  {tile.image_url || tile.image ? (
                    <img src={imgUrl(tile, 100, 100)} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full bg-foreground/5" />
                  )}
                </div>
                <h3 className="text-xl md:text-3xl font-serif font-light text-foreground group-hover:translate-x-2 transition-transform duration-500">
                  {tile.name}
                </h3>
              </div>

              <div className="hidden md:block col-span-2 text-sm font-sans font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                {tile.origin || 'Imported'}
              </div>

              <div className="hidden md:block col-span-2 text-sm font-serif italic text-foreground/70 group-hover:text-accent transition-colors">
                {tile.finish || 'Polished'}
              </div>

              <div className="hidden md:block col-span-2 font-mono text-[10px] uppercase tracking-widest text-foreground/60">
                {tile.size || '3200 x 1600'}
              </div>

              <div className="col-span-1 text-right">
                <span className="inline-flex w-10 h-10 items-center justify-center border border-accent/20 rounded-full text-accent opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110">
                  &rarr;
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// VIEW 4: INFINITY ROWS — Kinetic showroom wall
// ─────────────────────────────────────────────────────────────────────────────
const SlabRow = ({ tiles, speed, direction = 1 }: { tiles: Tile[], speed: number, direction?: 1 | -1 }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rowRef.current) return;
    const row = rowRef.current;
    const totalWidth = row.scrollWidth / 2;

    const anim = gsap.to(row, {
      x: direction === 1 ? -totalWidth : 0,
      ease: 'none',
      duration: speed,
      repeat: -1,
      onRepeat: () => {
        if (direction === -1) gsap.set(row, { x: -totalWidth });
      }
    });
    if (direction === -1) gsap.set(row, { x: -totalWidth });

    return () => { anim.kill(); };
  }, [tiles.length, speed, direction]);

  return (
    <div className="flex gap-8 py-12 select-none" ref={rowRef}>
      {[...tiles, ...tiles].map((tile, i) => (
        <a
          key={`${tile.id}-${i}`}
          href={`/product/${tile.id}`}
          className="group shrink-0 relative block"
          style={{ width: 'clamp(280px, 40vw, 380px)' }}
        >
          <div className="relative aspect-[3/4] overflow-hidden transition-all duration-700 group-hover:scale-[1.05] group-hover:-translate-y-6"
               style={{ transform: 'perspective(1200px) rotateY(-12deg)', boxShadow: '25px 25px 70px rgba(0,0,0,0.6)' }}>
            {tile.image_url || tile.image ? (
              <img src={imgUrl(tile, 800, 1000)} alt={tile.name} className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110" />
            ) : (
              <div className="w-full h-full bg-foreground/5" />
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 opacity-60" />
            
            {/* Label Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-accent mb-2">{tile.category_name}</p>
              <h4 className="text-2xl font-serif font-light text-white leading-none">{tile.name}</h4>
            </div>
          </div>
          
          {/* Floor Shadow */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-6 bg-black/60 blur-2xl rounded-full scale-x-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </a>
      ))}
    </div>
  );
};

export const DramaticSplit: React.FC = () => {
  const tiles = useTiles();
  
  if (tiles.length === 0) return null;

  // Split tiles into 3 chunks for the rows
  const row1 = tiles.slice(0, Math.ceil(tiles.length / 3));
  const row2 = tiles.slice(Math.ceil(tiles.length / 3), Math.ceil(tiles.length * 2 / 3));
  const row3 = tiles.slice(Math.ceil(tiles.length * 2 / 3));

  return (
    <div className="w-full bg-background py-24 md:py-40 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 mb-16">
        <p className="text-[10px] tracking-[0.6em] uppercase font-black text-accent mb-6">Archive Selection IV</p>
        <h2 className="text-6xl md:text-8xl font-serif font-light tracking-tighter text-foreground leading-[0.85]">
          The Infinite <br />
          <span className="italic text-foreground/60">Showroom.</span>
        </h2>
      </div>

      <div className="flex flex-col gap-0">
        <SlabRow tiles={row1.length ? row1 : tiles} speed={40} direction={1} />
        <SlabRow tiles={row2.length ? row2 : tiles} speed={60} direction={-1} />
        <SlabRow tiles={row3.length ? row3 : tiles} speed={50} direction={1} />
      </div>

      <div className="max-w-[1600px] mx-auto px-8 md:px-16 mt-24 text-center">
        <p className="text-[9px] tracking-[0.4em] uppercase font-black text-foreground/60">
          Total Collection Height: {tiles.length * 3} Meters · Interactive Surface
        </p>
      </div>
    </div>
  );
};
