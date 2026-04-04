import PageLayout from "@/components/PageLayout";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Check, Lock, CreditCard, Truck, MapPin, ShoppingBag, Wifi, User, UserCheck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { saveOrder } from "@/lib/orderStorage";

type Step = 1 | 2 | 3 | 4;

/* ─── Kart Marka Tespiti ─── */
type CardBrand = "visa" | "mastercard" | "troy" | "amex" | null;

const detectCardBrand = (number: string): CardBrand => {
  const n = number.replace(/\s/g, "");
  // Amex: 34 veya 37 ile başlar
  if (/^3[47]/.test(n)) return "amex";
  // Troy: 9792 ile başlar (Türkiye'ye özgü)
  if (n.startsWith("9792")) return "troy";
  // Mastercard: 51-55 arası veya 2221-2720 arası
  if (/^5[1-5]/.test(n) || /^2(2[2-9][1-9]|[3-6]\d{2}|7[01]\d|720)/.test(n)) return "mastercard";
  // Visa: 4 ile başlar
  if (n.startsWith("4")) return "visa";
  return null;
};

/* ─── Visa Logo SVG ─── */
const VisaLogo = () => (
  <svg width="58" height="18" viewBox="0 0 58 18" fill="none">
    <text x="0" y="16" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="18" fill="white" letterSpacing="-1">VISA</text>
  </svg>
);

/* ─── Mastercard Logo SVG ─── */
const MastercardLogo = () => (
  <svg width="48" height="30" viewBox="0 0 48 30" fill="none">
    <circle cx="16" cy="15" r="14" fill="#EB001B" />
    <circle cx="32" cy="15" r="14" fill="#F79E1B" />
    <path d="M24 4.2a14 14 0 0 1 0 21.6A14 14 0 0 1 24 4.2z" fill="#FF5F00" />
  </svg>
);

/* ─── Troy Logo SVG ─── */
const TroyLogo = () => (
  <svg width="52" height="20" viewBox="0 0 52 20" fill="none">
    <rect width="52" height="20" rx="3" fill="rgba(255,255,255,0.12)"/>
    <text x="6" y="14" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="13" fill="white" letterSpacing="0.5">TROY</text>
    <rect x="40" y="5" width="8" height="10" rx="1" fill="#E30A17" opacity="0.9"/>
    <path d="M44 6.5 L44 13.5 M41.5 10 L46.5 10" stroke="white" strokeWidth="1.5"/>
  </svg>
);

/* ─── Amex Logo SVG ─── */
const AmexLogo = () => (
  <svg width="52" height="28" viewBox="0 0 52 28" fill="none">
    <rect width="52" height="28" rx="4" fill="#2E77BC"/>
    <text x="4" y="19" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="11" fill="white" letterSpacing="-0.2">AMEX</text>
    <path d="M36 8 L44 14 L36 20 Z" fill="rgba(255,255,255,0.25)"/>
    <path d="M40 8 L48 14 L40 20 Z" fill="rgba(255,255,255,0.15)"/>
  </svg>
);

