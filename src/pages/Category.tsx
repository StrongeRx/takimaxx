import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/data/products";
import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { Heart, ShoppingBag, Star, ChevronDown, X, SlidersHorizontal, Tag, Check } from "lucide-react";

import { mainCategories, getCategoryBySlug } from "@/data/categories";
import Breadcrumb, { type BreadcrumbItem } from "@/components/Breadcrumb";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useToast } from "@/contexts/ToastContext";
import { useCartFly } from "@/hooks/useCartFly";
import AddToCartRow from "@/components/AddToCartRow";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

type SortKey = "default" | "price_asc" | "price_desc" | "discount" | "reviews";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "default",    label: "Önerilen" },
  { key: "price_asc",  label: "Artan Fiyat" },
  { key: "price_desc", label: "Azalan Fiyat" },
  { key: "discount",   label: "En Çok İndirim" },
  { key: "reviews",    label: "En Çok Değerlendirme" },
];

const getCategoryName = (slug: string): string => {
  if (!slug || slug === "hepsi") return "Tüm Ürünler";
  const found = getCategoryBySlug(slug);
  if (found) {
    // Tam kategori eşleşmesi
    if (found.slug === slug) return found.label;
    // Alt kategori arama
    const sub = found.subcategories.find(s => s.slug === slug);
    if (sub) return sub.label;
  }
  // Slash içeriyorsa parent/sub formatında ara
  const parts = slug.split("/");
  if (parts.length > 1) {
    const parent = getCategoryBySlug(parts[0]);
    const sub = parent?.subcategories.find(s => s.slug === slug);
    if (sub) return sub.label;
  }
  return slug;
};

const Stars = ({ count }: { count: number }) => {
  const rating = Math.min(5, Math.max(3.5, 5 - count * 0.005));
  const full = Math.floor(rating);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={9} style={{ color: i <= full ? "#c9a96e" : "#ddd", fill: i <= full ? "#c9a96e" : "none" }} />
      ))}
      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, color: "#aaa", marginLeft: 3 }}>({count})</span>
    </div>
  );
};

// Accordion bölümü
const FilterSection = ({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid #f0ede8" }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 0", background: "none", border: "none", cursor: "pointer",
        }}
      >
        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#111" }}>
          {title}
        </span>
        <ChevronDown size={14} style={{ color: "#aaa", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && <div style={{ paddingBottom: 16 }}>{children}</div>}
    </div>
  );
};

const ITEMS_PER_PAGE = 16;

const MATERIAL_GROUPS: { label: string; values: string[] }[] = [
  { label: "925 Ayar Gümüş",  values: ["925 Ayar Gümüş", "925 Ayar Gümüş & Altın Kaplama", "925 Ayar Gümüş & Zirkon"] },
  { label: "Paslanmaz Çelik", values: ["Paslanmaz Çelik", "316L Paslanmaz Çelik"] },
  { label: "Altın Kaplama",   values: ["Pirinç & Gümüş Kaplama"] },
  { label: "Hipoalerjenik",   values: ["Hipoalerjenik Gümüş", "Hipoalerjenik Çelik"] },
  { label: "Diğer Metal",     values: ["Çelik & Emaye", "Metal & Kristal", "Metal & Plastik", "Metal & İnci", "Reçine & Metal", "Kadife & Plastik"] },
];

