import { Link } from 'react-router-dom';

const footerLinks = {
  collection: [
    // { label: 'Italian Marble', href: '/collection' },
    { label: 'Exotic Granite', href: '/collection' },
    { label: 'Antique Texture', href: '/collection' },
    { label: 'Signature Series', href: '/collection' },
  ],
  heritage: [
    // { label: 'Our Story', href: '/heritage' },
    { label: 'The Blog', href: '/journal' },
    // { label: 'Showroom', href: '/showroom' },
    { label: 'Contact Us', href: '/contact' },
  ],
};

const socials = [
  { name: 'Instagram', href: 'https://www.instagram.com/m.h.marble?igsh=MTc2Z295YTFjMW5hZQ==' },
  { name: 'Youtube', href: 'https://youtube.com/@mhmarble786?si=p2WYLGiZEyGfqBuL' },
];

export function Footer() {

  return (
    <footer className="bg-background text-foreground border-t border-border py-16 md:py-24 lg:py-32 px-6 md:px-[8%] transition-colors duration-500">
      <div className="w-full max-w-none">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 lg:gap-24">
          {/* Brand Signature - Matches Header */}
          <div className="lg:col-span-2 space-y-8 md:space-y-12">
            <Link to="/" className="flex items-center gap-6 group">
              <img 
                src="/Logo1.png" 
                alt="MH Marbles" 
                className="h-14 md:h-16 w-auto object-contain transition-all duration-700 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl lg:text-3xl font-serif tracking-[0.4em] text-foreground uppercase leading-tight group-hover:text-accent transition-colors duration-500">
                  MH MARBLE

                </span>
                <span className="text-[10px] font-sans font-black tracking-[0.8em] uppercase text-accent mt-1 ml-0.5">
                  Quality Tiles For Stylish Living
                </span>
              </div>
            </Link>

            <p className="text-base md:text-xl font-sans font-light text-foreground/30 leading-relaxed italic max-w-sm">
              Curating the earth&apos;s most exquisite architectural statements
              for the discerning visionary since 2005.
            </p>

            <div className="space-y-6 pt-4 text-foreground/80">
              <a href="tel:+919866755272" className="text-[10px] font-sans font-bold tracking-[0.5em] hover:text-accent transition-all duration-500 block uppercase">
                <span className="w-8 h-[1px] bg-accent/30 inline-block mr-4 align-middle" />
                +91 98667 55272 / 79956 69012
              </a>
              <a href="mailto:info@mhmarble.com" className="text-[10px] font-sans font-bold tracking-[0.5em] hover:text-accent transition-all duration-500 block uppercase">
                <span className="w-8 h-[1px] bg-accent/30 inline-block mr-4 align-middle" />
                INFO@MHMARBLE.COM
              </a>
            </div>
          </div>

          {/* Nav groups */}
          <div className="space-y-10">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-accent">The Collection</h4>
            <ul className="space-y-6">
              {footerLinks.collection.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm font-light text-foreground/50 hover:text-foreground transition-colors italic tracking-widest">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-10">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-accent">The Heritage</h4>
            <ul className="space-y-6">
              {footerLinks.heritage.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm font-light text-foreground/50 hover:text-foreground transition-colors italic tracking-widest">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Signature */}
        <div className="mt-12 md:mt-20 lg:mt-32 pt-8 md:pt-16 border-t border-foreground/5 flex flex-col items-center gap-6 md:gap-12 md:flex-row md:justify-between">
          <div className="flex items-center gap-12 opacity-20 grayscale">
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase">Hyderabad</span>
          </div>

          <p className="text-[9px] font-bold text-foreground/20 uppercase tracking-[0.6em]">
            © {new Date().getFullYear()} MH MARBLE. CRAFTED FOR ETERNITY.
          </p>

          <div className="flex gap-10 opacity-30">
            <Link to="/admin" className="text-[10px] font-bold tracking-[0.3em] uppercase hover:text-accent transition-colors">Admin Portal</Link>
            {socials.map(social => (
              <a 
                key={social.name} 
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[10px] font-bold tracking-[0.3em] uppercase hover:text-accent transition-colors"
              >
                {social.name}
              </a>
            ))}

          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
