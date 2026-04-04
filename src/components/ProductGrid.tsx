import { useState, useMemo, useCallback, memo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, SlidersHorizontal, ChevronDown, Flame, Clock } from "lucide-react";
import { getStockStatus } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useToast } from "@/contexts/ToastContext";
import { useCartFly } from "@/hooks/useCartFly";

type SortKey = "default" | "price_asc" | "price_desc" | "discount" | "reviews";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "default",    label: "Önerilen" },
  { key: "price_asc",  label: "Artan Fiyat" },
  { key: "price_desc", label: "Azalan Fiyat" },
  { key: "discount",   label: "En Çok İndirim" },
  { key: "reviews",    label: "En Çok Değerlendirme" },
];

const Stars = ({ count }: { count: number }) => {
  const rating = Math.min(5, Math.max(3.5, 5 - count * 0.005));
  const full = Math.floor(rating);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      <div style={{ display: "flex", gap: 1 }}>
        {[1,2,3,4,5].map(i => (
          <Star key={i} size={10}
            style={{ color: i <= full ? "#f5a623" : "#e0ddd8", fill: i <= full ? "#f5a623" : "none" }} />
        ))}
      </div>
      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 600, color: "#555" }}>
        {rating.toFixed(1)}
      </span>
      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "#aaa" }}>
        ({count})
      </span>
    </div>
  );
};

