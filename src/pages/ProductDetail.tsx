import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { mainCategories } from "@/data/categories";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { useRecommendation } from "@/contexts/RecommendationContext";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useCartFly } from "@/hooks/useCartFly";

import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import ProductRecommendations from "@/components/ProductRecommendations";

import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductAddToCart from "@/components/product/ProductAddToCart";
import ProductTabs, { type Review } from "@/components/product/ProductTabs";
import LoginRequiredModal from "@/components/product/LoginRequiredModal";

const sampleReviews: Review[] = [
  { id: 1, name: "Ayşe K.", rating: 5, date: "15 Şubat 2026", comment: "Ürün fotoğraftaki gibi çok şık ve kaliteli. Annem için aldım çok beğendi. Kargo da hızlı geldi, teşekkürler!", helpful: 12, verified: true },
  { id: 2, name: "Selin M.", rating: 4, date: "8 Şubat 2026", comment: "Gerçekten güzel bir ürün. Kutusu da oldukça şık, hediye olarak mükemmel.", helpful: 7, verified: true },
  { id: 3, name: "Fatma D.", rating: 5, date: "1 Şubat 2026", comment: "Düğün hediyesi olarak aldım, çok beğenildi. Kalitesi gerçekten çok iyi, fiyatına göre değer.", helpful: 19, verified: true },
];

