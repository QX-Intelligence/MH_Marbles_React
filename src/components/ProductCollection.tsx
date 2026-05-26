import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Tile } from '@/data/tiles';
import { useGallery } from '@/contexts/GalleryContext';
import { cn, getOptimizedImageUrl } from '@/lib/utils';
import { Loader2, Filter } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Category } from '@/services/CategoryService';
import { Brand } from '@/types/gallery';

// ─── Sidebar (defined outside to avoid re-creation on every render) ───────────
interface SidebarProps {
  spaces: string[];
  categories: Category[];
  brands: Brand[];
  availableFinishes: string[];
  selectedSpaces: string[];
  selectedCategories: string[];
  selectedBrands: string[];
  selectedFinishes: string[];
  activeFiltersCount: number;
  onCheckbox: (value: string, state: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => void;
  setSelectedSpaces: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedFinishes: React.Dispatch<React.SetStateAction<string[]>>;
  onClear: () => void;
}

const SidebarFilterGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="py-6 border-b border-foreground/[0.05]">
    <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-[#C8A96E]/60 mb-6">{title}</h4>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const SidebarContent = React.memo(({
  spaces, categories, brands, availableFinishes,
  selectedSpaces, selectedCategories, selectedBrands, selectedFinishes,
  activeFiltersCount, onCheckbox,
  setSelectedSpaces, setSelectedCategories, setSelectedBrands, setSelectedFinishes,
  onClear,
}: SidebarProps) => (
  <div className="flex flex-col h-full bg-background">
    <div className="flex justify-between items-center mb-8 pb-3 border-b border-foreground/10">
      <div className="flex items-center gap-3">
        <Filter className="w-3.5 h-3.5 text-[#C8A96E]" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
          Curation {activeFiltersCount > 0 && `· ${activeFiltersCount}`}
        </span>
      </div>
      {activeFiltersCount > 0 && (
        <button onClick={onClear} className="text-[10px] font-bold uppercase tracking-widest text-[#C8A96E] hover:text-foreground transition-colors mix-blend-difference">
          Reset
        </button>
      )}
    </div>

    <div className="space-y-0">
      <SidebarFilterGroup title="Applications">
        {spaces.map(space => (
          <div key={space} className="flex items-center group">
            <Checkbox
              id={`space-${space}`}
              checked={selectedSpaces.includes(space)}
              onCheckedChange={() => onCheckbox(space, selectedSpaces, setSelectedSpaces)}
              className="w-3 h-3 border-foreground/20 data-[state=checked]:bg-[#C8A96E] data-[state=checked]:border-[#C8A96E] transition-all"
            />
            <label htmlFor={`space-${space}`} className="ml-3 text-[11px] font-sans font-medium uppercase tracking-widest text-foreground/40 group-hover:text-foreground transition-colors cursor-pointer select-none">
              {space}
            </label>
          </div>
        ))}
      </SidebarFilterGroup>

      <SidebarFilterGroup title="Material Type">
        {categories.map(cat => (
          <div key={cat.id} className="flex items-center group">
            <Checkbox
              id={`cat-${cat.id}`}
              checked={selectedCategories.includes(String(cat.id))}
              onCheckedChange={() => onCheckbox(String(cat.id), selectedCategories, setSelectedCategories)}
              className="w-3 h-3 border-foreground/20 data-[state=checked]:bg-[#C8A96E] data-[state=checked]:border-[#C8A96E]"
            />
            <label htmlFor={`cat-${cat.id}`} className="ml-3 text-[11px] font-sans font-medium uppercase tracking-widest text-foreground/40 group-hover:text-foreground transition-colors cursor-pointer select-none">
              {cat.name}
            </label>
          </div>
        ))}
      </SidebarFilterGroup>

      <SidebarFilterGroup title="Origin / Brand">
        {brands.map(brand => (
          <div key={brand.id} className="flex items-center group">
            <Checkbox
              id={`brand-${brand.id}`}
              checked={selectedBrands.includes(String(brand.id))}
              onCheckedChange={() => onCheckbox(String(brand.id), selectedBrands, setSelectedBrands)}
              className="w-3 h-3 border-foreground/20 data-[state=checked]:bg-[#C8A96E] data-[state=checked]:border-[#C8A96E]"
            />
            <label htmlFor={`brand-${brand.id}`} className="ml-3 text-[11px] font-sans font-medium uppercase tracking-widest text-foreground/40 group-hover:text-foreground transition-colors cursor-pointer select-none">
              {brand.name}
            </label>
          </div>
        ))}
      </SidebarFilterGroup>

      {availableFinishes.length > 0 && (
        <SidebarFilterGroup title="Selection Finish">
          {availableFinishes.map(finish => (
            <div key={finish} className="flex items-center group">
              <Checkbox
                id={`finish-${finish}`}
                checked={selectedFinishes.includes(finish)}
                onCheckedChange={() => onCheckbox(finish, selectedFinishes, setSelectedFinishes)}
                className="w-3 h-3 border-foreground/20 data-[state=checked]:bg-[#C8A96E] data-[state=checked]:border-[#C8A96E]"
              />
              <label htmlFor={`finish-${finish}`} className="ml-3 text-[11px] font-sans font-medium uppercase tracking-widest text-foreground/40 group-hover:text-foreground transition-colors cursor-pointer select-none">
                {finish}
              </label>
            </div>
          ))}
        </SidebarFilterGroup>
      )}
    </div>
  </div>
));
SidebarContent.displayName = 'SidebarContent';

