import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { mainCategories } from "@/data/categories";

const COUNTS: Record<string, string> = {
  "yeni-urunler":     "142",
  "populer-urunler":  "89",
  "kadin-aksesuar":   "215",
  "erkek-aksesuar":   "97",
  "cocuk-aksesuar":   "63",
  "sac-urunleri":     "48",
  "hediyelik-setler": "76",
  "kozmetik":         "54",
};

const SUBTITLES: Record<string, string> = {
  "yeni-urunler":     "Yeni Gelenler",
  "populer-urunler":  "Çok Satanlar",
  "kadin-aksesuar":   "Koleksiyon",
  "erkek-aksesuar":   "Aksesuar",
  "cocuk-aksesuar":   "Mini Koleksiyon",
  "sac-urunleri":     "Saç & Bakım",
  "hediyelik-setler": "Özel Setler",
  "kozmetik":         "Güzellik",
};

/* ── Küçük yatay kart (alt şerit) ── */
const SmallCard = ({ cat }: { cat: typeof mainCategories[number] }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={`/kategori/${cat.slug}`}
      style={{ textDecoration: "none", display: "block", height: "100%" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        position: "relative", width: "100%", height: "100%",
        overflow: "hidden", background: "#111", borderRadius: 6,
        display: "flex", alignItems: "center", padding: "0 18px", gap: 12,
        cursor: "pointer",
        transition: "transform 0.25s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.35)" : "none",
      }}>
        <img loading="lazy" src={cat.image} alt={cat.label} style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover",
          transition: "transform 0.6s ease, opacity 0.4s ease",
          transform: hovered ? "scale(1.08)" : "scale(1)",
          opacity: hovered ? 0.45 : 0.3,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 100%)",
        }} />
        {/* Sol altın çizgi */}
        <div style={{
          position: "relative", zIndex: 1,
          width: 3, height: hovered ? 32 : 20,
          borderRadius: 99,
          background: hovered
            ? "linear-gradient(180deg, #e8cc9a, #c9a96e)"
            : "linear-gradient(180deg, #c9a96e, #a07840)",
          transition: "height 0.3s ease, background 0.3s ease",
          flexShrink: 0,
        }} />
        <div style={{ position: "relative", zIndex: 1, flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 600,
            color: hovered ? "#c9a96e" : "rgba(255,255,255,0.4)",
            letterSpacing: "0.12em", textTransform: "uppercase",
            marginBottom: 3, transition: "color 0.3s",
          }}>{SUBTITLES[cat.slug]}</div>
          <div style={{
            fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700,
            color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{cat.label}</div>
        </div>
        <div style={{
          position: "relative", zIndex: 1,
          fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 600,
          color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em", flexShrink: 0,
        }}>{COUNTS[cat.slug]} ürün</div>
        <div style={{
          position: "relative", zIndex: 1,
          width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
          border: `1px solid ${hovered ? "#c9a96e" : "rgba(255,255,255,0.2)"}`,
          background: hovered ? "#c9a96e" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.3s ease",
        }}>
          <ArrowRight size={10} color="#fff" style={{
            transform: hovered ? "translateX(1px)" : "translateX(0)",
            transition: "transform 0.3s",
          }} />
        </div>
      </div>
    </Link>
  );
};

/* ── Orta/normal kart ── */
const MidCard = ({ cat, accent = false }: { cat: typeof mainCategories[number]; accent?: boolean }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={`/kategori/${cat.slug}`}
      style={{ textDecoration: "none", display: "block", height: "100%" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        position: "relative", width: "100%", height: "100%",
        overflow: "hidden", background: "#111", borderRadius: 6, cursor: "pointer",
        transition: "transform 0.25s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.4)" : "none",
      }}>
        <img loading="lazy" src={cat.image} alt={cat.label} style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
          transition: "transform 0.7s ease, opacity 0.5s ease",
          transform: hovered ? "scale(1.1)" : "scale(1)",
          opacity: hovered ? 0.55 : 0.75,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.05) 60%, transparent 100%)",
        }} />
        {/* Altın çizgi hover */}
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          height: 2,
          width: hovered ? "100%" : "0%",
          background: "linear-gradient(90deg, #c9a96e, #e8cc9a, #c9a96e)",
          transition: "width 0.45s cubic-bezier(0.25,0.46,0.45,0.94)",
        }} />
        {accent && (
          <div style={{
            position: "absolute", top: 12, left: 12,
            background: "#c9a96e", color: "#fff",
            fontFamily: "Montserrat, sans-serif", fontSize: 8, fontWeight: 800,
            letterSpacing: "0.18em", textTransform: "uppercase",
            padding: "3px 8px", borderRadius: 2,
          }}>YENİ</div>
        )}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "14px 14px",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          transition: "transform 0.35s ease",
        }}>
          <div style={{
            fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 600,
            color: hovered ? "#c9a96e" : "rgba(255,255,255,0.45)",
            letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4,
            transition: "color 0.3s",
          }}>{SUBTITLES[cat.slug]}</div>
          <div style={{
            fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700,
            color: "#fff", marginBottom: 2,
          }}>{cat.label}</div>
          <div style={{
            fontFamily: "Montserrat, sans-serif", fontSize: 9,
            color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em",
          }}>{COUNTS[cat.slug]} ürün</div>
        </div>
      </div>
    </Link>
  );
};

