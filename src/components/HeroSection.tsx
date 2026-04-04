import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import sliderImg from "@/assets/takimaxslider.webp";
import sliderImg2 from "@/assets/takimaxslider.webp"; // İkinci slide için kendi görselinizi ekleyin

/* ─── Slide Tipi ─────────────────────────────────────────────────────────── */
interface Slide {
  image: string;
  imageAlt: string;
  label: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonHref: string;
  schemaName: string;
  schemaDesc: string;
}

// ✅ Tüm slide'lar burada tanımlanır — ayrı bir yerde overwrite gerekmez.
// İkinci slide'ın görselini değiştirmek için: src/assets/ klasörüne
// kendi görselinizi ekleyin ve sliderImg2 importunu güncelleyin.
const SLIDES: Slide[] = [
  {
    image: sliderImg,
    imageAlt: "Takimax 2026 Koleksiyonu – El İşçiliğiyle Üretilen Gümüş Takılar",
    label: "2026 Koleksiyonu",
    title: "Takının Gücünü Keşfet",
    subtitle: "El işçiliğiyle üretilen özgün takı koleksiyonları",
    buttonText: "Koleksiyonu Gör",
    buttonHref: "/kategori/hepsi",
    schemaName: "Takimax Ana Koleksiyon",
    schemaDesc: "925 ayar gümüş ve paslanmaz çelik takı koleksiyonları",
  },
  {
    image: sliderImg2,
    imageAlt: "Takimax Kadın Aksesuar – Altın ve Gümüş Kolye, Küpe, Bileklik",
    label: "Yeni Gelenler",
    title: "Kadın Aksesuar",
    subtitle: "Altın kaplama ve gümüş takılarda yeni sezon modelleri",
    buttonText: "Hepsini Keşfet",
    buttonHref: "/kategori/kadin-aksesuar",
    schemaName: "Takimax Kadın Aksesuar Koleksiyonu",
    schemaDesc: "Kadınlara özel kolye, küpe, bileklik ve yüzük modelleri",
  },
];

// ✅ 6 saniye — kullanıcı metni okuyup butona tıklamaya vakit bulur
const INTERVAL_MS = 6000;