/* ─── 3D Kart Bileşeni ─── */
const CreditCardVisual = ({
  cardNumber,
  cardName,
  expiry,
  cvv,
  flipped,
}: {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
  flipped: boolean;
}) => {
  const brand = detectCardBrand(cardNumber);
  const isAmex = brand === "amex";
  const cardLength = isAmex ? 15 : 16;
  const placeholderChar = "·";
  const displayNumber = (cardNumber.replace(/\s/g, "") + placeholderChar.repeat(cardLength)).slice(0, cardLength);
  // Amex: 4-6-5 grupları, diğerleri: 4-4-4-4
  const groups = isAmex
    ? [displayNumber.slice(0, 4), displayNumber.slice(4, 10), displayNumber.slice(10, 15)]
    : [0, 4, 8, 12].map(i => displayNumber.slice(i, i + 4));


  return (
    <div style={{ perspective: "1200px", width: "100%", maxWidth: 380, margin: "0 auto 32px" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "56%",
          transformStyle: "preserve-3d",
          transition: "transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* KART ÖN YÜZÜ */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: 16,
            background: "linear-gradient(135deg, #111 0%, #2a2a2a 50%, #111 100%)",
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 24px 60px rgba(0,0,0,0.35), 0 8px 20px rgba(0,0,0,0.2)",
            overflow: "hidden",
          }}
        >
          {/* Dekoratif daireler */}
          <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -20, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

          {/* Üst satır: Logo + Chip */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
            {/* Kart markası logosu */}
            <div style={{ display: "flex", alignItems: "center", minWidth: 60, minHeight: 30 }}>
              {brand === "visa"       && <VisaLogo />}
              {brand === "mastercard" && <MastercardLogo />}
              {brand === "troy"       && <TroyLogo />}
              {brand === "amex"       && <AmexLogo />}
              {!brand && (
                <div style={{ width: 48, height: 28, border: "1.5px dashed rgba(255,255,255,0.2)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", fontFamily: "sans-serif" }}>KART</span>
                </div>
              )}
            </div>
            {/* NFC + Chip */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Wifi size={18} style={{ color: "rgba(255,255,255,0.5)", transform: "rotate(90deg)" }} />
              <div style={{
                width: 42, height: 32, borderRadius: 5,
                background: "linear-gradient(135deg, #d4a843, #f0c060, #b8892e)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
              }}>
                <div style={{ width: 28, height: 20, border: "1px solid rgba(0,0,0,0.25)", borderRadius: 3, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", padding: 3 }}>
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} style={{ background: "rgba(0,0,0,0.15)", borderRadius: 1 }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Kart Numarası */}
          <div style={{ display: "flex", gap: 14, position: "relative", zIndex: 1, justifyContent: "center", margin: "8px 0" }}>
            {groups.map((g, i) => (
              <span key={i} style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 20,
                letterSpacing: "0.15em",
                color: g.includes("·") ? "rgba(255,255,255,0.35)" : "#fff",
                fontWeight: 700,
                transition: "color 0.3s",
              }}>
                {g}
              </span>
            ))}
          </div>

          {/* Alt satır: İsim + Tarih */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative", zIndex: 1 }}>
            <div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", letterSpacing: "0.18em", marginBottom: 4, fontFamily: "sans-serif" }}>
                KART SAHİBİ
              </div>
              <div style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 13,
                color: cardName ? "#fff" : "rgba(255,255,255,0.3)",
                letterSpacing: "0.1em",
                fontWeight: 700,
                maxWidth: 180,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {cardName || "AD SOYAD"}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", letterSpacing: "0.18em", marginBottom: 4, fontFamily: "sans-serif" }}>
                SON KULLANMA
              </div>
              <div style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 15,
                color: expiry ? "#fff" : "rgba(255,255,255,0.3)",
                letterSpacing: "0.1em",
                fontWeight: 700,
              }}>
                {expiry || "AA/YY"}
              </div>
            </div>
          </div>
        </div>

        {/* KART ARKA YÜZÜ */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: 16,
            background: "linear-gradient(135deg, #1a1a1a 0%, #111 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
            overflow: "hidden",
          }}
        >
          {/* Manyetik şerit */}
          <div style={{ width: "100%", height: 44, background: "#000", margin: "0 0 20px 0" }} />
          {/* CVV şeridi */}
          <div style={{ padding: "0 24px" }}>
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 4, padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1, height: 20, background: "rgba(255,255,255,0.06)", borderRadius: 2 }} />
              <div style={{
                background: "#fff",
                borderRadius: 3,
                padding: "4px 12px",
                marginLeft: 12,
                fontFamily: "'Courier New', monospace",
                fontSize: 15,
                color: "#111",
                fontWeight: 700,
                letterSpacing: "0.2em",
                minWidth: 48,
                textAlign: "center",
              }}>
                {cvv || "···"}
              </div>
            </div>
            <div style={{ marginTop: 8, textAlign: "right", fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", fontFamily: "sans-serif" }}>
              CVV
            </div>
          </div>
          <div style={{ padding: "16px 24px 0" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", lineHeight: 1.6, fontFamily: "sans-serif" }}>
              Bu kart yalnızca yetkili kullanıcı tarafından kullanılabilir.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Ana Checkout ─── */
const Checkout = () => {
  const { items, totalPrice, clearCart, appliedCoupon, discountAmount, giftWrap } = useCart();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  // checkoutReady: kullanıcı giriş yapmış ya da misafir olarak devam etmeyi seçmişse true
  const [checkoutReady, setCheckoutReady] = useState<boolean>(isLoggedIn);
  // isLoggedIn sonradan true olursa (session restore) checkoutReady'i güncelle
  useEffect(() => { if (isLoggedIn) setCheckoutReady(true); }, [isLoggedIn]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId] = useState(`TKM${Date.now().toString().slice(-7)}`);
  const [cvvFocused, setCvvFocused] = useState(false);

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    addressLine: "",
    district: "",
    city: "",
    zip: "",
    saveAddress: false,
  });

  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");

  const [payment, setPayment] = useState({
    method: "card" as "card" | "transfer",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    saveCard: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const GIFT_WRAP_PRICE = 29.90;

  // Kargo sabitleri — yeni admin panelinden yönetilecek
  const shippingConfig = {
    fee: 49.90,
    expressFee: 89.90,
    threshold: 400,
    deliveryDays: "3–5 iş günü",
    expressDeliveryDays: "1–2 iş günü",
  };

  const SHIPPING_COSTS = {
    standard: totalPrice >= shippingConfig.threshold || appliedCoupon?.type === "shipping" ? 0 : shippingConfig.fee,
    express: appliedCoupon?.type === "shipping" ? 0 : shippingConfig.expressFee,
  };
  const shippingCost = SHIPPING_COSTS[shippingMethod];
  // grandTotal tek noktada hesaplanır — sipariş kaydında da bu değer kullanılır
  const grandTotal = Math.max(0, totalPrice - discountAmount + shippingCost + (giftWrap ? GIFT_WRAP_PRICE : 0));

  const formatCard = (v: string) => {
    const digits = v.replace(/\D/g, "");
    const brand = detectCardBrand(digits);
    if (brand === "amex") {
      // 4-6-5 format (15 hane)
      return digits.slice(0, 15)
        .replace(/^(\d{4})(\d{1,6})?( \d{1,5})?.*/, (_, a, b, c) =>
          [a, b, c].filter(Boolean).join(" ").trim()
        )
        .replace(/^(\d{0,4})$/, "$1")
        .replace(/^(\d{4})(\d{0,6})$/, "$1 $2")
        .replace(/^(\d{4}) (\d{6})(\d{0,5})$/, "$1 $2 $3")
        .trim();
    }
    return digits.slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!address.fullName.trim()) e.fullName = "Ad Soyad zorunludur.";
    if (!address.email) e.email = "E-posta zorunludur.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) e.email = "Geçerli e-posta girin.";
    if (!address.phone) e.phone = "Telefon zorunludur.";
    else if (!/^(0|\+90)?[5][0-9]{9}$/.test(address.phone.replace(/\s/g, "")))
      e.phone = "Geçerli telefon: 05xx xxx xx xx";
    if (!address.addressLine.trim()) e.addressLine = "Adres zorunludur.";
    if (!address.city.trim()) e.city = "Şehir zorunludur.";
    return e;
  };

  const validateStep3 = () => {
    const e: Record<string, string> = {};
    if (payment.method === "card") {
      const isAmexPayment = detectCardBrand(payment.cardNumber) === "amex";
      const expectedLen = isAmexPayment ? 15 : 16;
      if (payment.cardNumber.replace(/\s/g, "").length < expectedLen) e.cardNumber = "Geçerli kart numarası girin.";
      if (!payment.cardName.trim()) e.cardName = "Kart üzerindeki ad zorunludur.";
      if (payment.expiry.length < 5) {
        e.expiry = "Son kullanma tarihi girin.";
      } else {
        const [mm, yy] = payment.expiry.split("/").map(Number);
        const now = new Date();
        if (mm < 1 || mm > 12) e.expiry = "Geçersiz ay.";
        else if (2000 + yy < now.getFullYear() || (2000 + yy === now.getFullYear() && mm < now.getMonth() + 1))
          e.expiry = "Kartın son kullanma tarihi geçmiş.";
      }
      if (payment.cvv.length < (isAmexPayment ? 4 : 3)) e.cvv = "Geçerli CVV girin.";
    }
    return e;
  };

  const handleNext = () => {
    if (step === 1) {
      const e = validateStep1();
      if (Object.keys(e).length > 0) { setErrors(e); return; }
    }
    if (step === 3) {
      const e = validateStep3();
      if (Object.keys(e).length > 0) { setErrors(e); return; }
    }
    setErrors({});
    if (step === 3) {
      // Admin paneline sipariş kaydet
      try {
        const newOrder = {
          id: orderId,
          customer: address.fullName || user?.name || "Misafir",
          email: address.email || user?.email || "",
          phone: address.phone || user?.phone || "",
          address: `${address.addressLine}, ${address.district}/${address.city} ${address.zip}`.trim(),
          city: address.city || "",
          items: items.map(i => ({
            productId: i.product.id,
            name: i.product.name,
            image: i.product.image,
            price: i.product.price,
            quantity: i.quantity,
          })),
          subtotal: totalPrice,
          discount: discountAmount,
          shippingFee: shippingCost,
          couponCode: appliedCoupon?.code || "",
          total: grandTotal,
          status: "beklemede" as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          paymentMethod: payment.method === "card" ? "Kredi Kartı" : payment.method === "transfer" ? "Havale/EFT" : "Kapıda Ödeme",
        };
        // Siparişi localStorage'a kaydet — Account sayfasında gösterilecek
        saveOrder(newOrder);

        // "Bu adresi kaydet" işaretliyse adresi de kaydet
        if (address.saveAddress && isLoggedIn) {
          try {
            const existing: object[] = JSON.parse(localStorage.getItem("tkx_addresses") || "[]");
            const newAddr = {
              id: `addr_${Date.now()}`,
              title: "Teslimat Adresim",
              fullName: address.fullName,
              phone: address.phone,
              city: address.city,
              district: address.district,
              fullAddress: address.addressLine,
              isDefault: existing.length === 0,
            };
            existing.push(newAddr);
            localStorage.setItem("tkx_addresses", JSON.stringify(existing));
          } catch { /* sessizce geç */ }
        }
      } catch {
        // Sipariş kaydı başarısız — kullanıcı akışı devam eder
      }
      setOrderPlaced(true);
      clearCart();
      setStep(4);
    } else {
      setStep((step + 1) as Step);
    }
  };

  const steps = [
    { n: 1, label: "Adres", icon: <MapPin size={13} /> },
    { n: 2, label: "Kargo", icon: <Truck size={13} /> },
    { n: 3, label: "Ödeme", icon: <CreditCard size={13} /> },
    { n: 4, label: "Onay", icon: <Check size={13} /> },
  ];

  /* ─── Ortak input stili ─── */
  const inp = (hasError: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "13px 16px",
    border: `1.5px solid ${hasError ? "#e53e3e" : "#e0e0e0"}`,
    background: "#fff",
    fontFamily: "Montserrat, sans-serif",
    fontSize: 14,
    color: "#111",
    outline: "none",
    boxSizing: "border-box",
    borderRadius: 8,
    transition: "border-color 0.2s, box-shadow 0.2s",
  });

  const lbl: React.CSSProperties = {
    display: "block",
    fontFamily: "Montserrat, sans-serif",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.08em",
    color: "#666",
    marginBottom: 6,
    textTransform: "uppercase",
  };

  /* ── Giriş / Misafir Seçim Ekranı ── */
  if (!checkoutReady && !isLoggedIn) {
    return (
      <PageLayout title="Ödeme">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
          <div style={{ width: "100%", maxWidth: 460 }}>

            {/* Başlık */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#fff", border: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
                <ShoppingBag size={24} style={{ color: "#111" }} />
              </div>
              <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 8px" }}>Siparişi Tamamla</h1>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#999", margin: 0 }}>Devam etmek için bir seçenek belirleyin</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

              {/* Giriş Yap */}
              <Link to="/giris" state={{ from: "/odeme" }} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 16,
                  background: "#111", padding: "18px 22px", borderRadius: 12,
                  cursor: "pointer", transition: "background 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#333")}
                onMouseLeave={e => (e.currentTarget.style.background = "#111")}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <User size={18} color="#fff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", margin: 0 }}>Giriş Yap</p>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "2px 0 0" }}>Mevcut hesabınızla devam edin</p>
                  </div>
                  <ChevronRight size={16} color="rgba(255,255,255,0.35)" />
                </div>
              </Link>

              {/* Üye Ol */}
              <Link to="/kayit" state={{ from: "/odeme" }} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 16,
                  background: "#fff", padding: "18px 22px", borderRadius: 12,
                  border: "1.5px solid #e8e8e8", cursor: "pointer", transition: "border-color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#c9a96e")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#e8e8e8")}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fdf8f0", border: "1px solid #e8d5b0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <UserCheck size={18} color="#c9a96e" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, color: "#111", margin: 0 }}>Üye Ol</p>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#999", margin: "2px 0 0" }}>Yeni hesap oluşturarak devam edin</p>
                  </div>
                  <ChevronRight size={16} color="#ccc" />
                </div>
              </Link>

              {/* Ayırıcı */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
                <div style={{ flex: 1, height: 1, background: "#e8e8e8" }} />
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase" }}>veya</span>
                <div style={{ flex: 1, height: 1, background: "#e8e8e8" }} />
              </div>

              {/* Misafir Olarak Devam Et */}
              <button
                onClick={() => setCheckoutReady(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 16,
                  background: "#fff", padding: "18px 22px", borderRadius: 12,
                  border: "1.5px dashed #d0d0d0", cursor: "pointer", width: "100%",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.background = "#fafafa"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#d0d0d0"; e.currentTarget.style.background = "#fff"; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f5f5f5", border: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ShoppingBag size={18} color="#888" />
                </div>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, color: "#111", margin: 0 }}>Misafir Olarak Devam Et</p>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#999", margin: "2px 0 0" }}>Kayıt olmadan hızlıca satın alın</p>
                </div>
                <ChevronRight size={16} color="#ccc" />
              </button>
            </div>

            {/* Güvenlik notu */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 24 }}>
              <Lock size={11} color="#bbb" />
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#bbb" }}>256-bit SSL şifreleme ile güvenli ödeme</span>
            </div>

          </div>
        </div>
      </PageLayout>
    );
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <PageLayout title="Ödeme">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20, padding: "40px 0" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShoppingBag size={36} style={{ color: "#ccc" }} />
          </div>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 20, color: "#111", fontWeight: 600 }}>Sepetiniz boş</p>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, color: "#888" }}>Ödeme yapabilmek için sepete ürün eklemeniz gerekiyor.</p>
          <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff", background: "#111", padding: "14px 32px", textDecoration: "none", borderRadius: 8 }}>
            Alışverişe Başla
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <div className="page-wrapper header-offset" style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", flexDirection: "column", paddingTop: 96 }}>
      <AnnouncementBar />
      <Header />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');

        .checkout-input:focus {
          border-color: #111 !important;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.07) !important;
        }
        .checkout-input::placeholder { color: #bbb; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.35s ease forwards; }

        @keyframes successPulse {
          0%   { transform: scale(0.8); opacity: 0; }
          60%  { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }
        .success-icon { animation: successPulse 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        @media (max-width: 900px) {
          #checkout-grid { grid-template-columns: 1fr !important; }
          #addr-form-grid { grid-template-columns: 1fr !important; }
          #step-label-1, #step-label-2, #step-label-3, #step-label-4 { display: none !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 20px 72px", width: "100%", boxSizing: "border-box" }}>

        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#aaa", marginBottom: 32 }}>
          <Link to="/" style={{ color: "#aaa", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#111")}
            onMouseLeave={e => (e.currentTarget.style.color = "#aaa")}>Anasayfa</Link>
          <ChevronRight size={12} />
          <span style={{ color: "#111", fontWeight: 500 }}>Güvenli Ödeme</span>
        </nav>

        {/* Step Bar */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 40, background: "#fff", borderRadius: 12, padding: "16px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: step > s.n ? "#111" : step === s.n ? "#111" : "#f0f0f0",
                  color: step >= s.n ? "#fff" : "#999",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700,
                  transition: "all 0.35s",
                  boxShadow: step === s.n ? "0 4px 12px rgba(0,0,0,0.25)" : "none",
                }}>
                  {step > s.n ? <Check size={14} /> : s.icon}
                </div>
                <span
                  id={`step-label-${s.n}`}
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 12,
                    fontWeight: step === s.n ? 700 : 400,
                    color: step === s.n ? "#111" : step > s.n ? "#555" : "#bbb",
                    transition: "color 0.3s",
                  }}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: 1.5, background: step > s.n ? "#111" : "#e8e8e8", margin: "0 16px", transition: "background 0.4s", borderRadius: 2 }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }} id="checkout-grid">

          {/* Sol: Form */}
          <div className="fade-up" key={step} style={{ background: "#fff", borderRadius: 14, padding: "32px 36px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

            {/* ADIM 1: Adres */}
            {step === 1 && (
              <>
                <div style={{ marginBottom: 28 }}>
                  <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 20, fontWeight: 700, color: "#111", margin: 0 }}>Teslimat Adresi</h2>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#888", marginTop: 4 }}>Siparişinizin gönderileceği adres bilgilerini girin</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} id="addr-form-grid">
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={lbl}>Ad Soyad *</label>
                    <input className="checkout-input" value={address.fullName} autoComplete="name" inputMode="text"
                      onChange={e => { setAddress({ ...address, fullName: e.target.value }); setErrors({ ...errors, fullName: "" }); }}
                      style={inp(!!errors.fullName)} placeholder="Adınız Soyadınız" />
                    {errors.fullName && <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#e53e3e", marginTop: 5 }}>⚠ {errors.fullName}</p>}
                  </div>
                  <div>
                    <label style={lbl}>E-posta *</label>
                    <input className="checkout-input" type="email" value={address.email} autoComplete="email" inputMode="email"
                      onChange={e => { setAddress({ ...address, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
                      style={inp(!!errors.email)} placeholder="ornek@email.com" />
                    {errors.email && <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#e53e3e", marginTop: 5 }}>⚠ {errors.email}</p>}
                  </div>
                  <div>
                    <label style={lbl}>Telefon *</label>
                    <input className="checkout-input" type="tel" value={address.phone} autoComplete="tel" inputMode="tel"
                      onChange={e => { setAddress({ ...address, phone: e.target.value }); setErrors({ ...errors, phone: "" }); }}
                      style={inp(!!errors.phone)} placeholder="05xx xxx xx xx" />
                    {errors.phone && <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#e53e3e", marginTop: 5 }}>⚠ {errors.phone}</p>}
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={lbl}>Açık Adres *</label>
                    <input className="checkout-input" value={address.addressLine} autoComplete="street-address" inputMode="text"
                      onChange={e => { setAddress({ ...address, addressLine: e.target.value }); setErrors({ ...errors, addressLine: "" }); }}
                      style={inp(!!errors.addressLine)} placeholder="Mahalle, Cadde, Sokak, No, Daire" />
                    {errors.addressLine && <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#e53e3e", marginTop: 5 }}>⚠ {errors.addressLine}</p>}
                  </div>
                  <div>
                    <label style={lbl}>İlçe</label>
                    <input className="checkout-input" value={address.district} autoComplete="address-level3" inputMode="text"
                      onChange={e => setAddress({ ...address, district: e.target.value })}
                      style={inp(false)} placeholder="İlçe" />
                  </div>
                  <div>
                    <label style={lbl}>Şehir *</label>
                    <input className="checkout-input" value={address.city} autoComplete="address-level2" inputMode="text"
                      onChange={e => { setAddress({ ...address, city: e.target.value }); setErrors({ ...errors, city: "" }); }}
                      style={inp(!!errors.city)} placeholder="İstanbul" />
                    {errors.city && <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#e53e3e", marginTop: 5 }}>⚠ {errors.city}</p>}
                  </div>
                  <div>
                    <label style={lbl}>Posta Kodu</label>
                    <input className="checkout-input" value={address.zip} autoComplete="postal-code" inputMode="numeric"
                      onChange={e => setAddress({ ...address, zip: e.target.value })}
                      style={inp(false)} placeholder="34000" />
                  </div>
                </div>

                {isLoggedIn && (
                  <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20, cursor: "pointer" }}>
                    <div
                      onClick={() => setAddress({ ...address, saveAddress: !address.saveAddress })}
                      style={{
                        width: 18, height: 18,
                        border: `2px solid ${address.saveAddress ? "#111" : "#ccc"}`,
                        borderRadius: 4,
                        background: address.saveAddress ? "#111" : "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s", cursor: "pointer", flexShrink: 0,
                      }}>
                      {address.saveAddress && <Check size={11} style={{ color: "#fff" }} />}
                    </div>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#555" }}>Bu adresi hesabıma kaydet</span>
                  </label>
                )}
              </>
            )}

            {/* ADIM 2: Kargo */}
            {step === 2 && (
              <>
                <div style={{ marginBottom: 28 }}>
                  <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 20, fontWeight: 700, color: "#111", margin: 0 }}>Kargo Seçimi</h2>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#888", marginTop: 4 }}>Size en uygun teslimat seçeneğini belirleyin</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { key: "standard", title: "Standart Teslimat", desc: `${shippingConfig.deliveryDays} içinde teslim`, price: SHIPPING_COSTS.standard, tag: totalPrice >= shippingConfig.threshold ? "ÜCRETSİZ" : null },
                    { key: "express", title: "Hızlı Teslimat", desc: `${shippingConfig.expressDeliveryDays} içinde teslim`, price: SHIPPING_COSTS.express, tag: "HIZLI" },
                  ].map(opt => (
                    <label
                      key={opt.key}
                      onClick={() => setShippingMethod(opt.key as "standard" | "express")}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "18px 22px",
                        border: `2px solid ${shippingMethod === opt.key ? "#111" : "#e8e8e8"}`,
                        cursor: "pointer",
                        background: shippingMethod === opt.key ? "#f8f8f8" : "#fff",
                        transition: "all 0.2s",
                        borderRadius: 10,
                      }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: "50%",
                          border: `2px solid ${shippingMethod === opt.key ? "#111" : "#ccc"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.2s",
                        }}>
                          {shippingMethod === opt.key && (
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#111" }} />
                          )}
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600, color: "#111" }}>{opt.title}</span>
                            {opt.tag && (
                              <span style={{
                                fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
                                padding: "2px 8px", borderRadius: 20,
                                background: opt.tag === "ÜCRETSİZ" ? "#111" : "#f0f0f0",
                                color: opt.tag === "ÜCRETSİZ" ? "#fff" : "#555",
                              }}>
                                {opt.tag}
                              </span>
                            )}
                          </div>
                          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#999", marginTop: 2 }}>{opt.desc}</p>
                        </div>
                      </div>
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16, fontWeight: 700, color: opt.price === 0 ? "#111" : "#111" }}>
                        {opt.price === 0 ? "Ücretsiz" : `₺${opt.price.toFixed(2)}`}
                      </span>
                    </label>
                  ))}
                </div>

                <div style={{ marginTop: 20, padding: 16, background: "#f8f8f8", borderRadius: 10, border: "1px solid #ececec" }}>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#666", lineHeight: 1.7, margin: 0 }}>
                    📦 Hafta içi <strong style={{ color: "#111" }}>13:00'a kadar</strong> verilen siparişler aynı gün kargoya teslim edilir.<br />
                    📲 Kargo takip numarası SMS ve e-posta ile iletilir.
                  </p>
                </div>
              </>
            )}

            {/* ADIM 3: Ödeme */}
            {step === 3 && (
              <>
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 20, fontWeight: 700, color: "#111", margin: 0 }}>Ödeme Bilgileri</h2>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#888", marginTop: 4 }}>Kart bilgileriniz 256-bit SSL ile şifrelenmektedir</p>
                </div>

                {/* Yöntem seçimi */}
                <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
                  {[
                    { key: "card", label: "Kredi / Banka Kartı" },
                    { key: "transfer", label: "Havale / EFT" },
                  ].map(m => (
                    <button key={m.key} onClick={() => setPayment({ ...payment, method: m.key as "card" | "transfer" })}
                      style={{
                        flex: 1, padding: "12px", border: `2px solid ${payment.method === m.key ? "#111" : "#e0e0e0"}`,
                        background: payment.method === m.key ? "#111" : "#fff",
                        cursor: "pointer",
                        fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600,
                        color: payment.method === m.key ? "#fff" : "#555",
                        transition: "all 0.2s", borderRadius: 8,
                      }}>
                      {m.label}
                    </button>
                  ))}
                </div>

                {payment.method === "card" && (
                  <>
                    {/* 3D KART ANİMASYONU */}
                    <CreditCardVisual
                      cardNumber={payment.cardNumber}
                      cardName={payment.cardName}
                      expiry={payment.expiry}
                      cvv={payment.cvv}
                      flipped={cvvFocused}
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label style={lbl}>Kart Numarası *</label>
                        <input className="checkout-input" value={payment.cardNumber}
                          onChange={e => { setPayment({ ...payment, cardNumber: formatCard(e.target.value) }); setErrors({ ...errors, cardNumber: "" }); }}
                          style={{ ...inp(!!errors.cardNumber), letterSpacing: "0.12em", fontFamily: "'Courier New', monospace", fontSize: 16 }}
                          placeholder="0000 0000 0000 0000" maxLength={19}
                          inputMode="numeric" autoComplete="cc-number" />
                        {errors.cardNumber && <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#e53e3e", marginTop: 5 }}>⚠ {errors.cardNumber}</p>}
                      </div>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label style={lbl}>Kart Sahibinin Adı *</label>
                        <input className="checkout-input" value={payment.cardName}
                          onChange={e => { setPayment({ ...payment, cardName: e.target.value.toUpperCase() }); setErrors({ ...errors, cardName: "" }); }}
                          style={{ ...inp(!!errors.cardName), letterSpacing: "0.06em" }}
                          placeholder="AD SOYAD"
                          inputMode="text" autoComplete="cc-name" />
                        {errors.cardName && <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#e53e3e", marginTop: 5 }}>⚠ {errors.cardName}</p>}
                      </div>
                      <div>
                        <label style={lbl}>Son Kullanma Tarihi *</label>
                        <input className="checkout-input" value={payment.expiry}
                          onChange={e => { setPayment({ ...payment, expiry: formatExpiry(e.target.value) }); setErrors({ ...errors, expiry: "" }); }}
                          style={inp(!!errors.expiry)}
                          placeholder="AA / YY" maxLength={5}
                          inputMode="numeric" autoComplete="cc-exp" />
                        {errors.expiry && <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#e53e3e", marginTop: 5 }}>⚠ {errors.expiry}</p>}
                      </div>
                      <div>
                        <label style={lbl}>CVV / CVC *</label>
                        <input className="checkout-input" value={payment.cvv}
                          type="password"
                          onChange={e => { const maxCvv = detectCardBrand(payment.cardNumber) === "amex" ? 4 : 3; setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, "").slice(0, maxCvv) }); setErrors({ ...errors, cvv: "" }); }}
                          onFocus={() => setCvvFocused(true)}
                          onBlur={() => setCvvFocused(false)}
                          style={inp(!!errors.cvv)}
                          placeholder="•••" maxLength={4}
                          inputMode="numeric" autoComplete="cc-csc" />
                        {errors.cvv && <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#e53e3e", marginTop: 5 }}>⚠ {errors.cvv}</p>}
                      </div>
                    </div>

                    {/* SSL güvence */}
                    <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#f8f8f8", borderRadius: 8, border: "1px solid #ebebeb" }}>
                      <Lock size={14} style={{ color: "#111", flexShrink: 0 }} />
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#555" }}>
                        Ödeme bilgileriniz <strong style={{ color: "#111" }}>256-bit SSL</strong> şifrelemesiyle güvence altındadır.
                      </span>
                    </div>
                  </>
                )}

                {payment.method === "transfer" && (
                  <div style={{ padding: 24, background: "#f8f8f8", borderRadius: 10, border: "1px solid #ebebeb" }}>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 16 }}>Banka Hesap Bilgileri</p>
                    {[
                      { label: "Banka", value: "Takimax Örnek Bankası" },
                      { label: "IBAN", value: "TR00 0000 0000 0000 0000 0000 00" },
                      { label: "Hesap Adı", value: "Takimax Takı Tic. Ltd. Şti." },
                      { label: "Açıklama", value: `Sipariş #${orderId}` },
                    ].map(r => (
                      <div key={r.label} style={{ display: "flex", gap: 14, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #e8e8e8" }}>
                        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#999", minWidth: 90, fontWeight: 500 }}>{r.label}</span>
                        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#111", fontWeight: 600 }}>{r.value}</span>
                      </div>
                    ))}
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#e53e3e", marginTop: 8, fontWeight: 500 }}>
                      ⚠ Açıklamaya sipariş numarasını mutlaka yazın.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* ADIM 4: Onay */}
            {step === 4 && (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div className="success-icon" style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "#111",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 24px",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
                }}>
                  <Check size={36} style={{ color: "#fff" }} />
                </div>
                <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 26, fontWeight: 700, color: "#111", marginBottom: 10 }}>
                  Siparişiniz Alındı!
                </h2>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, color: "#777", marginBottom: 8, lineHeight: 1.7 }}>
                  <strong style={{ color: "#111" }}>#{orderId}</strong> numaralı siparişiniz başarıyla oluşturuldu.
                </p>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#aaa", marginBottom: 36 }}>
                  Onay e-postası <strong style={{ color: "#555" }}>{address.email}</strong> adresine gönderildi.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 300, margin: "0 auto" }}>
                  <Link to="/siparis-takibi" style={{
                    padding: "14px", background: "#111", color: "#fff",
                    textDecoration: "none", fontFamily: "Montserrat, sans-serif",
                    fontSize: 13, fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", borderRadius: 8, textAlign: "center",
                    transition: "opacity 0.2s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                    Siparişimi Takip Et
                  </Link>
                  <Link to="/" style={{
                    padding: "13px", background: "#fff", color: "#555",
                    border: "1.5px solid #e0e0e0",
                    textDecoration: "none", fontFamily: "Montserrat, sans-serif",
                    fontSize: 13, fontWeight: 600, letterSpacing: "0.08em",
                    textTransform: "uppercase", borderRadius: 8, textAlign: "center",
                  }}>
                    Alışverişe Devam Et
                  </Link>
                </div>
              </div>
            )}

            {/* Navigasyon */}
            {step < 4 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32, paddingTop: 24, borderTop: "1.5px solid #f0f0f0" }}>
                {step > 1 ? (
                  <button onClick={() => setStep((step - 1) as Step)} style={{
                    display: "flex", alignItems: "center", gap: 6, background: "none",
                    border: "1.5px solid #e0e0e0", cursor: "pointer", padding: "11px 22px",
                    fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, color: "#555",
                    transition: "all 0.2s", borderRadius: 8,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.color = "#111"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.color = "#555"; }}>
                    <ChevronLeft size={14} /> Geri
                  </button>
                ) : <div />}

                <button onClick={handleNext} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "13px 32px", background: "#111", color: "#fff",
                  border: "none", cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  transition: "opacity 0.2s", borderRadius: 8,
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                  {step === 3 ? (
                    <><Lock size={13} /> Siparişi Onayla</>
                  ) : (
                    <>Devam Et <ChevronRight size={14} /></>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Sağ: Sipariş Özeti */}
          {step < 4 && (
            <div style={{ background: "#fff", borderRadius: 14, padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", position: "sticky", top: 100 }}>
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 20, paddingBottom: 16, borderBottom: "1.5px solid #f0f0f0" }}>
                Sipariş Özeti
              </h3>

              <div style={{ maxHeight: 260, overflowY: "auto", marginBottom: 16 }}>
                {items.map(item => (
                  <div key={item.product.id} style={{ display: "flex", gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid #f5f5f5" }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <img loading="lazy" src={item.product.image} alt={item.product.name}
                        style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, border: "1px solid #ebebeb" }} />
                      <span style={{
                        position: "absolute", top: -6, right: -6,
                        width: 18, height: 18, borderRadius: "50%",
                        background: "#111", color: "#fff",
                        fontSize: 10, fontFamily: "Montserrat, sans-serif", fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {item.quantity}
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#333", fontWeight: 500, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.product.name}
                      </p>
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#aaa", marginTop: 2 }}>{item.product.material}</p>
                    </div>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, color: "#111", flexShrink: 0 }}>
                      ₺{(item.product.price * item.quantity).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1.5px solid #f0f0f0", paddingTop: 16 }}>
                {[
                  { label: "Ara Toplam", value: `₺${totalPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`, special: false },
                  ...(discountAmount > 0 ? [{ label: `İndirim (${appliedCoupon?.label})`, value: `-₺${discountAmount.toFixed(2)}`, special: true }] : []),
                  { label: "Kargo", value: shippingCost === 0 ? "Ücretsiz" : `₺${shippingCost.toFixed(2)}`, special: shippingCost === 0 },
                  ...(giftWrap ? [{ label: "Hediye Paketi", value: `+₺${GIFT_WRAP_PRICE.toFixed(2)}`, special: false }] : []),
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#999" }}>{r.label}</span>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: r.special ? "#22c55e" : "#333", fontWeight: r.special ? 600 : 400 }}>{r.value}</span>
                  </div>
                ))}

                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 14, marginTop: 4, borderTop: "1.5px solid #f0f0f0" }}>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700, color: "#111" }}>Toplam</span>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 22, fontWeight: 800, color: "#111" }}>
                    ₺{grandTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Güvence rozetleri */}
              <div style={{ marginTop: 20, padding: "14px 16px", background: "#f8f8f8", borderRadius: 10 }}>
                {[
                  { icon: "🔒", text: "256-bit SSL Şifrelemesi" },
                  { icon: "↩️", text: "14 Gün İade Garantisi" },
                  { icon: "🚚", text: `${shippingConfig.threshold}₺ üzeri ücretsiz kargo` },
                ].map(b => (
                  <div key={b.text} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 13 }}>{b.icon}</span>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#666" }}>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;