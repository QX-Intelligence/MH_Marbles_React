import React, { useState } from 'react';
import { useGallery } from '@/contexts/GalleryContext';
import { MediaEntry, HeroSlide } from '@/types/gallery';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Video, Play, Edit, Trash2, Youtube, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

/**
 * SlideCard - Individual card component for each carousel slide.
 * Allows quick activation/deactivation without opening the edit dialog.
 */
const SlideCard = ({ item, idx, onEdit, onDelete }: { 
  item: MediaEntry; 
  idx: number; 
  onEdit: (m: MediaEntry) => void; 
  onDelete: (id: string | number) => void;
}) => {
  const { updateMedia } = useGallery();
  const [isToggling, setIsToggling] = React.useState(false);

  const toggleActive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsToggling(true);
    
    // We send FormData with a string "true"/"false" so the backend handles it as multipart
    const data = new FormData();
    data.append('is_active', (!item.is_active).toString());
    
    try {
      await updateMedia(item.id, data);
      toast.success(item.is_active ? 'Slide deactivated' : 'Slide activated');
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: idx * 0.05 }}
      className="group relative bg-[#0C0A08] border border-foreground/5 overflow-hidden transition-all duration-700 hover:border-accent/40 shadow-2xl"
    >
      <div className="aspect-[4/3] bg-foreground/5 relative flex items-center justify-center overflow-hidden">
         {item.image ? (
           <img 
             src={item.image} 
             alt={item.heading} 
             className={`w-full h-full object-cover transition-all duration-1000 ${
               item.is_active ? 'grayscale-0 opacity-100' : 'grayscale opacity-30 blur-[2px]'
             }`} 
           />
         ) : (
           <ImageIcon className="w-10 h-10 text-foreground/5" />
         )}
         
         {/* Status Badge */}
         <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className={`text-[7px] font-black uppercase px-2 py-0.5 tracking-widest border ${
              item.is_active ? 'bg-accent/10 text-accent border-accent/20' : 'bg-red-500/10 text-red-500/60 border-red-500/20'
            }`}>
              {item.is_active ? 'Published' : 'Hidden'}
            </span>
         </div>

         {/* Selection Indicators Overlay */}
         <div className="absolute inset-0 bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      <div className="p-5">
         <div className="flex justify-between items-center mb-4">
            <span className="text-[8px] font-black uppercase text-foreground/30 tracking-[0.4em]">
              #{item.order}
            </span>
            <div className="flex gap-3">
               <button 
                 onClick={() => onEdit(item)} 
                 className="text-foreground/20 hover:text-accent transition-colors"
                >
                  <Edit size={12} />
                </button>
               <button 
                 onClick={() => onDelete(item.id)} 
                 className="text-red-500/20 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
            </div>
         </div>
         <h3 className="text-lg font-serif italic text-foreground mb-1 tracking-tight truncate">{item.heading || 'Untitled Slide'}</h3>
         <p className="text-[9px] text-foreground/40 uppercase tracking-[0.2em] font-sans font-bold leading-relaxed truncate">
           {item.subtext || 'No Subtext Provided'}
         </p>
         
         <div className="mt-5 pt-5 border-t border-white/5 flex items-center justify-between">
            <button 
              disabled={isToggling}
              onClick={toggleActive}
              className={`text-[8px] font-black uppercase tracking-widest transition-all duration-500 ${
                item.is_active ? 'text-foreground/40 hover:text-red-500' : 'text-accent hover:scale-105 hover:tracking-[0.3em]'
              }`}
            >
              {isToggling ? 'Syncing...' : (item.is_active ? 'Deactivate' : 'Publish to Home')}
            </button>
         </div>
      </div>
    </motion.div>
  );
};