const Dot = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    aria-label={active ? "Aktif slide" : "Slide değiştir"}
    aria-pressed={active}
    style={{
      background: "none",
      border: "none",
      padding: "6px 3px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
    }}
  >
    <span style={{
      display: "block",
      width: active ? 22 : 6,
      height: 6,
      borderRadius: 99,
      background: active ? "#c9a96e" : "rgba(255,255,255,0.45)",
      transition: "width 0.4s ease, background 0.3s ease",
    }} />
  </button>
);

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const animLock = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ✅ Slides doğrudan sabit listeden gelir — overwrite karmaşası yok
  const slides = SLIDES;

  const goTo = useCallback((next: number) => {
    if (animLock.current || next === current) return;
    animLock.current = true;
    setPrev(current);
    setCurrent(next);
    setTimeout(() => { setPrev(null); animLock.current = false; }, 700);
  }, [current]);

  const advance = useCallback(() => {
    if (animLock.current) return;
    const next = (current + 1) % slides.length;
    goTo(next);
  }, [current, slides.length, goTo]);

  useEffect(() => {
    timerRef.current = setInterval(advance, INTERVAL_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [advance]);

  return (
    <>
      {/* SEO: Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Takimax Ana Sayfa Slider",
            "itemListElement": slides.map((sl, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "item": {
                "@type": "ImageObject",
                "name": sl.schemaName,
                "description": sl.schemaDesc,
                "contentUrl": sl.image.startsWith("http") ? sl.image : `https://takimax.com${sl.image}`,
                "url": `https://takimax.com${sl.buttonHref}`,
              },
            })),
          }),
        }}
      />

      <section
        aria-label="Ana sayfa slider"
        aria-roledescription="carousel"
        style={{
          position: "relative",
          width: "100%",
          height: "clamp(240px, 42vw, 520px)",
          overflow: "hidden",
          background: "#111",
        }}
      >
        {slides.map((slide, i) => {
          const isActive = i === current;
          const isPrev   = i === prev;
          if (!isActive && !isPrev) return null;

          return (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${slides.length}: ${slide.title}`}
              aria-hidden={!isActive}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: isActive ? 2 : 1,
                opacity: isActive ? 1 : 0,
                transition: "opacity 0.7s ease",
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              {/* Görsel */}
              <img
                src={slide.image}
                alt={slide.imageAlt}
                fetchPriority={i === 0 ? "high" : "low"}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                width={1400}
                height={520}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  transform: isActive ? "scale(1.04)" : "scale(1)",
                  transition: "transform 6s ease",
                }}
              />

              {/* Koyu katman */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "linear-gradient(to right, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)",
              }} />

              {/* Metin içeriği */}
              <div style={{
                position: "absolute",
                top: 0, bottom: 0, left: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "0 clamp(20px, 5vw, 72px)",
                maxWidth: 560,
              }}>
                {/* Üst etiket */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translateY(0)" : "translateY(8px)",
                  transition: "opacity 0.55s ease 0.15s, transform 0.55s ease 0.15s",
                }}>
                  <span style={{ width: 22, height: 1, background: "#c9a96e", display: "block", flexShrink: 0 }} />
                  <span style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "#c9a96e",
                  }}>
                    {slide.label}
                  </span>
                </div>

                {/* Başlık: ilk slide h1, diğerleri h2 (SEO) */}
                {i === 0 ? (
                  <h1 className="hero-heading" style={{
                    fontFamily: "Montserrat, sans-serif", fontWeight: 800,
                    color: "#fff", margin: "0 0 10px",
                    letterSpacing: "-0.02em", lineHeight: 1.1,
                    textShadow: "0 2px 16px rgba(0,0,0,0.25)",
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(10px)",
                    transition: "opacity 0.55s ease 0.25s, transform 0.55s ease 0.25s",
                  }}>
                    {slide.title}
                  </h1>
                ) : (
                  <h2 className="hero-heading" style={{
                    fontFamily: "Montserrat, sans-serif", fontWeight: 800,
                    color: "#fff", margin: "0 0 10px",
                    letterSpacing: "-0.02em", lineHeight: 1.1,
                    textShadow: "0 2px 16px rgba(0,0,0,0.25)",
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(10px)",
                    transition: "opacity 0.55s ease 0.25s, transform 0.55s ease 0.25s",
                  }}>
                    {slide.title}
                  </h2>
                )}

                {/* Alt yazı */}
                <p className="hero-sub" style={{
                  fontFamily: "Montserrat, sans-serif",
                  color: "rgba(255,255,255,0.78)",
                  lineHeight: 1.65,
                  margin: "0 0 22px",
                  maxWidth: 330,
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translateY(0)" : "translateY(10px)",
                  transition: "opacity 0.55s ease 0.35s, transform 0.55s ease 0.35s",
                }}>
                  {slide.subtitle}
                </p>

                {/* CTA */}
                <div style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translateY(0)" : "translateY(10px)",
                  transition: "opacity 0.55s ease 0.45s, transform 0.55s ease 0.45s",
                }}>
                  <Link
                    to={slide.buttonHref}
                    aria-label={`${slide.buttonText} – ${slide.title}`}
                    className="hero-btn"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "11px 24px",
                      background: "#fff",
                      color: "#111",
                      textDecoration: "none",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 700,
                      letterSpacing: "0.13em",
                      textTransform: "uppercase",
                      borderRadius: 2,
                      transition: "background 0.22s, color 0.22s",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = "#c9a96e";
                      (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = "#fff";
                      (e.currentTarget as HTMLAnchorElement).style.color = "#111";
                    }}
                  >
                    {slide.buttonText}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Dot indikatörleri */}
        <div
          role="tablist"
          aria-label="Slide göstergeleri"
          style={{
            position: "absolute",
            bottom: 14,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 4,
            alignItems: "center",
            zIndex: 10,
          }}
        >
          {slides.map((_, i) => (
            <Dot key={i} active={i === current} onClick={() => goTo(i)} />
          ))}
        </div>
      </section>

      <style>{`
        .hero-heading { font-size: clamp(22px, 3.8vw, 50px); }
        .hero-sub     { font-size: clamp(12px, 1.2vw, 14px); }
        .hero-btn     { font-size: clamp(9px, 0.9vw, 11px); }

        @media (max-width: 600px) {
          .hero-heading { font-size: 22px !important; }
          .hero-sub     { font-size: 12px !important; max-width: 240px !important; }
          .hero-btn     { padding: 10px 18px !important; font-size: 9px !important; }
        }
      `}</style>
    </>
  );
};

export default HeroSection;