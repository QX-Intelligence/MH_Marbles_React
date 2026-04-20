import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { GalleryProvider } from "@/contexts/GalleryContext";

import Index from "./pages/Index";
import Collection from "./pages/Collection";
import Companies from "./pages/Companies";
import Showroom from "./pages/Showroom";
import Heritage from "./pages/Heritage";
import Blog from "./pages/Journal";
import Contact from "./pages/Contact";
import OurProcess from "./pages/OurProcess";
import Sanitary from "./pages/Sanitary";
import Test from "./pages/Test";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import AdminRoute from "./components/admin/AdminRoute";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ScrollProgress from "./components/ScrollProgress";

import AdminLayout from "./pages/admin/AdminLayout";
import ProductManager from "./pages/admin/ProductManager";
import CategoryManager from "./pages/admin/CategoryManager";
import BrandManager from "./pages/admin/BrandManager";
import MediaManager from "./pages/admin/MediaManager";
import FeaturedManager from "./pages/admin/FeaturedManager";
import SanitaryManager from "./pages/admin/SanitaryManager";
import JournalManager from "./pages/admin/JournalManager";
import MessageManager from "./pages/admin/MessageManager";
import SystemConfig from "./pages/admin/SystemConfig";
import Verification from "./pages/admin/Verification";

const queryClient = new QueryClient();
const GOOGLE_CLIENT_ID = "919556158056-2cifco8f1p5ssf6nkkmqclgeojp1iueb.apps.googleusercontent.com";

const App = () => {
  console.log("App Rendering - Current Path:", window.location.pathname);
  return (
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>

      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <GalleryProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollProgress />
                <ScrollToTop />
                <ScrollToTopButton />
                <Routes>
                  {/* Public Frontend */}
                  <Route path="/" element={<Index />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/collection" element={<Collection />} />
                  <Route path="/companies" element={<Companies />} />
                  <Route path="/heritage" element={<Heritage />} />
                  <Route path="/showroom" element={<Showroom />} />
                  <Route path="/process" element={<OurProcess />} />
                  <Route path="/journal" element={<Blog />} />
                  <Route path="/sanitary" element={<Sanitary />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/test" element={<Test />} />
                  
                  {/* Admin Access */}
                  <Route path="/admin/login" element={<Verification />} />
                  <Route 
                    path="/admin" 
                    element={
                      <AdminRoute>
                        <AdminLayout />
                      </AdminRoute>
                    }
                  >
                    <Route index element={<Navigate to="/admin/products" replace />} />
                    <Route path="products" element={<ProductManager />} />
                    <Route path="categories" element={<CategoryManager />} />
                    <Route path="brands" element={<BrandManager />} />
                    <Route path="sanitary" element={<SanitaryManager />} />
                    <Route path="media" element={<MediaManager />} />
                    <Route path="featured" element={<FeaturedManager />} />
                    <Route path="journal" element={<JournalManager />} />
                    <Route path="messages" element={<MessageManager />} />
                    <Route path="settings" element={<SystemConfig />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </GalleryProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  </HelmetProvider>
  );
};

export default App;
