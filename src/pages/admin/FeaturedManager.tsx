import React, { useState, useMemo } from 'react';
import { useGallery } from '@/contexts/GalleryContext';
import { 
  Star, Search, ArrowRight, X, LayoutGrid, 
  Sparkles, CheckCircle2, AlertCircle, Info,
  Loader2, ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, getOptimizedImageUrl } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Tile } from '@/data/tiles';

const FeaturedManager = () => {
  const { backendTiles, updateTile } = useGallery();
  const [search, setSearch] = useState('');
  const [isSyncing, setIsSyncing] = useState<string | number | null>(null);

  // Split products into Featured vs Available
  const featuredProducts = useMemo(() => 
    backendTiles.filter(t => t.is_featured).slice(0, 6)
  , [backendTiles]);

  const availableProducts = useMemo(() => {
    const featuredIds = new Set(featuredProducts.map(p => p.id));
    return backendTiles
      .filter(t => !featuredIds.has(t.id))
      .filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || 
                  String(t.brand).toLowerCase().includes(search.toLowerCase()));
  }, [backendTiles, featuredProducts, search]);

  const handleToggleFeature = async (product: Tile, shouldFeature: boolean) => {
    if (shouldFeature && featuredProducts.length >= 6) {
      toast.error('Spotlight capacity reached (max 6)');
      return;
    }

    setIsSyncing(product.id);
    try {
      const data = new FormData();
      data.append('is_featured', shouldFeature ? 'true' : 'false');
      
      // We must send other required fields because the backend might validate them
      // In a real patch, we'd only send is_featured, but our updateTile expects FormData
      await updateTile(product.id, data);
      
      toast.success(shouldFeature ? 'Item Promoted to Spotlight' : 'Item Removed from Spotlight');
    } catch (error: any) {
      const msg = error?.response?.data?.non_field_errors?.[0] || 'Synchronization failed';
      toast.error(msg);
    } finally {
      setIsSyncing(null);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header Architecture */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-[1px] bg-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Home Page Curation</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-medium text-foreground leading-none tracking-tighter">
            Featured <span className="italic text-foreground/50 text-5xl md:text-6xl lg:text-7xl">Showcase.</span>
          </h2>
          <p className="mt-10 text-[10px] sm:text-xs text-foreground/60 uppercase tracking-[0.3em] font-sans font-black leading-loose">
            Curate the high-performance curtain reveal for your homepage. 
            <span className="text-accent ml-2">[{featuredProducts.length} / 6 slots occupied]</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-start">
        
        {/* Left Column: Spotlight Queue (The Home Page View) */}
        <div className="xl:col-span-5 space-y-8">
          <div className="flex items-center justify-between border-b border-foreground/5 pb-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-accent" />
              Spotlight Queue
            </h3>
            <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest">Active Reveal</span>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative bg-card border border-foreground/5 p-4 flex items-center gap-6 group hover:border-accent/30 transition-all duration-500"
                  >
                    <div className="text-[10px] font-black text-foreground/20 italic group-hover:text-accent transition-colors">
                      0{idx + 1}
                    </div>
                    <div className="w-20 h-20 bg-foreground/5 shrink-0 overflow-hidden">
                      {p.image_url || p.image ? (
                        <img 
                          src={getOptimizedImageUrl(p.image_url || p.image, 100, 100)} 
                          alt="" 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-10"><ImageIcon size={16} /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-black text-accent uppercase tracking-widest mb-1">{p.brand}</p>
                      <h4 className="text-sm font-serif italic text-foreground truncate">{p.name}</h4>
                    </div>
                    <button
                      onClick={() => handleToggleFeature(p, false)}
                      disabled={isSyncing === p.id}
                      className="p-3 text-foreground/20 hover:text-red-500 hover:bg-red-500/5 transition-all"
                      title="Remove from spotlight"
                    >
                      {isSyncing === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="py-20 border border-dashed border-foreground/10 flex flex-col items-center justify-center text-center px-10">
                  <AlertCircle className="w-8 h-8 text-foreground/10 mb-4" />
                  <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">No products spotlighted</p>
                  <p className="text-[9px] text-foreground/20 mt-2 uppercase tracking-tighter">Choose items from the archive gallery to begin.</p>
                </div>
              )}
            </AnimatePresence>
            
            {/* Empty Slots visualization */}
            {Array.from({ length: 6 - featuredProducts.length }).map((_, i) => (
              <div key={`empty-${i}`} className="h-28 border border-dashed border-foreground/5 flex items-center justify-center opacity-[0.03]">
                 <span className="text-[10px] font-black uppercase tracking-[0.5em]">Reserved Slot</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Archive Gallery (Available for Promotion) */}
        <div className="xl:col-span-7 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-foreground/5 pb-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
              <LayoutGrid className="w-4 h-4 text-foreground/40" />
              Archive Gallery
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-foreground/30" />
              <Input
                placeholder="Find Specimen..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-foreground/5 border-none h-9 text-[9px] font-black uppercase tracking-widest pl-10 focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {availableProducts.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group bg-card border border-foreground/5 p-4 flex gap-4 hover:border-accent/40 transition-all duration-500 cursor-pointer"
                  onClick={() => handleToggleFeature(p, true)}
                >
                  <div className="w-16 h-16 bg-foreground/5 shrink-0 overflow-hidden relative">
                    {p.image_url || p.image ? (
                      <img 
                        src={getOptimizedImageUrl(p.image_url || p.image, 100, 100)} 
                        alt="" 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-10"><ImageIcon size={14} /></div>
                    )}
                    <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-background" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] font-black text-foreground/30 uppercase tracking-widest mb-1">{p.brand}</p>
                    <h4 className="text-xs font-serif text-foreground truncate">{p.name}</h4>
                    <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[8px] font-black text-accent uppercase tracking-tighter">Feature This</span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    {isSyncing === p.id && <Loader2 className="w-3 h-3 animate-spin text-accent" />}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {availableProducts.length === 0 && (
              <div className="col-span-2 py-20 text-center opacity-20">
                <p className="text-[10px] font-black uppercase tracking-widest">Archive slice empty</p>
              </div>
            )}
          </div>
          
          <div className="p-6 bg-accent/[0.03] border border-accent/10">
            <div className="flex gap-4">
              <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-accent uppercase tracking-widest">Curation Rules</p>
                <p className="text-[9px] text-foreground/50 leading-relaxed uppercase tracking-tighter">
                  The homepage showcase is restricted to 6 products for optimal horizontal flow. 
                  Items with high-resolution images are recommended for the best cinematic result.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FeaturedManager;
