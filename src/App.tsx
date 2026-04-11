import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext";
import { RecommendationProvider } from "@/contexts/RecommendationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import ToastBridge from "@/components/ToastBridge";
import CookieBanner from "@/components/CookieBanner";
import WhatsAppButton from "@/components/WhatsAppButton";

// Ana sayfa kritik — direkt import
import Index from "./pages/Index";

// Diğer sayfalar lazy — ihtiyaç duyulduğunda yüklensin
const Cart            = lazy(() => import("./pages/Cart"));
const ProductDetail  = lazy(() => import("./pages/ProductDetail"));
const Login          = lazy(() => import("./pages/Login"));
const Register       = lazy(() => import("./pages/Register"));
const NotFound       = lazy(() => import("./pages/NotFound"));
const About          = lazy(() => import("./pages/About"));
const Contact        = lazy(() => import("./pages/Contact"));
const FAQ            = lazy(() => import("./pages/FAQ"));
const Returns        = lazy(() => import("./pages/Returns"));
const Privacy        = lazy(() => import("./pages/Privacy"));
const Agreements     = lazy(() => import("./pages/Agreements"));
const OrderTracking  = lazy(() => import("./pages/OrderTracking"));
const Account        = lazy(() => import("./pages/Account"));
const Checkout       = lazy(() => import("./pages/Checkout"));
const Category       = lazy(() => import("./pages/Category"));
const Search         = lazy(() => import("./pages/Search"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime:    10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <ToastProvider>
              <RecentlyViewedProvider>
                <RecommendationProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ScrollToTop />
                  <ToastBridge />
                  <ScrollToTopButton />
                  <CookieBanner />
                  <WhatsAppButton />
                  <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/sepet" element={<Cart />} />
                      <Route path="/urun/:id" element={<ProductDetail />} />
                      <Route path="/giris" element={<Login />} />
                      <Route path="/kayit" element={<Register />} />
                      <Route path="/hakkimizda" element={<About />} />
                      <Route path="/iletisim" element={<Contact />} />
                      <Route path="/sikca-sorulan-sorular" element={<FAQ />} />
                      <Route path="/iade-ve-degisim" element={<Returns />} />
                      <Route path="/gizlilik-politikasi" element={<Privacy />} />
                      <Route path="/sozlesmeler" element={<Agreements />} />
                      <Route path="/siparis-takibi" element={<OrderTracking />} />
                      <Route path="/hesabim" element={<Account />} />
                      <Route path="/odeme" element={<Checkout />} />
                      <Route path="/kategori/:slug" element={<Category />} />
                      <Route path="/kategori/:parent/:sub" element={<Category />} />
                      <Route path="/arama" element={<Search />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
                </RecommendationProvider>
              </RecentlyViewedProvider>
            </ToastProvider>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;