import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/data/products";

interface Props {
  product: Product;
  onAddToCart: (e: React.MouseEvent, product: Product, qty: number) => void;
}

const AddToCartRow = ({ product, onAddToCart }: Props) => {
  const [qty, setQty] = useState(1);
  const [btnState, setBtnState] = useState<"idle" | "adding" | "added">("idle");
  const [confetti, setConfetti] = useState<{ id: number; x: number; color: string; rot: number; size: number }[]>([]);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (btnState !== "idle") return;

    const colors = ["#c9a96e", "#f5d78e", "#fff", "#e8cc9a", "#ffd700", "#ffe4b5"];
    setConfetti(Array.from({ length: 14 }, (_, i) => ({
      id: Date.now() + i,
      x: 30 + Math.random() * 40,
      color: colors[i % colors.length],
      rot: Math.random() * 360,
      size: 4 + Math.random() * 5,
    })));
    setTimeout(() => setConfetti([]), 900);

    setBtnState("adding");
    onAddToCart(e, product, qty);
    setTimeout(() => setBtnState("added"), 700);
    setTimeout(() => setBtnState("idle"), 2600);
  };

  const dec = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setQty(q => Math.max(1, q - 1)); };
  const inc = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setQty(q => Math.min(product.stock, q + 1)); };

  return (
    <div style={{ marginTop: 12 }} onClick={e => { e.preventDefault(); e.stopPropagation(); }}>
      {/* Miktar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <button onClick={dec} style={{ width: 30, height: 30, border: "1.5px solid #ddd", borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#333", transition: "all 0.15s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.background = "#111"; e.currentTarget.style.color = "#fff"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#333"; }}>−</button>
        <span style={{ flex: 1, textAlign: "center", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: "#111", border: "1.5px solid #ddd", borderRadius: 4, padding: "4px 0" }}>{qty}</span>
        <button onClick={inc} style={{ width: 30, height: 30, border: "1.5px solid #ddd", borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#333", transition: "all 0.15s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.background = "#111"; e.currentTarget.style.color = "#fff"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#333"; }}>+</button>
      </div>

      {/* Buton */}
      <div style={{ position: "relative" }}>
        {confetti.map(c => (
          <span key={c.id} style={{ position: "absolute", left: `${c.x}%`, top: "50%", width: c.size, height: c.size * 0.55, background: c.color, borderRadius: 1, pointerEvents: "none", zIndex: 20, transform: `rotate(${c.rot}deg)`, animation: "atcConfetti 0.85s cubic-bezier(0.25,0.46,0.45,0.94) forwards", "--dy": `${-40 - Math.random() * 35}px`, "--dx": `${(Math.random() - 0.5) * 50}px` } as React.CSSProperties} />
        ))}

        <button
          onClick={handleAdd}
          className="atc-btn"
          style={{
            width: "100%", height: 42, border: "none", borderRadius: 4,
            cursor: btnState === "idle" ? "pointer" : "default",
            overflow: "hidden", position: "relative",
            fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 800,
            letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff",
            background: btnState === "added" ? "linear-gradient(135deg,#15803d,#16a34a)" : btnState === "adding" ? "linear-gradient(135deg,#b8860b,#c9a96e)" : "linear-gradient(135deg,#1a1a1a,#333)",
            transition: "background 0.5s ease, box-shadow 0.3s ease, transform 0.15s ease",
            boxShadow: btnState === "added" ? "0 4px 20px rgba(21,128,61,0.45)" : btnState === "adding" ? "0 4px 20px rgba(201,169,110,0.4)" : "0 2px 8px rgba(0,0,0,0.2)",
            transform: btnState === "adding" ? "scale(0.97)" : "scale(1)",
          }}
          onMouseEnter={e => { if (btnState === "idle") { e.currentTarget.style.background = "linear-gradient(135deg,#c9a96e,#e8cc9a)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(201,169,110,0.45)"; } }}
          onMouseLeave={e => { if (btnState === "idle") { e.currentTarget.style.background = "linear-gradient(135deg,#1a1a1a,#333)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)"; } }}
        >
          {btnState === "adding" && <span style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center,rgba(255,255,255,0.15) 0%,transparent 70%)", animation: "atcRipple 0.7s ease forwards", zIndex: 0 }} />}
          {btnState === "added" && <span style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.22) 50%,transparent 70%)", animation: "atcShimmer 0.9s ease 0.1s both", zIndex: 0 }} />}

          <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            {btnState === "idle" && (
              <span className="atc-idle" style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <ShoppingBag size={13} /> Sepete Ekle
              </span>
            )}
            {btnState === "adding" && (
              <span style={{ display: "flex", alignItems: "center", gap: 8, animation: "atcSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
                <span style={{ display: "flex", position: "relative", width: 16, height: 16 }}>
                  <ShoppingBag size={14} style={{ position: "absolute", animation: "atcBagFly 0.65s cubic-bezier(0.4,0,1,1) forwards" }} />
                  <span style={{ position: "absolute", left: -2, top: "50%", marginTop: -0.5, width: 8, height: 1.5, background: "rgba(255,255,255,0.5)", animation: "atcTrail 0.65s ease forwards", borderRadius: 99 }} />
                </span>
                <span style={{ animation: "atcPulseText 0.5s ease infinite alternate" }}>Ekleniyor</span>
                <span style={{ display: "flex", gap: 3 }}>
                  {[0, 1, 2].map(i => <span key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.7)", display: "inline-block", animation: `atcDot 0.6s ease ${i * 0.15}s infinite alternate` }} />)}
                </span>
              </span>
            )}
            {btnState === "added" && (
              <span style={{ display: "flex", alignItems: "center", gap: 8, animation: "atcSuccessIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ overflow: "visible" }}>
                  <circle cx="9" cy="9" r="8" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" style={{ strokeDasharray: 51, strokeDashoffset: 0, animation: "atcCircleDraw 0.4s ease forwards" }} />
                  <circle cx="9" cy="9" r="8" fill="rgba(255,255,255,0.12)" style={{ animation: "atcCirclePop 0.4s ease forwards" }} />
                  <path d="M5 9 L7.8 12 L13 6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 13, strokeDashoffset: 0, animation: "atcCheckDraw 0.35s ease 0.2s both" }} />
                </svg>
                <span style={{ animation: "atcSuccessText 0.4s ease 0.15s both" }}>Sepete Eklendi!</span>
              </span>
            )}
          </span>
        </button>
      </div>

      <style>{`
        .atc-btn:hover .atc-idle svg { animation: atcBagWiggle 0.4s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes atcBagWiggle { 0%{transform:translateY(0) rotate(0deg)} 30%{transform:translateY(-4px) rotate(-8deg)} 65%{transform:translateY(-2px) rotate(5deg)} 100%{transform:translateY(0) rotate(0deg)} }
        @keyframes atcBagFly { 0%{opacity:1;transform:translate(0,0) scale(1) rotate(0deg)} 40%{opacity:1;transform:translate(6px,-6px) scale(1.1) rotate(10deg)} 100%{opacity:0;transform:translate(14px,-20px) scale(0.5) rotate(20deg)} }
        @keyframes atcTrail { 0%{width:0;opacity:0;transform:translateX(8px)} 40%{width:10px;opacity:0.7} 100%{width:4px;opacity:0;transform:translateX(0)} }
        @keyframes atcPulseText { from{opacity:0.7} to{opacity:1} }
        @keyframes atcDot { from{transform:translateY(0);opacity:0.4} to{transform:translateY(-4px);opacity:1} }
        @keyframes atcSlideIn { from{opacity:0;transform:translateY(8px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes atcRipple { 0%{transform:scale(0.5);opacity:1} 100%{transform:scale(2.5);opacity:0} }
        @keyframes atcSuccessIn { 0%{opacity:0;transform:scale(0.75) translateY(6px)} 55%{transform:scale(1.07) translateY(-2px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes atcSuccessText { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
        @keyframes atcCircleDraw { from{stroke-dashoffset:51;opacity:0.2} to{stroke-dashoffset:0;opacity:1} }
        @keyframes atcCirclePop { 0%{r:4;opacity:0} 50%{r:9;opacity:0.25} 100%{r:8;opacity:0.12} }
        @keyframes atcCheckDraw { from{stroke-dashoffset:13} to{stroke-dashoffset:0} }
        @keyframes atcShimmer { from{transform:translateX(-120%)} to{transform:translateX(220%)} }
        @keyframes atcConfetti { 0%{transform:rotate(var(--rot,0deg)) translate(0,0) scale(1);opacity:1} 100%{transform:rotate(calc(var(--rot,0deg) + 180deg)) translate(var(--dx,20px),var(--dy,-40px)) scale(0.3);opacity:0} }
      `}</style>
    </div>
  );
};

export default AddToCartRow;