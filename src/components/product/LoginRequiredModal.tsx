import { useEffect } from "react";
import { X, Lock, Star, LogIn, UserPlus } from "lucide-react";

interface Props {
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

const LoginRequiredModal = ({ onClose, onLogin, onRegister }: Props) => {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)", zIndex: 900, animation: "lrModalBg 0.2s ease" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 901, background: "#fff", width: "min(420px, 92vw)", borderRadius: 4, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.22)", animation: "lrModalIn 0.28s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg, #c9a96e, #e8cc9a, #c9a96e)" }} />
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: "#bbb", display: "flex", padding: 6, borderRadius: "50%", transition: "color 0.2s, background 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#111"; e.currentTarget.style.background = "#f5f5f5"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#bbb"; e.currentTarget.style.background = "none"; }}>
          <X size={17} />
        </button>
        <div style={{ padding: "34px 34px 30px" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, #fdf8f0, #f5ead8)", border: "1.5px solid #e8d5b0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            <Lock size={24} style={{ color: "#c9a96e" }} />
          </div>
          <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 24, fontWeight: 600, color: "#111", margin: "0 0 10px", lineHeight: 1.2 }}>Yorum Yapın</h3>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13.5, color: "#666", lineHeight: 1.7, margin: "0 0 22px" }}>
            Yorum yapabilmek ve puan verebilmek için{" "}
            <strong style={{ color: "#111" }}>üye girişi</strong> yapmanız gerekmektedir.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 14px", background: "#faf7f2", borderRadius: 5, border: "1px solid #f0ead8", marginBottom: 24 }}>
            {[1,2,3,4,5].map(i => <Star key={i} size={15} style={{ color: "#e0d5c0", fill: "none" }} />)}
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#bbb", marginLeft: 4 }}>Puan vermek için giriş yapın</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={onLogin} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "13px", background: "#111", color: "#fff", border: "none", borderRadius: 2, cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#c9a96e"}
              onMouseLeave={e => e.currentTarget.style.background = "#111"}>
              <LogIn size={15} /> Giriş Yap
            </button>
            <button onClick={onRegister} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "13px", background: "transparent", color: "#111", border: "1.5px solid #ddd", borderRadius: 2, cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", transition: "border-color 0.2s, color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#c9a96e"; e.currentTarget.style.color = "#c9a96e"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.color = "#111"; }}>
              <UserPlus size={15} /> Ücretsiz Kayıt Ol
            </button>
          </div>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#bbb", textAlign: "center", marginTop: 16, lineHeight: 1.5 }}>
            Kayıt olarak <span style={{ color: "#c9a96e" }}>Kullanım Koşulları</span>'nı kabul etmiş olursunuz.
          </p>
        </div>
      </div>
      <style>{`
        @keyframes lrModalBg { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lrModalIn { from { opacity: 0; transform: translate(-50%, -46%) scale(0.94); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
      `}</style>
    </>
  );
};

export default LoginRequiredModal;