const ProductDetail = () => {
  const allProducts = useProducts();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = allProducts.find(p => p.id === (id || ""));

  const { addToCart } = useCart();
  const { flyToCart } = useCartFly();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast, showCartModal, spawnHearts } = useToast();
  const { isLoggedIn, user } = useAuth();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { trackFavorite, trackCart } = useRecommendation();
  const recs = useRecommendations(product || undefined, 8);

  const [quantity, setQuantity] = useState(1);
  const [btnState, setBtnState] = useState<"idle" | "adding" | "added">("idle");
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [helpfulClicked, setHelpfulClicked] = useState<number[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (product) addToRecentlyViewed(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background header-offset" style={{ paddingTop: 96 }}>
        <AnnouncementBar /><Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-3xl text-foreground mb-4">Ürün Bulunamadı</h1>
          <Link to="/" className="font-body text-sm text-accent hover:underline">Anasayfaya Dön</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const galleryImages = [product.image, ...(product.images?.slice(1) || [])].filter(Boolean) as string[];
  const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 4);
  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  const handleAddToCart = () => {
    if (btnState !== "idle") return;
    setBtnState("adding");
    addToCart(product, quantity);
    trackCart(product.id);
    // Ürün görseli pozisyonundan sepete uçuş
    const imgEl = document.querySelector("[data-product-main-image]") as HTMLElement | null;
    if (imgEl) {
      const r = imgEl.getBoundingClientRect();
      flyToCart(product.image, r.left + r.width / 2, r.top + r.height / 2);
    }
    setTimeout(() => setBtnState("added"), 400);
    setTimeout(() => {
      setBtnState("idle");
      setQuantity(1);
      showCartModal(product.name, product.image);
    }, 1800);
  };

  const handleBuyNow = () => { addToCart(product, quantity); navigate("/odeme"); };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const wasFav = isFavorite(product.id);
    toggleFavorite(product);
    trackFavorite(product.id, !wasFav);
    if (!wasFav) spawnHearts(e.clientX, e.clientY);
  };

  const handleHelpful = (reviewId: number) => {
    if (!helpfulClicked.includes(reviewId)) {
      setHelpfulClicked([...helpfulClicked, reviewId]);
      setReviews(reviews.map(r => r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r));
    }
  };

  const handleReviewSubmit = (rating: number, comment: string) => {
    if (!user) return;
    const newReview: Review = {
      id: reviews.length + 1, name: user.name, rating,
      date: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
      comment, helpful: 0, verified: false,
    };
    setReviews([newReview, ...reviews]);
    showToast("Yorumunuz eklendi, teşekkürler!", "success");
  };

  const buildBreadcrumb = () => {
    if (!product.categorySlug) return [{ label: product.category, href: `/kategori/${product.categorySlug || "hepsi"}` }];
    const parts = product.categorySlug.split("/");
    if (parts.length >= 2) {
      const parentSlug = parts[0];
      const parentCat = mainCategories.find(c => c.slug === parentSlug);
      const subCat = parentCat?.subcategories.find(s => s.slug === product.categorySlug);
      return [
        parentCat ? { label: parentCat.label, href: `/kategori/${parentSlug}` } : { label: parentSlug, href: `/kategori/${parentSlug}` },
        subCat ? { label: subCat.label, href: `/kategori/${product.categorySlug}` } : { label: product.category, href: `/kategori/${product.categorySlug}` },
      ];
    }
    const cat = mainCategories.find(c => c.slug === product.categorySlug);
    return [{ label: cat?.label || product.category, href: `/kategori/${product.categorySlug}` }];
  };

  return (
    <div className="min-h-screen bg-background header-offset" style={{ paddingTop: 96 }}>
      <SEO
        title={product.seoTitle || `${product.name} – ${product.category} | Takimax`}
        description={product.seoDescription || `${product.description} ₺${product.price.toLocaleString("tr-TR")} fiyatıyla Takimax'te.`}
        canonical={`/urun/${product.id}`}
        ogImage={product.image}
        ogType="product"
        schema={{
          "@context": "https://schema.org", "@type": "Product",
          "name": product.name, "image": product.images || [product.image],
          "description": product.seoDescription || product.description,
          "sku": product.id, "material": product.material,
          "brand": { "@type": "Brand", "name": "Takimax" },
          "offers": { "@type": "Offer", "url": `https://takimax.com/urun/${product.id}`, "priceCurrency": "TRY", "price": product.price, "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", "seller": { "@type": "Organization", "name": "Takimax" } },
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": (Math.min(5, Math.max(3.5, 5 - product.reviews * 0.005))).toFixed(1), "reviewCount": product.reviews },
        }}
      />
      <AnnouncementBar />
      <Header />

      <div className="container mx-auto px-4">
        <Breadcrumb items={[...buildBreadcrumb(), { label: product.name }]} py={12} />
      </div>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <ProductImageGallery
            images={galleryImages}
            productName={product.name}
            discount={product.discount}
            isFavorite={isFavorite(product.id)}
            onToggleFavorite={handleToggleFavorite}
            isMobile={isMobile}
          />
          <ProductAddToCart
            product={product}
            quantity={quantity}
            btnState={btnState}
            avgRating={avgRating}
            reviewCount={reviews.length}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onScrollToReviews={() => document.getElementById("product-tabs")?.scrollIntoView({ behavior: "smooth" })}
            onScrollToPayment={() => document.getElementById("product-tabs")?.scrollIntoView({ behavior: "smooth" })}
          />
        </div>
      </section>

      <ProductTabs
        product={product}
        reviews={reviews}
        isLoggedIn={isLoggedIn}
        user={user}
        onNavigateLogin={() => navigate("/giris", { state: { from: window.location.pathname } })}
        onNavigateRegister={() => navigate("/kayit")}
        onReviewSubmit={handleReviewSubmit}
        onHelpful={handleHelpful}
        helpfulClicked={helpfulClicked}
      />

      <section className="bg-secondary py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-2xl lg:text-4xl font-semibold text-center text-foreground mb-8">Bunları da Beğenebilirsiniz</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {relatedProducts.map(p => (
              <Link key={p.id} to={`/urun/${p.id}`} className="product-card group bg-card overflow-hidden border border-border hover:shadow-lg transition-shadow">
                <div className="relative aspect-square overflow-hidden">
                  <img src={p.image} alt={p.name} className="product-card-img w-full h-full object-cover" />
                  {p.discount && p.discount > 0 && <span style={{ position: "absolute", top: 10, left: 10, background: "#e53e3e", color: "#fff", fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 4 }}>%{p.discount}</span>}
                </div>
                <div className="p-3 lg:p-4">
                  <h3 className="font-body text-xs lg:text-sm font-medium text-foreground line-clamp-2 mb-2 min-h-[2.5rem]">{p.name}</h3>
                  <div className="flex items-center gap-2">
                    {p.oldPrice && <span className="font-body text-xs text-muted-foreground line-through">₺{p.oldPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>}
                    <span className="font-body text-sm font-semibold text-foreground">₺{p.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ProductRecommendations title="Benzer Ürünler" subtitle="Kategori ve malzeme bazlı eşleşme" products={recs.similar} />
      {recs.hasPersonalData && <ProductRecommendations title="Sizin İçin Öneriler" subtitle="Gezinme geçmişinize göre seçildi" products={recs.personal} />}
      {recs.crossSell.length > 0 && <ProductRecommendations title="Bununla Harika Görünür" subtitle="Sıkça birlikte tercih edilen ürünler" products={recs.crossSell} />}
      {recs.fromFavorites.length > 0 && <ProductRecommendations title="Favorilerinizden İlham" subtitle="Beğendiğiniz ürünlerle aynı kategoriden" products={recs.fromFavorites} />}
      <ProductRecommendations title="Son Görüntüledikleriniz" products={recs.recentlyViewed} />

      <Footer />

      {showLoginModal && (
        <LoginRequiredModal
          onClose={() => setShowLoginModal(false)}
          onLogin={() => { setShowLoginModal(false); navigate("/giris", { state: { from: window.location.pathname } }); }}
          onRegister={() => { setShowLoginModal(false); navigate("/kayit"); }}
        />
      )}
    </div>
  );
};

export default ProductDetail;