const MediaManager = () => {
  const { media, addMedia, updateMedia, deleteMedia } = useGallery();
  const [selectedMedia, setSelectedMedia] = useState<MediaEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    heading: '',
    subtext: '',
    cta_text: '',
    cta_link: '',
    order: 1,
    is_active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.heading) {
      toast.error('Heading required');
      return;
    }

    const data = new FormData();
    data.append('heading', formData.heading);
    data.append('subtext', formData.subtext);
    data.append('cta_text', formData.cta_text);
    data.append('cta_link', formData.cta_link);
    data.append('order', formData.order.toString());
    data.append('is_active', formData.is_active ? 'true' : 'false');
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (selectedMedia) {
        await updateMedia(selectedMedia.id, data);
        toast.success('Visual narrative updated');
      } else {
        await addMedia(data);
        toast.success('New cinematic experience captured');
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save visual story');
    }
  };

  const handleEdit = (item: MediaEntry) => {
    setSelectedMedia(item);
    setFormData({
      heading: item.heading,
      subtext: item.subtext,
      cta_text: item.cta_text,
      cta_link: item.cta_link,
      order: item.order,
      is_active: item.is_active ?? true
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setSelectedMedia(null);
    setImageFile(null);
    setFormData({ heading: '', subtext: '', cta_text: '', cta_link: '', order: 1, is_active: true });
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-[1px] bg-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Cinematic Narrative</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-light text-foreground leading-none tracking-tighter">
            Media <span className="italic text-foreground/30 text-5xl md:text-6xl lg:text-7xl">Studio.</span>
          </h2>
          <p className="mt-10 text-[10px] sm:text-xs text-foreground/40 uppercase tracking-[0.3em] font-sans font-bold leading-loose">
            Curating visual poetry and cinematic architectural explorations.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="h-16 px-10 rounded-none bg-accent hover:bg-foreground text-background font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-700 shadow-[0_0_30px_rgba(229,142,88,0.2)]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Capture New Visual Story
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-sepia border-foreground/10 text-foreground rounded-none max-w-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif font-light tracking-tighter lowercase italic">
                {selectedMedia ? 'Refine Visual Story' : 'Record New Narrative'}
              </DialogTitle>
              <div className="w-12 h-px bg-accent/30 mx-auto mt-4" />
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Story Heading</Label>
                  <Input 
                    value={formData.heading} 
                    onChange={e => setFormData({...formData, heading: e.target.value})}
                    className="bg-foreground/5 border-foreground/10 rounded-none h-12 focus:border-accent transition-colors"
                    placeholder="Premium Tiles..."
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Display Order</Label>
                  <Input 
                    type="number"
                    value={formData.order} 
                    onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 1})}
                    className="bg-foreground/5 border-foreground/10 rounded-none h-12 focus:border-accent transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Cinematic Image</Label>
                <div className="flex gap-4">
                  <Input 
                    type="file"
                    accept="image/*"
                    onChange={e => setImageFile(e.target.files?.[0] || null)}
                    className="bg-foreground/5 border-foreground/10 rounded-none h-12 focus:border-accent transition-colors pt-2"
                  />
                  <div className="w-12 h-12 bg-foreground/5 border border-foreground/10 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-4 h-4 text-foreground/20" />
                  </div>
                </div>
                {selectedMedia?.image && !imageFile && (
                  <p className="text-[8px] text-foreground/20 italic">Current: {selectedMedia.image.split('/').pop()}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Subtext / Narrative</Label>
                <textarea 
                  value={formData.subtext} 
                  onChange={e => setFormData({...formData, subtext: e.target.value})}
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-none p-4 h-24 focus:border-accent transition-colors outline-none text-sm"
                  placeholder="Describe the cinematic journey..."
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">CTA Text</Label>
                  <Input 
                    value={formData.cta_text} 
                    onChange={e => setFormData({...formData, cta_text: e.target.value})}
                    className="bg-foreground/5 border-foreground/10 rounded-none h-12 focus:border-accent transition-colors"
                    placeholder="Explore Gallery"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">CTA Link</Label>
                  <Input 
                    value={formData.cta_link} 
                    onChange={e => setFormData({...formData, cta_link: e.target.value})}
                    className="bg-foreground/5 border-foreground/10 rounded-none h-12 focus:border-accent transition-colors"
                    placeholder="/gallery"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 py-4 border-y border-foreground/5">
                <input 
                  type="checkbox"
                  id="is_active_toggle"
                  checked={formData.is_active}
                  onChange={e => setFormData({...formData, is_active: e.target.checked})}
                  className="w-4 h-4 accent-accent cursor-pointer"
                />
                <div>
                  <Label htmlFor="is_active_toggle" className="text-[10px] font-black uppercase tracking-widest text-foreground cursor-pointer">Active in Carousel</Label>
                  <p className="text-[8px] text-foreground/30 mt-0.5">Visible to public visitors when enabled</p>
                </div>
              </div>

              <Button type="submit" className="w-full bg-accent text-background hover:bg-foreground rounded-none h-14 text-[10px] font-black uppercase tracking-widest transition-colors shadow-[0_0_30px_rgba(229,142,88,0.2)]">
                {selectedMedia ? 'Commit Refinement' : 'Begin Broadcast'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Slide Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-20">
        <AnimatePresence mode="popLayout">
          {media.map((item, idx) => (
            <SlideCard 
              key={item.id} 
              item={item} 
              idx={idx} 
              onEdit={handleEdit} 
              onDelete={deleteMedia} 
            />
          ))}
        </AnimatePresence>

        {media.length === 0 && (
          <div className="col-span-full py-40 text-center border border-dashed border-foreground/5">
            <ImageIcon className="w-8 h-8 text-foreground/10 mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/10 italic">No Cinematic Stories Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaManager;
