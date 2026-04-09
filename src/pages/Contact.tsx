import { Link } from "react-router-dom";
import { Phone, Mail, Clock, MapPin, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

// ─── İletişim Bilgileri ──────────────────────────────────────────────────────
const CONTACT_INFO = {
  phone: "+90 (212) 000 00 00",
  whatsapp: "905320000000",
  email: "destek@takimax.com",
  address: "İstanbul, Türkiye",
  workingHours: "Pzt – Cum  09:00 – 18:00",
};

// ─── Görsel ──────────────────────────────────────────────────────────────────
// Kendi görselinizi kullanmak için:
//   import contactImage from "@/assets/iletisim.png";
//   const CONTACT_IMAGE = contactImage;
// Ya da harici URL:
//   const CONTACT_IMAGE = "https://example.com/iletisim.jpg";
// null bırakırsanız SVG illüstrasyon gösterilir.
const CONTACT_IMAGE: string | null = null;

// ─── SVG İllüstrasyon ────────────────────────────────────────────────────────
const ContactIllustration = () => (
  <svg
    width="100%"
    viewBox="0 0 680 420"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block" }}
  >
    <title>İletişim illüstrasyon</title>
    <desc>İki karikatür karakter, zarf ve iletişim ikonları</desc>
    <style>{`
      .il-deco { fill: #f5ead8; }
      .il-skin { fill: #f5c5a3; }
      .il-hair1 { fill: #3d2b1f; }
      .il-hair2 { fill: #c9a96e; }
      .il-shirt1 { fill: #c9a96e; }
      .il-shirt2 { fill: #e8d5b0; }
      .il-pants { fill: #555; }
      .il-pants2 { fill: #888; }
      .il-env { fill: #fff; stroke: #ddd; stroke-width: 1.5; }
      .il-flap { fill: #f5ead8; stroke: #ddd; stroke-width: 1.5; }
      .il-bubble { fill: #fff; stroke: #c9a96e; stroke-width: 1.5; }
      .il-dot { fill: #c9a96e; }
      .il-plus { fill: none; stroke: #e8d5b0; stroke-width: 2.5; stroke-linecap: round; }
      .il-ring { fill: none; stroke: #e8d5b0; stroke-width: 2; }
    `}</style>

    <rect width="680" height="420" fill="#fdf8f0" rx="12" />
    <circle cx="340" cy="210" r="160" className="il-deco" opacity="0.45" />
    <circle cx="120" cy="80" r="28" className="il-deco" opacity="0.5" />
    <circle cx="580" cy="320" r="20" className="il-deco" opacity="0.5" />

    <line x1="95" y1="68" x2="95" y2="92" className="il-plus" />
    <line x1="83" y1="80" x2="107" y2="80" className="il-plus" />
    <line x1="578" y1="308" x2="578" y2="332" className="il-plus" />
    <line x1="566" y1="320" x2="590" y2="320" className="il-plus" />
    <line x1="600" y1="90" x2="600" y2="106" className="il-plus" />
    <line x1="592" y1="98" x2="608" y2="98" className="il-plus" />
    <circle cx="60" cy="200" r="8" className="il-ring" />
    <circle cx="630" cy="180" r="6" className="il-ring" />
    <circle cx="150" cy="370" r="5" className="il-ring" />
    <circle cx="530" cy="60" r="7" className="il-ring" />

    {/* Zarf */}
    <g transform="translate(220,120)">
      <rect x="-90" y="40" width="180" height="120" rx="8" className="il-env" />
      <polygon points="-90,40 0,100 90,40" className="il-flap" />
      <polyline points="-90,160 -20,110 0,124 20,110 90,160" stroke="#e8d5b0" strokeWidth="2" fill="none" />
      <line x1="-60" y1="85" x2="60" y2="85" stroke="#e8d5b0" strokeWidth="1.5" />
      <line x1="-50" y1="100" x2="50" y2="100" stroke="#e8d5b0" strokeWidth="1.5" />
      <line x1="-40" y1="115" x2="40" y2="115" stroke="#e8d5b0" strokeWidth="1.5" />
    </g>

    {/* Sol Karakter */}
    <g transform="translate(130,100)">
      <ellipse cx="0" cy="-8" rx="16" ry="18" className="il-skin" />
      <rect x="-7" y="-24" width="14" height="14" rx="3" className="il-hair1" />
      <ellipse cx="0" cy="-22" rx="10" ry="6" className="il-hair1" />
      <ellipse cx="-5" cy="-10" rx="1.5" ry="1.5" fill="#6b3a2a" />
      <ellipse cx="5" cy="-10" rx="1.5" ry="1.5" fill="#6b3a2a" />
      <path d="M -3 -5 Q 0 -3 3 -5" fill="none" stroke="#b07050" strokeWidth="1" strokeLinecap="round" />
      <rect x="-14" y="10" width="28" height="34" rx="6" className="il-shirt1" />
      <rect x="-10" y="44" width="9" height="30" rx="4" className="il-pants" />
      <rect x="1" y="44" width="9" height="30" rx="4" className="il-pants" />
      <ellipse cx="-11" cy="75" rx="7" ry="5" fill="#444" />
      <ellipse cx="10" cy="75" rx="7" ry="5" fill="#444" />
      <line x1="-14" y1="20" x2="-28" y2="36" stroke="#c9a96e" strokeWidth="8" strokeLinecap="round" />
      <line x1="14" y1="20" x2="28" y2="38" stroke="#c9a96e" strokeWidth="8" strokeLinecap="round" />
      <rect x="24" y="32" width="22" height="16" rx="4" fill="#333" />
      <rect x="26" y="34" width="18" height="10" rx="2" fill="#5bc8f5" />
    </g>

    {/* Sağ Karakter */}
    <g transform="translate(490,110)">
      <ellipse cx="0" cy="-8" rx="15" ry="17" className="il-skin" />
      <ellipse cx="0" cy="-20" rx="13" ry="8" className="il-hair2" />
      <ellipse cx="-9" cy="-14" rx="5" ry="8" className="il-hair2" />
      <ellipse cx="9" cy="-14" rx="5" ry="8" className="il-hair2" />
      <ellipse cx="-5" cy="-9" rx="1.5" ry="1.5" fill="#6b3a2a" />
      <ellipse cx="5" cy="-9" rx="1.5" ry="1.5" fill="#6b3a2a" />
      <path d="M -3 -4 Q 0 -2 3 -4" fill="none" stroke="#b07050" strokeWidth="1" strokeLinecap="round" />
      <rect x="-14" y="8" width="28" height="34" rx="6" className="il-shirt2" />
      <rect x="-10" y="42" width="9" height="28" rx="4" className="il-pants2" />
      <rect x="1" y="42" width="9" height="28" rx="4" className="il-pants2" />
      <ellipse cx="-11" cy="71" rx="7" ry="5" fill="#777" />
      <ellipse cx="10" cy="71" rx="7" ry="5" fill="#777" />
      <line x1="14" y1="18" x2="30" y2="32" stroke="#e8d5b0" strokeWidth="8" strokeLinecap="round" />
      <line x1="-14" y1="18" x2="-30" y2="34" stroke="#e8d5b0" strokeWidth="8" strokeLinecap="round" />
    </g>

    {/* Konuşma balonları */}
    <g transform="translate(175,95)">
      <rect x="-36" y="-26" width="72" height="46" rx="10" className="il-bubble" />
      <polygon points="-8,20 8,20 0,33" fill="#fff" stroke="#c9a96e" strokeWidth="1.5" />
      <polygon points="-7,21 7,21 0,32" fill="#fff" />
      <circle cx="-12" cy="-4" r="5" className="il-dot" />
      <circle cx="0" cy="-4" r="5" className="il-dot" />
      <circle cx="12" cy="-4" r="5" className="il-dot" />
    </g>
    <g transform="translate(500,90)">
      <rect x="-44" y="-28" width="88" height="44" rx="10" className="il-bubble" />
      <polygon points="-8,16 8,16 0,29" fill="#fff" stroke="#c9a96e" strokeWidth="1.5" />
      <polygon points="-7,17 7,17 0,28" fill="#fff" />
      <rect x="-28" y="-16" width="56" height="8" rx="3" fill="#e8d5b0" />
      <rect x="-22" y="-4" width="44" height="6" rx="3" fill="#f0e6d0" />
    </g>

    {/* Dekoratif ikonlar */}
    <g transform="translate(350,52)">
      <rect x="-20" y="-14" width="40" height="28" rx="5" fill="none" stroke="#c9a96e" strokeWidth="2" />
      <polyline points="-20,-14 0,2 20,-14" fill="none" stroke="#c9a96e" strokeWidth="2" />
    </g>
    <g transform="translate(405,168)">
      <circle cx="0" cy="-20" r="12" fill="none" stroke="#c9a96e" strokeWidth="2" />
      <line x1="0" y1="-8" x2="0" y2="0" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" />
      <circle cx="0" cy="5" r="3" fill="#c9a96e" />
    </g>
  </svg>
);

// ─── İletişim Satırı ─────────────────────────────────────────────────────────
const ContactRow = ({
  href,
  icon,
  label,
  value,
  note,
  target,
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  note?: string;
  target?: string;
}) => {
  const inner = (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        padding: "20px 0",
        borderBottom: "1px solid #f0ede8",
        textDecoration: "none",
        color: "inherit",
        cursor: href ? "pointer" : "default",
      }}
    >
      <div style={{ width: 38, height: 38, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "#bbb", margin: "0 0 4px" }}>
          {label}
        </p>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600, color: "#111", margin: 0 }}>
          {value}
        </p>
        {note && (
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#aaa", margin: "3px 0 0", lineHeight: 1.5 }}>
            {note}
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined} style={{ textDecoration: "none", display: "block" }}>
        {inner}
      </a>
    );
  }
  return <div>{inner}</div>;
};

