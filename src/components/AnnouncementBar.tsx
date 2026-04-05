const DEFAULT_TEXT = "🏷️ İLK SİPARİŞE %10 İNDİRİM 🏷️      📦 850₺ ÜZERİ KARGO ÜCRETSİZ 📦      ";
const DEFAULT_COLOR = "#111111";

const AnnouncementBar = () => {
  const bgColor = DEFAULT_COLOR;
  const text = DEFAULT_TEXT;

  const isLight = (hex: string) => {
    const c = hex.replace("#", "");
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
  };

  const textColor = isLight(bgColor) ? "#111111" : "#ffffff";

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 140, backgroundColor: bgColor, overflow: "hidden", paddingTop: "8px", paddingBottom: "8px" }}>
      <div className="animate-marquee flex whitespace-nowrap">
        <span style={{ color: textColor, marginLeft: "2rem", marginRight: "2rem" }}
          className="text-xs font-body font-medium tracking-widest">
          {text.repeat(3)}
        </span>
        <span aria-hidden style={{ color: textColor, marginLeft: "2rem", marginRight: "2rem" }}
          className="text-xs font-body font-medium tracking-widest">
          {text.repeat(3)}
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBar;