import { useProducts } from "@/hooks/useProducts";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, Search, Menu, X, User, ChevronDown, Heart, TrendingUp, Clock, ArrowRight, Sparkles, Tag, ChevronRight as CRight, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import logo from "@/assets/logo.svg";
import { mainCategories } from "@/data/categories";

const IC = ({ children }: { children: React.ReactNode }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "yeni-urunler":     <IC><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></IC>,
  "populer-urunler":  <IC><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></IC>,
  "kadin-aksesuar":   <IC><circle cx="12" cy="5" r="2.5"/><path d="M9 10c0 0-2 1-2 4h10c0-3-2-4-2-4"/><path d="M8.5 14l-1.5 7h10l-1.5-7"/></IC>,
  "erkek-aksesuar":   <IC><circle cx="12" cy="5" r="2.5"/><path d="M8 10h8l1 4H7l1-4z"/><path d="M9 14v7m6-7v7"/></IC>,
  "cocuk-aksesuar":   <IC><circle cx="12" cy="5" r="2"/><path d="M9 14l-1 7h8l-1-7"/></IC>,
  "sac-urunleri":     <IC><path d="M12 2C6.5 2 4 5.5 4 9c0 2 .8 3.8 2 5"/><path d="M6 14c1.5 2 4 3.5 6 3.5s4.5-1.5 6-3.5"/></IC>,
  "hediyelik-setler": <IC><rect x="3" y="8" width="18" height="14" rx="1"/><path d="M21 8H3V6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2z"/><path d="M12 5V22"/></IC>,
  "kozmetik":         <IC><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 6v3a3 3 0 0 0 6 0V6"/><rect x="8" y="12" width="8" height="10" rx="1"/></IC>,
};

const CATEGORY_BADGES: Record<string, { label: string; color: string }> = {
  "yeni-urunler":    { label: "YENİ",  color: "#16a34a" },
  "populer-urunler": { label: "TREND", color: "#dc2626" },

};

const POPULAR_SEARCHES = ["Gümüş Kolye", "Altın Küpe", "Bileklik Set", "Yüzük", "Hediye Seti", "925 Gümüş", "Paslanmaz Çelik"];

const POPULAR_CATEGORIES = [
  { label: "Kadın Küpe",    slug: "kadin-aksesuar/kupe" },
  { label: "Kadın Kolye",   slug: "kadin-aksesuar/kolye" },
  { label: "Erkek Kolye",   slug: "erkek-aksesuar/kolye" },
  { label: "Bileklik",      slug: "kadin-aksesuar/bileklik" },
  { label: "Hediye Seti",   slug: "hediyelik-setler" },
  { label: "Çocuk Takı",    slug: "cocuk-aksesuar" },
];

/* Yazım hatası toleransı — Levenshtein mesafesi */
function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[a.length][b.length];
}

function fuzzyMatch(query: string, target: string): boolean {
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase();
  if (t.includes(q)) return true;
  if (q.length >= 4 && levenshtein(q, t.slice(0, q.length)) <= 1) return true;
  return false;
}