/* ── Kurumsal Stok Göstergesi ── */
const StockIndicator = ({ stock, status }: { stock: number; status: ReturnType<typeof getStockStatus> }) => {
  if (status === "ok" || status === "out") return null;

  const isCritical = status === "critical";
  const pct = Math.min(100, Math.round((stock / 10) * 100));
  const barColor   = isCritical ? "#e53e3e" : "#f6921e";
  const bgColor    = isCritical ? "#fff5f5" : "#fff9f0";
  const borderClr  = isCritical ? "#fecaca" : "#fde68a";
  const textColor  = isCritical ? "#c53030" : "#b45309";
  const trackColor = isCritical ? "#fee2e2" : "#fef3c7";

  return (
    <div style={{
      background: bgColor,
      border: `1px solid ${borderClr}`,
      borderRadius: 6,
      padding: "9px 11px",
      marginBottom: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          {isCritical
            ? <Flame size={12} style={{ color: barColor }} />
            : <Clock size={12} style={{ color: barColor }} />
          }
          <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: textColor }}>
            {isCritical ? `Son ${stock} ürün kaldı!` : `${stock} adet stokta`}
          </span>
        </div>
        <span style={{
          fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700,
          color: barColor,
          background: `${barColor}1a`,
          padding: "2px 8px", borderRadius: 99,
          border: `1px solid ${barColor}33`,
        }}>
          {isCritical ? "Tükeniyor" : "Az kaldı"}
        </span>
      </div>
      <div style={{ height: 5, background: trackColor, borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${barColor}bb, ${barColor})`,
          borderRadius: 99,
          boxShadow: `0 0 6px ${barColor}55`,
          transition: "width 0.5s ease",
        }} />
      </div>
    </div>
  );
};

/* ── Tükendi Overlay ── */
const OutOfStockOverlay = () => (
  <div style={{
    position: "absolute", inset: 0, zIndex: 5,
    background: "rgba(255,255,255,0.65)",
    backdropFilter: "blur(2px)",
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <span style={{
      background: "#222", color: "#fff",
      fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 800,
      letterSpacing: "0.2em", textTransform: "uppercase",
      padding: "9px 22px", borderRadius: 3,
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    }}>
      Tükendi
    </span>
  </div>
);

import type { Product } from "@/data/products";
type ProductType = Product;

/* ── Sabit Miktar + Sepete Ekle Satırı ── */
const AddToCartRow = ({
  product,
  onAddToCart,
}: {
  product: ProductType;
  onAddToCart: (e: React.MouseEvent, product: ProductType, qty: number) => void;
}) => {
  const [qty, setQty] = useState(1);
  const [btnState, setBtnState] = useState<"idle" | "adding" | "added">("idle");
  const [confetti, setConfetti] = useState<{id:number; x:number; color:string; rot:number; size:number}[]>([]);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (btnState !== "idle") return;

    const colors = ["#c9a96e","#f5d78e","#fff","#e8cc9a","#ffd700","#ffe4b5"];
    const bits = Array.from({ length: 14 }, (_, i) => ({
      id: Date.now() + i,
      x: 30 + Math.random() * 40,
      color: colors[i % colors.length],
      rot: Math.random() * 360,
      size: 4 + Math.random() * 5,
    }));
    setConfetti(bits);
    setTimeout(() => setConfetti([]), 900);

    setBtnState("adding");
    onAddToCart(e, product, qty); // ✅ qty doğrudan iletiliyor — for döngüsü kaldırıldı
    setTimeout(() => setBtnState("added"), 700);
    setTimeout(() => setBtnState("idle"), 2600);
  };

  const dec = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setQty(q => Math.max(1, q - 1)); };
  const inc = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setQty(q => Math.min(product.stock, q + 1)); };

  return (
    <div style={{ marginTop: 12 }} onClick={e => { e.preventDefault(); e.stopPropagation(); }}>
      {/* Miktar satırı */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <button onClick={dec} style={{
          width: 30, height: 30, border: "1.5px solid #ddd", borderRadius: 4,
          background: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center", color: "#333",
          transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.background = "#111"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#333"; }}
        >−</button>
        <span style={{
          flex: 1, textAlign: "center",
          fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: "#111",
          border: "1.5px solid #ddd", borderRadius: 4, padding: "4px 0",
        }}>{qty}</span>
        <button onClick={inc} style={{
          width: 30, height: 30, border: "1.5px solid #ddd", borderRadius: 4,
          background: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center", color: "#333",
          transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.background = "#111"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#333"; }}
        >+</button>
      </div>

      {/* Sepete Ekle butonu */}
      <div style={{ position: "relative" }}>
        {/* Confetti parçaları */}
        {confetti.map(c => (
          <span key={c.id} style={{
            position: "absolute",
            left: `${c.x}%`, top: "50%",
            width: c.size, height: c.size * 0.55,
            background: c.color,
            borderRadius: 1,
            pointerEvents: "none",
            zIndex: 20,
            transform: `rotate(${c.rot}deg)`,
            animation: "pgConfetti 0.85s cubic-bezier(0.25,0.46,0.45,0.94) forwards",
            "--dy": `${-40 - Math.random() * 35}px`,
            "--dx": `${(Math.random() - 0.5) * 50}px`,
          } as React.CSSProperties} />
        ))}

        <button
          onClick={handleAdd}
          className="atc-btn"
          data-state={btnState}
          style={{
            width: "100%",
            height: 42,
            border: "none",
            borderRadius: 4,
            cursor: btnState === "idle" ? "pointer" : "default",
            overflow: "hidden",
            position: "relative",
            fontFamily: "Montserrat, sans-serif",
            fontSize: 11, fontWeight: 800,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "#fff",
            background: btnState === "added"
              ? "linear-gradient(135deg, #15803d, #16a34a)"
              : btnState === "adding"
              ? "linear-gradient(135deg, #b8860b, #c9a96e)"
              : "linear-gradient(135deg, #1a1a1a, #333)",
            transition: "background 0.5s ease, box-shadow 0.3s ease, transform 0.15s ease",
            boxShadow: btnState === "added"
              ? "0 4px 20px rgba(21,128,61,0.45)"
              : btnState === "adding"
              ? "0 4px 20px rgba(201,169,110,0.4)"
              : "0 2px 8px rgba(0,0,0,0.2)",
            transform: btnState === "adding" ? "scale(0.97)" : "scale(1)",
          }}
          onMouseEnter={e => { if (btnState === "idle") { e.currentTarget.style.background = "linear-gradient(135deg, #c9a96e, #e8cc9a)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(201,169,110,0.45)"; }}}
          onMouseLeave={e => { if (btnState === "idle") { e.currentTarget.style.background = "linear-gradient(135deg, #1a1a1a, #333)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)"; }}}
        >
          {/* Ripple arka plan */}
          {btnState === "adding" && (
            <span style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)",
              animation: "pgRipple 0.7s ease forwards",
              zIndex: 0,
            }} />
          )}

          {/* Shimmer — added state */}
          {btnState === "added" && (
            <span style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%)",
              animation: "pgShimmer 0.9s ease 0.1s both",
              zIndex: 0,
            }} />
          )}

          {/* İçerik katmanı */}
          <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>

            {/* IDLE */}
            {btnState === "idle" && (
              <span className="atc-idle" style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <ShoppingBag size={13} style={{ transition: "transform 0.2s" }} />
                Sepete Ekle
              </span>
            )}

            {/* ADDING — çanta uçuyor */}
            {btnState === "adding" && (
              <span style={{ display: "flex", alignItems: "center", gap: 8, animation: "pgSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
                <span style={{ display: "flex", position: "relative", width: 16, height: 16 }}>
                  {/* Uçan çanta */}
                  <ShoppingBag size={14} style={{
                    position: "absolute",
                    animation: "pgBagFly 0.65s cubic-bezier(0.4,0,1,1) forwards",
                  }} />
                  {/* Arkasındaki iz çizgileri */}
                  <span style={{
                    position: "absolute", left: -2, top: "50%", marginTop: -0.5,
                    width: 8, height: 1.5,
                    background: "rgba(255,255,255,0.5)",
                    animation: "pgTrail 0.65s ease forwards",
                    borderRadius: 99,
                  }} />
                </span>
                <span style={{ animation: "pgPulseText 0.5s ease infinite alternate" }}>Ekleniyor</span>
                <span style={{ display: "flex", gap: 3 }}>
                  {[0,1,2].map(i => (
                    <span key={i} style={{
                      width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.7)",
                      display: "inline-block",
                      animation: `pgDot 0.6s ease ${i * 0.15}s infinite alternate`,
                    }} />
                  ))}
                </span>
              </span>
            )}

            {/* ADDED — başarı */}
            {btnState === "added" && (
              <span style={{ display: "flex", alignItems: "center", gap: 8, animation: "pgSuccessIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>
                {/* Animasyonlu checkmark dairesi */}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ overflow: "visible" }}>
                  <circle
                    cx="9" cy="9" r="8"
                    stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"
                    style={{ strokeDasharray: 51, strokeDashoffset: 0, animation: "pgCircleDraw 0.4s ease forwards" }}
                  />
                  <circle cx="9" cy="9" r="8" fill="rgba(255,255,255,0.12)" style={{ animation: "pgCirclePop 0.4s ease forwards" }} />
                  <path
                    d="M5 9 L7.8 12 L13 6.5"
                    stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ strokeDasharray: 13, strokeDashoffset: 0, animation: "pgCheckDraw 0.35s ease 0.2s both" }}
                  />
                </svg>
                <span style={{ animation: "pgSuccessText 0.4s ease 0.15s both" }}>Sepete Eklendi!</span>
              </span>
            )}
          </span>
        </button>
      </div>
    </div>
  );
};

/* ── Memoized ürün kartı — sadece kendi props'u değişince render olur ── */
const ProductCard = memo(({
  product,
  isFav,
  onToggleFavorite,
  onAddToCart,
}: {
  product: ProductType;
  isFav: boolean;
  onToggleFavorite: (e: React.MouseEvent, product: ProductType) => void;
  onAddToCart: (e: React.MouseEvent, product: ProductType, qty: number) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const stockStatus = getStockStatus(product.stock);
  const isOut = stockStatus === "out";

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid #e8e8e8",
        boxShadow: isHovered && !isOut
          ? "0 8px 32px rgba(0,0,0,0.13)"
          : "0 1px 4px rgba(0,0,0,0.06)",
        transform: isHovered && !isOut ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.25s ease",
      }}
    >
      {/* Görsel */}
      <Link to={`/urun/${product.id}`} style={{ display: "block", position: "relative", aspectRatio: "1/1", overflow: "hidden", background: "#f9f7f4" }}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transition: "transform 0.5s ease",
            transform: isHovered && !isOut ? "scale(1.06)" : "scale(1)",
            filter: isOut ? "grayscale(25%) brightness(0.96)" : "none",
          }}
        />

        {isOut && <OutOfStockOverlay />}

        {/* Badge'lar — sol üst */}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", flexDirection: "column", gap: 5, zIndex: 6 }}>
          {!isOut && product.discount && product.discount > 0 && (
            <span style={{
              background: "#e53e3e", color: "#fff",
              fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 800,
              padding: "4px 9px", borderRadius: 4,
              boxShadow: "0 2px 6px rgba(229,62,62,0.35)",
            }}>
              %{product.discount} İNDİRİM
            </span>
          )}
          {!isOut && product.reviews > 100 && (
            <span style={{
              background: "linear-gradient(135deg, #b8860b, #c9a96e)",
              color: "#fff",
              fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700,
              padding: "4px 9px", borderRadius: 4,
              display: "flex", alignItems: "center", gap: 4,
              boxShadow: "0 2px 6px rgba(201,169,110,0.35)",
            }}>
              <Flame size={9} /> ÇOK SATAN
            </span>
          )}
          {stockStatus === "critical" && (
            <span style={{
              background: "#dc2626", color: "#fff",
              fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 800,
              padding: "4px 9px", borderRadius: 4,
              display: "flex", alignItems: "center", gap: 4,
              boxShadow: "0 2px 8px rgba(220,38,38,0.4)",
              animation: "criticalPulse 1.8s ease-in-out infinite",
            }}>
              🔥 SON {product.stock} ÜRÜN
            </span>
          )}
          {stockStatus === "low" && (
            <span style={{
              background: "#d97706", color: "#fff",
              fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700,
              padding: "4px 9px", borderRadius: 4,
              display: "flex", alignItems: "center", gap: 4,
              boxShadow: "0 2px 6px rgba(217,119,6,0.35)",
            }}>
              <Clock size={9} /> AZ KALDI
            </span>
          )}
        </div>

        {/* Favori — sağ üst */}
        <button onClick={(e) => onToggleFavorite(e, product)} style={{
          position: "absolute", top: 10, right: 10, zIndex: 6,
          width: 34, height: 34, borderRadius: "50%",
          background: isFav ? "#c9a96e" : "rgba(255,255,255,0.96)",
          border: isFav ? "none" : "1px solid rgba(0,0,0,0.08)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          transition: "all 0.2s",
          opacity: isHovered || isFav ? 1 : 0,
          transform: isFav ? "scale(1.08)" : "scale(1)",
        }} aria-label="Favorilere ekle">
          <Heart size={15} style={{ color: isFav ? "#fff" : "#666", fill: isFav ? "#fff" : "none", transition: "all 0.2s" }} />
        </button>


      </Link>

      {/* Ürün Bilgisi */}
      <Link to={`/urun/${product.id}`} className="product-card-body" style={{ display: "block", padding: "14px 14px 16px", textDecoration: "none" }}>

        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
          {product.material}
        </p>

        <h3 style={{
          fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 500,
          color: isOut ? "#bbb" : "#1a1a1a", lineHeight: 1.45,
          marginBottom: 8,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          minHeight: 38,
        }}>
          {product.name}
        </h3>

        {product.reviews > 0 && (
          <div style={{ marginBottom: 10 }}>
            <Stars count={product.reviews} />
          </div>
        )}

        {/* ── Stok Göstergesi ── */}
        <StockIndicator stock={product.stock} status={stockStatus} />

        {/* Fiyat alanı */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 7, flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "Montserrat, sans-serif", fontSize: 21, fontWeight: 700, lineHeight: 1,
            color: isOut ? "#ccc" : stockStatus === "critical" ? "#dc2626" : "#111",
          }}>
            ₺{product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
          </span>
          {product.oldPrice && (
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#ccc", textDecoration: "line-through" }}>
              ₺{product.oldPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>



        {isOut && (
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#bbb", marginTop: 6 }}>
            Bu ürün şu an stokta yok
          </p>
        )}

        {/* Sabit: Miktar Seçici + Sepete Ekle */}
        {!isOut && (
          <AddToCartRow onAddToCart={onAddToCart} product={product} />
        )}
      </Link>
    </div>
  );
});
ProductCard.displayName = "ProductCard";

const PAGE_SIZE = 10; // İlk yüklenmede gösterilecek ürün adedi

/* ── Ana Grid Bileşeni ── */
type GridMode = "bestsellers" | "new_arrivals";

interface ProductGridProps {
  mode?: GridMode;
}

const ProductGrid = ({ mode = "bestsellers" }: ProductGridProps) => {
  const { addToCart } = useCart();
  const { flyToCart } = useCartFly();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast, spawnHearts } = useToast();
  const allProducts = useProducts();

  const [sort, setSort] = useState<SortKey>("default");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // useCallback ile stabil referans — ProductCard'ın gereksiz re-render'ını önler
  const handleToggleFavorite = useCallback((e: React.MouseEvent, product: ProductType) => {
    e.preventDefault(); e.stopPropagation();
    const wasFav = isFavorite(product.id);
    toggleFavorite(product);
    if (!wasFav) spawnHearts(e.clientX, e.clientY);
  }, [isFavorite, toggleFavorite, spawnHearts]);

  const handleAddToCart = useCallback((e: React.MouseEvent, product: ProductType, qty: number = 1) => {
    e.preventDefault(); e.stopPropagation();
    if (product.stock === 0) {
      showToast("Bu ürün stokta yok", "error", undefined, product.name);
      return;
    }
    addToCart(product, qty);
    flyToCart(product.image, e.clientX, e.clientY);
  }, [addToCart, flyToCart, showToast]);

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (mode === "new_arrivals") {
      // BUG FIX #3: az review = yeni ürün mantigi yanlis.
      // Urunler products.ts'deki sirasina gore "yeni" sayilir —
      // listedeki son 12 urun en yeni kabul edilir.
      list = list.slice(-12).reverse();
    } else {
      list = list.sort((a, b) => b.reviews - a.reviews);
    }
    switch (sort) {
      case "price_asc":  return [...list].sort((a, b) => a.price - b.price);
      case "price_desc": return [...list].sort((a, b) => b.price - a.price);
      case "discount":   return [...list].sort((a, b) => (b.discount || 0) - (a.discount || 0));
      case "reviews":    return [...list].sort((a, b) => b.reviews - a.reviews);
      default:           return list;
    }
  }, [sort, allProducts, mode]);

  // Sıralama değişince başa dön
  useEffect(() => { setShowAll(false); }, [sort]);

  const visible = showAll ? filtered : filtered.slice(0, PAGE_SIZE);
  const hasMore = !showAll && filtered.length > PAGE_SIZE;

  const sectionId = mode === "new_arrivals" ? "new-arrivals" : "products";
  const subLabel  = mode === "new_arrivals" ? "Yeni Gelenler" : "Koleksiyonumuz";
  const mainTitle = mode === "new_arrivals" ? "Yeni Ürünler" : "En Çok Satan Ürünler";

  return (
    <section id={sectionId} style={{ padding: "64px 0 80px", background: mode === "new_arrivals" ? "#fff" : "#f5f5f5" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        {/* Başlık */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.35em", color: "#c9a96e", textTransform: "uppercase", marginBottom: 12 }}>
            {subLabel}
          </p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#111", lineHeight: 1.15, margin: "0 0 16px" }}>
            {mainTitle}
          </h2>
          <div style={{ width: 48, height: 2, background: "linear-gradient(90deg, transparent, #c9a96e, transparent)", margin: "0 auto" }} />
        </div>

        {/* Ürün sayısı + sıralama */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#999", margin: 0 }}>
            <span style={{ fontWeight: 700, color: "#111" }}>{visible.length}</span>
            <span style={{ color: "#ccc" }}> / {filtered.length} ürün gösteriliyor</span>
          </p>
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowSortMenu(v => !v)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", border: "1px solid #ddd", background: "#fff", borderRadius: 4, cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#444", fontWeight: 600 }}>
              <SlidersHorizontal size={13} />
              {SORT_OPTIONS.find(o => o.key === sort)?.label || "Önerilen"}
              <ChevronDown size={12} style={{ transition: "transform 0.2s", transform: showSortMenu ? "rotate(180deg)" : "none" }} />
            </button>
            {showSortMenu && (
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", background: "#fff", border: "1px solid #eee", borderRadius: 8, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", zIndex: 20, minWidth: 210, overflow: "hidden" }}>
                {SORT_OPTIONS.map(opt => (
                  <button key={opt.key} onClick={() => { setSort(opt.key); setShowSortMenu(false); }}
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 16px", background: sort === opt.key ? "#fdf8f2" : "#fff", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 12, color: sort === opt.key ? "#c9a96e" : "#333", fontWeight: sort === opt.key ? 700 : 400, borderLeft: sort === opt.key ? "3px solid #c9a96e" : "3px solid transparent", transition: "all 0.15s" }}
                    onMouseEnter={e => { if (sort !== opt.key) e.currentTarget.style.background = "#f9f9f9"; }}
                    onMouseLeave={e => { if (sort !== opt.key) e.currentTarget.style.background = "#fff"; }}
                  >{opt.label}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Ürün Grid ── */}
        <div className="product-grid-inner" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {visible.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFav={isFavorite(product.id)}
              onToggleFavorite={handleToggleFavorite}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 600, color: "#111", marginBottom: 8 }}>Bu kategoride ürün bulunamadı</p>
          </div>
        )}

        {/* Devamını Gör butonu */}
        {hasMore && (
          <div style={{ marginTop: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setShowAll(true)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "0 36px",
                height: 52,
                background: "#111",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12, fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "#fff",
                transition: "all 0.22s",
                boxShadow: "0 4px 20px rgba(0,0,0,0.16)",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#2a2a2a"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.22)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#111"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.16)"; }}
            >
              <span>Tüm Ürünleri Gör</span>
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                background: "#c9a96e",
                color: "#fff",
                fontFamily: "Montserrat, sans-serif",
                fontSize: 11, fontWeight: 800,
                borderRadius: 99,
                padding: "3px 11px",
                letterSpacing: "0.04em",
              }}>
                {filtered.length}
              </span>
            </button>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "#bbb", letterSpacing: "0.08em" }}>
              {PAGE_SIZE} / {filtered.length} ürün gösteriliyor
            </span>
          </div>
        )}

        {/* Tüm ürünler gösterildi — şık bitiş */}
        {!hasMore && filtered.length > PAGE_SIZE && (
          <div style={{ marginTop: 56, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%", maxWidth: 360 }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #d4c9b8)" }} />
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, color: "#c9a96e", letterSpacing: "0.2em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                ✦ Tüm Ürünler
              </span>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #d4c9b8, transparent)" }} />
            </div>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#aaa" }}>
              {filtered.length} ürünün tamamı gösterildi
            </span>
          </div>
        )}
      </div>

      {showSortMenu && <div style={{ position: "fixed", inset: 0, zIndex: 15 }} onClick={() => setShowSortMenu(false)} />}

      <style>{`
        @keyframes criticalPulse {
          0%, 100% { box-shadow: 0 2px 8px rgba(220,38,38,0.4); }
          50%       { box-shadow: 0 2px 16px rgba(220,38,38,0.7); }
        }
        @keyframes pgSpin {
          to { transform: rotate(360deg); }
        }

        /* === Sepete Ekle Animasyonları === */

        /* Hover: çanta hafif zıplar */
        .atc-btn:hover .atc-idle svg {
          animation: pgBagWiggle 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes pgBagWiggle {
          0%   { transform: translateY(0) rotate(0deg); }
          30%  { transform: translateY(-4px) rotate(-8deg); }
          60%  { transform: translateY(-2px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }

        /* Adding: çanta yukarı doğru uçar */
        @keyframes pgBagFly {
          0%   { opacity: 1; transform: translate(0, 0) scale(1) rotate(0deg); }
          40%  { opacity: 1; transform: translate(6px, -6px) scale(1.1) rotate(10deg); }
          100% { opacity: 0; transform: translate(14px, -20px) scale(0.5) rotate(20deg); }
        }

        /* Adding: arkada bırakılan iz */
        @keyframes pgTrail {
          0%   { width: 0; opacity: 0; transform: translateX(8px); }
          40%  { width: 10px; opacity: 0.7; }
          100% { width: 4px; opacity: 0; transform: translateX(0); }
        }

        /* Adding: metin pulse */
        @keyframes pgPulseText {
          from { opacity: 0.7; }
          to   { opacity: 1; }
        }

        /* Adding: nokta bounce */
        @keyframes pgDot {
          from { transform: translateY(0); opacity: 0.4; }
          to   { transform: translateY(-4px); opacity: 1; }
        }

        /* Adding: içerik slide-in */
        @keyframes pgSlideIn {
          from { opacity: 0; transform: translateY(8px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Adding: ripple arka */
        @keyframes pgRipple {
          0%   { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        /* Added: başarı içerik girişi */
        @keyframes pgSuccessIn {
          0%   { opacity: 0; transform: scale(0.75) translateY(6px); }
          55%  { transform: scale(1.07) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* Added: metin gecikmeli giriş */
        @keyframes pgSuccessText {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* Added: çember çizim */
        @keyframes pgCircleDraw {
          from { stroke-dashoffset: 51; opacity: 0.2; }
          to   { stroke-dashoffset: 0;  opacity: 1; }
        }
        @keyframes pgCirclePop {
          0%   { r: 4; opacity: 0; }
          50%  { r: 9; opacity: 0.25; }
          100% { r: 8; opacity: 0.12; }
        }

        /* Added: checkmark çizimi */
        @keyframes pgCheckDraw {
          from { stroke-dashoffset: 13; }
          to   { stroke-dashoffset: 0; }
        }

        /* Added: shimmer geçişi */
        @keyframes pgShimmer {
          from { transform: translateX(-120%); }
          to   { transform: translateX(220%); }
        }

        /* Confetti */
        @keyframes pgConfetti {
          0%   { transform: rotate(var(--rot, 0deg)) translate(0, 0) scale(1); opacity: 1; }
          100% { transform: rotate(calc(var(--rot, 0deg) + 180deg)) translate(var(--dx, 20px), var(--dy, -40px)) scale(0.3); opacity: 0; }
        }

        /* ── Mobil: 2 sütun grid ── */
        @media (max-width: 640px) {
          .product-grid-inner {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .product-card-body {
            padding: 10px 10px 12px !important;
          }

          /* Favori butonu mobilde her zaman görünür */
          .product-grid-inner [aria-label="Favorilere ekle"] {
            opacity: 1 !important;
            width: 30px !important;
            height: 30px !important;
            top: 7px !important;
            right: 7px !important;
          }

        }
      `}</style>
    </section>
  );
};

export default ProductGrid;