import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Globe, Cpu, Zap, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SystemConfig = () => {
  return (
    <div className="space-y-12">
      <div className="max-w-3xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-[1px] bg-accent" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">System Configuration</span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-medium text-foreground leading-none tracking-tighter">
          System <span className="italic text-foreground/60 text-5xl md:text-6xl lg:text-7xl">Settings.</span>
        </h2>
        <p className="mt-10 text-[10px] sm:text-xs text-foreground/60 uppercase tracking-[0.3em] font-sans font-black leading-loose">
          Configure site-wide parameters and platform settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-foreground/5 p-12 space-y-10 shadow-2xl"
        >
          <div className="flex items-center gap-4 border-b border-foreground/5 pb-8 mb-8">
             <Cpu className="w-5 h-5 text-accent" />
             <h3 className="text-xs font-black uppercase tracking-[0.4em] text-foreground">Core Platform</h3>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/60">Site Name</Label>
              <Input className="bg-foreground/5 border-foreground/10 rounded-none h-14 font-bold text-foreground" defaultValue="MH MARBLE" />
            </div>
            <div className="space-y-3">
              <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/60">Site Tagline</Label>
              <Input className="bg-foreground/5 border-foreground/10 rounded-none h-14 font-bold text-foreground" defaultValue="QUALITY TILE FOR STYLISH LIVING" />
            </div>
            <div className="space-y-3">
              <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/60">Business Address</Label>
              <Input className="bg-foreground/5 border-foreground/10 rounded-none h-14 font-bold text-foreground" defaultValue="MH Marble, PLOT No : 5/A, DOMMARA POCHAMPALLY, SARA GUDEM CHOWRASTA MAIN ROAD, Hyderabad, Telangana 500043" />
            </div>
          </div>
          
          <Button className="w-full h-16 bg-accent text-black hover:bg-white rounded-none font-black uppercase tracking-[0.4em] text-[10px] transition-all duration-700 shadow-[0_0_30px_rgba(229,142,88,0.2)]">
             Save Changes
          </Button>
        </motion.div>

        <div className="space-y-6">
           <div className="bg-card border border-foreground/5 p-10 flex items-center justify-between group cursor-pointer hover:border-accent/30 transition-all duration-700 shadow-xl">
              <div className="flex items-center gap-6">
                 <Shield className="w-6 h-6 text-foreground/20 group-hover:text-accent transition-colors" />
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground">Platform Security</h4>
                    <p className="text-[8px] text-foreground/60 font-black uppercase tracking-[0.2em] mt-1">SSL and Protocol Encryption Active</p>
                  </div>
              </div>
              <Zap className="w-4 h-4 text-accent animate-pulse" />
           </div>
           
           <div className="bg-card border border-foreground/5 p-10 flex items-center justify-between group cursor-pointer hover:border-accent/30 transition-all duration-700 shadow-xl">
              <div className="flex items-center gap-6">
                 <Cloud className="w-6 h-6 text-foreground/20 group-hover:text-accent transition-colors" />
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground">Asset Management</h4>
                    <p className="text-[8px] text-foreground/60 font-black uppercase tracking-[0.2em] mt-1">CDN Synchronization Active</p>
                  </div>
              </div>
              <Globe className="w-4 h-4 text-foreground/10" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default SystemConfig;
