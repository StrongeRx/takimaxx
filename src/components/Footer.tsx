import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";
import logoSvg from "@/assets/logo.svg";
import cardLogos from "@/assets/card-logos.webp";
import bankLogos from "@/assets/bank-logos.webp";

type Section = {
  title: string;
  links: { label: string; href: string }[];
};

const sections: Section[] = [
  {
    title: "Popüler Kategoriler",
    links: [
      { label: "Kadın Küpe", href: "/kategori/kadin-aksesuar/kupe" },
      { label: "Kadın Kolye", href: "/kategori/kadin-aksesuar/kolye" },
      { label: "Sevgiliye Özel", href: "/kategori/hediyelik-setler/sevgili" },
      { label: "Erkek Kolye", href: "/kategori/erkek-aksesuar/kolye" },
      { label: "Erkek Yüzük", href: "/kategori/erkek-aksesuar/yuzuk" },
    ],
  },
  {
    title: "Alışveriş Bilgileri",
    links: [
      { label: "Favorilerim", href: "#" },
      { label: "Sepetim", href: "#" },
      { label: "İade Taleplerim", href: "/iade-ve-degisim" },
      { label: "Sipariş Takibi", href: "/siparis-takibi" },
      { label: "Hesabım", href: "/giris" },
    ],
  },
  {
    title: "Müşteri Hizmetleri",
    links: [
      { label: "Canlı Destek", href: "/iletisim" },
      { label: "Mesafeli Satış Sözleşmesi", href: "/sozlesmeler" },
      { label: "Üyelik Sözleşmesi", href: "/sozlesmeler" },
      { label: "Kişisel Verilerin Korunma Kanunu", href: "/gizlilik-politikasi" },
      { label: "Gizlilik Politikası & Kuralları", href: "/gizlilik-politikasi" },
    ],
  },
  {
    title: "Kurumsal",
    links: [
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "İletişim", href: "/iletisim" },
      { label: "İade ve Değişim Koşulları", href: "/iade-ve-degisim" },
      { label: "Sıkça Sorulan Sorular", href: "/sikca-sorulan-sorular" },
    ],
  },
];

const SocialIcons = () => (
  <div style={{ display: "flex", gap: 8 }}>
    {[
      {
        href: "https://instagram.com/takimax", label: "Instagram",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
      },
      {
        href: "https://facebook.com/takimax", label: "Facebook",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(255,255,255,0.75)"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
      },
      {
        href: "https://tiktok.com/@takimax", label: "TikTok",
        icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.75)"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/></svg>
      },
    ].map(s => (
      <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
        style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", flexShrink: 0 }}>
        {s.icon}
      </a>
    ))}
  </div>
);

