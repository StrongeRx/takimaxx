import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ChevronRight, Gift, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { FieldError } from "@/components/AlertMsg";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const STATIC_COUPONS: Record<string, { type: "percent" | "fixed" | "shipping"; value: number; label: string }> = {
  "TAKIMAX10": { type: "percent",  value: 10,  label: "%10 İndirim" },
  "HOSGELDIN": { type: "fixed",    value: 150, label: "150₺ İndirim" },
  "KARGO0":    { type: "shipping", value: 0,   label: "Ücretsiz Kargo" },
};

const FREE_SHIPPING_THRESHOLD = 400;
const SHIPPING_FEE = 49.90;

const Cart = () => {
  const navigate = useNavigate();
  const {
    items, removeFromCart, updateQuantity, clearCart,
    totalPrice, totalItems,
    appliedCoupon, setAppliedCoupon, discountAmount,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [showCoupon, setShowCoupon]   = useState(false);
  const [shippingDismissed, setShippingDismissed] = useState(false);

  const baseShipping      = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const remainingForFree  = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const effectiveShipping = appliedCoupon?.type === "shipping" ? 0 : baseShipping;
  const discount          = discountAmount;
  const grandTotal        = Math.max(0, totalPrice - (appliedCoupon?.type === "shipping" ? 0 : discount) + effectiveShipping);

  const applyCoupon = () => {
    const code  = couponInput.trim().toUpperCase();
    const found = STATIC_COUPONS[code];
    if (!found) { setCouponError("Geçersiz kupon kodu."); return; }
    setAppliedCoupon({ code, type: found.type, value: found.value, label: found.label });
    setCouponError("");
    setCouponInput("");
    setShowCoupon(false);
  };

  /* ── BOŞ SEPET ── */
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background" style={{ paddingTop: 96 }}>
        <SEO title="Sepetim | Takimax" description="Alışveriş sepetiniz" />
        <AnnouncementBar />
        <Header />
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: "60vh", gap: 20, padding: "60px 24px",
        }}>
          <ShoppingCart size={130} strokeWidth={1.5} color="#111" />
          <p style={{
            fontFamily: "Montserrat, sans-serif", fontSize: 22, fontWeight: 700,
            color: "#111", margin: 0,
          }}>
            Sepetin Boş
          </p>
          <p style={{
            fontFamily: "Montserrat, sans-serif", fontSize: 16, fontWeight: 600,
            color: "#111", margin: 0, textAlign: "center",
          }}>
            Sepetinde henüz ürün yok
          </p>
          <Link to="/kategori/hepsi" style={{
            display: "block", padding: "16px 0", width: 340, maxWidth: "90vw",
            background: "#111", color: "#fff", textAlign: "center",
            textDecoration: "none", borderRadius: 8,
            fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700,
            letterSpacing: "0.04em", transition: "background 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "#c9a96e")}
            onMouseLeave={e => (e.currentTarget.style.background = "#111")}
          >
            Alışverişe Başla
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── DOLU SEPET ── */
  return (
    <div className="min-h-screen bg-background" style={{ paddingTop: 96 }}>
      <SEO title={`Sepetim (${totalItems}) | Takimax`} description="Alışveriş sepetiniz" />
      <AnnouncementBar />
      <Header />

      <div className="container mx-auto px-4 py-8 lg:py-12">

        {/* Başlık */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 20, fontWeight: 700, color: "#111", margin: 0 }}>
            Sepet ({totalItems})
          </h1>
          <button onClick={() => clearCart()} style={{
            display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
            cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#e53e3e", padding: 0,
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Sepeti Temizle <Trash2 size={14} />
          </button>
        </div>

        {/* Kargo bandı */}
        {!shippingDismissed && remainingForFree > 0 && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 18px", marginBottom: 16,
            background: "#f0eeff", border: "1px solid #d4c8ff", borderRadius: 8,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>📦</span>
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#4c3d9e" }}>
                Ücretsiz kargo hakkı kazanmanıza{" "}
                <strong>₺{remainingForFree.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} kaldı!</strong>
              </span>
            </div>
            <button onClick={() => setShippingDismissed(true)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#9d8fd4", display: "flex", padding: 4 }}>
              <X size={15} />
            </button>
          </div>
        )}
        {totalPrice >= FREE_SHIPPING_THRESHOLD && !shippingDismissed && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "14px 18px", marginBottom: 16,
            background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8,
          }}>
            <span style={{ fontSize: 18 }}>🎉</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#16a34a", fontWeight: 600 }}>
              Ücretsiz kargoya hak kazandınız!
            </span>
          </div>
        )}

        <div className="cart-layout" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>

          {/* ── SOL: Ürün Listesi ── */}
          <div>
            <div style={{ border: "1px solid #e8e8e8", borderRadius: 12, background: "#fff", overflow: "hidden" }}>
              {items.map((item, idx) => (
                <div key={item.product.id} style={{
                  display: "grid",
                  gridTemplateColumns: "88px 1fr",
                  gap: 16,
                  padding: "20px",
                  borderBottom: idx < items.length - 1 ? "1px solid #f0f0f0" : "none",
                  alignItems: "start",
                }}>
                  {/* Görsel */}
                  <Link to={`/urun/${item.product.id}`} style={{ display: "block" }}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      style={{ width: 88, height: 88, objectFit: "cover", borderRadius: 6, border: "1px solid #eee", display: "block" }}
                    />
                  </Link>

                  {/* Detay */}
                  <div>
                    <Link to={`/urun/${item.product.id}`} style={{
                      fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600,
                      color: "#111", textDecoration: "none", display: "block",
                      marginBottom: 3, lineHeight: 1.4,
                    }}>
                      {item.product.name}
                    </Link>

                    {item.product.material && (
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#aaa", margin: "0 0 12px" }}>
                        {item.product.material}
                      </p>
                    )}

                    {/* Adet + Birim fiyat + Toplam + Sil */}
                    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 14 }}>

                      {/* Adet */}
                      <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #ddd", borderRadius: 6 }}>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "#555" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#f5f5f5")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        ><Minus size={12} /></button>
                        <span style={{ width: 40, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, color: "#111", borderLeft: "1px solid #ddd", borderRight: "1px solid #ddd", lineHeight: "32px" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: item.quantity >= item.product.stock ? "not-allowed" : "pointer", color: "#555", opacity: item.quantity >= item.product.stock ? 0.3 : 1 }}
                          onMouseEnter={e => { if (item.quantity < item.product.stock) e.currentTarget.style.background = "#f5f5f5"; }}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        ><Plus size={12} /></button>
                      </div>

                      {/* Birim fiyat etiketi */}
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "#bbb", letterSpacing: "0.05em" }}>Birim Fiyat</span>
                        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#888" }}>
                          ₺{item.product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Satır toplam */}
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16, fontWeight: 700, color: "#111", marginLeft: "auto" }}>
                        ₺{(item.product.price * item.quantity).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                      </span>

                      {/* Sil */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", display: "flex", padding: 4 }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#e53e3e")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#ccc")}
                      ><Trash2 size={16} /></button>
                    </div>

                    {/* Stok uyarısı */}
                    {item.quantity >= item.product.stock && (
                      <div style={{ marginTop: 6 }}>
                        <FieldError msg={`Bu üründen en fazla ${item.product.stock} adet alabilirsiniz.`} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Alışverişe devam */}
            <div style={{ marginTop: 14, textAlign: "right" }}>
              <Link to="/kategori/hepsi" style={{
                fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#888",
                textDecoration: "underline", textUnderlineOffset: 3,
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "#111")}
                onMouseLeave={e => (e.currentTarget.style.color = "#888")}
              >
                Alışverişe Devam Et
              </Link>
            </div>
          </div>

          {/* ── SAĞ: Sipariş Özeti ── */}
          <div>
            <div style={{
              border: "1px solid #e8e8e8", borderRadius: 12,
              background: "#fff", position: "sticky", top: 110,
            }}>
              <div style={{ padding: "18px 22px", borderBottom: "1px solid #f0f0f0" }}>
                <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16, fontWeight: 700, color: "#111", margin: 0 }}>
                  Sipariş Özeti
                </h2>
              </div>

              <div style={{ padding: "18px 22px" }}>
                {/* Sepet tutarı */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, color: "#555" }}>Sepet Tutarı</span>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, color: "#111", fontWeight: 500 }}>
                    ₺{totalPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* İndirim */}
                {discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, color: "#555" }}>İndirim</span>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, color: "#16a34a", fontWeight: 600 }}>
                      -₺{discount.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Kargo */}
                {effectiveShipping > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, color: "#555" }}>Kargo</span>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, color: "#111", fontWeight: 500 }}>
                      ₺{effectiveShipping.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Toplam tutar */}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  paddingTop: 14, borderTop: "1px solid #f0f0f0", marginBottom: 18,
                }}>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700, color: "#111" }}>
                    Toplam Tutar
                  </span>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 20, fontWeight: 800, color: "#111" }}>
                    ₺{grandTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Ödemeye geç butonu */}
                <button
                  onClick={() => navigate("/odeme")}
                  style={{
                    width: "100%", padding: "16px 0", background: "#16a34a", color: "#fff",
                    border: "none", borderRadius: 8, cursor: "pointer",
                    fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700,
                    marginBottom: 12, transition: "background 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#15803d")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#16a34a")}
                >
                  Alışverişi Tamamla
                </button>

                {/* Hediye Çeki / Kupon */}
                <div style={{ border: "1px solid #f0f0f0", borderRadius: 8, overflow: "hidden" }}>
                  <button
                    onClick={() => setShowCoupon(v => !v)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "13px 16px", background: "none", border: "none", cursor: "pointer",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Gift size={17} style={{ color: "#c9a96e" }} />
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: appliedCoupon ? "#16a34a" : "#555", fontWeight: 500 }}>
                        {appliedCoupon ? `✓ ${appliedCoupon.label} uygulandı` : "Hediye Çeki Kullan"}
                      </span>
                    </span>
                    <ChevronRight size={16} style={{ color: "#aaa", transform: showCoupon ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                  </button>

                  {showCoupon && (
                    <div style={{ padding: "0 16px 14px", borderTop: "1px solid #f5f5f5" }}>
                      {appliedCoupon ? (
                        <div style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "8px 12px", borderRadius: 6, marginTop: 10,
                        }}>
                          <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#16a34a", fontWeight: 700 }}>
                            {appliedCoupon.code}
                          </span>
                          <button onClick={() => setAppliedCoupon(null)}
                            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#e53e3e", textDecoration: "underline" }}>
                            Kaldır
                          </button>
                        </div>
                      ) : (
                        <div style={{ marginTop: 10 }}>
                          <div style={{ display: "flex", gap: 8 }}>
                            <input
                              type="text"
                              value={couponInput}
                              onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                              onKeyDown={e => e.key === "Enter" && applyCoupon()}
                              placeholder="Kupon kodunu girin"
                              style={{ flex: 1, padding: "9px 12px", border: "1px solid #ddd", borderRadius: 6, fontFamily: "Montserrat, sans-serif", fontSize: 12, outline: "none" }}
                              onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")}
                              onBlur={e => (e.currentTarget.style.borderColor = "#ddd")}
                            />
                            <button onClick={applyCoupon}
                              style={{ padding: "9px 14px", background: "#111", color: "#fff", border: "none", cursor: "pointer", borderRadius: 6, fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, flexShrink: 0 }}
                              onMouseEnter={e => (e.currentTarget.style.background = "#c9a96e")}
                              onMouseLeave={e => (e.currentTarget.style.background = "#111")}
                            >Uygula</button>
                          </div>
                          {couponError && <FieldError msg={couponError} />}
                          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "#ccc", margin: "6px 0 0" }}>
                            Demo: TAKIMAX10 · HOSGELDIN · KARGO0
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />

      <style>{`
        @media (min-width: 1024px) {
          .cart-layout { grid-template-columns: 1fr 360px !important; }
        }
      `}</style>
    </div>
  );
};

export default Cart;