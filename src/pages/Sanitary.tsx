import React from 'react';
import SEO from '@/components/SEO';
import { useGallery } from '@/contexts/GalleryContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SanitaryItem } from '@/data/tiles';

// ─── Sanitary Product Card (with Hover-to-Cycle Gallery) ─────────────────────
const SanitaryCard = ({ item, brands }: { item: SanitaryItem, brands: any[] }) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isHovered, setIsHovered] = React.useState(false);
    const images = item.image_urls && item.image_urls.length > 0 ? item.image_urls : [item.image_url || item.image || ''];

    React.useEffect(() => {
        let interval: any;
        if (isHovered && images.length > 1) {
            interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length);
            }, 1200); // Cycle every 1.2s on hover
        } else if (!isHovered) {
            setCurrentIndex(0); // Reset to first image when not hovered
        }
        return () => clearInterval(interval);
    }, [isHovered, images.length]);

    return (
        <div 
            className="group relative flex flex-col h-full bg-background border border-foreground/5 hover:border-accent/40 transition-all duration-700 overflow-hidden shadow-sm hover:shadow-2xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] bg-foreground/5 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.img 
                        key={currentIndex}
                        src={images[currentIndex]} 
                        alt={item.name} 
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1.1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full object-cover grayscale active:grayscale-0 group-hover:grayscale-0"
                    />
                </AnimatePresence>
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A08]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Dots indicator */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                        {images.map((_, i) => (
                            <div 
                                key={i} 
                                className={`w-1 h-1 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-[#C8A96E] scale-150' : 'bg-white/30'}`} 
                            />
                        ))}
                    </div>
                )}

                {/* Hover CTA */}
                <div className="absolute bottom-12 left-0 right-0 flex justify-center translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                    <Link 
                        to={`/contact?inquire=${encodeURIComponent(item.name)}`}
                        className="bg-[#C8A96E] text-[#0C0A08] px-8 py-3.5 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-colors block text-center shadow-lg w-3/4 max-w-[200px]"
                    >
                        Inquire Details
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[9px] font-black text-[#C8A96E] uppercase tracking-widest leading-none mt-1">
                        Specimen #{String(item.id).padStart(4, '0')}
                    </span>
                    {item.company && (
                        <span className="text-[9px] font-black text-foreground/50 uppercase tracking-widest leading-none">
                            {brands.find(b => b.id === Number(item.company))?.name || ''}
                        </span>
                    )}
                    {item.price && (
                        <span className="text-[10px] text-foreground/40 font-black tracking-widest">{item.price}</span>
                    )}
                </div>
                <h3 className="text-2xl font-serif font-light tracking-tight text-foreground group-hover:text-[#C8A96E] transition-colors mb-4 line-clamp-2 italic">
                    {item.name}
                </h3>
                <p className="text-[11px] font-sans font-light text-foreground/50 leading-relaxed max-w-sm line-clamp-3 mb-2 flex-1">
                    {item.description || "Premium sanitary fixture constructed with uncompromised quality and fluid geometry. A masterful addition to dynamic environments."}
                </p>
            </div>
        </div>
    );
};

const Sanitary = () => {
    const { sanitary, brands } = useGallery();

    return (
        <>
            <SEO 
                title="Bath & Wellness | Luxury Sanitary Ware" 
                description="Explore our curated collection of world-class sanitary fixtures at MH MARBLE. Transform your private sanctuaries into masterpieces of design and engineering with our fluid sculpture fixtures."

                breadcrumbs={[
                  { name: 'Home', item: '/' },
                  { name: 'Sanitary', item: '/sanitary' }
                ]}
            />
            <div className="min-h-screen bg-background text-foreground selection:bg-accent/30/30 selection:text-foreground">
                <Header />
                
                <main className="pb-0 bg-background">
                    
                    {/* Intro Hero - Ultra minimal */}
                    <div className="pt-40 md:pt-56 pb-24 px-6 md:px-[8%] relative z-10">
                        <div className="max-w-4xl text-left">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-px bg-[#C8A96E]" />
                                <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-[#C8A96E]">Bath & Wellness</span>
                            </div>
                            
                            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-serif font-light leading-[0.8] tracking-tighter mb-12">
                                Private <br />
                                <span className="italic text-foreground/40">Sanctuary.</span>
                            </h1>
                            
                            <p className="text-lg md:text-2xl text-foreground/40 font-light max-w-2xl leading-relaxed">
                                Beyond utility. We curate world-class fixtures that transform intimate spaces into masterclasses of water engineering and fluid sculpture.
                            </p>
                        </div>
                    </div>

                    {/* Collection - Grid Product Cards */}
                    {sanitary.length === 0 ? (
                        <div className="py-64 text-center border-b border-foreground/5 bg-background relative overflow-hidden">
                            <div className="absolute inset-0 bg-[#C8A96E]/5 blur-[100px] rounded-full w-[80vw] h-[80vw] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <div className="relative z-10">
                                <Droplets className="w-16 h-16 text-[#C8A96E] mx-auto mb-10 stroke-[1px]" />
                                <h2 className="text-4xl font-serif italic text-foreground mb-6">Curating Collection</h2>
                                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/40">The Private Sanctuary is being prepared</p>
                                <Link to="/contact" className="inline-flex items-center gap-4 mt-12 text-[#C8A96E] text-xs font-black uppercase tracking-[0.3em] hover:text-foreground transition-colors duration-500">
                                    Inquire for specialized sourcing <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-[1800px] mx-auto px-6 md:px-[8%] pb-40">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                                {sanitary.map((item) => (
                                    <SanitaryCard key={item.id} item={item} brands={brands} />
                                ))}
                            </div>
                        </div>
                    )}
                </main>

                <Footer />
            </div>
        </>
    );
};

export default Sanitary;
