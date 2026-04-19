import { Phone, Navigation } from 'lucide-react';

export function MobileSticky() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/90 backdrop-blur-2xl border-t border-foreground/5 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
      <div className="flex gap-4">
        <a
          href="tel:+919866755272"
          className="flex-1 flex items-center justify-center gap-3 bg-foreground/5 border border-foreground/10 text-foreground/50 py-4 rounded-none font-bold uppercase text-[8px] tracking-[0.4em] backdrop-blur-md transition-all active:scale-95 shadow-2xl hover:text-foreground"
        >
          <Phone className="w-3 h-3 text-[#C8A96E]/40" />
          Call
        </a>
        <a
          href="https://www.google.com/maps/dir/?api=1&destination=17.4947,78.4177"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-3 bg-[#C8A96E] text-background py-4 rounded-none font-black uppercase text-[8px] tracking-[0.4em] transition-all active:scale-95 shadow-gold"
        >
          <Navigation className="w-3 h-3" />
          Directions
        </a>
      </div>
    </div>
  );
}

export default MobileSticky;
