import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useGallery } from '@/contexts/GalleryContext';
import { ChevronDown } from 'lucide-react';

const navLinks = [
  { href: '/collection', label: 'Collection', dropdown: true },
  { href: '/companies', label: 'Companies', dropdown: true },
  { href: '/sanitary', label: 'Sanitary ware' },
  { href: '/journal', label: 'Recent Works' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/heritage', label: 'About Us' },
  { href: '/showroom', label: 'Where To Buy' },
];

export function Header() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { categories, brands } = useGallery();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
          isScrolled
            ? "glass-sepia border-b border-border py-3 shadow-luxury"
            : "bg-transparent py-6"
        )}
      >
        <div className="w-full max-w-none px-4 md:px-[3%]">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="group flex items-center gap-2 shrink-0">
              <img 
                src="/Logo1.png" 
                alt="MH Marbles" 
                className={cn(
                  "h-7 md:h-9 w-auto object-contain transition-all duration-700 group-hover:scale-105"
                )}
              />
              <div className="flex flex-col">
                <span className={cn(
                  "text-base md:text-[18px] font-serif font-bold tracking-[0.15em] uppercase leading-tight transition-colors duration-700 group-hover:text-accent",
                  isScrolled ? "text-foreground" : "text-foreground"
                )}>
                  MH MARBLE
                </span>
                <span className="hidden md:block text-[7px] font-sans font-black tracking-[0.4em]">
                  Quality Tiles For Stylish Living
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Subtle Gold Underline */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-10">
              {navLinks.map((link) => (
                <div 
                  key={link.href} 
                  className="relative group py-2"
                  onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                  onMouseLeave={() => link.dropdown && setActiveDropdown(null)}
                >
                  <Link
                    to={link.href}
                    className={cn(
                      "text-[12px] xl:text-[13px] font-sans font-black uppercase tracking-[0.25em] xl:tracking-[0.3em] transition-all duration-500 relative flex items-center gap-1.5 whitespace-nowrap",
                      isScrolled ? "text-foreground/80 hover:text-foreground" : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    {link.label}
                    {link.dropdown && <ChevronDown className={cn("w-3 h-3 transition-transform duration-500", activeDropdown === link.label && "rotate-180")} />}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all duration-500 group-hover:w-full" />
                  </Link>

                  {/* Dynamic Collection Dropdown */}
                  {link.dropdown && (
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-background border border-border py-6 px-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden"
                        >
                          <div className="flex flex-col gap-1">
                             <div className="mb-4 px-4 pb-2 border-b border-border/10">
                               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">
                                 {link.label === 'Collection' ? 'The Archive' : 'Our Partners'}
                               </span>
                             </div>
                             
                             <div className="max-h-[60vh] overflow-y-auto scrollbar-hide">
                               {link.label === 'Collection' 
                                 ? categories.map((cat) => (
                                     <button
                                       key={cat.id}
                                       onClick={() => {
                                         navigate(`/collection?category=${encodeURIComponent(cat.name)}`);
                                         setActiveDropdown(null);
                                       }}
                                       className="text-left px-4 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] text-foreground/80 hover:text-accent hover:bg-foreground/[0.03] transition-all duration-300 rounded-none block w-full"
                                     >
                                       {cat.name}
                                     </button>
                                   ))
                                 : brands.map((brand) => (
                                     <button
                                       key={brand.id}
                                       onClick={() => {
                                         navigate(`/collection?brand=${encodeURIComponent(brand.name)}`);
                                         setActiveDropdown(null);
                                       }}
                                       className="text-left px-4 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] text-foreground/80 hover:text-accent hover:bg-foreground/[0.03] transition-all duration-300 rounded-none block w-full"
                                     >
                                       {brand.name}
                                     </button>
                                   ))
                               }
                             </div>

                             <div className="mt-4 pt-4 border-t border-border/10 px-4">
                               <Link
                                 to={link.href}
                                 onClick={() => setActiveDropdown(null)}
                                 className="text-[9px] font-black uppercase tracking-[0.4em] text-accent hover:text-foreground transition-all block text-center py-2 border border-accent/20"
                               >
                                 {link.label === 'Collection' ? 'Explore All' : 'View Directory'}
                               </Link>
                             </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

              <div className="hidden lg:flex items-center gap-4 border-l pl-4 xl:pl-6 border-border transition-colors duration-700">
                {/* Theme Toggle */}
                <button
                  onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                  className="p-2 transition-all duration-500 rounded-full hover:bg-foreground/5 text-foreground/40 hover:text-foreground"
                  aria-label="Toggle theme"
                >
                  {mounted && (resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
                </button>
              </div>

            {/* Mobile Menu Toggle - Refined typography */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 transition-colors duration-700 text-foreground flex items-center gap-4 relative z-[60]"
              aria-label="Toggle menu"
            >
              <span className="text-[8px] font-black uppercase tracking-[0.6em] text-foreground/40">{isMobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
              <div className="space-y-1.5 w-6">
                <span className={cn("block w-full h-[1px] bg-foreground transition-all duration-500", isMobileMenuOpen && "translate-y-[7px] rotate-45")} />
                <span className={cn("block w-full h-[1px] bg-foreground transition-all duration-500", isMobileMenuOpen && "opacity-0")} />
                <span className={cn("block w-full h-[1px] bg-foreground transition-all duration-500", isMobileMenuOpen && "-translate-y-[7px] -rotate-45")} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ type: 'tween', ease: [0.76, 0, 0.24, 1], duration: 0.8 }}
            className="fixed inset-0 z-40 lg:hidden bg-background"
          >
            <div className="flex flex-col h-full pt-32 pb-12 px-8">
               <div className="flex justify-between items-center mb-16 border-b border-border pb-8">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Navigation</span>
                  <button
                    onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                    className="p-2 transition-all duration-500 rounded-full hover:bg-accent/10 text-foreground"
                    aria-label="Toggle theme"
                  >
                    {mounted && (resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
                  </button>
               </div>
               
              <nav className="flex flex-col space-y-8 h-full overflow-y-auto pr-4 custom-scrollbar">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.4, duration: 0.8 }}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <Link
                          to={link.href}
                          onClick={() => !link.dropdown && setIsMobileMenuOpen(false)}
                          className={cn(
                            "text-3xl font-serif tracking-tighter transition-colors",
                            activeDropdown === link.label ? "text-accent" : "text-foreground"
                          )}
                        >
                          {link.label}
                        </Link>
                        {link.dropdown && (
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                            className="p-4 -mr-4"
                          >
                            <ChevronDown className={cn("w-6 h-6 transition-transform duration-500", activeDropdown === link.label && "rotate-180")} />
                          </button>
                        )}
                      </div>

                      {/* Mobile Categories Accordion */}
                      {link.dropdown && (
                        <AnimatePresence>
                          {activeDropdown === link.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-foreground/[0.03] border-l-2 border-accent ml-1 mt-4"
                            >
                              <div className="flex flex-col py-6 px-8 gap-8">
                                {link.label === 'Collection' 
                                  ? categories.map((cat) => (
                                      <button
                                        key={cat.id}
                                        onClick={() => {
                                          navigate(`/collection?category=${encodeURIComponent(cat.name)}`);
                                          setIsMobileMenuOpen(false);
                                        }}
                                        className="text-left text-base font-sans font-black uppercase tracking-[0.2em] text-foreground hover:text-accent transition-colors"
                                      >
                                        {cat.name}
                                      </button>
                                    ))
                                  : brands.map((brand) => (
                                      <button
                                        key={brand.id}
                                        onClick={() => {
                                          navigate(`/collection?brand=${encodeURIComponent(brand.name)}`);
                                          setIsMobileMenuOpen(false);
                                        }}
                                        className="text-left text-base font-sans font-black uppercase tracking-[0.2em] text-foreground hover:text-accent transition-colors"
                                      >
                                        {brand.name}
                                      </button>
                                    ))
                                }
                                <Link
                                  to={link.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="text-[11px] font-black uppercase tracking-[0.4em] text-accent mt-6 pt-6 border-t border-border/20"
                                >
                                  {link.label === 'Collection' ? 'View Full Archive' : 'View Directory'}
                                </Link>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  </motion.div>
                ))}
              </nav>

                <div className="mt-auto pt-12 border-t border-border">
                  <p className="text-[9px] font-sans font-bold uppercase tracking-[0.4em] text-accent mb-4">The Private Gallery</p>
                  <a href="tel:+919866755272" className="text-xl font-serif text-foreground block">+91 98667 55272</a>
                  <a href="tel:+917995669012" className="text-xl font-serif text-foreground block mt-2">+91 79956 69012</a>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
