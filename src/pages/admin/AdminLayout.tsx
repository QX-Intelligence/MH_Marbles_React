import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  Tag, 
  Video, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  Bell,
  Search,
  Droplets,
  Building2,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useGallery } from '@/contexts/GalleryContext';
import { cn } from '@/lib/utils';

const AdminLayout = () => {
  const { userInfo: user, logout } = useAuth();
  const { messages } = useGallery();
  const location = useLocation();
  const navigate = useNavigate();
  const unreadCount = messages.filter(m => !m.is_read).length;

  const navigation = [
    { name: 'Spotlight', href: '/admin/featured', icon: Star },
    { name: 'Products', href: '/admin/products', icon: Layers },
    { name: 'Categories', href: '/admin/categories', icon: LayoutDashboard },
    { name: 'Companies', href: '/admin/brands', icon: Building2 },
    { name: 'Sanitary', href: '/admin/sanitary', icon: Droplets },
    { name: 'Media', href: '/admin/media', icon: Video },
    { name: 'Journal', href: '/admin/journal', icon: FileText },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare, badge: unreadCount },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent/30 flex">
      {/* Cinematic Sidebar - Fixed Pattern */}
      <aside className="fixed left-0 top-0 w-80 border-r border-foreground/5 bg-card flex flex-col h-screen overflow-hidden shrink-0 z-50">
        {/* Brand Identity */}
        <div className="p-6 border-b border-foreground/5 group bg-gradient-to-b from-foreground/5 to-transparent">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src="/Logo1.png"
                alt="MH Marble Logo"
                className="w-16 h-16 object-contain"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xl font-black text-foreground tracking-[0.25em] leading-none mb-1">
                MH<span className="text-accent"> MARBLE</span>
              </span>
              <span className="text-[7px] font-bold text-foreground/40 tracking-[0.4em] uppercase whitespace-nowrap">
                Architectural Excellence
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Registry */}
        <nav className="flex-1 px-6 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center justify-between px-6 py-4 transition-all duration-500 rounded-none relative overflow-hidden",
                  isActive 
                    ? "text-foreground bg-foreground/[0.03] border-l-2 border-accent" 
                    : "text-foreground/40 hover:text-foreground hover:bg-foreground/[0.02]"
                )}
              >
                <div className="flex items-center gap-5 z-10">
                  <item.icon className={cn(
                    "w-5 h-5 transition-colors duration-500",
                    isActive ? "text-accent" : "text-foreground/20 group-hover:text-foreground/40"
                  )} />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase">{item.name}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-accent text-background text-[9px] font-black px-2 py-0.5 rounded-none z-10">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Curator Profile */}
        <div className="p-8 border-t border-foreground/5 bg-background/40 backdrop-blur-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative group">
               {user?.picture ? (
                 <img src={user.picture} alt="" className="w-12 h-12 rounded-none border border-foreground/10 group-hover:border-accent transition-colors grayscale" />
               ) : (
                 <div className="w-12 h-12 bg-foreground/5 text-foreground/40 flex items-center justify-center text-xs font-bold border border-foreground/10 group-hover:border-accent transition-all">
                   {user?.name?.[0] || 'C'}
                 </div>
               )}
               <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent border-2 border-background flex items-center justify-center">
                 <ShieldCheck className="w-2.5 h-2.5 text-background" />
               </div>
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-foreground uppercase tracking-wider truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[9px] text-foreground/30 truncate uppercase tracking-widest">{user?.email || 'System Management'}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 py-4 text-[9px] font-black uppercase tracking-[0.4em] border border-foreground/5 hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400 transition-all duration-500 group"
          >
            <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Exit Admin Session
          </button>
        </div>
      </aside>

      {/* Primary Workspace - Natural Scroll Pattern */}
      <main className="flex-1 ml-80 flex flex-col bg-background relative min-h-screen">
        {/* Architectural Canvas - Clean & High-Contrast */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,169,110,0.05),transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-50" />

        {/* Workspace Utility Bar */}
        <header className="h-20 border-b border-foreground/5 px-10 flex items-center justify-between bg-card/60 backdrop-blur-xl relative z-10 shadow-[0_1px_5px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-4 text-foreground/50 group cursor-pointer hover:text-foreground transition-colors duration-500">
               <Search className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] font-sans">Command Center</span>
             </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-accent uppercase tracking-[0.3em]">Vault Status</span>
                <span className="text-[8px] text-foreground/60 uppercase tracking-[0.2em] font-bold">Operational · Secure</span>
              </div>
              <div className="w-2 h-2 bg-accent shadow-[0_0_15px_rgba(200,169,110,0.8)]" />
            </div>
            <div className="w-px h-8 bg-foreground/10" />
            <div 
              onClick={() => navigate('/admin/messages')}
              className="relative cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Bell className="w-5 h-5 text-foreground/60" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 border border-card" />
              )}
            </div>
          </div>
        </header>

        {/* Main Canvas Area */}
        <div className="flex-1 p-12 lg:p-20 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
