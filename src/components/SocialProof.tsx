import { ShieldCheck, Truck, RotateCcw, HeadphonesIcon } from "lucide-react";
import { Product } from "@/data/products";

interface SocialProofProps {
  product: Product;
}

// Güven rozetleri — gerçek ve dürüst bilgiler
const TRUST_BADGES = [
  {
    icon: <ShieldCheck size={16} style={{ color: "#c9a96e" }} />,
    label: "Güvenli Ödeme",
    sub: "256-bit SSL şifreleme",
  },
  {
    icon: <Truck size={16} style={{ color: "#c9a96e" }} />,
    label: "Hızlı Kargo",
    sub: "400₺ üzeri ücretsiz",
  },
  {
    icon: <RotateCcw size={16} style={{ color: "#c9a96e" }} />,
    label: "Kolay İade",
    sub: "14 gün iade hakkı",
  },
  {
    icon: <HeadphonesIcon size={16} style={{ color: "#c9a96e" }} />,
    label: "Canlı Destek",
    sub: "Hafta içi 09-18",
  },
];

const SocialProof = ({ product: _product }: SocialProofProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

      {/* Güven rozetleri — 2x2 grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {TRUST_BADGES.map((badge) => (
          <div
            key={badge.label}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px",
              background: "#fdf8f2",
              border: "1px solid #f0e8d8",
              borderRadius: 8,
            }}
          >
            <div style={{ flexShrink: 0 }}>{badge.icon}</div>
            <div>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: "#111", margin: 0 }}>
                {badge.label}
              </p>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, color: "#999", margin: 0 }}>
                {badge.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default SocialProof;