/* ── Mega Menu ── */
const MegaMenu = ({ category, onClose, headerBottom }: {
  category: typeof mainCategories[number];
  onClose: () => void;
  headerBottom: number;
}) => {
  const cols: (typeof category.subcategories)[] = [];
  const chunkSize = Math.ceil(category.subcategories.length / 2);
  for (let i = 0; i < category.subcategories.length; i += chunkSize)
    cols.push(category.subcategories.slice(i, i + chunkSize));
  const badge = CATEGORY_BADGES[category.slug];

  return (
    <div
      style={{
        position: "fixed", left: 0, right: 0, top: headerBottom, zIndex: 110,
        background: "#fff", borderTop: "2px solid #c9a96e", borderBottom: "1px solid #ede9e2",
        boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
        animation: "megaFadeIn 0.2s cubic-bezier(0.16,1,0.3,1)",
      }}
      onMouseLeave={onClose}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 40px", display: "flex", gap: 0 }}>

        {/* SOL: Kategori başlığı */}
        <div style={{ width: 180, paddingRight: 28, borderRight: "1px solid #f0ece6", marginRight: 36, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            {badge && (
              <span style={{ display: "inline-block", padding: "2px 8px", background: badge.color, color: "#fff", fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", borderRadius: 3, marginBottom: 10 }}>
                {badge.label}
              </span>
            )}
            <Link to={`/kategori/${category.slug}`} onClick={onClose} style={{ textDecoration: "none" }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a96e", marginBottom: 6, marginTop: 0 }}>
                {category.label}
              </p>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#aaa", lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>
                {category.description}
              </p>
            </Link>
          </div>
          <Link
            to={`/kategori/${category.slug}`} onClick={onClose}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 14px", background: "#111", color: "#fff", textDecoration: "none", fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", borderRadius: 3, transition: "background 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#c9a96e")}
            onMouseLeave={e => (e.currentTarget.style.background = "#111")}
          >
            Tümünü Gör <ArrowRight size={11} />
          </Link>
        </div>

        {/* ORTA: Alt kategori sütunları */}
        <div style={{ display: "flex", gap: 48, flex: 1 }}>
          {cols.map((col, ci) => (
            <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 0, minWidth: 150 }}>
              {col.map(sub => (
                <Link
                  key={sub.slug} to={`/kategori/${sub.slug}`} onClick={onClose}
                  style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#444", textDecoration: "none", padding: "8px 12px", borderRadius: 5, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 8 }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#fdf8f2"; e.currentTarget.style.color = "#c9a96e"; e.currentTarget.style.paddingLeft = "16px"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#444"; e.currentTarget.style.paddingLeft = "12px"; }}
                >
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#c9a96e", flexShrink: 0, opacity: 0.6 }} />
                  {sub.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* SAĞ: Mega görseller */}
        <div style={{ display: "flex", gap: 14, marginLeft: 36, paddingLeft: 36, borderLeft: "1px solid #f0ece6", flexShrink: 0 }}>
          {category.megaImages.map((img, i) => (
            <Link key={i} to={`/kategori/${category.slug}`} onClick={onClose} style={{ textDecoration: "none", display: "block", width: 155 }}>
              <div style={{ width: 155, height: 115, overflow: "hidden", borderRadius: 8, marginBottom: 9, background: "#f5f0eb", position: "relative" }}>
                <img loading="lazy" src={img.src} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)", display: "block" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 60%)", pointerEvents: "none", borderRadius: 8 }} />
              </div>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 600, color: "#222", textAlign: "center", lineHeight: 1.3, margin: 0, letterSpacing: "0.02em" }}>{img.label}</p>
            </Link>
          ))}
        </div>
      </div>

      <style>{`@keyframes megaFadeIn { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  );
};

/* ── Nav Item ── */
const NavItem = ({ category, headerBottom }: { category: typeof mainCategories[number]; headerBottom: number }) => {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const badge = CATEGORY_BADGES[category.slug];

  return (
    <div style={{ position: "relative" }}
      onMouseEnter={() => { if (timer.current) clearTimeout(timer.current); setOpen(true); }}
      onMouseLeave={() => { timer.current = setTimeout(() => setOpen(false), 80); }}
    >
      <Link to={`/kategori/${category.slug}`} style={{ display: "flex", alignItems: "center", gap: 3, fontFamily: "Montserrat, sans-serif", fontSize: 11.5, fontWeight: 600, color: open ? "#c9a96e" : "#222", textDecoration: "none", padding: "4px 4px", whiteSpace: "nowrap", transition: "color 0.2s", borderBottom: open ? "2px solid #c9a96e" : "2px solid transparent" }}>
        {category.label}
        {badge && <span style={{ fontSize: 7.5, fontWeight: 800, background: badge.color, color: "#fff", padding: "1px 4px", borderRadius: 3, letterSpacing: "0.06em", lineHeight: 1.6 }}>{badge.label}</span>}
        <ChevronDown size={9} style={{ flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", color: open ? "#c9a96e" : "#ccc" }} />
      </Link>
      {open && <MegaMenu category={category} onClose={() => setOpen(false)} headerBottom={headerBottom} />}
    </div>
  );
};

/* ── MobileSocialBtn ── */
const MobileSocialBtn = ({ href, label, hoverBg, hoverBorder, normalBg, normalBorder, icon }: {
  href: string; label: string;
  hoverBg: string; hoverBorder: string;
  normalBg: string; normalBorder: string;
  icon: (hovered: boolean) => React.ReactNode;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setTimeout(() => setHovered(false), 400)}
      style={{
        width: 40, height: 40, borderRadius: 10,
        background: hovered ? hoverBg : normalBg,
        border: `1px solid ${hovered ? hoverBorder : normalBorder}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        textDecoration: "none", flexShrink: 0,
        transform: hovered ? "rotate(360deg) scale(1.08)" : "rotate(0deg) scale(1)",
        transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1), background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        boxShadow: hovered ? "0 4px 12px rgba(0,0,0,0.12)" : "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      {icon(hovered)}
    </a>
  );
};

/* ── Header ── */
const Header = () => {
  const allProducts = useProducts();
  const { totalItems } = useCart();
  const { isLoggedIn, user } = useAuth();
  const { totalFavorites } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen]         = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [searchOpen, setSearchOpen]         = useState(false);
  const [searchQuery, setSearchQuery]       = useState("");
  const [searchFocused, setSearchFocused]   = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeResultIdx, setActiveResultIdx] = useState(-1);

  // Aktif filtreler (arama paneli içi)
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterDiscount, setFilterDiscount] = useState(false);
  const [filterInStock,  setFilterInStock]  = useState(false);

  const [scrolled, setScrolled]             = useState(false);
  const [headerBottom, setHeaderBottom]     = useState(60);
  const headerRef  = useRef<HTMLElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [headerLogo, setHeaderLogo] = useState("");
  const logoUrl = headerLogo || logo;

  useEffect(() => {
    // Logo — yeni admin panelinden yönetilecek
  }, []);

  useEffect(() => {
    const upd = () => { if (headerRef.current) setHeaderBottom(headerRef.current.getBoundingClientRect().bottom); };
    upd(); window.addEventListener("scroll", upd); window.addEventListener("resize", upd);
    return () => { window.removeEventListener("scroll", upd); window.removeEventListener("resize", upd); };
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
    };
  }, [mobileOpen]);

  useEffect(() => {
    try { const s = localStorage.getItem("tm_recent_searches"); if (s) setRecentSearches(JSON.parse(s)); } catch (_e) { /* localStorage erişilemez */ }
  }, []);

  const saveRecentSearch = useCallback((q: string) => {
    setRecentSearches(prev => {
      const upd = [q, ...prev.filter(s => s !== q)].slice(0, 5);
      try { localStorage.setItem("tm_recent_searches", JSON.stringify(upd)); } catch (_e) { /* localStorage erişilemez */ }
      return upd;
    });
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false); setSearchQuery(""); setActiveResultIdx(-1);
    setFilterCategory(""); setFilterDiscount(false); setFilterInStock(false);
  }, []);

  // BUG FIX #5: location değişince mobil menüyü ve aramayı kapat
  // closeSearch dep array yerine direkt state reset — döngüsel bağımlılığı önler
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
    setActiveResultIdx(-1);
    setFilterCategory("");
    setFilterDiscount(false);
    setFilterInStock(false);
  }, [location.pathname]);

  const handleSearch = useCallback(() => {
    const q = searchQuery.trim();
    if (q) {
      saveRecentSearch(q);
      const params = new URLSearchParams({ q });
      if (filterCategory) params.set("cat", filterCategory);
      if (filterDiscount) params.set("discount", "1");
      if (filterInStock)  params.set("instock", "1");
      navigate(`/arama?${params.toString()}`);
      closeSearch();
    }
  }, [searchQuery, filterCategory, filterDiscount, filterInStock, navigate, saveRecentSearch, closeSearch]);

  // Fuzzy + filtreli arama sonuçları
  const searchResults = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return [];
    let list = allProducts.filter(p =>
      fuzzyMatch(q, p.name) ||
      fuzzyMatch(q, p.category || "") ||
      fuzzyMatch(q, p.material || "")
    );
    if (filterCategory) list = list.filter(p => p.categorySlug?.startsWith(filterCategory));
    if (filterDiscount)  list = list.filter(p => p.discount && p.discount > 0);
    if (filterInStock)   list = list.filter(p => p.stock > 0);
    return list.slice(0, 6);
  }, [searchQuery, allProducts, filterCategory, filterDiscount, filterInStock]);

  // Kategori önerileri (query varken)
  const categoryHits = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return mainCategories.flatMap(c => [
      { label: c.label, slug: c.slug },
      ...c.subcategories.map(s => ({ label: s.label, slug: s.slug })),
    ]).filter(c => fuzzyMatch(q, c.label)).slice(0, 3);
  }, [searchQuery]);

  const activeFiltersCount = [filterCategory, filterDiscount, filterInStock].filter(Boolean).length;
  const showSuggestions = searchOpen && searchFocused && searchQuery.trim().length === 0;

  const IconBtn = ({ onClick, label, children, active = false, dataAttr }: { onClick: () => void; label: string; children: React.ReactNode; active?: boolean; dataAttr?: string }) => (
    <button onClick={onClick} aria-label={label} {...(dataAttr ? { [`data-${dataAttr}`]: "true" } : {})}
      style={{ background: active ? "#faf7f2" : "none", border: "none", cursor: "pointer", padding: "8px 10px", borderRadius: 6, color: active ? "#c9a96e" : "#111", display: "flex", alignItems: "center", position: "relative", transition: "all 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.color = "#c9a96e"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.color = "#111"; }}
    >
      {children}
    </button>
  );

  return (
    <>
      <header ref={headerRef} style={{ position: "fixed", top: 36, left: 0, right: 0, zIndex: 130, background: "#fff", borderBottom: scrolled ? "none" : "1px solid #eee", boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.08)" : "none", transition: "box-shadow 0.3s" }}>
        <div id="hdr-inner" style={{ maxWidth: 1600, margin: "0 auto", padding: "0 32px", height: 60, display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", width: "100%", boxSizing: "border-box", gap: 0 }}>

          {/* SOL */}
          <div id="hdr-left" style={{ display: "flex", alignItems: "center" }}>
            <button id="hdr-hamburger" onClick={() => { closeSearch(); setMobileOpen(v => !v); }} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", color: "#111", display: "none", alignItems: "center" }} aria-label="Menü">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Logo */}
          <Link to="/" id="hdr-logo" style={{ flexShrink: 0, display: "flex", alignItems: "center", marginRight: 32 }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <img loading="lazy" src={logoUrl} alt="Takimax" style={{ height: 30, width: "auto" }} />
          </Link>

          {/* Desktop Nav */}
          <nav id="hdr-desktop-nav" style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2, flexWrap: "nowrap", overflow: "hidden", minWidth: 0 }}>
            {mainCategories.map(cat => <NavItem key={cat.slug} category={cat} headerBottom={headerBottom} />)}
          </nav>

          {/* Sağ ikonlar */}
          <div id="hdr-right" style={{ display: "flex", alignItems: "center", gap: 0, flexShrink: 0, justifyContent: "flex-end" }}>

            {/* Arama */}
            <IconBtn onClick={() => { if (mobileOpen) return; setSearchOpen(v => !v); if (!searchOpen) setTimeout(() => inputRef.current?.focus(), 100); }} label="Arama" active={searchOpen}>
              <Search size={20} />
            </IconBtn>

            {/* Favoriler — hesabım sayfasına yönlendir */}
            <span id="hdr-fav-btn" style={{ display: "none" }}>
              <IconBtn onClick={() => navigate(isLoggedIn ? "/hesabim" : "/giris")} label="Favorilerim">
                <Heart
                  size={20}
                  style={{
                    color: "currentColor",
                    fill: "none",
                    transition: "color 0.2s",
                  }}
                />
                {totalFavorites > 0 && (
                  <span style={{ position: "absolute", top: 3, right: 3, minWidth: 16, height: 16, background: "#c9a96e", color: "#fff", fontSize: 9, fontFamily: "Montserrat, sans-serif", fontWeight: 700, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>
                    {totalFavorites}
                  </span>
                )}
              </IconBtn>
            </span>

            {/* Hesap */}
            <IconBtn onClick={() => navigate(isLoggedIn ? "/hesabim" : "/giris")} label="Hesabım">
              <User size={20} />
              {isLoggedIn && <span style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, background: "#c9a96e", borderRadius: "50%" }} />}
            </IconBtn>

            {/* Sepet */}
            <IconBtn onClick={() => navigate("/sepet")} label="Sepetim" dataAttr="cart-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {totalItems > 0 && (
                <span style={{ position: "absolute", top: 2, right: 2, minWidth: 15, height: 15, background: "#111", color: "#fff", fontSize: 8, fontFamily: "Montserrat, sans-serif", fontWeight: 800, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px", border: "1.5px solid #fff" }}>
                  {totalItems}
                </span>
              )}
            </IconBtn>
          </div>
        </div>
      </header>

      {/* ══ MOBİL DRAWER ══ */}
      {mobileOpen && (
        <>
          <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)", zIndex: 200, animation: "mobileOverlayIn 0.22s ease" }} />

          <div
            onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={e => { if (touchStartX.current !== null && touchStartX.current - e.changedTouches[0].clientX > 60) setMobileOpen(false); touchStartX.current = null; }}
            style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: "82%", maxWidth: 340, background: "#fff", zIndex: 201, display: "flex", flexDirection: "column", overflowY: "auto", WebkitOverflowScrolling: "touch", overscrollBehavior: "contain", boxShadow: "8px 0 40px rgba(0,0,0,0.18)", animation: "mobileDrawerIn 0.3s cubic-bezier(0.32,0.72,0,1)" }}
          >
            {/* Üst bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f0ede8", background: "#faf9f7", flexShrink: 0 }}>
              <Link to="/" onClick={() => { setMobileOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                <img loading="lazy" src={logoUrl} alt="Takimax" style={{ height: 26 }} />
              </Link>
              <button onClick={() => setMobileOpen(false)} style={{ background: "#fff", border: "1px solid #eee", borderRadius: "50%", cursor: "pointer", padding: 7, color: "#111", display: "flex", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}>
                <X size={16} />
              </button>
            </div>

            {/* Kullanıcı kartı */}
            <Link to={isLoggedIn ? "/hesabim" : "/giris"} onClick={() => setMobileOpen(false)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: "linear-gradient(135deg,#fdf8f0 0%,#f5ead8 100%)", borderBottom: "1px solid #ead9b8", textDecoration: "none", flexShrink: 0 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#e8cc9a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(201,169,110,0.35)" }}>
                <User size={17} style={{ color: "#fff" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: "#111", margin: 0 }}>{isLoggedIn ? (user?.name || "Hesabım") : "Giriş Yap"}</p>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#999", margin: "2px 0 0" }}>{isLoggedIn ? "Hesabınızı görüntüleyin" : "Üye girişi veya kayıt ol"}</p>
              </div>
              <ChevronDown size={14} style={{ color: "#c9a96e", transform: "rotate(-90deg)" }} />
            </Link>

            {/* Favoriler + Sepet hızlı erişim */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #f0ede8", flexShrink: 0 }}>
              <button onClick={() => {
                setMobileOpen(false);
                navigate(isLoggedIn ? "/hesabim" : "/giris");
              }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px 16px", background: "none", border: "none", borderRight: "1px solid #f0ede8", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 600, color: "#555" }}>
                <Heart size={14} style={{ color: "#c9a96e", fill: "none" }} /> Favoriler
                {totalFavorites > 0 && <span style={{ background: "#c9a96e", color: "#fff", fontSize: 9, fontWeight: 800, padding: "1px 5px", borderRadius: 10 }}>{totalFavorites}</span>}
              </button>
              <button onClick={() => {
                setMobileOpen(false);
                navigate("/sepet");
              }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px 16px", background: "none", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 600, color: "#555" }}>
                <ShoppingBag size={14} style={{ color: "#c9a96e" }} /> Sepetim
                {totalItems > 0 && <span style={{ background: "#111", color: "#fff", fontSize: 9, fontWeight: 800, padding: "1px 5px", borderRadius: 10 }}>{totalItems}</span>}
              </button>
            </div>

            {/* Kategoriler */}
            <div style={{ padding: "14px 20px 8px", flexShrink: 0 }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "#bbb", margin: 0 }}>Kategoriler</p>
            </div>

            <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}>
              {mainCategories.map(cat => {
                const isOpen = mobileAccordion === cat.slug;
                const badge = CATEGORY_BADGES[cat.slug];
                return (
                  <div key={cat.slug} style={{ borderBottom: "1px solid #f5f2ee" }}>
                    <button onClick={() => setMobileAccordion(isOpen ? null : cat.slug)}
                      style={{ width: "100%", display: "flex", alignItems: "center", padding: "12px 20px", background: isOpen ? "#fdf8f0" : "transparent", border: "none", cursor: "pointer", textAlign: "left", gap: 12, transition: "background 0.15s" }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: isOpen ? "linear-gradient(135deg,#c9a96e22,#c9a96e11)" : "#f5f3ef", border: isOpen ? "1px solid #c9a96e44" : "1px solid #ece9e3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                        {CATEGORY_ICONS[cat.slug] ?? <ShoppingBag size={15} style={{ color: "#c9a96e" }} />}
                      </div>
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: isOpen ? 700 : 500, color: isOpen ? "#111" : "#333", flex: 1, display: "flex", alignItems: "center", gap: 7, transition: "color 0.15s" }}>
                        {cat.label}
                        {badge && <span style={{ fontSize: 8, fontWeight: 800, background: badge.color, color: "#fff", padding: "1px 5px", borderRadius: 3, letterSpacing: "0.06em" }}>{badge.label}</span>}
                      </span>
                      <ChevronDown size={13} style={{ color: isOpen ? "#c9a96e" : "#ccc", transition: "transform 0.25s, color 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }} />
                    </button>

                    {isOpen && (
                      <div style={{ background: "#fdfaf6", borderTop: "1px solid #f0ebe0", paddingBottom: 4, animation: "subCatIn 0.2s ease" }}>
                        <Link to={`/kategori/${cat.slug}`} onClick={() => setMobileOpen(false)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px 10px 68px", fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: "#c9a96e", textDecoration: "none", borderBottom: "1px solid #ece9e3", letterSpacing: "0.02em" }}>
                          Tümünü Gör <ArrowRight size={13} />
                        </Link>
                        {cat.subcategories.map((sub, i) => (
                          <Link key={sub.slug} to={`/kategori/${sub.slug}`} onClick={() => setMobileOpen(false)}
                            style={{ display: "flex", alignItems: "center", padding: "9px 20px 9px 68px", fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#666", textDecoration: "none", borderBottom: i < cat.subcategories.length - 1 ? "1px solid #f0ede8" : "none", transition: "color 0.15s" }}
                            onTouchStart={e => (e.currentTarget.style.color = "#c9a96e")}
                            onTouchEnd={e => (e.currentTarget.style.color = "#666")}
                          >
                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#d4b483", marginRight: 10, flexShrink: 0 }} />
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sosyal Medya */}
            <div style={{ borderTop: "1px solid #f0ede8", padding: "14px 20px", background: "#faf9f7", flexShrink: 0 }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "#bbb", margin: "0 0 10px 0" }}>Bizi Takip Et</p>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  {
                    href: "https://instagram.com/takimax",
                    label: "Instagram",
                    hoverBg: "radial-gradient(circle at 30% 110%, #f9c449 0%, #f47839 25%, #e1306c 50%, #833ab4 75%, #405de6 100%)",
                    hoverBorder: "#e1306c",
                    normalBg: "#fff",
                    normalBorder: "#ece9e3",
                    icon: (h: boolean) => (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke={h ? "#fff" : "#888"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                      </svg>
                    ),
                  },
                  {
                    href: "https://facebook.com/takimax",
                    label: "Facebook",
                    hoverBg: "#1877f2",
                    hoverBorder: "#1877f2",
                    normalBg: "#fff",
                    normalBorder: "#ece9e3",
                    icon: (h: boolean) => (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill={h ? "#fff" : "#888"}>
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                      </svg>
                    ),
                  },
                  {
                    href: "https://tiktok.com/@takimax",
                    label: "TikTok",
                    hoverBg: "#010101",
                    hoverBorder: "#69c9d0",
                    normalBg: "#fff",
                    normalBorder: "#ece9e3",
                    icon: (h: boolean) => (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={h ? "#fff" : "#888"}>
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
                      </svg>
                    ),
                  },
                ].map(({ href, label, hoverBg, hoverBorder, normalBg, normalBorder, icon }) => (
                  <MobileSocialBtn
                    key={label}
                    href={href}
                    label={label}
                    hoverBg={hoverBg}
                    hoverBorder={hoverBorder}
                    normalBg={normalBg}
                    normalBorder={normalBorder}
                    icon={icon}
                  />
                ))}
              </div>
            </div>

            {/* Alt linkler */}
            <div style={{ borderTop: "1px solid #f0ede8", padding: "10px 20px 16px", background: "#faf9f7", flexShrink: 0 }}>
              {[{ label: "Sipariş Takibi", to: "/siparis-takibi" }, { label: "İade & Değişim", to: "/iade-ve-degisim" }, { label: "İletişim", to: "/iletisim" }].map(link => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 4px", fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#666", textDecoration: "none", borderBottom: "1px solid #f0ede8" }}>
                  {link.label}
                  <ChevronDown size={11} style={{ color: "#ccc", transform: "rotate(-90deg)" }} />
                </Link>
              ))}
            </div>
          </div>

          <style>{`
            @keyframes mobileOverlayIn { from{opacity:0} to{opacity:1} }
            @keyframes mobileDrawerIn { from{transform:translateX(-100%)} to{transform:translateX(0)} }
            @keyframes subCatIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
          `}</style>
        </>
      )}

      {/* ══ GELİŞMİŞ ARAMA PANELİ ══ */}
      <div style={{ position: "fixed", top: 96, left: 0, right: 0, zIndex: 129, background: "#fff", borderBottom: searchOpen ? "1px solid #ede9e2" : "none", boxShadow: searchOpen ? "0 8px 32px rgba(0,0,0,0.09)" : "none", maxHeight: searchOpen ? 600 : 0, overflow: "hidden", transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "18px 32px 22px" }}>

          {/* Input satırı */}
          <div style={{ display: "flex", alignItems: "stretch", height: 48, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 48, flexShrink: 0, background: "#faf7f2", border: "1.5px solid #e0dbd2", borderRight: "none", borderRadius: "5px 0 0 5px" }}>
              <Search size={16} style={{ color: "#c9a96e" }} />
            </div>
            <input
              ref={inputRef} type="text" value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setActiveResultIdx(-1); }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  if (activeResultIdx >= 0 && searchResults[activeResultIdx]) {
                    navigate(`/urun/${searchResults[activeResultIdx].id}`);
                    closeSearch();
                  } else { handleSearch(); }
                }
                if (e.key === "Escape") closeSearch();
                if (e.key === "ArrowDown") { e.preventDefault(); setActiveResultIdx(i => Math.min(i + 1, searchResults.length - 1)); }
                if (e.key === "ArrowUp")   { e.preventDefault(); setActiveResultIdx(i => Math.max(i - 1, -1)); }
              }}
              placeholder="Kolye, küpe, bileklik, yüzük ara..."
              style={{ flex: 1, padding: "0 16px", border: "1.5px solid #e0dbd2", borderRight: "none", fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#111", outline: "none", background: "#fff", letterSpacing: "0.02em" }}
            />
            <button onClick={handleSearch}
              style={{ padding: "0 28px", background: "#111", color: "#fff", border: "1.5px solid #111", borderRadius: "0 5px 5px 0", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", whiteSpace: "nowrap", transition: "background 0.2s, border-color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#c9a96e"; e.currentTarget.style.borderColor = "#c9a96e"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#111"; e.currentTarget.style.borderColor = "#111"; }}
            >Ara</button>
            <button onClick={closeSearch}
              style={{ marginLeft: 10, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px", color: "#bbb", flexShrink: 0, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#111")}
              onMouseLeave={e => (e.currentTarget.style.color = "#bbb")}
              aria-label="Kapat"
            ><X size={18} /></button>
          </div>

          {/* Filtre chip'leri */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.12em", textTransform: "uppercase", marginRight: 2 }}>Filtrele:</span>

            {/* Kategori chip'leri */}
            {[
              { label: "Kadın", slug: "kadin-aksesuar" },
              { label: "Erkek", slug: "erkek-aksesuar" },
              { label: "Çocuk", slug: "cocuk-aksesuar" },
              { label: "İndirimli", slug: "" },
              { label: "Stokta", slug: "" },
            ].map(f => {
              const isDiscount  = f.label === "İndirimli";
              const isStock     = f.label === "Stokta";
              const isCat       = !isDiscount && !isStock;
              const active      = isCat ? filterCategory === f.slug : isDiscount ? filterDiscount : filterInStock;
              return (
                <button key={f.label}
                  onClick={() => {
                    if (isDiscount) setFilterDiscount(v => !v);
                    else if (isStock) setFilterInStock(v => !v);
                    else setFilterCategory(v => v === f.slug ? "" : f.slug);
                  }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "4px 11px", border: "1px solid",
                    borderColor: active ? "#111" : "#e8e3dc",
                    background: active ? "#111" : "#fff",
                    color: active ? "#fff" : "#555",
                    fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: active ? 700 : 400,
                    borderRadius: 20, cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  {active && <X size={10} />}
                  {f.label}
                </button>
              );
            })}

            {activeFiltersCount > 0 && (
              <button onClick={() => { setFilterCategory(""); setFilterDiscount(false); setFilterInStock(false); }}
                style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", border: "1px solid #fca5a5", background: "#fff5f5", color: "#dc2626", fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 600, borderRadius: 20, cursor: "pointer" }}>
                <X size={10} /> Filtreleri Temizle
              </button>
            )}
          </div>

          {/* ── Boş sorgu: Popüler + Son Aramalar + Kategori Kısayolları ── */}
          {showSuggestions && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>

              {/* Popüler aramalar */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <TrendingUp size={12} style={{ color: "#c9a96e" }} />
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#bbb" }}>Popüler Aramalar</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {POPULAR_SEARCHES.map(s => (
                    <button key={s} onClick={() => { saveRecentSearch(s); navigate(`/arama?q=${encodeURIComponent(s)}`); closeSearch(); }}
                      style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 8px", background: "none", border: "none", cursor: "pointer", borderRadius: 5, textAlign: "left", width: "100%", transition: "background 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#faf7f2")}
                      onMouseLeave={e => (e.currentTarget.style.background = "none")}
                    >
                      <Sparkles size={11} style={{ color: "#c9a96e", flexShrink: 0 }} />
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#444" }}>{s}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Son aramalar */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <Clock size={12} style={{ color: "#c9a96e" }} />
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#bbb" }}>Son Aramalar</span>
                </div>
                {recentSearches.length === 0 ? (
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#ccc", padding: "7px 8px" }}>Henüz arama yok</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {recentSearches.slice(0, 5).map(s => (
                      <button key={s} onClick={() => { navigate(`/arama?q=${encodeURIComponent(s)}`); closeSearch(); }}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 9, padding: "7px 8px", background: "none", border: "none", cursor: "pointer", borderRadius: 5, textAlign: "left", width: "100%", transition: "background 0.15s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#faf7f2")}
                        onMouseLeave={e => (e.currentTarget.style.background = "none")}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <Clock size={11} style={{ color: "#ddd", flexShrink: 0 }} />
                          <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#555" }}>{s}</span>
                        </div>
                        <button onClick={e => { e.stopPropagation(); setRecentSearches(prev => { const upd = prev.filter(r => r !== s); try { localStorage.setItem("tm_recent_searches", JSON.stringify(upd)); } catch (_e) { /* localStorage erişilemez */ } return upd; }); }}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", padding: 2, display: "flex", flexShrink: 0 }}
                          onMouseEnter={e => (e.currentTarget.style.color = "#dc2626")}
                          onMouseLeave={e => (e.currentTarget.style.color = "#ccc")}
                        ><X size={11} /></button>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Kategori kısayolları */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <Tag size={12} style={{ color: "#c9a96e" }} />
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#bbb" }}>Kategoriler</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {POPULAR_CATEGORIES.map(c => (
                    <Link key={c.slug} to={`/kategori/${c.slug}`} onClick={closeSearch}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 8px", textDecoration: "none", borderRadius: 5, transition: "background 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#faf7f2")}
                      onMouseLeave={e => (e.currentTarget.style.background = "none")}
                    >
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#444" }}>{c.label}</span>
                      <CRight size={11} style={{ color: "#ccc" }} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Yazılınca: kategori önerileri + ürün sonuçları ── */}
          {searchQuery.trim().length > 0 && (
            <div>
              {/* Kategori önerileri */}
              {categoryHits.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "#bbb", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0 }}>Kategori:</span>
                  {categoryHits.map(c => (
                    <Link key={c.slug} to={`/kategori/${c.slug}`} onClick={closeSearch}
                      style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", background: "#faf7f2", border: "1px solid #e8e3dc", borderRadius: 20, fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#444", textDecoration: "none", transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#c9a96e"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#c9a96e"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#faf7f2"; e.currentTarget.style.color = "#444"; e.currentTarget.style.borderColor = "#e8e3dc"; }}
                    >
                      <Tag size={10} /> {c.label} <CRight size={10} />
                    </Link>
                  ))}
                </div>
              )}

              {/* Ürün sonuçları */}
              {searchResults.length === 0 ? (
                <div style={{ padding: "16px 0", fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#aaa", display: "flex", alignItems: "center", gap: 8 }}>
                  <Search size={14} style={{ opacity: 0.4 }} />
                  "<strong style={{ color: "#555" }}>{searchQuery}</strong>" için sonuç bulunamadı.
                  {activeFiltersCount > 0 && <button onClick={() => { setFilterCategory(""); setFilterDiscount(false); setFilterInStock(false); }} style={{ marginLeft: 8, background: "none", border: "none", cursor: "pointer", color: "#c9a96e", fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 600, padding: 0 }}>Filtreleri kaldır →</button>}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {searchResults.map((p, i) => {
                    const q = searchQuery.trim().toLowerCase();
                    const idx = p.name.toLowerCase().indexOf(q);
                    const before = idx >= 0 ? p.name.slice(0, idx) : p.name;
                    const match  = idx >= 0 ? p.name.slice(idx, idx + q.length) : "";
                    const after  = idx >= 0 ? p.name.slice(idx + q.length) : "";
                    const isActive = i === activeResultIdx;
                    return (
                      <div key={p.id}
                        onClick={() => { navigate(`/urun/${p.id}`); closeSearch(); }}
                        style={{ display: "flex", alignItems: "center", gap: 14, padding: "9px 10px", cursor: "pointer", borderRadius: 7, borderTop: i > 0 ? "1px solid #f5f2ee" : "none", transition: "background 0.15s", background: isActive ? "#faf7f2" : "transparent" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#faf7f2")}
                        onMouseLeave={e => (e.currentTarget.style.background = isActive ? "#faf7f2" : "transparent")}
                      >
                        <div style={{ width: 44, height: 44, borderRadius: 6, overflow: "hidden", flexShrink: 0, background: "#f5f0eb", border: "1px solid #ede9e2" }}>
                          <img loading="lazy" src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#222", display: "block" }}>
                            {idx >= 0 ? <>{before}<strong style={{ color: "#c9a96e" }}>{match}</strong>{after}</> : p.name}
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "#bbb" }}>{p.category}</span>
                            <span style={{ width: 2, height: 2, borderRadius: "50%", background: "#ddd" }} />
                            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "#bbb" }}>{p.material}</span>
                            {p.stock === 0 && <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 700, color: "#ef4444", background: "#fef2f2", padding: "1px 5px", borderRadius: 3 }}>Tükendi</span>}
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: "#111", display: "block" }}>
                            {p.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                          </span>
                          {p.discount && p.discount > 0 && (
                            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, background: "#dcfce7", color: "#16a34a", padding: "1px 5px", borderRadius: 3 }}>%{p.discount} indirim</span>
                          )}
                        </div>
                        <ArrowRight size={13} style={{ color: "#ddd", flexShrink: 0 }} />
                      </div>
                    );
                  })}

                  {/* Tüm sonuçları gör */}
                  <button onClick={handleSearch}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 8, padding: "10px", background: "#faf7f2", border: "1px solid #e8e3dc", borderRadius: 6, cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 600, color: "#555", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#111"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#111"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#faf7f2"; e.currentTarget.style.color = "#555"; e.currentTarget.style.borderColor = "#e8e3dc"; }}
                  >
                    <Search size={13} />
                    "{searchQuery}" için tüm sonuçları gör
                    {activeFiltersCount > 0 && <span style={{ background: "#c9a96e", color: "#fff", fontSize: 9, fontWeight: 800, padding: "1px 6px", borderRadius: 10 }}>{activeFiltersCount} filtre</span>}
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Arama overlay */}
      {searchOpen && (
        <div onClick={closeSearch} style={{ position: "fixed", inset: 0, zIndex: 128, background: "rgba(0,0,0,0.18)", backdropFilter: "blur(1px)", animation: "searchBgFade 0.25s ease" }} />
      )}

      {/* Responsive */}
      <style>{`
        @media (min-width: 1025px) {
          #hdr-hamburger   { display: none !important; }
          #hdr-left        { display: none !important; }
          #hdr-logo        { margin-right: 32px !important; }
          #hdr-desktop-nav { display: flex !important; }
          #hdr-fav-btn     { display: none !important; }
        }
        @media (max-width: 1024px) {
          #hdr-desktop-nav { display: none !important; }
          #hdr-hamburger   { display: flex !important; }
          #hdr-inner {
            grid-template-columns: 1fr auto 1fr !important;
            padding: 0 16px !important;
            height: 54px !important;
          }
          #hdr-left  { display: flex !important; justify-content: flex-start; align-items: center; }
          #hdr-logo  { margin: 0 !important; justify-content: center; }
          #hdr-right { justify-content: flex-end; gap: 0 !important; }
          #hdr-fav-btn { display: flex !important; }
        }
        @keyframes searchBgFade { from{opacity:0} to{opacity:1} }
      `}</style>
    </>
  );
};

export default Header;