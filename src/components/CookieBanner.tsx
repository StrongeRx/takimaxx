import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const COOKIE_KEY = "takimax_cookie_consent";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY);
    if (!saved) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = (accepted: boolean) => {
    localStorage.setItem(COOKIE_KEY, accepted ? "accepted" : "rejected");
    setLeaving(true);
    setTimeout(() => setVisible(false), 380);
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes cookieUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cookieDown {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(16px); }
        }
      `}</style>

      <div style={{
        position: "fixed",
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 99990,
        animation: leaving
          ? "cookieDown 0.38s cubic-bezier(0.4,0,1,1) forwards"
          : "cookieUp 0.45s cubic-bezier(0.34,1.1,0.64,1)",
        maxWidth: 660,
        margin: "0 auto",
      }}>
        <div style={{
          background: "#fff",
          border: "1px solid #e8e4de",
          borderRadius: 12,
          boxShadow: "0 4px 24px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.05)",
          padding: "14px 16px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 12,
          boxSizing: "border-box",
          width: "100%",
        }}>

          {/* İkon + Metin */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "1 1 200px", minWidth: 0 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: "#fdf8f0", border: "1px solid #e8d5b0",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#c9a96e" opacity="0.12"/>
                <circle cx="12" cy="12" r="10" stroke="#c9a96e" strokeWidth="1.5"/>
                <circle cx="8.5"  cy="9"    r="1.2"  fill="#c9a96e"/>
                <circle cx="14"   cy="7.5"  r="0.9"  fill="#c9a96e"/>
                <circle cx="15.5" cy="13"   r="1.3"  fill="#c9a96e"/>
                <circle cx="9.5"  cy="14.5" r="1"    fill="#c9a96e"/>
                <circle cx="13"   cy="16.5" r="0.75" fill="#c9a96e"/>
              </svg>
            </div>
            <p style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 12,
              color: "#555",
              margin: 0,
              lineHeight: 1.55,
              minWidth: 0,
            }}>
              Deneyiminizi iyileştirmek için çerezler kullanıyoruz.{" "}
              <Link to="/gizlilik-politikasi" style={{ color: "#c9a96e", textDecoration: "underline", fontWeight: 600 }}>
                Gizlilik Politikası
              </Link>
            </p>
          </div>

          {/* Butonlar */}
          <div style={{ display: "flex", gap: 8, flexShrink: 0, width: "100%", maxWidth: 220, marginLeft: "auto" }}>
            <button
              onClick={() => dismiss(false)}
              style={{
                flex: 1,
                padding: "8px 0",
                background: "transparent",
                color: "#999",
                border: "1.5px solid #e5e5e5",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                fontSize: 11,
                fontWeight: 600,
                transition: "border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#bbb"; e.currentTarget.style.color = "#555"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e5e5"; e.currentTarget.style.color = "#999"; }}
            >
              Reddet
            </button>
            <button
              onClick={() => dismiss(true)}
              style={{
                flex: 1,
                padding: "8px 0",
                background: "#111",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#c9a96e")}
              onMouseLeave={e => (e.currentTarget.style.background = "#111")}
            >
              Kabul Et
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default CookieBanner;