import React from 'react';
import SEO from '@/components/SEO';
import { PageLayout } from '@/components/PageLayout';
import { useGallery } from '@/contexts/GalleryContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Companies = () => {
  const { brands } = useGallery();
  const navigate = useNavigate();

  return (
    <>
      <SEO 
        title="Our Partners | Global Quarry Network" 
        description="Explore the global network of premier stone brands and quarry origins curated by MH Marble."
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Companies', item: '/companies' }
        ]}
      />
      
      <PageLayout title="The Partners." subtitle="Curatory Selection">
        <div className="bg-background min-h-[60vh] relative z-20">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-24">
            
            {/* Header / Intro */}
            <div className="max-w-3xl mb-24">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent block mb-8">Direct From Source</span>
              <p className="text-2xl md:text-3xl font-serif font-light leading-relaxed text-foreground/70">
                We bridge the gap between the world's finest quarries and your vision. Each brand in our curation represents a legacy of geology and craftsmanship.
              </p>
            </div>

            {/* Brands Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1px bg-border/20 border border-border/20">
              {brands.map((brand, index) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="group bg-background p-12 lg:p-16 flex flex-col min-h-[400px] transition-colors hover:bg-foreground/[0.01]"
                >
                  {/* Brand Identity */}
                  <div className="flex-1 flex flex-col">
                    <div className="h-16 mb-12 flex items-start">
                      {brand.image_url || brand.logo ? (
                        <img 
                          src={brand.image_url || brand.logo} 
                          alt={brand.name} 
                          className="h-full w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                        />
                      ) : (
                        <span className="text-2xl font-serif italic text-foreground/20">{brand.name.charAt(0)}</span>
                      )}
                    </div>

                    <h3 className="text-3xl md:text-4xl font-serif font-light tracking-tighter mb-4 group-hover:text-accent transition-colors duration-500">
                      {brand.name}
                    </h3>
                    
                    <p className="text-sm font-sans font-light leading-relaxed text-foreground/50 max-w-xs group-hover:text-foreground/70 transition-colors duration-500">
                      {brand.description || "Leading specialist in premium architectural stone and bespoke quarry selections."}
                    </p>
                  </div>

                  {/* CTA / Detail */}
                  <div 
                    className="mt-8 pt-8 border-t border-border/10 flex justify-between items-center overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/collection?brand=${encodeURIComponent(brand.name)}`)}
                  >
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-accent/40 group-hover:text-accent group-hover:translate-x-0 -translate-x-4 transition-all duration-500">
                       Explore Origin
                    </span>
                    <div className="w-8 h-[1px] bg-accent/20 group-hover:w-16 transition-all duration-500" />
                  </div>
                </motion.div>
              ))}

              {brands.length === 0 && (
                <div className="col-span-full py-40 text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.6em] text-foreground/30">Archives synchronizing...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Strategic Footer Decoration */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </PageLayout>
    </>
  );
};

export default Companies;
