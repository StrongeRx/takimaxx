import { ShoppingBag, CreditCard, Truck, Shield, RotateCcw, Flame, Clock, Star } from "lucide-react";
import { getStockStatus } from "@/data/products";
import type { Product } from "@/data/products";
import SocialProof from "@/components/SocialProof";

interface Props {
  product: Product;
  quantity: number;
  btnState: "idle" | "adding" | "added";
  avgRating: number;
  reviewCount: number;
  onQuantityChange: (q: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onScrollToReviews: () => void;
  onScrollToPayment: () => void;
}

const ProductAddToCart = ({
  product, quantity, btnState, avgRating, reviewCount,
  onQuantityChange, onAddToCart, onBuyNow, onScrollToReviews, onScrollToPayment,
}: Props) => {
  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="flex flex-col justify-center">
      <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground mb-2">{product.name}</h1>

      {/* Yıldızlar */}
      <div className="flex items-center gap-2 mb-4" style={{ paddingBottom: 14, borderBottom: "1px solid #f0ede8" }}>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < Math.round(avgRating) ? "fill-accent text-accent" : "text-border"}`} />
          ))}
        </div>
        <span className="font-body text-xs text-muted-foreground">{reviewCount} değerlendirme</span>
        <button onClick={onScrollToReviews} className="font-body text-xs text-accent hover:underline ml-1">Yorumları Gör</button>
      </div>

      {/* Stok adedi */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#374151", margin: 0 }}>
          Stok : <span style={{ fontWeight: 500 }}>{product.stock > 0 ? `${product.stock} adet` : "Tükendi"}</span>
        </p>
      </div>

      {/* Fiyat */}
      <div className="flex items-baseline gap-3 mb-6">
        {product.oldPrice && (
          <span className="font-body text-lg text-muted-foreground line-through">
            ₺{product.oldPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
          </span>
        )}
        <span className="font-heading text-4xl font-bold text-foreground">
          ₺{product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
        </span>
      </div>

      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">{product.description}</p>

      {/* Sosyal kanıt */}
      <div style={{ marginBottom: 24 }}>
        <SocialProof product={product} />
      </div>

      {/* Stok uyarıları */}
      {stockStatus !== "ok" && (
        <div style={{ marginBottom: 24 }}>
          {stockStatus === "out" && (
            <div style={{ background: "#fafafa", border: "1px solid #e5e7eb", borderRadius: 8, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ShoppingBag className="w-5 h-5" style={{ color: "#9ca3af" }} />
              </div>
              <div>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, color: "#374151", margin: 0 }}>Bu ürün şu an stokta bulunmuyor</p>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#9ca3af", margin: "3px 0 0" }}>
                  Stoka girdiğinde bildirim almak için{" "}
                  <a href="/iletisim" style={{ color: "#c9a96e", textDecoration: "none", fontWeight: 600 }}>bize ulaşın →</a>
                </p>
              </div>
            </div>
          )}
          {(stockStatus === "critical" || stockStatus === "low") && (() => {
            const isCritical = stockStatus === "critical";
            const pct = Math.min(100, Math.round((product.stock / 10) * 100));
            const ac = isCritical ? "#dc2626" : "#d97706";
            const bg = isCritical ? "#fff5f5" : "#fffbeb";
            const br = isCritical ? "#fecaca" : "#fde68a";
            const tr = isCritical ? "#fee2e2" : "#fef3c7";
            return (
              <div style={{ background: bg, border: `1px solid ${br}`, borderRadius: 8, padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${ac}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {isCritical ? <Flame className="w-4 h-4" style={{ color: ac }} /> : <Clock className="w-4 h-4" style={{ color: ac }} />}
                    </div>
                    <div>
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, color: ac, margin: 0 }}>
                        {isCritical ? `Son ${product.stock} ürün kaldı — hızlı olun!` : `Stokta yalnızca ${product.stock} adet kaldı`}
                      </p>
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: isCritical ? "#7f1d1d" : "#78350f", margin: "2px 0 0", opacity: 0.7 }}>
                        {isCritical ? "Bu ürün çok hızlı satılıyor, stok tükenmeden sepetinize ekleyin" : "Bu ürüne olan yoğun ilgi nedeniyle stok sınırlıdır"}
                      </p>
                    </div>
                  </div>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 800, color: ac, background: `${ac}15`, border: `1px solid ${ac}30`, padding: "4px 12px", borderRadius: 99, whiteSpace: "nowrap" }}>
                    {isCritical ? "Kritik Stok" : "Az Stok"}
                  </span>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 600, color: ac, opacity: 0.8 }}>Stok doluluk oranı</span>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, color: ac }}>%{pct}</span>
                  </div>
                  <div style={{ height: 7, background: tr, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${ac}aa, ${ac})`, borderRadius: 99, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Adet seçici */}
      {stockStatus !== "out" && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <button onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            style={{ width: 42, height: 42, border: "1.5px solid #ddd", borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 20, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#333", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.background = "#111"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#333"; }}>−</button>
          <span style={{ width: 56, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700, color: "#111", border: "1.5px solid #ddd", borderRadius: 4, padding: "8px 0", display: "block" }}>{quantity}</span>
          <button onClick={() => onQuantityChange(Math.min(product.stock, quantity + 1))}
            disabled={quantity >= product.stock}
            style={{ width: 42, height: 42, border: "1.5px solid #ddd", borderRadius: 4, background: "#fff", cursor: quantity >= product.stock ? "not-allowed" : "pointer", fontSize: 20, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#333", opacity: quantity >= product.stock ? 0.3 : 1, transition: "all 0.15s" }}
            onMouseEnter={e => { if (quantity < product.stock) { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.background = "#111"; e.currentTarget.style.color = "#fff"; }}}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#333"; }}>+</button>
        </div>
      )}

      {/* Sepete Ekle + Satın Al */}
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <button onClick={onAddToCart} disabled={stockStatus === "out"} className="pd-atc-btn"
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: stockStatus === "out" ? "#e5e7eb" : btnState === "added" ? "linear-gradient(135deg,#15803d,#16a34a)" : btnState === "adding" ? "linear-gradient(135deg,#b8860b,#c9a96e)" : "linear-gradient(135deg,#1a1a1a,#333)", color: stockStatus === "out" ? "#9ca3af" : "#fff", border: "none", borderRadius: 4, cursor: stockStatus === "out" ? "not-allowed" : btnState === "idle" ? "pointer" : "default", fontFamily: "Montserrat, sans-serif", fontSize: "clamp(10px, 2vw, 12px)", fontWeight: 800, letterSpacing: "clamp(0.05em, 1vw, 0.2em)", textTransform: "uppercase", padding: "16px 8px", overflow: "hidden", position: "relative", whiteSpace: "nowrap", transition: "background 0.5s ease, box-shadow 0.3s ease, transform 0.15s ease", boxShadow: btnState === "added" ? "0 6px 24px rgba(21,128,61,0.45)" : btnState === "adding" ? "0 6px 24px rgba(201,169,110,0.4)" : "0 2px 10px rgba(0,0,0,0.2)", transform: btnState === "adding" ? "scale(0.98)" : "scale(1)" }}
            onMouseEnter={e => { if (btnState === "idle" && stockStatus !== "out") { e.currentTarget.style.background = "linear-gradient(135deg,#c9a96e,#e8cc9a)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(201,169,110,0.5)"; }}}
            onMouseLeave={e => { if (btnState === "idle" && stockStatus !== "out") { e.currentTarget.style.background = "linear-gradient(135deg,#1a1a1a,#333)"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)"; }}}>
            {btnState === "adding" && <span style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)", animation: "pdRipple 0.7s ease forwards", zIndex: 0 }} />}
            {btnState === "added" && <span style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%)", animation: "pdShimmer 0.9s ease 0.1s both", zIndex: 0 }} />}
            <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 8 }}>
              {stockStatus === "out" ? "STOK TÜKENMİŞTİR" : btnState === "idle" ? (
                <span className="pd-idle" style={{ display: "flex", alignItems: "center", gap: 8 }}><ShoppingBag size={15} />SEPETE EKLE</span>
              ) : btnState === "adding" ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8, animation: "pdSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
                  <span style={{ display: "flex", position: "relative", width: 18, height: 18 }}>
                    <ShoppingBag size={15} style={{ position: "absolute", animation: "pdBagFly 0.65s cubic-bezier(0.4,0,1,1) forwards" }} />
                    <span style={{ position: "absolute", left: -2, top: "50%", width: 9, height: 1.5, background: "rgba(255,255,255,0.5)", animation: "pdTrail 0.65s ease forwards", borderRadius: 99 }} />
                  </span>
                  <span style={{ animation: "pdPulseText 0.5s ease infinite alternate" }}>EKLENİYOR</span>
                  <span style={{ display: "flex", gap: 3 }}>
                    {[0,1,2].map(i => <span key={i} style={{ width: 3.5, height: 3.5, borderRadius: "50%", background: "rgba(255,255,255,0.7)", display: "inline-block", animation: `pdDot 0.6s ease ${i * 0.15}s infinite alternate` }} />)}
                  </span>
                </span>
              ) : (
                <span style={{ display: "flex", alignItems: "center", gap: 8, animation: "pdSuccessIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>
                  <svg width="20" height="20" viewBox="0 0 18 18" fill="none" style={{ overflow: "visible" }}>
                    <circle cx="9" cy="9" r="8" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" style={{ strokeDasharray: 51, strokeDashoffset: 0, animation: "pdCircleDraw 0.4s ease forwards" }} />
                    <circle cx="9" cy="9" r="8" fill="rgba(255,255,255,0.12)" style={{ animation: "pdCirclePop 0.4s ease forwards" }} />
                    <path d="M5 9 L7.8 12 L13 6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 13, strokeDashoffset: 0, animation: "pdCheckDraw 0.35s ease 0.2s both" }} />
                  </svg>
                  <span style={{ animation: "pdSuccessText 0.4s ease 0.15s both" }}>SEPETE EKLENDİ!</span>
                </span>
              )}
            </span>
          </button>
        </div>

        {stockStatus !== "out" && (
          <button onClick={onBuyNow}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#111", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: "clamp(10px, 2vw, 12px)", fontWeight: 700, letterSpacing: "clamp(0.05em, 1vw, 0.2em)", textTransform: "uppercase", padding: "16px 8px", whiteSpace: "nowrap", transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#333"}
            onMouseLeave={e => e.currentTarget.style.background = "#111"}>
            <CreditCard size={15} />SATIN AL
          </button>
        )}
      </div>

      {stockStatus !== "out" && quantity >= product.stock && (
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 600, color: "#dc2626", marginBottom: 20 }}>
          ⚠ Bu üründen en fazla {product.stock} adet satın alabilirsiniz
        </p>
      )}
      {stockStatus === "out" && (
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#9ca3af", marginBottom: 20 }}>
          Stoka girdiğinde haberdar olmak için <a href="/iletisim" style={{ color: "#c9a96e", fontWeight: 600, textDecoration: "none" }}>bize ulaşın →</a>
        </p>
      )}

      <div className="flex items-center gap-2 mb-8 p-3 bg-secondary border border-border rounded-sm">
        <CreditCard className="w-4 h-4 text-accent shrink-0" />
        <p className="font-body text-xs text-muted-foreground">
          <span className="text-foreground font-semibold">12 aya kadar taksit</span> imkânı •{" "}
          <button onClick={onScrollToPayment} className="text-accent hover:underline">Ödeme seçeneklerini gör</button>
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
        <div className="text-center"><Truck className="w-5 h-5 mx-auto mb-2 text-accent" /><p className="font-body text-[10px] tracking-wider uppercase text-muted-foreground">Aynı Gün Kargo</p></div>
        <div className="text-center"><Shield className="w-5 h-5 mx-auto mb-2 text-accent" /><p className="font-body text-[10px] tracking-wider uppercase text-muted-foreground">Güvenli Ödeme</p></div>
        <div className="text-center"><RotateCcw className="w-5 h-5 mx-auto mb-2 text-accent" /><p className="font-body text-[10px] tracking-wider uppercase text-muted-foreground">Kolay İade</p></div>
      </div>

      <style>{`
        .pd-atc-btn:hover .pd-idle svg { animation: pdBagWiggle 0.4s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes pdBagWiggle { 0%{transform:translateY(0) rotate(0deg)} 30%{transform:translateY(-5px) rotate(-10deg)} 65%{transform:translateY(-2px) rotate(6deg)} 100%{transform:translateY(0) rotate(0deg)} }
        @keyframes pdRipple { 0%{transform:scale(0.5);opacity:1} 100%{transform:scale(2.5);opacity:0} }
        @keyframes pdShimmer { from{transform:translateX(-120%)} to{transform:translateX(220%)} }
        @keyframes pdBagFly { 0%{opacity:1;transform:translate(0,0) scale(1) rotate(0deg)} 40%{opacity:1;transform:translate(7px,-8px) scale(1.1) rotate(12deg)} 100%{opacity:0;transform:translate(16px,-24px) scale(0.4) rotate(22deg)} }
        @keyframes pdTrail { 0%{width:0;opacity:0;transform:translateX(10px)} 40%{width:12px;opacity:0.7} 100%{width:4px;opacity:0;transform:translateX(0)} }
        @keyframes pdPulseText { from{opacity:.65} to{opacity:1} }
        @keyframes pdDot { from{transform:translateY(0);opacity:0.4} to{transform:translateY(-5px);opacity:1} }
        @keyframes pdSlideIn { from{opacity:0;transform:translateY(10px) scale(0.93)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes pdSuccessIn { 0%{opacity:0;transform:scale(0.72) translateY(8px)} 55%{transform:scale(1.08) translateY(-2px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes pdSuccessText { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pdCircleDraw { from{stroke-dashoffset:51;opacity:0.2} to{stroke-dashoffset:0;opacity:1} }
        @keyframes pdCirclePop { 0%{r:4;opacity:0} 50%{r:9;opacity:0.25} 100%{r:8;opacity:0.12} }
        @keyframes pdCheckDraw { from{stroke-dashoffset:13} to{stroke-dashoffset:0} }
        @media (max-width: 480px) {
          .pd-atc-btn, .pd-atc-btn + button { font-size: 10px !important; letter-spacing: 0.05em !important; padding: 14px 6px !important; gap: 5px !important; }
        }
      `}</style>
    </div>
  );
};

export default ProductAddToCart;