// ─── Product Card (memoized — only re-renders when its own tile prop changes) ──
const ProductCard = React.memo(({ tile }: { tile: Tile }) => {
  return (
    <Link
      to={`/product/${tile.id}`}
      className="group relative flex flex-col w-full bg-background border border-foreground/[0.04] transition-all duration-700 outline-none ring-0 overflow-hidden group"
    >
      {/* Cinematic Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-foreground/[0.02]">
        {tile.image_url || tile.image ? (
          <img
            src={getOptimizedImageUrl(tile.image_url || tile.image, 600, 750)}
            alt={tile.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 ease-out grayscale-[20%] group-hover:grayscale-0"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-foreground/5">
            <Filter className="w-6 h-6 opacity-10" />
          </div>
        )}
        
        {/* Floating Details Overlay (Visible on Hover/Always subtle) */}
        <div className="absolute inset-x-0 bottom-0 p-6 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
           <div className="bg-background/80 backdrop-blur-md border border-foreground/[0.05] p-4 flex flex-col gap-2 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="flex justify-between items-center">
                 <span className="text-[7px] font-black uppercase tracking-[0.2em] text-[#C8A96E]">Technical Profile</span>
                 <span className="text-[7px] font-black uppercase tracking-[0.2em] text-foreground/40">{tile.size || 'Custom Cut'}</span>
              </div>
              <div className="flex justify-between items-end border-t border-foreground/[0.05] pt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-serif italic text-foreground">{tile.finish || 'Polished'}</span>
                    <span className="text-[10px] font-serif italic text-foreground/60">{tile.origin || 'Imported'}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#C8A96E]">View &rarr;</span>
              </div>
           </div>
        </div>

        {/* Minimal Gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      {/* Integrated Title & Category */}
      <div className="pt-6 pb-6 px-6 bg-background flex flex-col gap-1 border-t border-foreground/[0.03]">
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#C8A96E]">
          {tile.category_name || String(tile.category || 'Curated Selection')}
        </span>
        <h3 className="text-xl md:text-2xl font-serif text-foreground font-light leading-[0.9] tracking-tighter group-hover:translate-x-1 transition-transform duration-500">
          {tile.name}
        </h3>
      </div>

      {/* Sub-Brand Marker */}
      <div className="absolute top-4 right-4 z-10 px-2 py-1 bg-foreground/5 backdrop-blur-sm border border-foreground/[0.1] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
         <span className="text-[7px] font-black uppercase tracking-widest text-foreground/60">{tile.brand || 'Luxury'}</span>
      </div>
    </Link>
  );
});
ProductCard.displayName = 'ProductCard';

// ─── Main Component ────────────────────────────────────────────────────────────
const SPACES = ['Kitchen', 'Living Room', 'Bathroom', 'Outdoor', 'Commercial'];

