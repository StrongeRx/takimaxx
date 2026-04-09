import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import { Heart } from "lucide-react";

interface Props {
  images: string[];
  productName: string;
  discount?: number;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  isMobile: boolean;
}

const ProductImageGallery = ({
  images, productName, discount, isFavorite, onToggleFavorite, isMobile,
}: Props) => {
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const imgRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  const prevImg = useCallback(() => setActiveImg(i => (i - 1 + images.length) % images.length), [images.length]);
  const nextImg = useCallback(() => setActiveImg(i => (i + 1) % images.length), [images.length]);

  const handleZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 0), 100);
    const y = Math.min(Math.max(((e.clientY - rect.top) / rect.height) * 100, 0), 100);
    setZoomPos({ x, y });
  };

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { if (diff > 0) nextImg(); else prevImg(); }
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextImg();
      if (e.key === "ArrowLeft") prevImg();
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [lightboxOpen, nextImg, prevImg]);

  return (
    <>
      {/* Lightbox */}
      {lightboxOpen && (
        <>
          <div onClick={() => setLightboxOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 2000, animation: "lbBgIn .2s ease" }} />
          <div style={{ position: "fixed", inset: 0, zIndex: 2001, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
            <button onClick={() => setLightboxOpen(false)} style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", transition: "background .2s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.24)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}>
              <X size={22} />
            </button>
            <div style={{ position: "absolute", top: 24, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.6)", fontFamily: "Montserrat, sans-serif", fontSize: 13 }}>
              {activeImg + 1} / {images.length}
            </div>
            <div style={{ position: "relative", maxWidth: "min(900px, 90vw)", maxHeight: "75vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {images.length > 1 && (
                <button onClick={prevImg} style={{ position: "absolute", left: -52, background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", zIndex: 1, transition: "background .2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.24)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}>
                  <ChevronLeft size={22} />
                </button>
              )}
              <img src={images[activeImg]} alt={productName} style={{ maxWidth: "100%", maxHeight: "75vh", objectFit: "contain", borderRadius: 4, display: "block", animation: "lbImgIn .25s ease" }} />
              {images.length > 1 && (
                <button onClick={nextImg} style={{ position: "absolute", right: -52, background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", zIndex: 1, transition: "background .2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.24)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}>
                  <ChevronRight size={22} />
                </button>
              )}
            </div>
            {images.length > 1 && (
              <div style={{ display: "flex", gap: 8, marginTop: 20, padding: "0 8px", overflowX: "auto", maxWidth: "min(900px, 90vw)" }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} style={{ width: 60, height: 60, flexShrink: 0, padding: 0, border: `2px solid ${activeImg === i ? "#c9a96e" : "rgba(255,255,255,0.25)"}`, borderRadius: 6, overflow: "hidden", cursor: "pointer", background: "#222", outline: "none", transition: "border-color .15s", opacity: activeImg === i ? 1 : 0.6 }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </button>
                ))}
              </div>
            )}
          </div>
          <style>{`
            @keyframes lbBgIn  { from { opacity:0 } to { opacity:1 } }
            @keyframes lbImgIn { from { opacity:0; transform:scale(0.97) } to { opacity:1; transform:scale(1) } }
          `}</style>
        </>
      )}

      {/* Galeri */}
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12 }}>
        {/* Masaüstü: dikey thumbnail rail */}
        {!isMobile && images.length > 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 76, flexShrink: 0 }}>
            {images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                style={{ width: 76, height: 76, padding: 0, flexShrink: 0, border: `2px solid ${activeImg === i ? "#c9a96e" : "#e2e8f0"}`, borderRadius: 6, overflow: "hidden", cursor: "pointer", background: "#f5f2ee", outline: "none", transition: "border-color .15s, transform .15s", transform: activeImg === i ? "scale(1)" : "scale(0.97)", opacity: activeImg === i ? 1 : 0.7 }}
                onMouseEnter={e => { if (activeImg !== i) { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}}
                onMouseLeave={e => { if (activeImg !== i) { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.transform = "scale(0.97)"; }}}>
                <img src={img} alt={`${productName} - ${i + 1}`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </button>
            ))}
          </div>
        )}

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <div ref={imgRef}
            style={{ position: "relative", aspectRatio: "1/1", background: "#f5f2ee", overflow: "hidden", borderRadius: isMobile ? 0 : 4, cursor: zoomActive ? "zoom-out" : "zoom-in", width: isMobile ? "100vw" : "100%", marginLeft: isMobile ? "calc(-50vw + 50%)" : 0 }}
            onMouseEnter={() => !isMobile && setZoomActive(true)}
            onMouseLeave={() => setZoomActive(false)}
            onMouseMove={handleZoomMove}
            onClick={() => isMobile && setLightboxOpen(true)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}>

            <img src={images[activeImg]} alt={productName} fetchPriority="high" data-product-main-image="true"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`, transform: zoomActive ? "scale(2.2)" : "scale(1)", transition: zoomActive ? "none" : "transform .3s ease" }} />

            {discount && discount > 0 && (
              <span style={{ position: "absolute", top: 12, left: 12, background: "#e53e3e", color: "#fff", fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 4, zIndex: 2 }}>%{discount}</span>
            )}

            <button onClick={onToggleFavorite}
              style={{ position: "absolute", top: 12, right: 12, width: 38, height: 38, background: isFavorite ? "#c9a96e" : "rgba(255,255,255,0.92)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2, transition: "all .2s", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
              aria-label="Favorilere ekle">
              <Heart size={17} style={{ color: isFavorite ? "#fff" : "#555", fill: isFavorite ? "#fff" : "none" }} />
            </button>

            {!isMobile && !zoomActive && (
              <button onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
                style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(255,255,255,0.88)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 6, padding: "6px 10px", display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 600, color: "#333", zIndex: 2, transition: "background .2s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.88)")}>
                <ZoomIn size={13} /> Büyüt
              </button>
            )}



            {isMobile && images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prevImg(); }} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.85)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2, boxShadow: "0 2px 8px rgba(0,0,0,.12)" }}>
                  <ChevronLeft size={18} color="#111" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); nextImg(); }} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.85)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2, boxShadow: "0 2px 8px rgba(0,0,0,.12)" }}>
                  <ChevronRight size={18} color="#111" />
                </button>
                <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(0,0,0,0.45)", borderRadius: 20, padding: "3px 10px", fontSize: 12, color: "#fff", fontFamily: "Montserrat, sans-serif", fontWeight: 500, zIndex: 2 }}>
                  {activeImg + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {isMobile && images.length > 1 && (
            <div style={{ display: "flex", gap: 8, padding: "4px 16px", overflowX: "auto", scrollbarWidth: "none", background: "#fff", borderBottom: "1px solid #f0ede8" }}>
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{ width: 58, height: 58, flexShrink: 0, padding: 0, border: `2px solid ${activeImg === i ? "#c9a96e" : "#e2e8f0"}`, borderRadius: 6, overflow: "hidden", cursor: "pointer", background: "#f5f2ee", outline: "none", transition: "border-color .15s" }}>
                  <img src={img} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </button>
              ))}
            </div>
          )}

          {!isMobile && images.length > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
              {images.map((_, i) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{ width: i === activeImg ? 20 : 6, height: 6, borderRadius: 99, background: i === activeImg ? "#c9a96e" : "#ddd", border: "none", cursor: "pointer", padding: 0, transition: "all .3s ease" }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductImageGallery;