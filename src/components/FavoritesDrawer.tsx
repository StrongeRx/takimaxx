import { useState } from "react";
import { X, Heart, ShoppingBag, Trash2, ChevronRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";

const FavoritesDrawer = () => {
  const { favorites, isFavDrawerOpen, setIsFavDrawerOpen, toggleFavorite } = useFavorites();
  const { addToCart, items: cartItems } = useCart();
  const [addedAll, setAddedAll] = useState(false);

  if (!isFavDrawerOpen) return null;

  const isInCart = (id: string) => cartItems.some(i => i.product.id === id);

  const handleAddAll = () => {
    favorites.forEach(p => addToCart(p));
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2500);
  };

  const totalSavings = favorites.reduce((sum, p) => {
    return p.oldPrice ? sum + (p.oldPrice - p.price) : sum;
  }, 0);

  return (
    <>
      <div
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 150 }}
        onClick={() => setIsFavDrawerOpen(false)}
      />

      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "100%", maxWidth: 440,
        background: "#fff", zIndex: 160,
        display: "flex", flexDirection: "column",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
        animation: "slideInRight 0.28s ease",
      }}>

        {/* Başlık */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #f0ede8", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Heart size={19} style={{ color: "#111", fill: "none" }} />
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 20, fontWeight: 600, color: "#111", margin: 0 }}>
              Favorilerim
            </h2>
            {favorites.length > 0 && (
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#aaa" }}>
                ({favorites.length} ürün)
              </span>
            )}
          </div>
          <button
            onClick={() => setIsFavDrawerOpen(false)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "#888", display: "flex" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#111")}
            onMouseLeave={e => (e.currentTarget.style.color = "#888")}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tasarruf banner */}
        {totalSavings > 0 && (
          <div style={{ padding: "10px 24px", background: "#fdf9f0", borderBottom: "1px solid #f5ede0", flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <Tag size={13} style={{ color: "#c9a96e", flexShrink: 0 }} />
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#a07840" }}>
              Bu ürünleri alırsan <strong style={{ color: "#c9a96e" }}>₺{totalSavings.toFixed(2)}</strong> tasarruf edersin
            </span>
          </div>
        )}

        {/* Ürün listesi */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {favorites.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "40px 24px", textAlign: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#fff5f5", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <Heart size={32} style={{ color: "#f0c0c0" }} />
              </div>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 22, fontWeight: 600, color: "#111", marginBottom: 8 }}>
                Favori listeniz boş
              </p>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#aaa", marginBottom: 28, lineHeight: 1.7 }}>
                Beğendiğiniz ürünlerin yanındaki ♡ simgesine<br />tıklayarak favorilere ekleyebilirsiniz
              </p>
              <Link to="/kategori/hepsi" onClick={() => setIsFavDrawerOpen(false)}
                style={{ display: "inline-block", padding: "12px 28px", background: "#111", color: "#fff", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#c9a96e")}
                onMouseLeave={e => (e.currentTarget.style.background = "#111")}
              >
                Alışverişe Başla
              </Link>
            </div>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {favorites.map((product) => (
                <li
                  key={product.id}
                  style={{ display: "flex", gap: 14, padding: "16px 24px", borderBottom: "1px solid #f5f2ee" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLLIElement).style.background = "#faf9f7")}
                  onMouseLeave={e => ((e.currentTarget as HTMLLIElement).style.background = "#fff")}
                >
                  {/* Görsel */}
                  <Link
                    to={`/urun/${product.id}`}
                    onClick={() => setIsFavDrawerOpen(false)}
                    style={{ width: 80, height: 80, flexShrink: 0, overflow: "hidden", background: "#faf9f7", border: "1px solid #eee", display: "block", position: "relative" }}
                  >
                    <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {product.discount && (
                      <span style={{ position: "absolute", top: 4, left: 4, background: "#e53e3e", color: "#fff", fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 700, padding: "2px 5px" }}>
                        -{product.discount}%
                      </span>
                    )}
                  </Link>

                  {/* Bilgi */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link
                      to={`/urun/${product.id}`}
                      onClick={() => setIsFavDrawerOpen(false)}
                      style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 500, color: "#111", textDecoration: "none", display: "block", lineHeight: 1.4, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#c9a96e")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#111")}
                    >
                      {product.name}
                    </Link>

                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "#bbb", marginBottom: 8 }}>
                      {product.material}
                    </p>

                    {/* Fiyat */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 17, fontWeight: 600, color: "#111" }}>
                        ₺{product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                      </span>
                      {product.oldPrice && (
                        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#ccc", textDecoration: "line-through" }}>
                          ₺{product.oldPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </div>

                    {/* Aksiyon butonları */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => addToCart(product)}
                        style={{
                          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                          padding: "7px 0",
                          background: isInCart(product.id) ? "#f0fdf4" : "#111",
                          color: isInCart(product.id) ? "#16a34a" : "#fff",
                          border: isInCart(product.id) ? "1px solid #bbf7d0" : "none",
                          cursor: "pointer", transition: "all 0.2s",
                          fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700,
                          letterSpacing: "0.1em", textTransform: "uppercase",
                        }}
                        onMouseEnter={e => { if (!isInCart(product.id)) e.currentTarget.style.background = "#c9a96e"; }}
                        onMouseLeave={e => { if (!isInCart(product.id)) e.currentTarget.style.background = "#111"; }}
                      >
                        <ShoppingBag size={11} />
                        {isInCart(product.id) ? "Sepette ✓" : "Sepete Ekle"}
                      </button>

                      <button
                        onClick={() => toggleFavorite(product)}
                        style={{ background: "none", border: "1px solid #eee", cursor: "pointer", padding: "7px 10px", color: "#ccc", display: "flex", alignItems: "center", transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#e53e3e"; e.currentTarget.style.borderColor = "#fecaca"; e.currentTarget.style.background = "#fff5f5"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#ccc"; e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.background = "transparent"; }}
                        aria-label="Favoriden çıkar"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Alt panel */}
        {favorites.length > 0 && (
          <div style={{ borderTop: "1px solid #f0ede8", padding: "16px 24px", flexShrink: 0 }}>
            <button
              onClick={handleAddAll}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "14px 0", marginBottom: 10,
                background: addedAll ? "#f0fdf4" : "#111",
                color: addedAll ? "#16a34a" : "#fff",
                border: addedAll ? "1px solid #bbf7d0" : "none",
                cursor: "pointer", transition: "all 0.25s",
                fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.15em", textTransform: "uppercase",
              }}
              onMouseEnter={e => { if (!addedAll) e.currentTarget.style.background = "#c9a96e"; }}
              onMouseLeave={e => { if (!addedAll) e.currentTarget.style.background = "#111"; }}
            >
              <ShoppingBag size={14} />
              {addedAll ? "Tümü Sepete Eklendi ✓" : "Tümünü Sepete Ekle"}
            </button>

            <button
              onClick={() => setIsFavDrawerOpen(false)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "12px 0",
                background: "#fff", color: "#555", border: "1px solid #e5e5e5",
                cursor: "pointer", transition: "all 0.2s",
                fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 600,
                letterSpacing: "0.12em", textTransform: "uppercase",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#faf9f7"; e.currentTarget.style.borderColor = "#ccc"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e5e5e5"; }}
            >
              Alışverişe Devam Et <ChevronRight size={13} />
            </button>

            {totalSavings > 0 && (
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "#c9a96e", textAlign: "center", marginTop: 12, fontWeight: 600 }}>
                🏷️ Tüm favorileri alırsan ₺{totalSavings.toFixed(2)} tasarruf edersin
              </p>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

export default FavoritesDrawer;