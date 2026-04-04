import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;  // son eleman için href olmaz (aktif sayfa)
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Arka plan rengi — varsayılan şeffaf */
  background?: string;
  /** Üst/alt padding */
  py?: number;
}

/**
 * Yeniden kullanılabilir Breadcrumb bileşeni.
 * - Schema.org BreadcrumbList JSON-LD üretir (SEO)
 * - İlk eleman daima Anasayfa (ikonlu)
 * - Son eleman tıklanamaz (aktif sayfa)
 * - Mobilde uzun etiketler kısaltılmaz; yatay scroll yoktur,
 *   bunun yerine metin overflow: hidden ile kırpılır.
 */
const Breadcrumb = ({ items, background = "transparent", py = 12 }: BreadcrumbProps) => {
  const allItems: BreadcrumbItem[] = [
    { label: "Anasayfa", href: "/" },
    ...items,
  ];

  /* Schema.org JSON-LD */
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `https://takimax.com${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <nav
        aria-label="Sayfa konumu"
        style={{
          background,
          padding: `${py}px 0`,
        }}
      >
        <ol
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 0,
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {allItems.map((item, i) => {
            const isFirst  = i === 0;
            const isLast   = i === allItems.length - 1;

            return (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  minWidth: 0,
                  maxWidth: isLast ? "none" : 160,
                }}
              >
                {/* Ayırıcı (ilk eleman hariç) */}
                {!isFirst && (
                  <ChevronRight
                    size={12}
                    style={{ color: "#d1cdc7", flexShrink: 0, margin: "0 4px" }}
                    aria-hidden
                  />
                )}

                {/* Eleman */}
                {item.href && !isLast ? (
                  <Link
                    to={item.href}
                    aria-label={item.label}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: 11,
                      color: "#999",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#c9a96e")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#999")}
                  >
                    {isFirst && (
                      <Home size={11} style={{ flexShrink: 0 }} aria-hidden />
                    )}
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current="page"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#333",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumb;