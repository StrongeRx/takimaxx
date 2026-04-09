import { useState, useEffect } from "react";
import { X, Minus, Plus, ShoppingBag, Trash2, Tag, Truck, ChevronRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { FieldError } from "@/components/AlertMsg";
// Kupon listesi — yeni admin panelinden yönetilecek
const STATIC_COUPONS: Record<string, { type: "percent" | "fixed" | "shipping"; value: number; label: string }> = {
  "TAKIMAX10": { type: "percent", value: 10,  label: "%10 İndirim" },
  "HOSGELDIN": { type: "fixed",   value: 150, label: "150₺ İndirim" },
  "KARGO0":    { type: "shipping", value: 0,  label: "Ücretsiz Kargo" },
};

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, totalItems, appliedCoupon, setAppliedCoupon, discountAmount } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [showCoupon, setShowCoupon] = useState(false);

  // Body scroll lock — drawer açıkken arkadaki sayfa kaymasın
  useEffect(() => {
    if (!isCartOpen) return;
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
    };
  }, [isCartOpen]);

  const COUPONS = STATIC_COUPONS;
  const FREE_SHIPPING_THRESHOLD = 400;
  const SHIPPING_FEE = 49.90;

  const baseShipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const freeShippingPercent = Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const discount = discountAmount;
  const effectiveShipping = appliedCoupon?.type === "shipping" ? 0 : baseShipping;

  const grandTotal = Math.max(
    0,
    totalPrice - (appliedCoupon?.type === "shipping" ? 0 : discount) + effectiveShipping
  );

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const found = COUPONS[code];
    if (!found) { setCouponError("Geçersiz kupon kodu."); return; }
    setAppliedCoupon({ code, type: found.type, value: found.value, label: found.label });
    setCouponError("");
    setCouponInput("");
    setShowCoupon(false);
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 150 }}
        onClick={() => setIsCartOpen(false)} />

      <div className="cart-drawer" style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "100%", maxWidth: 440,
        background: "#fff", zIndex: 160,
        display: "flex", flexDirection: "column",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
        animation: "slideInRight 0.28s ease",
        overscrollBehavior: "contain",
      }}>

        {/* Başlık */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #f0ede8", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShoppingBag size={19} />
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 20, fontWeight: 600, color: "#111", margin: 0 }}>Sepetim</h2>
            {totalItems > 0 && <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#aaa" }}>({totalItems} ürün)</span>}
          </div>
          <button onClick={() => setIsCartOpen(false)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "#888", display: "flex" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#111")}
            onMouseLeave={e => (e.currentTarget.style.color = "#888")}
          ><X size={20} /></button>
        </div>

        {/* Kargo progress */}
        {totalItems > 0 && (
          <div style={{ padding: "12px 24px", background: "#faf9f7", borderBottom: "1px solid #f0ede8", flexShrink: 0 }}>
            {totalPrice >= FREE_SHIPPING_THRESHOLD ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Truck size={14} style={{ color: "#16a34a" }} />
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#16a34a", fontWeight: 600 }}>
                  Tebrikler! Ücretsiz kargoya hak kazandınız 🎉
                </span>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                  <Truck size={14} style={{ color: "#c9a96e" }} />
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#555" }}>
                    Ücretsiz kargo için <strong style={{ color: "#c9a96e" }}>₺{remainingForFree.toFixed(2)}</strong> daha ekle
                  </span>
                </div>
                <div style={{ height: 4, background: "#e8e3db", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${freeShippingPercent}%`, height: "100%", background: "linear-gradient(90deg, #c9a96e, #e8c98a)", borderRadius: 4, transition: "width 0.4s ease" }} />
                </div>
              </>
            )}
          </div>
        )}

        {/* Ürün listesi */}
        <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}>
          {items.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "40px 24px", textAlign: "center" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#faf9f7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <ShoppingBag size={28} style={{ color: "#ddd" }} />
              </div>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 20, fontWeight: 600, color: "#111", marginBottom: 8 }}>Sepetiniz boş</p>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#aaa", marginBottom: 24 }}>
                Beğendiğiniz ürünleri sepetinize ekleyin
              </p>
              <Link to="/kategori/hepsi" onClick={() => setIsCartOpen(false)}
                style={{ display: "inline-block", padding: "12px 28px", background: "#111", color: "#fff", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#c9a96e")}
                onMouseLeave={e => (e.currentTarget.style.background = "#111")}
              >Alışverişe Başla</Link>
            </div>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {items.map((item) => (
                <li key={item.product.id} style={{ display: "flex", gap: 14, padding: "16px 24px", borderBottom: "1px solid #f5f2ee" }}>
                  <Link to={`/urun/${item.product.id}`} onClick={() => setIsCartOpen(false)}
                    style={{ width: 76, height: 76, flexShrink: 0, overflow: "hidden", background: "#faf9f7", border: "1px solid #eee" }}>
                    <img src={item.product.image} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </Link>
                    <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/urun/${item.product.id}`} onClick={() => setIsCartOpen(false)}
                      style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 500, color: "#111", textDecoration: "none", display: "block", lineHeight: 1.4, marginBottom: 2 }}>
                      {item.product.name}
                    </Link>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "#aaa", marginBottom: 8 }}>{item.product.material}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid #e5e5e5" }}>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#f5f5f5")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        ><Minus size={11} /></button>
                        <span style={{ width: 28, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 600, borderLeft: "1px solid #e5e5e5", borderRight: "1px solid #e5e5e5", lineHeight: "28px" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          title={item.quantity >= item.product.stock ? `Maksimum stok: ${item.product.stock} adet` : undefined}
                          style={{
                            width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                            background: "none", border: "none",
                            cursor: item.quantity >= item.product.stock ? "not-allowed" : "pointer",
                            opacity: item.quantity >= item.product.stock ? 0.35 : 1,
                          }}
                          onMouseEnter={e => { if (item.quantity < item.product.stock) e.currentTarget.style.background = "#f5f5f5"; }}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        ><Plus size={11} /></button>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 17, fontWeight: 600, color: "#111" }}>
                          ₺{(item.product.price * item.quantity).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                        </span>
                        <button onClick={() => removeFromCart(item.product.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", display: "flex", padding: 4 }}
                          onMouseEnter={e => (e.currentTarget.style.color = "#e53e3e")}
                          onMouseLeave={e => (e.currentTarget.style.color = "#ccc")}
                        ><Trash2 size={14} /></button>
                      </div>
                    </div>
                    {/* Stok limit uyarısı */}
                    {item.quantity >= item.product.stock && (
                      <FieldError msg={`Bu üründen en fazla ${item.product.stock} adet alabilirsiniz.`} />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Alt panel */}
        {items.length > 0 && (
          <div style={{ borderTop: "1px solid #f0ede8", flexShrink: 0 }}>


            {/* Kupon */}
            <div style={{ padding: "13px 24px", borderBottom: "1px solid #f0ede8" }}>
              <button onClick={() => setShowCoupon(v => !v)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Montserrat, sans-serif", fontSize: 12, color: appliedCoupon ? "#16a34a" : "#555" }}>
                  <Tag size={15} style={{ color: "#c9a96e" }} />
                  {appliedCoupon ? `✓ ${appliedCoupon.label} uygulandı` : "Kupon kodu var mı?"}
                </span>
                <ChevronRight size={14} style={{ color: "#aaa", transform: showCoupon ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
              </button>

              {showCoupon && (
                <div style={{ marginTop: 10 }}>
                  {appliedCoupon ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "8px 12px", borderRadius: 2 }}>
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#16a34a", fontWeight: 600 }}>{appliedCoupon.code}</span>
                      <button onClick={() => { setAppliedCoupon(null); }}
                        style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#e53e3e", textDecoration: "underline" }}>
                        Kaldır
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input type="text" value={couponInput}
                          onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                          onKeyDown={e => e.key === "Enter" && applyCoupon()}
                          placeholder="Kupon kodunu girin"
                          style={{ flex: 1, padding: "9px 12px", border: "1px solid #ddd", fontFamily: "Montserrat, sans-serif", fontSize: 12, outline: "none", letterSpacing: "0.05em" }}
                          onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")}
                          onBlur={e => (e.currentTarget.style.borderColor = "#ddd")}
                        />
                        <button onClick={applyCoupon}
                          style={{ padding: "9px 16px", background: "#111", color: "#fff", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, flexShrink: 0 }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#c9a96e")}
                          onMouseLeave={e => (e.currentTarget.style.background = "#111")}
                        >Uygula</button>
                      </div>
                      {couponError && <FieldError msg={couponError} />}
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "#ccc", marginTop: 6 }}>
                        Demo kodlar: TAKIMAX10 · HOSGELDIN · KARGO0
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Fiyat özeti */}
            <div style={{ padding: "14px 24px", borderBottom: "1px solid #f0ede8" }}>
              {[
                { label: "Ara Toplam", value: `₺${totalPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`, color: "#555" },
                ...(discount > 0 ? [{ label: "İndirim", value: `-₺${discount.toFixed(2)}`, color: "#16a34a" }] : []),
                { label: "Kargo", value: appliedCoupon?.code === "KARGO0" ? "ÜCRETSİZ (Özel)" : effectiveShipping === 0 ? "ÜCRETSİZ" : `₺${effectiveShipping.toFixed(2)}`, color: effectiveShipping === 0 ? "#16a34a" : "#555" },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#888" }}>{row.label}</span>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: row.color, fontWeight: row.color !== "#555" ? 600 : 400 }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #f0ede8" }}>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: "#111" }}>Toplam</span>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 22, fontWeight: 700, color: "#111" }}>
                  ₺{grandTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Butonlar */}
            <div className="cart-drawer-footer" style={{ padding: "16px 24px", paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))", display: "flex", flexDirection: "column", gap: 10 }}>
              <Link to="/odeme" onClick={() => setIsCartOpen(false)}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "15px 0", background: "#111", color: "#fff", textDecoration: "none", fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", transition: "background 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#c9a96e")}
                onMouseLeave={e => (e.currentTarget.style.background = "#111")}
              >
                SİPARİŞİ TAMAMLA <ChevronRight size={14} />
              </Link>
              <button onClick={() => setIsCartOpen(false)}
                style={{ padding: "13px 0", background: "#fff", color: "#555", border: "1px solid #e5e5e5", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#faf9f7")}
                onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
              >Alışverişe Devam Et</button>
            </div>
            <div style={{ paddingBottom: 16, textAlign: "center" }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "#ccc" }}>🔒 256-bit SSL ile güvenli ödeme</p>
            </div>
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

export default CartDrawer;