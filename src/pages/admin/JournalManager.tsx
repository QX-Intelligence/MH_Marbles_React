import React, { useState, useRef } from 'react';
import { useGallery } from '@/contexts/GalleryContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, FileText, Calendar, Youtube, ArrowUpRight, Upload, X, Image as ImageIcon } from 'lucide-react';
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

const JournalManager = () => {
  const { journal: entries, addJournal, deleteJournal } = useGallery();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ytUrl: ''
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalPossible = 10;
      
      if (selectedImages.length + newFiles.length > totalPossible) {
        toast.error(`Maximum ${totalPossible} images allowed per project`);
        return;
      }
      
      setSelectedImages(prev => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Required fields missing');
      return;
    }
    
    if (selectedImages.length === 0) {
      toast.error('Please upload at least one architectural image');
      return;
    }

    try {
      setIsSubmitting(true);
      await addJournal({
        title: formData.title,
        description: formData.description,
        ytUrl: formData.ytUrl || undefined,
        images: selectedImages
      });
      
      toast.success('Narrative established successfully');
      setIsDialogOpen(false);
      setFormData({ title: '', description: '', ytUrl: '' });
      setSelectedImages([]);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to establish narrative';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteJournal(id);
      toast.success('Narrative deleted');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to delete narrative';
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-12">

      {/* ── Header + Add Button ─────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-[1px] bg-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Editorial Content</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-light text-foreground leading-none tracking-tighter">
            Journal <span className="italic text-foreground/30 text-5xl md:text-6xl lg:text-7xl">Manager.</span>
          </h2>
          <p className="mt-10 text-[10px] sm:text-xs text-foreground/40 uppercase tracking-[0.3em] font-sans font-bold leading-loose">
            Curating architectural narratives, project milestones, and cinematic reflections.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setFormData({ title: '', description: '', ytUrl: '' });
                setSelectedImages([]);
              }}
              className="h-16 px-10 rounded-none bg-accent hover:bg-foreground text-background font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-700 shadow-[0_0_30px_rgba(229,142,88,0.2)]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Draft New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-sepia border-foreground/10 text-foreground rounded-none max-w-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif font-light tracking-tighter lowercase italic">
                Publish New Narrative
              </DialogTitle>
              <div className="w-12 h-px bg-accent/30 mx-auto mt-4" />
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-8 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Text Inputs */}
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Entry Title</Label>
                    <Input
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="bg-foreground/5 border-foreground/10 rounded-none h-12 focus:border-accent transition-colors"
                      placeholder="The Tuscon Journey..."
                      required
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">YouTube URL (Optional)</Label>
                    <div className="relative">
                      <Input
                        type="url"
                        value={formData.ytUrl}
                        onChange={e => setFormData({...formData, ytUrl: e.target.value})}
                        className="bg-foreground/5 border-foreground/10 rounded-none h-12 focus:border-accent transition-colors pl-10"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                      <Youtube className="w-4 h-4 text-foreground/40 absolute left-4 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Narrative Description</Label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-none p-4 h-40 focus:border-accent transition-colors outline-none text-sm leading-relaxed"
                      placeholder="Summarize the architectural philosophy or client story..."
                      required
                    />
                  </div>
                </div>

                {/* Right: Image Upload */}
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Project Gallery (Min 1)</Label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group h-[320px] border border-dashed border-foreground/10 hover:border-accent/40 bg-foreground/[0.02] transition-all duration-700 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden"
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageSelect} 
                      className="hidden" 
                      multiple 
                      accept="image/*" 
                    />
                    
                    {selectedImages.length === 0 ? (
                      <div className="text-center space-y-4">
                        <Upload className="w-8 h-8 text-foreground/10 mx-auto group-hover:text-accent/40 transition-colors" />
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-foreground/20 group-hover:text-foreground/40 transition-colors">Select Visuals</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 p-4 w-full h-full overflow-y-auto content-start">
                        {selectedImages.map((file, i) => (
                          <div key={i} className="relative aspect-square bg-foreground/5 group/img overflow-hidden">
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt="preview" 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" 
                            />
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                              className="absolute top-1 right-1 bg-black/50 text-white p-1 backdrop-blur-md opacity-0 group-hover/img:opacity-100 transition-opacity"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                        <div className="aspect-square border border-dashed border-foreground/10 flex items-center justify-center hover:bg-foreground/5 transition-colors">
                           <Plus className="w-4 h-4 text-foreground/20" />
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-[8px] text-foreground/30 font-black uppercase tracking-widest mt-2">
                    {selectedImages.length} of 10 slots filled
                  </p>
                </div>
              </div>

              <Button
                disabled={isSubmitting}
                type="submit"
                className="w-full h-16 bg-accent text-background hover:bg-foreground rounded-none text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-700 shadow-[0_0_40px_rgba(229,142,88,0.2)] disabled:opacity-50"
              >
                {isSubmitting ? 'Establishing Narrative...' : 'Publish Masterpiece'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Creative Editorial Strip Cards ──────────────── */}
      <div className="mt-20 space-y-4">
        <AnimatePresence mode="popLayout">
          {entries.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60, scale: 0.97 }}
              transition={{ delay: idx * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.3, ease: 'easeOut' } }}
              className="group relative"
            >
              <div className="relative flex items-stretch min-h-[180px] bg-card border border-foreground/[0.08] group-hover:border-accent/30 transition-all duration-700 shadow-lg group-hover:shadow-[0_12px_60px_rgba(229,142,88,0.15)]">
                
                {/* Image Preview Block */}
                <div className="w-[180px] flex-shrink-0 bg-foreground/5 relative overflow-hidden hidden sm:block">
                  {entry.image_urls && entry.image_urls.length > 0 ? (
                    <img 
                      src={entry.image_urls[0]} 
                      alt={entry.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                       <ImageIcon className="w-6 h-6 text-foreground/10" />
                    </div>
                  )}
                  {entry.image_urls && entry.image_urls.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 text-[8px] font-black text-white uppercase tracking-widest leading-none">
                      +{entry.image_urls.length - 1} More
                    </div>
                  )}
                </div>

                {/* Vertical Label */}
                <div className="flex-shrink-0 w-12 flex items-center justify-center border-r border-foreground/[0.03] group-hover:border-accent/10">
                  <span
                    className="text-[7px] font-black uppercase tracking-[0.6em] text-accent/25 group-hover:text-accent/60 select-none whitespace-nowrap"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  >
                    Vol.{String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Main Content */}
                <div className="flex-1 relative z-10 flex flex-col justify-between px-10 py-7">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <span className="text-[7px] font-black uppercase tracking-[0.7em] text-foreground/12 flex items-center gap-1.5">
                        <Calendar className="w-2 h-2" />
                        {entry.instant
                          ? new Date(entry.instant).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                          : 'Unknown Date'}
                      </span>
                      <span className="w-12 h-px bg-foreground/[0.06]" />
                      <span className="text-[7px] font-black uppercase tracking-[0.6em] text-accent/30">
                        {entry.image_urls?.length ? 'Portfolio Submission' : 'Narrative'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="opacity-0 group-hover:opacity-100 w-7 h-7 border border-foreground/8 hover:border-red-500/40 hover:bg-red-500/8 flex items-center justify-center transition-all duration-300"
                    >
                      <Trash2 size={10} className="text-red-400/60 hover:text-red-400" />
                    </button>
                  </div>

                  <h3 className="text-[1.8rem] md:text-[2.2rem] font-serif italic font-light text-foreground/80 group-hover:text-foreground transition-colors duration-500 leading-tight tracking-tight my-4 line-clamp-1">
                    {entry.title}
                  </h3>

                  <div className="flex items-end justify-between gap-10">
                    <p className="text-[10px] text-foreground/25 leading-loose tracking-wide max-w-2xl line-clamp-2 font-sans group-hover:text-foreground/40 transition-colors">
                      {entry.description}
                    </p>

                    <div className="flex gap-2">
                      {entry.ytUrl && (
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                          <Youtube size={12} className="text-accent" />
                        </div>
                      )}
                      <div className="w-8 h-8 border border-foreground/5 rounded-full flex items-center justify-center group-hover:border-accent/30 transition-colors">
                        <ArrowUpRight size={10} className="text-foreground/20 group-hover:text-accent" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accent Watermark */}
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-serif italic font-black text-[120px] text-foreground/[0.02] select-none pointer-events-none leading-none tracking-tighter">
                   {String(idx + 1).padStart(2, '0')}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {entries.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-52 flex flex-col items-center gap-6 border border-dashed border-foreground/[0.04] mt-8"
        >
          <FileText className="w-7 h-7 text-foreground/[0.05]" />
          <p className="text-[9px] font-black uppercase tracking-[0.8em] text-foreground/[0.07] italic">
            Zero Transmissions Captured
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default JournalManager;
