import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
  }, [location.pathname]);

  return (
    <div className="header-offset" style={{ minHeight: "100vh", background: "#faf9f7", display: "flex", flexDirection: "column", paddingTop: 96 }}>
      <SEO
        title="Sayfa Bulunamadı (404) – Takimax"
        description="Aradığınız sayfa bulunamadı. Takimax ana sayfasına dönerek alışverişe devam edebilirsiniz."
        noIndex={true}
      />
      <AnnouncementBar />
      <Header />

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px" }}>
        <div style={{ textAlign: "center", maxWidth: 480 }}>

          {/* 404 Büyük Yazı */}
          <div style={{ position: "relative", marginBottom: 32 }}>
            <p style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(96px, 20vw, 160px)",
              fontWeight: 700, lineHeight: 1,
              color: "transparent",
              WebkitTextStroke: "2px #e5e0d8",
              letterSpacing: "0.05em",
              margin: 0,
              userSelect: "none",
            }}>
              404
            </p>
            {/* Ortadaki ikon */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 56, height: 56, borderRadius: "50%",
              background: "#fff", border: "1px solid #eee",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="11" y1="8" x2="11" y2="11"/><line x1="11" y1="14" x2="11.01" y2="14"/>
              </svg>
            </div>
          </div>

          {/* Başlık */}
          <h1 style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "clamp(22px, 5vw, 32px)",
            fontWeight: 600, color: "#111", marginBottom: 12,
          }}>
            Sayfa Bulunamadı
          </h1>

          <p style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 13, color: "#888", lineHeight: 1.8,
            marginBottom: 36,
          }}>
            Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.<br />
            Endişelenmeyin, sizi doğru yere götürelim.
          </p>

          {/* Butonlar */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "13px 28px", background: "#111", color: "#fff",
                fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#c9a96e")}
              onMouseLeave={e => (e.currentTarget.style.background = "#111")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              Anasayfaya Dön
            </Link>

            <Link to="/giris"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "13px 28px", background: "transparent", color: "#111",
                border: "1px solid #ddd",
                fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#c9a96e"; e.currentTarget.style.color = "#c9a96e"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.color = "#111"; }}
            >
              Giriş Yap
            </Link>
          </div>

          {/* Popüler Linkler */}
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid #eee" }}>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#bbb", marginBottom: 16 }}>
              Popüler Sayfalar
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              {["Kolye", "Küpe", "Bileklik", "Yüzük", "Hediyelik Setler"].map((item) => (
                <a key={item} href="#"
                  style={{
                    fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#666",
                    textDecoration: "none", padding: "6px 14px", border: "1px solid #eee",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#c9a96e"; e.currentTarget.style.color = "#c9a96e"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.color = "#666"; }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;