const Category = () => {
  const products = useProducts();
  const { slug, parent, sub } = useParams<{ slug: string; parent: string; sub: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { flyToCart } = useCartFly();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast, spawnHearts } = useToast();

  // Slug — önce hesaplanmalı, useEffect'in dependency'sinde kullanılıyor
  const fullSlug = sub ? `${parent}/${sub}` : (slug || "hepsi");
  const categoryName = getCategoryName(fullSlug);
  const isAll = fullSlug === "hepsi";

  // Tüm filtre state'leri
  const [sort, setSort] = useState<SortKey>("default");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyBestseller, setOnlyBestseller] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination — URL'den sayfa oku
  const currentPage = Math.max(1, Number(searchParams.get("page") || 1));

  const goToPage = (p: number) => {
    setSearchParams(prev => { const n = new URLSearchParams(prev); n.set("page", String(p)); return n; });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filtreler veya kategori değişince sayfa 1'e dön
  useEffect(() => {
    setSearchParams(prev => { const n = new URLSearchParams(prev); n.delete("page"); return n; });
  }, [priceMin, priceMax, selectedMaterials, selectedRating, onlyDiscounted, onlyInStock, onlyBestseller, sort, fullSlug, setSearchParams]);

  /* Breadcrumb zinciri */
  const breadcrumbItems = useMemo((): BreadcrumbItem[] => {
    if (isAll) return [{ label: "Tüm Ürünler" }];

    const parentCat = getCategoryBySlug(fullSlug);
    if (!parentCat) return [{ label: categoryName }];

    // Alt kategori mi? (örn: kadin-aksesuar/kolye)
    const subCat = parentCat.subcategories.find(s => s.slug === fullSlug);
    if (subCat) {
      return [
        { label: parentCat.label, href: `/kategori/${parentCat.slug}` },
        { label: subCat.label },
      ];
    }

    // Üst kategori (örn: kadin-aksesuar)
    return [{ label: parentCat.label }];
  }, [fullSlug, isAll, categoryName]);

  // Önce sadece kategoriye göre (malzeme sayımı için)
  const categoryFiltered = useMemo(() =>
    isAll ? products : products.filter(p =>
      p.categorySlug && (p.categorySlug === fullSlug || p.categorySlug.startsWith(fullSlug + "/"))
    ),
    [products, isAll, fullSlug]
  );

  // Malzeme grupları ve sayımlar
  const materialCounts = useMemo(() =>
    MATERIAL_GROUPS.map(g => ({
      ...g,
      count: categoryFiltered.filter(p => g.values.some(v => p.material?.includes(v.split(" ")[0]))).length,
    })).filter(g => g.count > 0),
    [categoryFiltered]
  );

  const toggleMaterial = (label: string) =>
    setSelectedMaterials(prev => prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label]);

  const filtered = useMemo(() => {
    let list = categoryFiltered;

    if (priceMin) list = list.filter(p => p.price >= Number(priceMin));
    if (priceMax) list = list.filter(p => p.price <= Number(priceMax));

    if (selectedMaterials.length > 0) {
      const matchValues = MATERIAL_GROUPS
        .filter(g => selectedMaterials.includes(g.label))
        .flatMap(g => g.values);
      list = list.filter(p => matchValues.some(v => p.material?.includes(v.split(" ")[0])));
    }

    if (selectedRating !== null) {
      list = list.filter(p => {
        const r = Math.min(5, Math.max(3.5, 5 - p.reviews * 0.005));
        return r >= selectedRating;
      });
    }

    if (onlyDiscounted) list = list.filter(p => p.discount && p.discount > 0);
    if (onlyInStock)    list = list.filter(p => p.stock > 0);
    if (onlyBestseller) list = list.filter(p => p.reviews > 100);

    switch (sort) {
      case "price_asc":  return [...list].sort((a, b) => a.price - b.price);
      case "price_desc": return [...list].sort((a, b) => b.price - a.price);
      case "discount":   return [...list].sort((a, b) => (b.discount || 0) - (a.discount || 0));
      case "reviews":    return [...list].sort((a, b) => b.reviews - a.reviews);
      default:           return list;
    }
  }, [categoryFiltered, priceMin, priceMax, selectedMaterials, selectedRating, onlyDiscounted, onlyInStock, onlyBestseller, sort]);

  const allCategories = [
    { slug: "hepsi", label: "Tüm Ürünler" },
    ...mainCategories.map(c => ({ slug: c.slug, label: c.label })),
  ];

  const activeFilterCount = [
    priceMin || priceMax ? 1 : 0,
    selectedMaterials.length,
    selectedRating !== null ? 1 : 0,
    onlyDiscounted ? 1 : 0,
    onlyInStock ? 1 : 0,
    onlyBestseller ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const hasActiveFilters = activeFilterCount > 0 || sort !== "default";

  const clearAll = () => {
    setPriceMin(""); setPriceMax("");
    setSelectedMaterials([]);
    setSelectedRating(null);
    setOnlyDiscounted(false);
    setOnlyInStock(false);
    setOnlyBestseller(false);
    setSort("default");
  };

  // Sayfalama hesapla
  const totalPages   = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage     = Math.min(currentPage, totalPages);
  const paginated    = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleFav = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); e.stopPropagation();
    const wasFav = isFavorite(product.id);
    toggleFavorite(product);
    if (!wasFav) spawnHearts(e.clientX, e.clientY);
  };

  const handleCart = (e: React.MouseEvent, product: Product, qty: number = 1) => {
    e.preventDefault(); e.stopPropagation();
    for (let i = 0; i < qty; i++) addToCart(product);
    flyToCart(product.image, e.clientX, e.clientY);
  };

  // Filtre paneli içeriği (masaüstü + mobil aynı)
  const FilterPanel = () => (
    <>
      {/* Aktif filtre / temizle */}
      {hasActiveFilters && (
        <div style={{ marginBottom: 4, paddingBottom: 14, borderBottom: "1px solid #f0ede8", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#888" }}>Filtre uygulandı</span>
          <button onClick={clearAll} style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#c9a96e", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <X size={11} /> Temizle
          </button>
        </div>
      )}

      {/* Kategori */}
      <FilterSection title="Kategori">
        {allCategories.map(cat => {
          const isActive = cat.slug === fullSlug;
          const count = cat.slug === "hepsi"
            ? products.length
            : products.filter(p => p.categorySlug && (p.categorySlug === cat.slug || p.categorySlug.startsWith(cat.slug + "/"))).length;
          return (
            <Link
              key={cat.slug}
              to={`/kategori/${cat.slug}`}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "7px 10px", marginBottom: 2,
                fontFamily: "Montserrat, sans-serif", fontSize: 12,
                color: isActive ? "#fff" : "#444",
                background: isActive ? "#111" : "transparent",
                textDecoration: "none",
                transition: "all 0.15s",
                borderRadius: 2,
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "#f5f2ee"; e.currentTarget.style.color = "#111"; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#444"; }}}
            >
              <span>{cat.label}</span>
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: isActive ? "rgba(255,255,255,0.6)" : "#bbb", minWidth: 18, textAlign: "right" }}>{count}</span>
            </Link>
          );
        })}
      </FilterSection>

      {/* Fiyat Aralığı */}
      <FilterSection title="Fiyat Aralığı">
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
          <input
            type="number" placeholder="Min ₺" value={priceMin}
            onChange={e => setPriceMin(e.target.value)}
            style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8e4df", fontFamily: "Montserrat, sans-serif", fontSize: 12, outline: "none", background: "#faf9f7", color: "#111" }}
            onFocus={e => e.currentTarget.style.borderColor = "#111"}
            onBlur={e => e.currentTarget.style.borderColor = "#e8e4df"}
          />
          <span style={{ color: "#ccc", fontSize: 14, flexShrink: 0 }}>–</span>
          <input
            type="number" placeholder="Max ₺" value={priceMax}
            onChange={e => setPriceMax(e.target.value)}
            style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8e4df", fontFamily: "Montserrat, sans-serif", fontSize: 12, outline: "none", background: "#faf9f7", color: "#111" }}
            onFocus={e => e.currentTarget.style.borderColor = "#111"}
            onBlur={e => e.currentTarget.style.borderColor = "#e8e4df"}
          />
        </div>
        {/* Hızlı fiyat seçenekleri */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {[["0","500"],["500","1000"],["1000","2000"],["2000",""]].map(([mn, mx]) => {
            const label = mx ? `₺${mn}–₺${mx}` : `₺${mn}+`;
            const active = priceMin === mn && priceMax === mx;
            return (
              <button
                key={label}
                onClick={() => { setPriceMin(mn); setPriceMax(mx); }}
                style={{
                  padding: "4px 10px", border: "1px solid",
                  borderColor: active ? "#111" : "#e8e4df",
                  background: active ? "#111" : "#fff",
                  color: active ? "#fff" : "#555",
                  fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >{label}</button>
            );
          })}
        </div>
      </FilterSection>

      {/* Malzeme */}
      {materialCounts.length > 0 && (
        <FilterSection title="Malzeme" defaultOpen={false}>
          {materialCounts.map(g => {
            const checked = selectedMaterials.includes(g.label);
            return (
              <label key={g.label} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", padding: "5px 0", userSelect: "none" }}>
                <div onClick={() => toggleMaterial(g.label)}
                  style={{ width: 16, height: 16, border: `1.5px solid ${checked ? "#111" : "#ccc"}`, background: checked ? "#111" : "#fff", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", transition: "all 0.15s" }}>
                  {checked && <Check size={10} color="#fff" strokeWidth={3} />}
                </div>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: checked ? "#111" : "#555", flex: 1, fontWeight: checked ? 600 : 400 }}>{g.label}</span>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "#bbb" }}>{g.count}</span>
              </label>
            );
          })}
        </FilterSection>
      )}

      {/* Değerlendirme */}
      <FilterSection title="Değerlendirme" defaultOpen={false}>
        {[{ label: "4 yıldız ve üzeri", min: 4 }, { label: "3 yıldız ve üzeri", min: 3 }].map(opt => (
          <label key={opt.min} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", padding: "5px 0", userSelect: "none" }}>
            <div onClick={() => setSelectedRating(selectedRating === opt.min ? null : opt.min)}
              style={{ width: 16, height: 16, border: `1.5px solid ${selectedRating === opt.min ? "#111" : "#ccc"}`, background: selectedRating === opt.min ? "#111" : "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", transition: "all 0.15s" }}>
              {selectedRating === opt.min && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={11} style={{ color: i <= opt.min ? "#c9a96e" : "#ddd", fill: i <= opt.min ? "#c9a96e" : "none" }} />)}
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#555", marginLeft: 3 }}>ve üzeri</span>
            </div>
          </label>
        ))}
      </FilterSection>

      {/* Özellikler */}
      <FilterSection title="Özellikler" defaultOpen={false}>
        {[
          { label: "Stokta var",  checked: onlyInStock,    toggle: () => setOnlyInStock(v => !v) },
          { label: "İndirimli",   checked: onlyDiscounted, toggle: () => setOnlyDiscounted(v => !v) },
          { label: "Çok satan",   checked: onlyBestseller, toggle: () => setOnlyBestseller(v => !v) },
        ].map(item => (
          <label key={item.label} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", padding: "5px 0", userSelect: "none" }}>
            <div onClick={item.toggle}
              style={{ width: 16, height: 16, border: `1.5px solid ${item.checked ? "#111" : "#ccc"}`, background: item.checked ? "#111" : "#fff", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", transition: "all 0.15s" }}>
              {item.checked && <Check size={10} color="#fff" strokeWidth={3} />}
            </div>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: item.checked ? "#111" : "#555", fontWeight: item.checked ? 600 : 400 }}>{item.label}</span>
          </label>
        ))}
      </FilterSection>
    </>
  );

  return (
    <div className="page-wrapper header-offset" style={{ minHeight: "100vh", background: "#faf9f7", display: "flex", flexDirection: "column", paddingTop: 96 }}>
      <SEO
        title={`${categoryName} – Takı ve Aksesuar | Takimax`}
        description={`Takimax ${categoryName} koleksiyonu. 925 ayar gümüş ve paslanmaz çelik takılar, hızlı kargo, güvenli ödeme.`}
        canonical={`/kategori/${fullSlug}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": `${categoryName} – Takimax`,
          "url": `https://takimax.com/kategori/${fullSlug}`,
          "description": `Takimax ${categoryName} ürünleri`,
        }}
      />
      <AnnouncementBar />
      <Header />

      {/* Sayfa başlığı */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "0 24px 16px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb items={breadcrumbItems} py={14} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div>
              <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, color: "#111", margin: 0, letterSpacing: "-0.01em" }}>{categoryName}</h1>
            </div>
            {/* Mobil filtre butonu */}
            <button
              className="mobile-filter-btn"
              onClick={() => setMobileFilterOpen(true)}
              style={{ display: "none", alignItems: "center", gap: 8, padding: "9px 16px", border: "1.5px solid #111", background: "#fff", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              <SlidersHorizontal size={13} /> Filtrele
              {hasActiveFilters && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a96e", marginLeft: 2 }} />}
            </button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: 1280, margin: "0 auto", width: "100%", padding: "28px 24px", boxSizing: "border-box" }}>
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 28, alignItems: "start" }} id="cat-layout">

          {/* Sol: Filtre Paneli */}
          <aside style={{ background: "#fff", border: "1px solid #ece9e4", padding: "20px 20px 8px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: "#111", letterSpacing: "0.05em" }}>Filtrele</span>
              <SlidersHorizontal size={13} style={{ color: "#aaa" }} />
            </div>
            <FilterPanel />
          </aside>

          {/* Sağ: Ürünler */}
          <div>
            {/* Üst bar: ürün sayısı + sıralama */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #ece9e4" }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#999", margin: 0 }}>
                <span style={{ fontWeight: 700, color: "#111" }}>{filtered.length}</span> ürün
              </p>
              {/* Sıralama */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowSortMenu(v => !v)}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", border: "1px solid #e8e4df", background: "#fff", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#444", fontWeight: 600, transition: "border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#111"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#e8e4df"}
                >
                  {SORT_OPTIONS.find(o => o.key === sort)?.label}
                  <ChevronDown size={12} style={{ color: "#aaa", transition: "transform 0.2s", transform: showSortMenu ? "rotate(180deg)" : "none" }} />
                </button>
                {showSortMenu && (
                  <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", background: "#fff", border: "1px solid #e8e4df", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", zIndex: 20, minWidth: 200 }}>
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => { setSort(opt.key); setShowSortMenu(false); }}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          width: "100%", textAlign: "left", padding: "10px 16px",
                          background: "none", border: "none", cursor: "pointer",
                          fontFamily: "Montserrat, sans-serif", fontSize: 12,
                          color: sort === opt.key ? "#111" : "#555",
                          fontWeight: sort === opt.key ? 700 : 400,
                          borderLeft: sort === opt.key ? "2px solid #111" : "2px solid transparent",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { if (sort !== opt.key) e.currentTarget.style.background = "#faf9f7"; }}
                        onMouseLeave={e => { if (sort !== opt.key) e.currentTarget.style.background = "none"; }}
                      >
                        {opt.label}
                        {sort === opt.key && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polyline points="2 6 5 9 10 3" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Ürün grid */}
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                {/* Modern boş durum ikonu */}
                <div style={{ display: "inline-block", marginBottom: 24, position: "relative" }}>
                  <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Arka plan daire */}
                    <circle cx="48" cy="48" r="44" fill="#F3F3F0" />
                    {/* Büyüteç camı */}
                    <circle cx="42" cy="41" r="18" stroke="#C8C8C0" strokeWidth="3.5" fill="white" />
                    {/* Büyüteç camı iç detay — hafif parlaklık */}
                    <circle cx="37" cy="36" r="5" fill="#EDEDEA" />
                    {/* Büyüteç sapı */}
                    <line x1="55" y1="54" x2="68" y2="67" stroke="#C8C8C0" strokeWidth="4" strokeLinecap="round" />
                    {/* Büyüteç sap ucu */}
                    <circle cx="69" cy="68" r="3" fill="#B0B0A8" />
                    {/* İçinde X işareti — ürün yok simgesi */}
                    <line x1="36" y1="35" x2="48" y2="47" stroke="#BBBBB3" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="48" y1="35" x2="36" y2="47" stroke="#BBBBB3" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 8 }}>Eşleşen ürün bulunamadı</p>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#999", marginBottom: 20 }}>Filtreleri değiştirerek tekrar deneyin.</p>
                <button onClick={clearAll} style={{ padding: "10px 24px", background: "#111", color: "#fff", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", borderRadius: 3 }}>
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <>
                <div className="cat-product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
                  {paginated.map(product => {
                    const isHovered = hoveredId === product.id;
                    const fav = isFavorite(product.id);
                    return (
                      <div key={product.id}
                        onMouseEnter={() => setHoveredId(product.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        style={{ background: "#fff", border: "1px solid #ece9e4", overflow: "hidden", borderRadius: 4, transition: "box-shadow 0.25s, transform 0.25s", boxShadow: isHovered ? "0 10px 36px rgba(0,0,0,0.1)" : "0 2px 8px rgba(0,0,0,0.04)", transform: isHovered ? "translateY(-3px)" : "translateY(0)" }}>
                        <Link to={`/urun/${product.id}`} style={{ display: "block", position: "relative", aspectRatio: "1/1", overflow: "hidden" }}>
                          <img src={product.image} alt={product.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", transform: isHovered ? "scale(1.06)" : "scale(1)" }} />
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 50%)", opacity: isHovered ? 1 : 0, transition: "opacity 0.3s" }} />
                          <div style={{ position: "absolute", top: 8, left: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                            {product.discount && product.discount > 0 && (
                              <span style={{ background: "#e53e3e", color: "#fff", fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 800, padding: "3px 7px", borderRadius: 3 }}>%{product.discount}</span>
                            )}
                            {product.reviews > 100 && (
                              <span style={{ background: "#c9a96e", color: "#fff", fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 700, padding: "3px 7px", borderRadius: 3 }}>ÇOK SATAN</span>
                            )}
                            {product.stock === 0 && (
                              <span style={{ background: "#999", color: "#fff", fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 700, padding: "3px 7px", borderRadius: 3 }}>TÜKENDİ</span>
                            )}
                          </div>
                          <button onClick={(e) => handleFav(e, product)} style={{ position: "absolute", top: 8, right: 8, width: 30, height: 30, borderRadius: "50%", background: fav ? "#c9a96e" : "rgba(255,255,255,0.95)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", transition: "all 0.2s", opacity: isHovered || fav ? 1 : 0 }}>
                            <Heart size={13} style={{ color: fav ? "#fff" : "#555", fill: fav ? "#fff" : "none" }} />
                          </button>
                        </Link>
                        <Link to={`/urun/${product.id}`} style={{ display: "block", padding: "11px 12px 4px", textDecoration: "none" }}>
                          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{product.material}</p>
                          <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 500, color: "#111", lineHeight: 1.45, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: 35 }}>
                            {product.name}
                          </h3>
                          <Stars count={product.reviews} />
                          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 6 }}>
                            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16, fontWeight: 700, color: "#111" }}>
                              ₺{product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                            </span>
                            {product.oldPrice && (
                              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#bbb", textDecoration: "line-through" }}>
                                ₺{product.oldPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                              </span>
                            )}
                          </div>
                        </Link>
                        {product.stock > 0 && (
                          <div style={{ padding: "0 12px 12px" }}>
                            <AddToCartRow product={product} onAddToCart={handleCart} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 48, flexWrap: "wrap" }}>
                    {/* Önceki */}
                    <button
                      onClick={() => goToPage(safePage - 1)}
                      disabled={safePage === 1}
                      style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e8e4df", background: "#fff", borderRadius: 3, cursor: safePage === 1 ? "default" : "pointer", opacity: safePage === 1 ? 0.4 : 1, transition: "all 0.15s" }}
                      onMouseEnter={e => { if (safePage !== 1) e.currentTarget.style.borderColor = "#111"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8e4df"; }}
                      aria-label="Önceki sayfa"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>

                    {/* Sayfa numaraları — akıllı ellipsis */}
                    {(() => {
                      const pages: (number | "...")[] = [];
                      if (totalPages <= 7) {
                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                      } else {
                        pages.push(1);
                        if (safePage > 3) pages.push("...");
                        for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i);
                        if (safePage < totalPages - 2) pages.push("...");
                        pages.push(totalPages);
                      }
                      return pages.map((p, i) =>
                        p === "..." ? (
                          <span key={`e${i}`} style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#bbb" }}>…</span>
                        ) : (
                          <button key={p}
                            onClick={() => goToPage(p as number)}
                            aria-label={`Sayfa ${p}`}
                            aria-current={p === safePage ? "page" : undefined}
                            style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${p === safePage ? "#111" : "#e8e4df"}`, background: p === safePage ? "#111" : "#fff", color: p === safePage ? "#fff" : "#444", borderRadius: 3, cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: p === safePage ? 700 : 400, transition: "all 0.15s" }}
                            onMouseEnter={e => { if (p !== safePage) { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.color = "#111"; }}}
                            onMouseLeave={e => { if (p !== safePage) { e.currentTarget.style.borderColor = "#e8e4df"; e.currentTarget.style.color = "#444"; }}}
                          >{p}</button>
                        )
                      );
                    })()}

                    {/* Sonraki */}
                    <button
                      onClick={() => goToPage(safePage + 1)}
                      disabled={safePage === totalPages}
                      style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e8e4df", background: "#fff", borderRadius: 3, cursor: safePage === totalPages ? "default" : "pointer", opacity: safePage === totalPages ? 0.4 : 1, transition: "all 0.15s" }}
                      onMouseEnter={e => { if (safePage !== totalPages) e.currentTarget.style.borderColor = "#111"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8e4df"; }}
                      aria-label="Sonraki sayfa"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  </div>
                )}

                {totalPages > 1 && (
                  <p style={{ textAlign: "center", marginTop: 12, fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#bbb" }}>
                    {safePage}. sayfa / {totalPages} · toplam {filtered.length} ürün
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobil Filtre Drawer */}
      {mobileFilterOpen && (
        <>
          <div onClick={() => setMobileFilterOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 300 }} />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", zIndex: 301, maxHeight: "80vh", overflowY: "auto", borderTop: "1px solid #eee", padding: "0 20px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 0 14px", borderBottom: "1px solid #f0ede8", marginBottom: 4 }}>
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: "#111" }}>Filtrele & Sırala</span>
              <button onClick={() => setMobileFilterOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <X size={20} style={{ color: "#111" }} />
              </button>
            </div>
            <FilterPanel />
            <button
              onClick={() => setMobileFilterOpen(false)}
              style={{ width: "100%", marginTop: 20, padding: "13px", background: "#111", color: "#fff", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}
            >
              {filtered.length} Ürünü Gör
            </button>
          </div>
        </>
      )}

      <Footer />

      {showSortMenu && <div style={{ position: "fixed", inset: 0, zIndex: 15 }} onClick={() => setShowSortMenu(false)} />}

      <style>{`
        @media (max-width: 768px) {
          #cat-layout { grid-template-columns: 1fr !important; }
          #cat-layout > aside { display: none !important; }
          .mobile-filter-btn { display: flex !important; }
        }
        @media (max-width: 640px) {
          .cat-product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Category;