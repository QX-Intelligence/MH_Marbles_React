import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ChevronLeft, ChevronRight, ShieldCheck, Globe } from 'lucide-react';

interface LocationState {
  from?: { pathname: string };
}

const CAROUSEL_SLIDES = [
  {
    image: '/calacatta-gold.png',
    name: 'Calacatta Gold',
    tagline: 'Elevate Your Sanctuary.',
    description: 'Italian marble of unparalleled brilliance — curated for visionary interiors.',
    fallback: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
  },
  {
    image: '/carrara_luxury_texture_1769248332961.png',
    name: 'Statuario White',
    tagline: "Nature's Purest Canvas.",
    description: 'Rare Carrara stone — a billion-year narrative of mineral crystallization.',
    fallback: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1600&q=85',
  },
  {
    image: '/travertine_roman_texture_1769248381252.png',
    name: 'Emperador Dark',
    tagline: 'Timeless Earth Narratives.',
    description: 'Rich, earthy veining that transforms every surface into a statement.',
    fallback: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=85',
  },
  {
    image: '/onyx_translucent_texture_dark_1769248364215.png',
    name: 'Black Galaxy Granite',
    tagline: 'Celestial Stone Mastery.',
    description: 'Deep-space granite with luminous crystal inclusions. Extraordinary by nature.',
    fallback: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=85',
  },
  {
    image: '/nero-marquina.png',
    name: 'Nero Marquina',
    tagline: 'The Spirit of Sophistication.',
    description: 'Dramatic Spanish marble — bold contrast, timeless sophistication.',
    fallback: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85',
  },
];

const Verification = () => {
  const { login, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const [authStage, setAuthStage] = useState<'idle' | 'verifying'>('idle');
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (isLoggedIn && !loading) {
      const origin = state?.from?.pathname || '/admin';
      navigate(origin, { replace: true });
    }
  }, [isLoggedIn, loading, navigate, state]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goTo = useCallback((idx: number) => {
    setCurrent((idx + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  }, []);

  const handleLoginSuccess = async (credentialResponse: { credential?: string }) => {
    setAuthStage('verifying');
    try {
      await login(credentialResponse.credential!);
    } catch (error) {
      setAuthStage('idle');
      console.error('Login Failed', error);
    }
  };

  const slide = CAROUSEL_SLIDES[current];

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans bg-background">

      {/* ─── FULLSCREEN KEN BURNS CAROUSEL ────────────────── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <motion.img
            src={slide.image}
            alt={slide.name}
            initial={{ scale: 1 }}
            animate={{ scale: 1.15 }}
            transition={{ duration: 10, ease: 'linear' }}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = slide.fallback;
            }}
          />
          {/* Layered Overlays: heavier vignette on right side for the card */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0c0b]/90 via-[#0d0c0b]/40 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(229,142,88,0.05),transparent_70%)]" />
          <div className="absolute inset-0 bg-gradient-sepia opacity-60 mix-blend-multiply" />
        </motion.div>
      </AnimatePresence>

      {/* ─── SCANLINE / GRID OVERLAY (qi-frontend style) ─── */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* BRAND BADGE (top-left) */}
      <div className="absolute top-10 left-12 z-50 flex flex-col items-center group">
        <img 
          src="/Logo1.png" 
          alt="MH Marbles" 
          className="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-700"
        />
        <div className="mt-2 text-center">
          <span className="text-white font-black text-[9px] tracking-[0.6em] uppercase block opacity-40">Visionary Portal</span>
        </div>
      </div>

      {/* ─── CAROUSEL CAPTION (bottom-left) ──────────────── */}
      <div className="absolute bottom-12 left-12 z-20 max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={`caption-${current}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-accent/80 mb-4 block">
              Specimen: {slide.name}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-white leading-tight tracking-tighter mb-5">
              {slide.tagline.split(' ').map((word, i) => i === 1 ? <span key={i} className="italic text-accent/60">{word} </span> : word + ' ')}
            </h2>
            <p className="text-xs text-foreground/40 font-sans font-medium uppercase tracking-[0.2em] max-w-sm leading-loose">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dot + Controls */}
        <div className="mt-12 flex items-center gap-8">
          <div className="flex items-center gap-3">
            {CAROUSEL_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`transition-all duration-700 rounded-full h-[3px] ${
                  idx === current ? 'w-10 bg-accent' : 'w-3 bg-foreground/20 hover:bg-foreground/40'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => goTo(current - 1)} className="p-2 border border-foreground/10 text-foreground/50 hover:bg-foreground/10 transition-all"><ChevronLeft size={16} /></button>
             <button onClick={() => goTo(current + 1)} className="p-2 border border-foreground/10 text-foreground/50 hover:bg-foreground/10 transition-all"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* ─── THE MONOLITH: DARK GLASS CARD (right-center) ── */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 flex items-center justify-center lg:justify-end lg:pr-24 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-[400px] sm:w-[480px] glass-sepia rounded-[40px] p-12 overflow-hidden shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8)]"
        >
          {/* Enhanced glow effects matching the provided image */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-accent/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#4a382f]/40 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
          
          <div className="relative z-10 text-center">
             <div className="mb-14">
               <h1 className="text-5xl font-serif font-bold text-white tracking-tighter mb-4 italic">
                 Welcome <span className="text-accent/40 not-italic font-light">Back.</span>
               </h1>
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-accent/50">
                  Secured Architectural Terminal
               </p>
             </div>

            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-foreground/10" />
                <span className="text-[9px] font-bold text-foreground/20 uppercase tracking-[0.3em]">SECURE PORTAL</span>
                <div className="h-px flex-1 bg-foreground/10" />
              </div>

              <div className="flex justify-center py-4 scale-110">
                <AnimatePresence mode="wait">
                  {authStage === 'verifying' ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <Loader2 className="w-8 h-8 text-accent animate-spin" />
                      <span className="text-[9px] font-black uppercase tracking-[0.5em] text-accent">Validating Access…</span>
                    </motion.div>
                  ) : (
                    <motion.div key="google">
                      <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={() => console.error('Login Failed')}
                        useOneTap
                        theme="filled_black"
                        shape="pill"
                        size="large"
                        width="320"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col gap-4 items-center">
                <div className="flex items-center gap-3 text-foreground/30 group">
                   <ShieldCheck className="w-4 h-4 group-hover:text-accent transition-colors" />
                   <span className="text-[9px] font-bold uppercase tracking-widest">End-to-End Encrypted Session</span>
                </div>
                <div className="flex items-center gap-3 text-foreground/30 group">
                   <Globe className="w-4 h-4 group-hover:text-accent transition-colors" />
                   <span className="text-[9px] font-bold uppercase tracking-widest">Google OAuth Verifier Active</span>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-foreground/5">
              <p className="text-[9px] text-foreground/20 font-black uppercase tracking-[0.5em]">
                MH MARBLE &copy; {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Verification;