// ─── Sayfa ───────────────────────────────────────────────────────────────────
const Contact = () => {
  return (
    <div
      className="header-offset"
      style={{ minHeight: "100vh", background: "#faf9f7", display: "flex", flexDirection: "column", paddingTop: 96 }}
    >
      <SEO
        title="İletişim – Takimax | Bize Ulaşın"
        description="Takimax müşteri hizmetleriyle telefon, e-posta veya WhatsApp üzerinden iletişime geçin."
        canonical="/iletisim"
      />
      <AnnouncementBar />
      <Header />

      {/* Breadcrumb */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "18px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#aaa" }}>
            <Link to="/" style={{ color: "#aaa", textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "#111"}
              onMouseLeave={e => e.currentTarget.style.color = "#aaa"}>
              Anasayfa
            </Link>
            <ChevronRight size={10} style={{ color: "#ddd" }} />
            <span style={{ color: "#111" }}>İletişim</span>
          </nav>
        </div>
      </div>

      <main style={{ flex: 1, maxWidth: 900, margin: "0 auto", width: "100%", padding: "60px 24px 100px", boxSizing: "border-box" }}>

        {/* Başlık */}
        <div style={{ borderBottom: "1px solid #ece9e4", paddingBottom: 32, marginBottom: 40 }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", color: "#c9a96e", margin: "0 0 10px" }}>
            Bize Ulaşın
          </p>
          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 400, color: "#111", margin: "0 0 12px", letterSpacing: "-0.01em" }}>
            İletişim
          </h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#888", lineHeight: 1.8, maxWidth: 480, margin: 0 }}>
            Sorularınız veya siparişlerinizle ilgili her konuda bize ulaşabilirsiniz.
            En kısa sürede geri döneriz.
          </p>
        </div>

        {/* İki Sütun: Bilgiler + Görsel */}
        <div className="contact-layout">

          {/* Sol: İletişim bilgileri */}
          <div>
            <ContactRow
              href={`tel:${CONTACT_INFO.phone}`}
              icon={<Phone size={18} style={{ color: "#c9a96e" }} />}
              label="Çağrı Merkezi"
              value={CONTACT_INFO.phone}
              note="Hafta içi 09:00 – 18:00"
            />
            <ContactRow
              href={`mailto:${CONTACT_INFO.email}`}
              icon={<Mail size={18} style={{ color: "#c9a96e" }} />}
              label="7/24 Destek"
              value={CONTACT_INFO.email}
              note="7/24 mail ile ulaşabilirsiniz"
            />
            <ContactRow
              href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
              target="_blank"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#c9a96e">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              }
              label="WhatsApp"
              value="WhatsApp'tan Yazın"
              note="Hızlı destek için mesaj gönderebilirsiniz"
            />
            <ContactRow
              icon={<Clock size={18} style={{ color: "#c9a96e" }} />}
              label="Çalışma Saatleri"
              value={CONTACT_INFO.workingHours}
              note="Hafta sonu mesajlarınıza Pazartesi yanıt verilir"
            />
            <ContactRow
              href={`https://maps.google.com/?q=${encodeURIComponent(CONTACT_INFO.address)}`}
              target="_blank"
              icon={<MapPin size={18} style={{ color: "#c9a96e" }} />}
              label="Adres"
              value={CONTACT_INFO.address}
              note="Google Haritalar'da görüntülemek için tıklayın"
            />
          </div>

          {/* Sağ: Görsel */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {CONTACT_IMAGE ? (
              <img
                src={CONTACT_IMAGE}
                alt="İletişim"
                style={{ width: "100%", maxWidth: 420, height: "auto", borderRadius: 8, display: "block" }}
              />
            ) : (
              <div style={{ width: "100%", maxWidth: 420 }}>
                <ContactIllustration />
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />

      <style>{`
        .contact-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }
        @media (max-width: 680px) {
          .contact-layout {
            grid-template-columns: 1fr !important;
          }
          .contact-layout > div:last-child {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;