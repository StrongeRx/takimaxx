/**
 * MarqueeBanner → ColorBar
 * Yazı yerine fotoğraftaki gibi renkli segmentli ince çizgi.
 * AnnouncementBar (en üstteki duyuru) bu bileşen değil — o ayrı kalıyor.
 */

const SEGMENTS = [
  { color: "#e8420a", flex: 5 },   // turuncu-kırmızı
  { color: "#00b8d4", flex: 3 },   // açık mavi
  { color: "#7b2d8b", flex: 4 },   // mor
  { color: "#6abf4b", flex: 3 },   // yeşil
  { color: "#4a1a5c", flex: 2 },   // koyu mor
];

const MarqueeBanner = () => (
  <div
    aria-hidden="true"
    style={{
      display: "flex",
      width: "100%",
      height: 5,
      overflow: "hidden",
      lineHeight: 0,
    }}
  >
    {SEGMENTS.map((seg, i) => (
      <div
        key={i}
        style={{
          flex: seg.flex,
          background: seg.color,
          height: "100%",
        }}
      />
    ))}
  </div>
);

export default MarqueeBanner;