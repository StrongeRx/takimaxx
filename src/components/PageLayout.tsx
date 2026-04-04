import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";

interface Props {
  title: string;
  breadcrumb?: string;
  children: ReactNode;
  showBanner?: boolean;
}

const PageLayout = ({ title, breadcrumb, children, showBanner = false }: Props) => {
  return (
    <div className="page-wrapper header-offset" style={{ minHeight: "100vh", background: "#faf9f7", display: "flex", flexDirection: "column", overflowX: "hidden", paddingTop: 96 }}>
      <AnnouncementBar />
      <Header />

      {/* Banner — sadece showBanner=true olan sayfada */}
      {showBanner ? (
        <div style={{ position: "relative", width: "100%", height: 160, overflow: "hidden", flexShrink: 0 }}>
          <svg width="100%" height="100%" viewBox="0 0 1200 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, display: "block" }}>
            <rect width="1200" height="160" fill="#F5F0E8"/>
            <circle cx="-30" cy="80" r="130" fill="#E8DDD0" opacity="0.6"/>
            <circle cx="60" cy="150" r="80" fill="#DDD0BE" opacity="0.45"/>
            <circle cx="1230" cy="40" r="150" fill="#E2D6C5" opacity="0.55"/>
            <circle cx="1160" cy="140" r="90" fill="#D4C5AF" opacity="0.4"/>
            <circle cx="600" cy="80" r="220" fill="none" stroke="#C9B99A" strokeWidth="0.8" opacity="0.35"/>
            <path d="M80,20 C130,40 150,65 135,95 C120,125 90,135 105,150" fill="none" stroke="#A8917A" strokeWidth="1.2" opacity="0.5"/>
            <circle cx="195" cy="50" r="18" fill="none" stroke="#B8A48C" strokeWidth="2" opacity="0.65"/>
            <circle cx="195" cy="50" r="6" fill="#C4A882" opacity="0.75"/>
            <circle cx="290" cy="30" r="6" fill="#C4A882" opacity="0.5"/>
            <circle cx="306" cy="36" r="4" fill="#B09070" opacity="0.4"/>
            <circle cx="320" cy="30" r="6" fill="#C4A882" opacity="0.5"/>
            <circle cx="334" cy="38" r="4" fill="#B09070" opacity="0.4"/>
            <circle cx="348" cy="30" r="5" fill="#C4A882" opacity="0.45"/>
            <path d="M260,115 Q300,104 345,115 Q388,126 415,116" fill="none" stroke="#A8917A" strokeWidth="1.8" opacity="0.45"/>
            <path d="M940,0 C944,30 940,60 936,82" fill="none" stroke="#A8917A" strokeWidth="1.4" opacity="0.5"/>
            <ellipse cx="938" cy="90" rx="10" ry="15" fill="#C4A882" opacity="0.65"/>
            <circle cx="1040" cy="118" r="22" fill="none" stroke="#B8A48C" strokeWidth="2.5" opacity="0.6"/>
            <circle cx="1040" cy="96" r="7" fill="#C4A882" opacity="0.7"/>
            <circle cx="820" cy="22" r="4" fill="#C4A882" opacity="0.5"/>
            <circle cx="833" cy="17" r="6" fill="#B8A48C" opacity="0.5"/>
            <circle cx="847" cy="22" r="4" fill="#C4A882" opacity="0.5"/>
            <circle cx="860" cy="16" r="5" fill="#B8A48C" opacity="0.45"/>
            <polygon points="490,18 496,28 490,38 484,28" fill="#C4A882" opacity="0.4"/>
            <polygon points="710,128 715,137 710,146 705,137" fill="#C4A882" opacity="0.35"/>
            <rect x="0" y="156" width="1200" height="4" fill="#C4A882" opacity="0.3"/>
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: "#3D2B1A", margin: 0, letterSpacing: "0.02em", textAlign: "center" }}>
              {title}
            </h1>
            <nav style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, display: "flex", gap: 6, alignItems: "center" }}>
              <Link to="/" style={{ color: "#8B6F52", textDecoration: "none" }} onMouseEnter={e => (e.currentTarget.style.color = "#3D2B1A")} onMouseLeave={e => (e.currentTarget.style.color = "#8B6F52")}>Ana Sayfa</Link>
              <span style={{ color: "#C4A882" }}>/</span>
              <span style={{ color: "#3D2B1A", fontWeight: 700 }}>{breadcrumb || title}</span>
            </nav>
          </div>
        </div>
      ) : (
        /* Normal başlık */
        <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "32px 24px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <nav style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#999", marginBottom: 8, display: "flex", gap: 6, alignItems: "center" }}>
              <Link to="/" style={{ color: "#999", textDecoration: "none" }} onMouseEnter={e => e.currentTarget.style.color = "#c9a96e"} onMouseLeave={e => e.currentTarget.style.color = "#999"}>Anasayfa</Link>
              <span>/</span>
              <span style={{ color: "#111" }}>{breadcrumb || title}</span>
            </nav>
            <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 600, color: "#111", margin: 0 }}>
              {title}
            </h1>
          </div>
        </div>
      )}

      {/* İçerik */}
      <div style={{ flex: 1, maxWidth: 1280, margin: "0 auto", width: "100%", padding: "48px 24px", boxSizing: "border-box" }}>
        <style>{`@media(max-width:640px){.pl-content{padding:24px 16px!important}}`}</style>
        <div className="pl-content" style={{ flex: 1, maxWidth: 1280, margin: "0 auto", width: "100%", padding: "48px 24px", boxSizing: "border-box" }}>
          {children}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PageLayout;