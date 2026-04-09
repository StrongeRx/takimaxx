import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/data/products";
import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, Search as SearchIcon, X, TrendingUp } from "lucide-react";
import SEO from "@/components/SEO";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useToast } from "@/contexts/ToastContext";
import { useCartFly } from "@/hooks/useCartFly";
import AddToCartRow from "@/components/AddToCartRow";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import { mainCategories } from "@/data/categories";

const POPULAR_SEARCHES = ["Gümüş Kolye", "Altın Küpe", "Bileklik Set", "Yüzük", "Hediye Seti", "925 Gümüş"];

const Stars = ({ count }: { count: number }) => {
  const r = Math.min(5, Math.max(3.5, 5 - count * 0.005));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={9} style={{ color: i <= Math.floor(r) ? "#c9a96e" : "#ddd", fill: i <= Math.floor(r) ? "#c9a96e" : "none" }} />
      ))}
      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, color: "#aaa", marginLeft: 3 }}>({count})</span>
    </div>
  );
};

/* ── Ürün kartı ── */
const ProductCard = ({ product, onFav, onCart, isFav, isHovered, onHover, onLeave }: {
  product: Product; isFav: boolean; isHovered: boolean;
  onFav: (e: React.MouseEvent) => void; onCart: (e: React.MouseEvent, p: Product, qty: number) => void;
  onHover: () => void; onLeave: () => void;
}) => (
  <div
    onMouseEnter={onHover} onMouseLeave={onLeave}
    style={{ background: "#fff", border: "1px solid #ece9e4", borderRadius: 8, overflow: "hidden", transition: "box-shadow 0.3s, transform 0.3s", boxShadow: isHovered ? "0 12px 40px rgba(0,0,0,0.1)" : "0 2px 8px rgba(0,0,0,0.04)", transform: isHovered ? "translateY(-4px)" : "translateY(0)" }}
  >
    <Link to={`/urun/${product.id}`} style={{ display: "block", position: "relative", aspectRatio: "1/1", overflow: "hidden" }}>
      <img src={product.image} alt={product.name} loading="lazy"
        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease", transform: isHovered ? "scale(1.07)" : "scale(1)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 50%)", opacity: isHovered ? 1 : 0, transition: "opacity 0.3s" }} />
      {product.discount && product.discount > 0 && (
        <span style={{ position: "absolute", top: 10, left: 10, background: "#e53e3e", color: "#fff", fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 800, padding: "3px 7px", borderRadius: 3 }}>-%{product.discount}</span>
      )}
      <button onClick={onFav} aria-label="Favorilere ekle"
        style={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: "50%", background: isFav ? "#c9a96e" : "rgba(255,255,255,0.92)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
        <Heart size={14} style={{ color: isFav ? "#fff" : "#555", fill: isFav ? "#fff" : "none" }} />
      </button>
    </Link>
    <Link to={`/urun/${product.id}`} style={{ display: "block", padding: "14px 16px 4px", textDecoration: "none" }}>
      <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 500, color: "#111", lineHeight: 1.45, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: 35 }}>
        {product.name}
      </h3>
      <Stars count={product.reviews} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 19, fontWeight: 600, color: "#111" }}>
          ₺{product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
        </span>
        {product.oldPrice && (
          <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#bbb", textDecoration: "line-through" }}>
            ₺{product.oldPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
          </span>
        )}
      </div>
    </Link>
    {product.stock > 0 && (
      <div style={{ padding: "0 16px 16px" }}>
        <AddToCartRow product={product} onAddToCart={onCart} />
      </div>
    )}
  </div>
);

/* ── Boş / Sorgu yok ekranı ── */
const EmptyState = ({ query, allProducts, onCart, onFav, isFavorite, hoveredId, setHoveredId }: {
  query: string; allProducts: Product[];
  onCart: (e: React.MouseEvent, p: Product, qty: number) => void;
  onFav: (e: React.MouseEvent, p: Product) => void;
  isFavorite: (id: string) => boolean;
  hoveredId: string | null; setHoveredId: (id: string | null) => void;
}) => {
  const topProducts = useMemo(() =>
    [...allProducts].sort((a, b) => b.reviews - a.reviews).slice(0, 4),
    [allProducts]
  );

  const heading = query
    ? `"${query}" için sonuç bulunamadı`
    : "Ne aramak istersiniz?";

  const sub = query
    ? "Yazım hatası olabilir veya farklı kelimeler deneyebilirsiniz."
    : "Milyonlarca müşterimizin favorisi takı ve aksesuarları keşfedin.";

  return (
    <div>
      {/* Üst mesaj */}
      <div style={{ textAlign: "center", padding: "56px 0 40px" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f5f2ee", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          {query ? <X size={28} style={{ color: "#c9a96e" }} /> : <SearchIcon size={28} style={{ color: "#c9a96e" }} />}
        </div>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 600, color: "#111", margin: "0 0 8px" }}>
          {heading}
        </h2>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#888", margin: 0 }}>{sub}</p>
      </div>

      {/* Popüler aramalar */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <TrendingUp size={14} style={{ color: "#c9a96e" }} />
          <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa" }}>
            Popüler Aramalar
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {POPULAR_SEARCHES.map(s => (
            <Link key={s} to={`/arama?q=${encodeURIComponent(s)}`}
              style={{ padding: "7px 16px", border: "1px solid #e8e3dc", borderRadius: 99, background: "#faf7f2", fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#555", textDecoration: "none", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#c9a96e"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#c9a96e"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#faf7f2"; e.currentTarget.style.color = "#555"; e.currentTarget.style.borderColor = "#e8e3dc"; }}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      {/* Kategoriler */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa" }}>
            Kategorilere Göz At
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {mainCategories.slice(0, 6).map(cat => (
            <Link key={cat.slug} to={`/kategori/${cat.slug}`}
              style={{ padding: "8px 18px", border: "1px solid #e8e3dc", borderRadius: 4, background: "#fff", fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 500, color: "#333", textDecoration: "none", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#c9a96e"; e.currentTarget.style.color = "#c9a96e"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8e3dc"; e.currentTarget.style.color = "#333"; }}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* En çok satanlar */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa" }}>
            En Çok Satanlar
          </span>
          <Link to="/kategori/populer-urunler" style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#c9a96e", textDecoration: "none" }}>
            Tümünü Gör →
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
          {topProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              isFav={isFavorite(product.id)}
              isHovered={hoveredId === product.id}
              onHover={() => setHoveredId(product.id)}
              onLeave={() => setHoveredId(null)}
              onFav={e => onFav(e, product)}
              onCart={(e, p, qty) => onCart(e, p, qty)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Ana bileşen ── */
const Search = () => {
  const allProducts = useProducts();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { flyToCart } = useCartFly();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast, showCartModal, spawnHearts } = useToast();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.material.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }, [query, allProducts]);

  const handleFav = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); e.stopPropagation();
    const wasFav = isFavorite(product.id);
    toggleFavorite(product);
    if (!wasFav) spawnHearts(e.clientX, e.clientY);
  };

  const handleCart = (e: React.MouseEvent, product: Product, qty: number = 1) => {
    e.preventDefault(); e.stopPropagation();
    if (product.stock === 0) { showToast("Bu ürün stokta yok", "error", undefined, product.name); return; }
    for (let i = 0; i < qty; i++) addToCart(product);
    flyToCart(product.image, e.clientX, e.clientY);
    showCartModal(product.name, product.image);
  };

  const showEmptyState = !query.trim() || results.length === 0;

  return (
    <div className="header-offset" style={{ minHeight: "100vh", background: "#faf9f7", display: "flex", flexDirection: "column", paddingTop: 96 }}>
      <SEO
        title={query ? `"${query}" için arama sonuçları – Takimax` : "Ürün Arama – Takimax"}
        description={query ? `Takimax'te "${query}" için ${results.length} sonuç bulundu.` : "Takimax ürün arama sayfası."}
        noIndex={true}
      />
      <AnnouncementBar />
      <Header />

      {/* Sayfa başlığı */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "28px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <nav style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#aaa", marginBottom: 8, display: "flex", gap: 6 }}>
            <Link to="/" style={{ color: "#aaa", textDecoration: "none" }} onMouseEnter={e => e.currentTarget.style.color = "#c9a96e"} onMouseLeave={e => e.currentTarget.style.color = "#aaa"}>Anasayfa</Link>
            <span>/</span>
            <span style={{ color: "#111" }}>Arama</span>
          </nav>
          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 600, color: "#111", margin: "0 0 4px" }}>
            {query ? `"${query}" için sonuçlar` : "Ürün Arama"}
          </h1>
          {query && (
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#aaa", margin: 0 }}>
              {results.length} ürün bulundu
            </p>
          )}
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: 1280, margin: "0 auto", width: "100%", padding: "40px 24px", boxSizing: "border-box" }}>
        {showEmptyState ? (
          <EmptyState
            query={query}
            allProducts={allProducts}
            onFav={handleFav}
            onCart={handleCart}
            isFavorite={isFavorite}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
          />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 16 }}>
            {results.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isFav={isFavorite(product.id)}
                isHovered={hoveredId === product.id}
                onHover={() => setHoveredId(product.id)}
                onLeave={() => setHoveredId(null)}
                onFav={e => handleFav(e, product)}
                onCart={e => handleCart(e, product)}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Search;