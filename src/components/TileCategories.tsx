import React from 'react';
import { Link } from 'react-router-dom';
import { useGallery } from '@/contexts/GalleryContext';

const fallbackImages: Record<string, string> = {
  BATHROOM: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80',
  KITCHEN: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80',
  'LIVING ROOM': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80',
  BEDROOM: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80',
  'BED ROOM': 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80',
  OUTDOOR: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80',
  'COMMERCIAL SPACES': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
  DEFAULT: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80'
};

export function TileCategories() {
  const { categories } = useGallery();

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-32 md:py-48 bg-background relative z-10 border-t border-border overflow-hidden">
      
      {/* Background structural typography */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 pointer-events-none opacity-[0.02]">
         <h2 className="text-[20vw] md:text-[25vw] font-serif italic tracking-tighter whitespace-nowrap leading-none select-none">
           Categories
         </h2>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 md:px-12 xl:px-16 flex flex-col xl:flex-row gap-16 xl:gap-24 items-start">
        
        {/* Left Column: Typography & Context */}
        <div className="xl:w-[35%] flex flex-col items-start text-left shrink-0 xl:sticky xl:top-40">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-6 flex items-center gap-4">
             <div className="w-8 h-[1px] bg-accent" />
             Curated Spaces
          </span>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-foreground mb-8 tracking-tighter leading-[0.9]">
            The <br />
            <span className="italic text-foreground/40">Collections.</span>
          </h2>
          
          <p className="text-sm md:text-base text-foreground/50 font-sans leading-relaxed tracking-wide max-w-md mb-12 border-l border-border pl-6">
            MH Marbles offers premium wall and floor tiles, combining advanced technology with elegant designs for lasting quality. Explore curated spaces defined by monolithic grace.
          </p>
          
          <Link to="/collection" className="group inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-foreground hover:text-accent transition-colors">
            View the Archive
            <span className="w-12 h-[1px] bg-foreground/20 group-hover:bg-accent group-hover:w-24 transition-all duration-700" />
          </Link>
        </div>

        {/* Right Column: Grid of Cards */}
        <div className="xl:w-[65%] w-full">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
             {categories.map((cat, i) => {
               const upName = cat.name.toUpperCase();
               const imageToUse = cat.image_url || fallbackImages[upName] || fallbackImages.DEFAULT;
               
               // Introduce staggered alignment for a dynamic look
               const marginTop = i % 2 !== 0 ? 'lg:mt-16' : '';

               return (
                 <Link 
                    to={`/collection?category=${encodeURIComponent(cat.name)}`} 
                    key={cat.id || i} 
                    className={`group relative block overflow-hidden border border-border/30 bg-foreground/5 transition-all duration-700 shadow-sm hover:shadow-2xl ${marginTop}`}
                  >
                   <div className="w-full relative aspect-[3/4]">
                     <img 
                       src={imageToUse} 
                       alt={cat.name} 
                       className="w-full h-full object-cover transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-110"
                     />
                     <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-700" />
                     <div className="absolute inset-x-0 bottom-0 top-[30%] bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-700" />
                     <div className="absolute inset-0 border border-white/10 m-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-95 group-hover:scale-100 pointer-events-none" />
                   </div>

                   <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-start gap-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                       <span className="text-[8px] font-black uppercase tracking-[0.4em] text-accent/90 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 translate-y-2 group-hover:translate-y-0">
                         View Series
                       </span>
                       <h3 className="text-2xl md:text-3xl font-serif font-light tracking-tight text-white group-hover:text-accent transition-colors duration-500 drop-shadow-md">
                         {cat.name}
                       </h3>
                   </div>
                 </Link>
               );
             })}
           </div>
        </div>

      </div>
    </section>
  );
}
