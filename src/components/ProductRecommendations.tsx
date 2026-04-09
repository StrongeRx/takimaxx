import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useToast } from "@/contexts/ToastContext";
import { useCartFly } from "@/hooks/useCartFly";
import AddToCartRow from "@/components/AddToCartRow";

interface Props {
  title: string;
  subtitle?: string;
  products: Product[];
}

const RecommendCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { flyToCart } = useCartFly();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast, showCartModal, spawnHearts } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const wasFav = isFavorite(product.id);
    toggleFavorite(product);
    if (!wasFav) spawnHearts(e.clientX, e.clientY);
    showToast(
      wasFav ? `"${product.name}" favorilerden çıkarıldı` : `"${product.name}" favorilere eklendi`,
      wasFav ? "info" : "warning",
      product.image
    );
  };

  const handleCart = (e: React.MouseEvent, p: Product, qty: number = 1) => {
    e.preventDefault(); e.stopPropagation();
    for (let i = 0; i < qty; i++) addToCart(p);
    flyToCart(p.image, e.clientX, e.clientY);
    showCartModal(p.name, p.image);
  };

  const isFav = isFavorite(product.id);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        flexShrink: 0, width: 220,
        background: "#fff",
        border: "1px solid #e8e8e8",
        borderRadius: 8,
        overflow: "hidden",
        scrollSnapAlign: "start",
        transition: "box-shadow 0.25s, transform 0.25s",
        boxShadow: isHovered ? "0 8px 32px rgba(0,0,0,0.12)" : "0 1px 4px rgba(0,0,0,0.06)",
        transform: isHovered ? "translateY(-3px)" : "translateY(0)",
      }}
    >
      <Link to={`/urun/${product.id}`} style={{ display: "block", position: "relative", aspectRatio: "1/1", overflow: "hidden" }}>
        <img
          src={product.image} alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", transform: isHovered ? "scale(1.06)" : "scale(1)" }}
        />
        {product.discount && product.discount > 0 && (
          <span style={{ position: "absolute", top: 10, left: 10, background: "#e53e3e", color: "#fff", fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 4 }}>
            %{product.discount}
          </span>
        )}
        <button
          onClick={handleFavorite}
          style={{
            position: "absolute", top: 10, right: 10,
            width: 32, height: 32, borderRadius: "50%",
            background: isFav ? "#c9a96e" : "rgba(255,255,255,0.95)",
            border: isFav ? "none" : "1px solid rgba(0,0,0,0.08)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)", transition: "all 0.2s",
            opacity: isHovered || isFav ? 1 : 0,
          }}
        >
          <Heart size={14} style={{ color: isFav ? "#fff" : "#666", fill: isFav ? "#fff" : "none" }} />
        </button>
      </Link>

      <Link to={`/urun/${product.id}`} style={{ display: "block", padding: "12px 12px 4px", textDecoration: "none" }}>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "#bbb", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {product.material || product.category}
        </p>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 500, color: "#111", lineHeight: 1.4, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {product.name}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700, color: "#111" }}>
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
        <div style={{ padding: "0 12px 12px" }}>
          <AddToCartRow product={product} onAddToCart={handleCart} />
        </div>
      )}
    </div>
  );
};

const ProductRecommendations = ({ title, subtitle, products }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -260 : 260, behavior: "smooth" });
  };

  return (
    <section style={{ padding: "48px 0", borderTop: "1px solid #f0ede8" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 600, color: "#111", margin: 0 }}>
              {title}
            </h2>
            {subtitle && (
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#999", marginTop: 4 }}>{subtitle}</p>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {(["left", "right"] as const).map((dir) => (
              <button key={dir} onClick={() => scroll(dir)}
                style={{ width: 36, height: 36, border: "1px solid #ddd", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", borderRadius: 4 }}
                onMouseEnter={e => { e.currentTarget.style.background = "#111"; e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.color = "#111"; }}
              >
                {dir === "left" ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </button>
            ))}
          </div>
        </div>

        <div ref={scrollRef} style={{ display: "flex", gap: 14, overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none", paddingBottom: 4 }}>
          {products.map((product) => (
            <RecommendCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
};

export default ProductRecommendations;