import { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollUp}
      aria-label="Yukarı çık"
      style={{
        position: "fixed", bottom: 84, right: 24, zIndex: 999,
        width: 44, height: 44,
        background: "#111", color: "#fff",
        border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.3s ease, transform 0.3s ease, background 0.2s",
        pointerEvents: visible ? "auto" : "none",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "#c9a96e")}
      onMouseLeave={e => (e.currentTarget.style.background = "#111")}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>
  );
};

export default ScrollToTopButton;