export function ProductCollection() {
  const { backendTiles, nextPageUrl, loadMoreTiles, categories, brands } = useGallery();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const [selectedSpaces, setSelectedSpaces] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);

  // Derive available finishes lazily
  const availableFinishes = useMemo(
    () => Array.from(new Set(backendTiles.map(t => t.finish).filter(Boolean))).sort(),
    [backendTiles]
  );

  // Stable filter function
  const filteredTiles = useMemo(() => {
    if (!selectedSpaces.length && !selectedCategories.length && !selectedBrands.length && !selectedFinishes.length) {
      return backendTiles; // fast path — no filters active
    }
    return backendTiles.filter(tile => {
      if (selectedSpaces.length > 0) {
        const spaceMatch = selectedSpaces.includes(tile.space || '') ||
          (tile.usage?.some(u => selectedSpaces.includes(u)) ?? false);
        if (!spaceMatch) return false;
      }
      if (selectedCategories.length > 0 && !selectedCategories.includes(String(tile.category ?? ''))) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(String(tile.company ?? tile.brand ?? ''))) return false;
      if (selectedFinishes.length > 0 && !selectedFinishes.includes(tile.finish ?? '')) return false;
      return true;
    });
  }, [backendTiles, selectedSpaces, selectedCategories, selectedBrands, selectedFinishes]);

  const activeFiltersCount = selectedSpaces.length + selectedCategories.length + selectedBrands.length + selectedFinishes.length;

  // Stable checkbox handler (useCallback prevents sidebar re-render on filter change)
  const handleCheckbox = useCallback((
    value: string,
    _state: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedSpaces([]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedFinishes([]);
  }, []);

  const isLoadingMoreRef = useRef(false);
  // Keep ref strictly synchronized with state to prevent stale reads in observer callback
  useEffect(() => {
    isLoadingMoreRef.current = isLoadingMore;
  }, [isLoadingMore]);

  // Stable infinite scroll observer — completely detached from state updates
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMoreRef.current) {
          setIsLoadingMore(true);
          loadMoreTiles().finally(() => setIsLoadingMore(false));
        }
      },
      { threshold: 0.1, rootMargin: '500px' }
    );

    if (loadMoreRef.current && nextPageUrl) {
      observerRef.current.observe(loadMoreRef.current);
    }
    return () => observerRef.current?.disconnect();
  }, [nextPageUrl, loadMoreTiles]); // Never depend on isLoadingMore here, it causes infinite detach/reattach loops!

  const sidebarProps: SidebarProps = {
    spaces: SPACES,
    categories,
    brands,
    availableFinishes,
    selectedSpaces,
    selectedCategories,
    selectedBrands,
    selectedFinishes,
    activeFiltersCount,
    onCheckbox: handleCheckbox,
    setSelectedSpaces,
    setSelectedCategories,
    setSelectedBrands,
    setSelectedFinishes,
    onClear: clearFilters,
  };

  return (
    <section id="collection" className="bg-background relative z-10 w-full pb-48 pt-28 md:pt-40 border-t border-foreground/5">

      {/* Page Header */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 mb-16 flex flex-col items-center text-center">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-8 h-[1px] bg-[#C8A96E]" />
          <span className="text-[9px] font-sans font-black tracking-[0.9em] uppercase text-[#C8A96E]">THE CATALOGUE</span>
          <div className="w-8 h-[1px] bg-[#C8A96E]" />
        </div>
        <h2 className="text-5xl md:text-8xl font-serif font-light text-foreground leading-[0.85] tracking-tighter">
          Masterpiece <span className="italic text-foreground/25">Gallery.</span>
        </h2>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-10 lg:gap-16">

        {/* Mobile Filters — Sheet drawer */}
        <div className="lg:hidden flex justify-between items-center border-y border-foreground/[0.07] py-5">
          <span className="text-[10px] font-bold tracking-widest text-foreground/40 uppercase">
            {filteredTiles.length} results
          </span>
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-[#C8A96E]">
                <Filter className="w-3.5 h-3.5" />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] bg-background border-r border-foreground/5 p-7 pt-16 overflow-y-auto">
              <SidebarContent {...sidebarProps} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar — solid bg, NO backdrop-blur (performance) */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-36 xl:top-40 self-start bg-background border border-foreground/[0.07] p-7 max-h-[calc(100vh-10rem)] overflow-y-auto scrollbar-hide z-30">
          <SidebarContent {...sidebarProps} />
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <div className="hidden lg:flex justify-between items-center mb-8 pb-5 border-b border-foreground/[0.07]">
            <span className="text-[10px] font-bold tracking-widest text-foreground/40 uppercase">
              {filteredTiles.length} products{activeFiltersCount > 0 ? ` (${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} applied)` : ''}
            </span>
          </div>

          {/* Card Grid — no backdrop-blur anywhere */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {filteredTiles.map(tile => (
              <ProductCard key={tile.id} tile={tile} />
            ))}
          </div>

          {/* Empty State */}
          {filteredTiles.length === 0 && !isLoadingMore && (
            <div className="py-32 flex flex-col items-center text-center opacity-40">
              <Filter className="w-10 h-10 mb-5 text-[#C8A96E]" />
              <span className="text-xs uppercase tracking-widest font-black mb-3">No matches found</span>
              <p className="text-sm font-sans text-foreground/50 max-w-xs leading-relaxed">
                Try adjusting the active filters to broaden your search.
              </p>
              <button onClick={clearFilters} className="mt-6 text-[10px] text-[#C8A96E] uppercase tracking-widest font-black hover:text-foreground transition-colors">
                Reset All Filters
              </button>
            </div>
          )}

          {/* Infinite Scroll Sentinel */}
          {nextPageUrl && (
            <div ref={loadMoreRef} className="py-20 flex justify-center items-center border-t border-foreground/[0.06] mt-10">
              <Loader2 className="w-5 h-5 text-[#C8A96E] animate-spin" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductCollection;
