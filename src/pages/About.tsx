import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";

const About = () => {
  const [aboutTitle, setAboutTitle]             = useState("Hakkımızda");
  const [aboutText, setAboutText]               = useState("");
  const [aboutImage, setAboutImage]             = useState("https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80");
  const [aboutBannerImage, setAboutBannerImage] = useState("https://images.unsplash.com/photo-1573408301185-9519f94815b4?w=1400&q=80");

  useEffect(() => {
    try {
      const c = { aboutTitle: "Hakkımızda", aboutText: "Takimax, 2018'den bu yana el işçiliğiyle üretilen özgün takı ve aksesuar koleksiyonları sunuyor.", aboutImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80", aboutBannerImage: "https://images.unsplash.com/photo-1573408301185-9519f94815b4?w=1400&q=80" };
      if (c.aboutTitle)       setAboutTitle(c.aboutTitle);
      if (c.aboutText)        setAboutText(c.aboutText);
      if (c.aboutImage)       setAboutImage(c.aboutImage);
      if (c.aboutBannerImage) setAboutBannerImage(c.aboutBannerImage);
    } catch (_e) { /* localStorage erişilemez */ }
    const onStorage = () => {
      try {
        const c = { aboutTitle: "Hakkımızda", aboutText: "Takimax, 2018'den bu yana el işçiliğiyle üretilen özgün takı ve aksesuar koleksiyonları sunuyor.", aboutImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80", aboutBannerImage: "https://images.unsplash.com/photo-1573408301185-9519f94815b4?w=1400&q=80" };
        if (c.aboutTitle)       setAboutTitle(c.aboutTitle);
        if (c.aboutText)        setAboutText(c.aboutText);
        if (c.aboutImage)       setAboutImage(c.aboutImage);
        if (c.aboutBannerImage) setAboutBannerImage(c.aboutBannerImage);
      } catch (_e) { /* localStorage erişilemez */ }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
  <div className="header-offset" style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", paddingTop: 96 }}>
    <SEO
      title="Hakkımızda – Takimax | El İşçiliğiyle Üretilen Takılar"
      description="Takimax, 2018'den bu yana el işçiliğiyle üretilen özgün takı ve aksesuar koleksiyonları sunuyor. 925 ayar gümüş ve paslanmaz çelik ürünlerde kalite ve güven."
      canonical="/hakkimizda"
    />
    <AnnouncementBar />
    <Header />

    {/* SEO: H1 başlık + breadcrumb */}
    <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "20px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <nav aria-label="breadcrumb" style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#aaa" }}>
          <Link to="/" style={{ color: "#aaa", textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.color = "#111"}
            onMouseLeave={e => e.currentTarget.style.color = "#aaa"}>
            Anasayfa
          </Link>
          <span style={{ color: "#ddd" }}>›</span>
          <span style={{ color: "#111" }}>Hakkımızda</span>
        </nav>
      </div>
    </div>

    <main style={{ flex: 1 }}>
      <article style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 80px" }}>

        {/* Başlık */}
        <header style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: "#999", marginBottom: 16 }}>
            Biz kimiz
          </p>
          <h1 style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "clamp(36px, 5vw, 60px)",
            fontWeight: 400, color: "#111", margin: "0 0 24px",
            lineHeight: 1.1, letterSpacing: "-0.01em",
          }}>
            {aboutTitle}
          </h1>
          <div style={{ width: 40, height: 1, background: "#c9a96e", margin: "0 auto" }} />
        </header>

        {/* Fotoğraf + Metin */}
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", marginBottom: 72 }}>

          {/* Fotoğraf */}
          <div style={{ position: "relative" }}>
            <div style={{
              aspectRatio: "4/5",
              overflow: "hidden",
              background: "#f5f2ee",
            }}>
              <img
                src={aboutImage}
                alt="Takimax – Türkiye'nin Online Takı ve Aksesuar Mağazası"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
            {/* Dekor çizgi */}
            <div style={{
              position: "absolute", bottom: -16, right: -16,
              width: "60%", height: "60%",
              border: "1px solid #e8e4df",
              zIndex: -1,
            }} />
          </div>

          {/* Metin */}
          <div>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#c9a96e", marginBottom: 20 }}>
              Takimax
            </p>
            <h2 style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "clamp(26px, 3vw, 38px)",
              fontWeight: 400, color: "#111",
              lineHeight: 1.25, margin: "0 0 28px",
            }}>
              Türkiye'nin Güvenilir<br />Online Takı Mağazası
            </h2>
            <div style={{ width: 32, height: 1, background: "#c9a96e", marginBottom: 28 }} />
            <p style={{
              fontFamily: "Montserrat, sans-serif", fontSize: 14, color: "#555",
              lineHeight: 1.9, marginBottom: 20,
            }}>
              {aboutText || "Takimax olarak kadın, erkek ve çocuk aksesuarından kozmetiğe, saç ürünlerinden hediyelik setlere kadar geniş bir koleksiyonu sizlerle buluşturuyoruz. Kaliteli ürünleri uygun fiyatlarla, güvenli alışveriş ortamında sunmak en temel önceliğimizdir."}
            </p>
            <p style={{
              fontFamily: "Montserrat, sans-serif", fontSize: 14, color: "#555",
              lineHeight: 1.9, marginBottom: 36,
            }}>
              {aboutText ? "" : "Hızlı kargo, kolay iade ve 7/24 müşteri desteğiyle her alışverişinizin sorunsuz ve keyifli olmasını sağlıyoruz. Her ürünümüz özenle seçilmiş, her paketimiz sevgiyle hazırlanmıştır."}
            </p>

            {/* İstatistikler */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, border: "1px solid #f0ede8" }}>
              {[
                { num: "5.000+", label: "Mutlu Müşteri" },
                { num: "500+",   label: "Ürün Çeşidi" },
                { num: "%98",    label: "Memnuniyet Oranı" },
                { num: "1–3",    label: "İş Günü Kargo" },
              ].map(s => (
                <div key={s.label} style={{ padding: "20px 16px", background: "#faf9f7", textAlign: "center" }}>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 600, color: "#111", margin: "0 0 4px" }}>{s.num}</p>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", margin: 0 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* İkinci fotoğraf — tam genişlik banner */}
        <div style={{ position: "relative", overflow: "hidden", marginBottom: 72 }}>
          <div style={{ aspectRatio: "21/7", overflow: "hidden" }}>
            <img
              src={aboutBannerImage}
              alt="Takimax koleksiyonu – Kadın, erkek ve çocuk takı çeşitleri"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", display: "block" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.38)" }} />
          </div>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            textAlign: "center", padding: "0 24px",
          }}>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(22px, 4vw, 42px)", fontWeight: 400, color: "#fff", margin: "0 0 20px", lineHeight: 1.3 }}>
              "Her takı bir hikayenin parçasıdır."
            </p>
            <Link
              to="/kategori/hepsi"
              style={{
                display: "inline-block",
                padding: "11px 32px",
                border: "1px solid rgba(255,255,255,0.8)",
                color: "#fff",
                fontFamily: "Montserrat, sans-serif",
                fontSize: 11, fontWeight: 700,
                letterSpacing: "0.2em", textTransform: "uppercase",
                textDecoration: "none",
                transition: "all 0.25s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#111"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#fff"; }}
            >
              Koleksiyonu Keşfet
            </Link>
          </div>
        </div>

        {/* Taahhütlerimiz — 3 sütun */}
        <div className="about-pillars" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, border: "1px solid #f0ede8" }}>
          {[
            { title: "Kaliteli Ürün",   text: "Tüm ürünlerimiz titizlikle seçilir, kalite kontrolünden geçirilir ve sertifikalı tedarikçilerden temin edilir." },
            { title: "Güvenli Alışveriş", text: "256-bit SSL şifreleme ile korunan ödeme altyapımız sayesinde kredi kartı bilgileriniz her zaman güvende." },
            { title: "Hızlı Kargo",     text: "Siparişleriniz aynı gün veya en geç 1–3 iş günü içinde kargoya verilir, takip linki anında iletilir." },
          ].map((item, i) => (
            <div key={item.title} style={{
              padding: "36px 28px",
              background: "#fff",
              borderRight: i < 2 ? "1px solid #f0ede8" : "none",
              textAlign: "center",
            }}>
              <div style={{ width: 32, height: 1, background: "#c9a96e", margin: "0 auto 20px" }} />
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 12, letterSpacing: "0.02em" }}>
                {item.title}
              </h3>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#777", lineHeight: 1.8, margin: 0 }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>

      </article>
    </main>

    <Footer />

    {/* Schema.org – Organization */}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Takimax",
      "description": "Türkiye'nin güvenilir online takı, aksesuar ve kozmetik mağazası. Kadın, erkek ve çocuk aksesuarı, saç ürünleri ve hediyelik setler.",
      "url": "https://takimax.com",
      "logo": "https://takimax.com/logo.svg",
      "foundingDate": "2019",
      "address": { "@type": "PostalAddress", "addressCountry": "TR" },
      "contactPoint": { "@type": "ContactPoint", "contactType": "customer service", "availableLanguage": "Turkish" }
    })}} />

    <style>{`
      @media (max-width: 768px) {
        .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        .about-pillars { grid-template-columns: 1fr !important; }
        .about-pillars > div { border-right: none !important; border-bottom: 1px solid #f0ede8; }
      }
    `}</style>
  </div>
  );
};

export default About;