/* ── Featured büyük kart ── */
const FeaturedCard = ({ cat }: { cat: typeof mainCategories[number] }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={`/kategori/${cat.slug}`}
      style={{ textDecoration: "none", display: "block", height: "100%" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        position: "relative", width: "100%", height: "100%",
        overflow: "hidden", background: "#0e0e0e", borderRadius: 6, cursor: "pointer",
        boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.5)" : "none",
        transition: "box-shadow 0.4s ease",
      }}>
        {/* Üst altın şerit */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: 3,
          background: "linear-gradient(90deg, #c9a96e, #e8cc9a, #c9a96e)",
          zIndex: 3,
        }} />

        <img loading="lazy" src={cat.image} alt={cat.label} style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
          transition: "transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.5s ease",
          transform: hovered ? "scale(1.08)" : "scale(1)",
          opacity: hovered ? 0.5 : 0.72,
        }} />

        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(201,169,110,0.04)",
          opacity: hovered ? 1 : 0, transition: "opacity 0.4s",
        }} />

        {/* İçerik */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "32px 28px",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          transition: "transform 0.4s ease",
        }}>
          <div style={{
            fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 700,
            letterSpacing: "0.3em", textTransform: "uppercase",
            color: "#c9a96e", marginBottom: 10,
          }}>Öne Çıkan Koleksiyon</div>

          <h3 style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "clamp(22px, 2.5vw, 32px)",
            fontWeight: 600, color: "#fff",
            margin: "0 0 8px", lineHeight: 1.15,
            letterSpacing: "-0.01em",
            textShadow: "0 2px 16px rgba(0,0,0,0.5)",
          }}>{cat.label}</h3>

          <div style={{
            fontFamily: "Montserrat, sans-serif", fontSize: 11,
            color: "rgba(255,255,255,0.45)", marginBottom: 22,
            letterSpacing: "0.04em",
          }}>{COUNTS[cat.slug]} ürün</div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              border: `1.5px solid ${hovered ? "#c9a96e" : "rgba(255,255,255,0.3)"}`,
              background: hovered ? "#c9a96e" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.35s ease",
            }}>
              <ArrowRight size={14} color="#fff" style={{
                transform: hovered ? "translateX(1px)" : "translateX(0)",
                transition: "transform 0.35s ease",
              }} />
            </div>
            <span style={{
              fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: hovered ? "#e8cc9a" : "rgba(255,255,255,0.6)",
              transition: "color 0.3s",
            }}>Keşfedin</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

/* ── Çift yatay kart (yan yana) ── */
const DualCard = ({ cats }: { cats: typeof mainCategories }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, height: "100%" }}>
    {cats.map(cat => (
      <MidCard key={cat.slug} cat={cat} />
    ))}
  </div>
);

const CategoryGrid = () => {
  /* 
    BENTO LAYOUT:
    [0] Kadın Aksesuar  → Featured (sol, tall)
    [1] Yeni Ürünler    → Mid top-right
    [2] Popüler         → Mid top-right
    [3] Erkek           → Dual (sağ-alt) ─┐
    [4] Kozmetik        → Dual (sağ-alt) ─┘
    [5,6,7] Çocuk, Saç, Hediye → Alt şerit
  */
  const [feat, top1, top2, dual1, dual2, ...bottom] = mainCategories;

  return (
    <section id="categories" style={{ padding: "72px 0 80px", background: "#faf9f7" }}>
      <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px" }}>

        {/* Başlık */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{
            fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700,
            letterSpacing: "0.35em", color: "#c9a96e", textTransform: "uppercase", marginBottom: 12,
          }}>Koleksiyonlar</p>
          <h2 style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 400, color: "#111", margin: "0 0 16px",
            letterSpacing: "-0.02em", lineHeight: 1.1,
          }}>Kategoriler</h2>
          <div style={{ width: 48, height: 2, background: "linear-gradient(90deg, transparent, #c9a96e, transparent)", margin: "0 auto" }} />
        </div>

        {/* BENTO ANA GRID */}
        <div className="cat-bento" style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1.9fr",
          gridTemplateRows: "340px 200px",
          gap: 8,
        }}>
          {/* Sol — Featured tall */}
          <div style={{ gridRow: "1 / 3" }}>
            <FeaturedCard cat={feat} />
          </div>

          {/* Sağ üst — 2 mid kart */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <MidCard cat={top1} accent />
            <MidCard cat={top2} />
          </div>

          {/* Sağ alt — dual içiçe */}
          <DualCard cats={[dual1, dual2]} />
        </div>

        {/* ALT ŞERİT — küçük yatay kartlar */}
        <div className="cat-strip" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          marginTop: 8,
        }}>
          {bottom.map(cat => (
            <div key={cat.slug} style={{ height: 70 }}>
              <SmallCard cat={cat} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .cat-bento {
            grid-template-columns: 1fr 1fr !important;
            grid-template-rows: 280px 180px !important;
          }
        }
        @media (max-width: 700px) {
          .cat-bento {
            grid-template-columns: 1fr !important;
            grid-template-rows: 260px 140px 120px !important;
          }
          .cat-bento > div:first-child {
            grid-row: auto !important;
          }
          .cat-strip {
            grid-template-columns: 1fr !important;
          }
          #categories { padding: 48px 0 56px !important; }
          #categories > div { padding: 0 14px !important; }
        }
      `}</style>
    </section>
  );
};

export default CategoryGrid;