const Footer = () => {
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "error" | "success">("idle");
  const [openSection, setOpenSection] = useState<string | null>(null);
  const { setIsCartOpen } = useCart();
  const { setIsFavDrawerOpen } = useFavorites();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleIadeTaleplerim = () => {
    if (isLoggedIn) navigate("/hesabim", { state: { tab: "returns" } });
    else navigate("/giris", { state: { from: "/hesabim", tab: "returns" } });
  };

  const handleSubmit = () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailStatus("error"); return;
    }
    setEmailStatus("success"); setEmail("");
    setTimeout(() => setEmailStatus("idle"), 4000);
  };

  const toggle = (title: string) => setOpenSection(openSection === title ? null : title);

  const renderLink = (link: { label: string; href: string }) => {
    const style: React.CSSProperties = {
      fontSize: "13px",
      color: "rgba(255,255,255,0.65)",
      background: "none", border: "none", cursor: "pointer",
      padding: 0, textDecoration: "none", fontFamily: "inherit",
      display: "block", textAlign: "left",
    };
    if (link.label === "Sepetim")
      return <button onClick={() => setIsCartOpen(true)} style={style}>{link.label}</button>;
    if (link.label === "Favorilerim")
      return <button onClick={() => setIsFavDrawerOpen(true)} style={style}>{link.label}</button>;
    if (link.label === "İade Taleplerim")
      return <button onClick={handleIadeTaleplerim} style={style}>{link.label}</button>;
    return <Link to={link.href} style={style}>{link.label}</Link>;
  };

  return (
    <footer style={{ backgroundColor: "#111", color: "#fff", overflowX: "hidden" }}>
      <style>{`
        .footer-desktop { display: none; }
        .footer-mobile  { display: block; }
        @media (min-width: 768px) {
          .footer-desktop { display: block; }
          .footer-mobile  { display: none; }
        }
        .footer-link-btn:hover { color: #fff !important; }
        .footer-social-btn:hover {
          background: rgba(201,169,110,0.18) !important;
          border-color: rgba(201,169,110,0.5) !important;
        }
      `}</style>

      {/* ══ MOBİL ══ */}
      <div className="footer-mobile" style={{ padding: "32px 20px", boxSizing: "border-box", width: "100%" }}>

        {/* Logo + açıklama + sosyal */}
        <div style={{ marginBottom: 28, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 24 }}>
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <img loading="lazy" src={logoSvg} alt="Takimax" style={{ maxWidth: 120, display: "block" }} />
          </Link>
          <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.12)", margin: "14px 0" }} />
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, margin: "0 0 20px", letterSpacing: "0.01em" }}>
            Kadın, erkek ve çocuk aksesuarından kozmetiğe, saç ürünlerinden hediyelik setlere kadar geniş bir koleksiyonu sizlerle buluşturuyoruz.
          </p>
          <SocialIcons />
        </div>

        {/* Accordion menüler */}
        {sections.map(section => (
          <div key={section.title} style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <button onClick={() => toggle(section.title)} style={{ width: "100%", background: "transparent", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "left", fontFamily: "Montserrat, sans-serif" }}>
              {section.title}
              <span style={{ fontSize: 18, lineHeight: 1, color: "rgba(255,255,255,0.5)", transform: openSection === section.title ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>+</span>
            </button>
            {openSection === section.title && (
              <ul style={{ listStyle: "none", padding: "0 0 16px 0", margin: 0 }}>
                {section.links.map(link => (
                  <li key={link.label} style={{ marginBottom: 12 }}>
                    {renderLink(link)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* E-Bülten accordion */}
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <button onClick={() => toggle("ebulten")} style={{ width: "100%", background: "transparent", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "left", fontFamily: "Montserrat, sans-serif" }}>
            E-Bülten Kayıt
            <span style={{ fontSize: 18, lineHeight: 1, color: "rgba(255,255,255,0.5)", transform: openSection === "ebulten" ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>+</span>
          </button>
          {openSection === "ebulten" && (
            <div style={{ paddingBottom: 16 }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 12 }}>Kampanyalarımızdan ve indirimlerimizden güncel olarak haberdar olun.</p>
              <div style={{ display: "flex", alignItems: "center", border: `1px solid ${emailStatus === "error" ? "#ff4d4d" : emailStatus === "success" ? "#4caf50" : "rgba(255,255,255,0.25)"}` }}>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setEmailStatus("idle"); }} onKeyDown={e => e.key === "Enter" && handleSubmit()} placeholder="E-posta adresinizi yazın..." style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#fff", padding: "10px 12px", minWidth: 0, fontFamily: "Montserrat, sans-serif" }} />
                <button onClick={handleSubmit} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#c9a96e", padding: "10px 14px", whiteSpace: "nowrap", fontFamily: "Montserrat, sans-serif" }}>Gönder</button>
              </div>
              {emailStatus === "error" && <p style={{ fontSize: 11, color: "#ff4d4d", marginTop: 6 }}>⚠ Lütfen geçerli bir e-posta adresi giriniz.</p>}
              {emailStatus === "success" && <p style={{ fontSize: 11, color: "#4caf50", marginTop: 6 }}>✓ E-posta adresiniz başarıyla kaydedildi!</p>}
            </div>
          )}
        </div>

        {/* Ödeme logoları */}
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <img loading="lazy" src={cardLogos} alt="Kart logoları" style={{ height: 26, objectFit: "contain", opacity: 0.9, maxWidth: "100%" }} />
          <img loading="lazy" src={bankLogos} alt="Ödeme yöntemleri" style={{ height: 20, objectFit: "contain", opacity: 0.8, maxWidth: "100%" }} />
        </div>

        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 20, marginBottom: 0, textAlign: "center", fontWeight: 500 }}>
          © 2026 Takimax. Tüm hakları saklıdır.
        </p>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 10, marginBottom: 0, textAlign: "center" }}>
          Coded by{" "}
          <a
            href="https://www.instagram.com/macosgun/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontWeight: 700,
              letterSpacing: "0.08em",
              textDecoration: "none",
              background: "linear-gradient(90deg, #1a6fd4, #4facf7, #1a6fd4)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 2.5s linear infinite",
            }}
          >
            Macosgun
          </a>
        </p>
      </div>

      {/* ══ MASAÜSTÜ ══ */}
      <div className="footer-desktop">
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "180px repeat(5, 1fr)", gap: 32 }}>

            {/* Logo sütunu */}
            <div style={{ display: "flex", flexDirection: "column", paddingTop: 4 }}>
              <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                <img loading="lazy" src={logoSvg} alt="Takimax" style={{ maxWidth: 140 }} />
              </Link>
              <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.12)", margin: "16px 0" }} />
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11.5, color: "rgba(255,255,255,0.42)", lineHeight: 1.85, margin: "0 0 20px", letterSpacing: "0.01em" }}>
                Kadın, erkek ve çocuk aksesuarından kozmetiğe, saç ürünlerinden hediyelik setlere kadar geniş bir koleksiyonu sizlerle buluşturuyoruz.
              </p>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: "0 0 8px" }}>Bizi Takip Edin</p>
              <SocialIcons />
            </div>

            {/* Link sütunları */}
            {sections.map(section => (
              <div key={section.title}>
                <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20, color: "#fff", fontFamily: "Montserrat, sans-serif" }}>{section.title}</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {section.links.map(link => (
                    <li key={link.label} style={{ marginBottom: 12 }}>
                      {renderLink(link)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* E-Bülten */}
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20, color: "#fff", fontFamily: "Montserrat, sans-serif" }}>E-Bülten Kayıt</h4>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 16 }}>Kampanyalarımızdan ve indirimlerimizden güncel olarak haberdar olun.</p>
              <div style={{ display: "flex", alignItems: "center", border: `1px solid ${emailStatus === "error" ? "#ff4d4d" : emailStatus === "success" ? "#4caf50" : "rgba(255,255,255,0.25)"}` }}>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setEmailStatus("idle"); }} onKeyDown={e => e.key === "Enter" && handleSubmit()} placeholder="E-posta adresinizi yazın..." style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#fff", padding: 12, minWidth: 0, fontFamily: "Montserrat, sans-serif" }} />
                <button onClick={handleSubmit} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#c9a96e", padding: "12px 16px", whiteSpace: "nowrap", fontFamily: "Montserrat, sans-serif" }}>Gönder</button>
              </div>
              {emailStatus === "error" && <p style={{ fontSize: 11, color: "#ff4d4d", marginTop: 6 }}>⚠ Lütfen geçerli bir e-posta adresi giriniz.</p>}
              {emailStatus === "success" && <p style={{ fontSize: 11, color: "#4caf50", marginTop: 6 }}>✓ E-posta adresiniz başarıyla kaydedildi!</p>}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", textAlign: "center", padding: "14px 32px" }}>
          <p style={{ fontSize: 12, color: "#fff", margin: 0, fontWeight: 500, letterSpacing: "0.03em" }}>© 2026 Takimax. Tüm hakları saklıdır.</p>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 6, marginBottom: 0 }}>
            Coded by{" "}
            <a
              href="https://www.instagram.com/macosgun/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontWeight: 700,
                letterSpacing: "0.08em",
                textDecoration: "none",
                background: "linear-gradient(90deg, #1a6fd4, #4facf7, #1a6fd4)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "shimmer 2.5s linear infinite",
              }}
            >
              Macosgun
            </a>
          </p>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <img loading="lazy" src={bankLogos} alt="Ödeme yöntemleri" style={{ height: 22, objectFit: "contain", opacity: 0.85 }} />
            <img loading="lazy" src={cardLogos} alt="Kart logoları" style={{ height: 28, objectFit: "contain", opacity: 0.9 }} />
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;