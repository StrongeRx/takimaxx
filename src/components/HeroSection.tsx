import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import sliderImg from "@/assets/takimaxslider.webp";

// 📌 İKİNCİ SLIDE GÖRSELİ — Kendi görselinizi eklemek için:
// 1. src/assets/ klasörüne görseli kopyalayın (örn: slider2.webp)
// 2. Aşağıdaki satırı uncomment yapın ve SLIDE_2_IMAGE'ı kaldırın:
// import sliderImg2 from "@/assets/slider2.webp";
const SLIDE_2_IMAGE = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&h=520&fit=crop&crop=center";

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

const SLIDES: Slide[] = [
  {
    image: sliderImg,
    imageAlt: "Takimax 2026 Koleksiyonu – El İşçiliğiyle Üretilen Gümüş Takılar",
    label: "",
    title: "",
    subtitle: "",
    buttonText: "",
    buttonHref: "/kategori/yeni-urunler",
    schemaName: "Takimax Ana Koleksiyon",
    schemaDesc: "925 ayar gümüş ve paslanmaz çelik takı koleksiyonları",
  },
  {
    image: SLIDE_2_IMAGE,
    imageAlt: "Takimax Kadın Aksesuar – Altın ve Gümüş Kolye, Küpe, Bileklik",
    label: "",
    title: "",
    subtitle: "",
    buttonText: "",
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
          <Link
            key={i}
            to={slide.buttonHref}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${slides.length}`}
            aria-hidden={!isActive}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: isActive ? 2 : 1,
              opacity: isActive ? 1 : 0,
              transition: "opacity 0.7s ease",
              pointerEvents: isActive ? "auto" : "none",
              textDecoration: "none",
              display: "block",
              cursor: "pointer",
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
          </Link>
          );
        })}

        {/* Dot indikatörleri */}
        <div
          role="tablist"
          aria-label="Slide göstergeleri"
          className="hero-dots"
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
        @media (max-width: 600px) {
          .hero-dots { bottom: 10px !important; }
        }
      `}</style>
    </>
  );
};

export default HeroSection;