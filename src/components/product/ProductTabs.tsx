import { useState } from "react";
import { Star, ThumbsUp, CheckCircle2, Lock, ChevronDown, CreditCard, Banknote, Smartphone, Shield, Gem, Package, Award } from "lucide-react";
import type { Product } from "@/data/products";
import ziraatLogo from "@/assets/banks/ziraat.png";
import isbankLogo from "@/assets/banks/isbank.png";
import garantiLogo from "@/assets/banks/garanti.png";
import yapikrdiLogo from "@/assets/banks/yapikredi.png";
import akbankLogo from "@/assets/banks/akbank.png";
import halkbankLogo from "@/assets/banks/halkbank.png";
import vakifbankLogo from "@/assets/banks/vakifbank.png";
import denizLogo from "@/assets/banks/denizbank.png";
import qnbLogo from "@/assets/banks/qnb.png";

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
  verified: boolean;
}

type TabType = "features" | "reviews" | "payment";

interface Props {
  product: Product;
  reviews: Review[];
  isLoggedIn: boolean;
  user: { name: string } | null;
  onNavigateLogin: () => void;
  onNavigateRegister: () => void;
  onReviewSubmit: (rating: number, comment: string) => void;
  onHelpful: (id: number) => void;
  helpfulClicked: number[];
  defaultTab?: TabType;
}

const ProductTabs = ({
  product, reviews, isLoggedIn, user,
  onNavigateLogin, onNavigateRegister, onReviewSubmit, onHelpful, helpfulClicked,
  defaultTab = "features",
}: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }));

  const tabs: { key: TabType; label: string }[] = [
    { key: "features", label: "Ürün Özellikleri" },
    { key: "reviews", label: `Yorumlar (${reviews.length})` },
    { key: "payment", label: "Ödeme Seçenekleri" },
  ];

  const handleReviewButtonClick = () => {
    if (!isLoggedIn) onNavigateLogin();
    else setShowReviewForm(v => !v);
  };

  const handleStarClick = (star: number) => {
    if (!isLoggedIn) { onNavigateLogin(); return; }
    setReviewForm(f => ({ ...f, rating: star }));
    setShowReviewForm(true);
  };

  const handleSubmit = () => {
    if (!reviewForm.comment.trim()) return;
    onReviewSubmit(reviewForm.rating, reviewForm.comment);
    setReviewForm({ rating: 5, comment: "" });
    setShowReviewForm(false);
  };

  return (
    <section id="product-tabs" className="container mx-auto px-4 pb-16">
      <div className="flex border-b border-border mb-0 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`font-body text-xs tracking-[0.15em] uppercase px-6 py-4 transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === tab.key ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="border border-t-0 border-border p-6 lg:p-10 bg-card">

        {/* Özellikler */}
        {activeTab === "features" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-6">Teknik Özellikler</h3>
              <table className="w-full font-body text-sm">
                <tbody>
                  {(product.specs && product.specs.length > 0
                    ? product.specs
                    : [
                        { label: "Malzeme", value: product.material },
                        { label: "Kategori", value: product.category },
                        { label: "Menşei", value: "Türkiye" },
                      ]
                  ).filter(row => row.value?.trim()).map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-secondary/40" : ""}>
                      <td className="py-2.5 px-4 text-muted-foreground font-medium w-1/2">{row.label}</td>
                      <td className="py-2.5 px-4 text-foreground">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Öne Çıkan Özellikler</h3>
                <ul className="space-y-3">
                  {(product.features && product.features.length > 0 ? product.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 font-body text-sm text-foreground">
                      <Gem className="w-4 h-4 text-accent shrink-0" />{feat}
                    </li>
                  )) : [
                    { icon: <Gem className="w-4 h-4 text-accent" />, text: "El işçiliği ile üretilmiş özel tasarım" },
                    { icon: <Award className="w-4 h-4 text-accent" />, text: "Orijinallik sertifikası ile birlikte teslim" },
                    { icon: <Package className="w-4 h-4 text-accent" />, text: "Özel hediye kutusu dahil" },
                    { icon: <Shield className="w-4 h-4 text-accent" />, text: "Alerjik reaksiyona karşı nikel içermez" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 font-body text-sm text-foreground">{item.icon}{item.text}</li>
                  )))}
                </ul>
              </div>
              <div className="bg-secondary/50 border border-border p-4 rounded-sm">
                <p className="font-body text-xs text-muted-foreground leading-relaxed">
                  <span className="text-foreground font-semibold block mb-1">Bakım Talimatı</span>
                  {product.careNote || "Ürününüzü uzun süre güzel tutmak için kimyasal maddelerden, parfümden ve sudan uzak tutun. Kullanmadığınız zamanlarda kuru ve kapalı bir kutuda saklayın."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Yorumlar */}
        {activeTab === "reviews" && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 pb-10 border-b border-border">
              <div className="text-center">
                <div className="font-heading text-6xl font-bold text-foreground mb-2">{avgRating.toFixed(1)}</div>
                <div className="flex justify-center gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.round(avgRating) ? "fill-accent text-accent" : "text-border"}`} />
                  ))}
                </div>
                <p className="font-body text-xs text-muted-foreground">{reviews.length} değerlendirme</p>
              </div>
              <div className="lg:col-span-2 space-y-2">
                {ratingCounts.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="font-body text-xs text-muted-foreground w-4">{star}</span>
                    <Star className="w-3 h-3 fill-accent text-accent shrink-0" />
                    <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-accent rounded-full transition-all" style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%" }} />
                    </div>
                    <span className="font-body text-xs text-muted-foreground w-4">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading text-lg font-semibold text-foreground">Müşteri Yorumları</h3>
              <button onClick={handleReviewButtonClick}
                className="flex items-center gap-2 font-body text-xs tracking-wider uppercase border border-border px-4 py-2.5 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors">
                {isLoggedIn ? <Star className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                Yorum Yaz
                {isLoggedIn && <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showReviewForm ? "rotate-180" : ""}`} />}
              </button>
            </div>

            {!isLoggedIn && (
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: "linear-gradient(135deg, #fdf8f0, #faf3e8)", border: "1px solid #ead9b8", borderRadius: 6, marginBottom: 28, flexWrap: "wrap" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #f5ead8, #e8d5b0)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Lock size={19} style={{ color: "#c9a96e" }} />
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 700, color: "#111", margin: "0 0 3px" }}>Bu ürünü değerlendirin</p>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#888", margin: 0, lineHeight: 1.5 }}>Yorum yapmak ve puan vermek için giriş yapmanız gerekmektedir.</p>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button onClick={onNavigateLogin} style={{ padding: "8px 16px", background: "#111", color: "#fff", border: "none", borderRadius: 2, cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", transition: "background 0.2s", whiteSpace: "nowrap" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#c9a96e"}
                    onMouseLeave={e => e.currentTarget.style.background = "#111"}>Giriş Yap</button>
                  <button onClick={onNavigateRegister} style={{ padding: "8px 16px", background: "transparent", color: "#111", border: "1.5px solid #ddd", borderRadius: 2, cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", transition: "border-color 0.2s, color 0.2s", whiteSpace: "nowrap" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#c9a96e"; e.currentTarget.style.color = "#c9a96e"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.color = "#111"; }}>Kayıt Ol</button>
                </div>
              </div>
            )}

            {isLoggedIn && showReviewForm && (
              <div className="bg-secondary/40 border border-border p-6 mb-8 rounded-sm">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                  <h4 className="font-heading text-base font-semibold text-foreground">Değerlendirmenizi Paylaşın</h4>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#888" }}><strong>{user?.name}</strong> olarak yorum yapıyorsunuz</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-1.5">Puanınız</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} onClick={() => handleStarClick(star)}>
                          <Star className={`w-6 h-6 transition-colors ${star <= reviewForm.rating ? "fill-accent text-accent" : "text-border hover:text-accent"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-1.5">Yorumunuz</label>
                    <textarea value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} rows={4}
                      className="w-full border border-border bg-background px-4 py-2.5 font-body text-sm focus:outline-none focus:border-accent resize-none"
                      placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..." />
                  </div>
                  <button onClick={handleSubmit}
                    className="font-body text-xs tracking-[0.2em] uppercase bg-primary text-primary-foreground px-6 py-3 hover:bg-accent hover:text-accent-foreground transition-colors">
                    Yorumu Gönder
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.id} className="border-b border-border pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-body text-sm font-semibold text-foreground">{review.name}</span>
                        {review.verified && (
                          <span className="flex items-center gap-1 font-body text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3" /> Doğrulanmış Alışveriş
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-accent text-accent" : "text-border"}`} />
                          ))}
                        </div>
                        <span className="font-body text-xs text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-body text-sm text-foreground/80 leading-relaxed mb-3">{review.comment}</p>
                  <button onClick={() => onHelpful(review.id)}
                    className={`flex items-center gap-1.5 font-body text-xs transition-colors ${helpfulClicked.includes(review.id) ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}>
                    <ThumbsUp className="w-3.5 h-3.5" />
                    Faydalı ({review.helpful})
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ödeme */}
        {activeTab === "payment" && (
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent" />
              <h3 className="font-heading text-xl font-semibold text-foreground">Kredi Kartı ile Taksit Seçenekleri</h3>
            </div>

            {[
              { name: "Ziraat Bankası",  cardName: "Bankkart",    accentColor: "#c8102e", bgColor: "#fff5f5", borderColor: "#fca5a5", installments: [2,3,4,6,9,12], freeUpTo: 6, logo: ziraatLogo },
              { name: "İş Bankası",     cardName: "Maximum Card", accentColor: "#003087", bgColor: "#eff6ff", borderColor: "#93c5fd", installments: [2,3,4,6,9,12], freeUpTo: 6, logo: isbankLogo },
              { name: "Garanti BBVA",   cardName: "Bonus Card",   accentColor: "#00a651", bgColor: "#f0fdf4", borderColor: "#86efac", installments: [2,3,4,6,9,12], freeUpTo: 6, logo: garantiLogo },
              { name: "Yapı Kredi",     cardName: "World Card",   accentColor: "#1a3d8f", bgColor: "#eff6ff", borderColor: "#93c5fd", installments: [2,3,4,6,9,12], freeUpTo: 6, logo: yapikrdiLogo },
              { name: "Akbank",         cardName: "Axess Card",   accentColor: "#e30613", bgColor: "#fff5f5", borderColor: "#fca5a5", installments: [2,3,4,6,9,12], freeUpTo: 6, logo: akbankLogo },
              { name: "Halkbank",       cardName: "Paraf Card",   accentColor: "#003399", bgColor: "#eff6ff", borderColor: "#93c5fd", installments: [2,3,4,6,9,12], freeUpTo: 6, logo: halkbankLogo },
              { name: "Vakıfbank",      cardName: "World Card",   accentColor: "#f7a600", bgColor: "#fffbeb", borderColor: "#fde68a", installments: [2,3,4,6,9,12], freeUpTo: 6, logo: vakifbankLogo },
              { name: "Denizbank",      cardName: "Bonus Card",   accentColor: "#0066b2", bgColor: "#eff6ff", borderColor: "#93c5fd", installments: [2,3,4,6,9,12], freeUpTo: 6, logo: denizLogo },
              { name: "QNB Finansbank", cardName: "CardFinans",   accentColor: "#6d28d9", bgColor: "#faf5ff", borderColor: "#c4b5fd", installments: [2,3,4,6,9,12], freeUpTo: 6, logo: qnbLogo },
            ].map(bank => (
              <div key={bank.name} style={{ border: `1px solid ${bank.borderColor}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ background: bank.bgColor, borderBottom: `1px solid ${bank.borderColor}`, padding: "14px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                  <img src={bank.logo} alt={bank.name} style={{ height: 32, maxWidth: 110, objectFit: "contain" }} />
                  <div style={{ width: 1, height: 32, background: bank.borderColor }} />
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#888", letterSpacing: "0.08em" }}>
                    {bank.cardName} ile <strong style={{ color: bank.accentColor }}>faizsiz {bank.freeUpTo} taksit</strong>
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table style={{ width: "100%", fontFamily: "Montserrat, sans-serif", fontSize: 12, borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#fafafa" }}>
                        <th style={{ textAlign: "left", padding: "10px 20px", fontWeight: 600, color: "#555", borderBottom: "1px solid #f0ede8", fontSize: 11, letterSpacing: "0.05em" }}>TAKSİT</th>
                        <th style={{ textAlign: "right", padding: "10px 20px", fontWeight: 600, color: "#555", borderBottom: "1px solid #f0ede8", fontSize: 11, letterSpacing: "0.05em" }}>TAKSİT TUTARI</th>
                        <th style={{ textAlign: "right", padding: "10px 20px", fontWeight: 600, color: "#555", borderBottom: "1px solid #f0ede8", fontSize: 11, letterSpacing: "0.05em" }}>TOPLAM TUTAR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bank.installments.map((count, i) => {
                        const isFree = count <= bank.freeUpTo;
                        const rate = isFree ? 0 : count <= 9 ? 0.025 : 0.04;
                        const total = product.price * (1 + rate * count);
                        const monthly = total / count;
                        return (
                          <tr key={count} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <td style={{ padding: "11px 20px", borderBottom: "1px solid #f5f2ee", color: "#333" }}>
                              <span style={{ fontWeight: 600 }}>{count} Taksit</span>
                              {isFree && <span style={{ marginLeft: 8, fontSize: 9, fontWeight: 700, color: bank.accentColor, background: bank.bgColor, border: `1px solid ${bank.borderColor}`, padding: "2px 6px", borderRadius: 2, letterSpacing: "0.05em" }}>FAİZSİZ</span>}
                            </td>
                            <td style={{ padding: "11px 20px", textAlign: "right", borderBottom: "1px solid #f5f2ee", color: "#333" }}>₺{monthly.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</td>
                            <td style={{ padding: "11px 20px", textAlign: "right", borderBottom: "1px solid #f5f2ee", fontWeight: 700, color: "#111" }}>₺{total.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            <p className="font-body text-xs text-muted-foreground">* Taksit seçenekleri bankalara ve kart limitine göre farklılık gösterebilir.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-border p-5 rounded-sm">
                <Banknote className="w-6 h-6 text-accent mb-3" />
                <h4 className="font-heading text-base font-semibold text-foreground mb-1.5">Havale / EFT</h4>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">Banka havalesi ile ödeme yapın, <span className="text-accent font-semibold">%5 indirim</span> kazanın. Ödemeniz onaylandıktan sonra kargoya verilir.</p>
              </div>
              <div className="border border-border p-5 rounded-sm">
                <Smartphone className="w-6 h-6 text-accent mb-3" />
                <h4 className="font-heading text-base font-semibold text-foreground mb-1.5">Kapıda Ödeme</h4>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">Nakit veya kredi kartı ile kapıda ödeme seçeneği mevcuttur. +₺15 kapıda ödeme hizmet bedeli uygulanır.</p>
              </div>
              <div className="border border-border p-5 rounded-sm">
                <Shield className="w-6 h-6 text-accent mb-3" />
                <h4 className="font-heading text-base font-semibold text-foreground mb-1.5">3D Secure</h4>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">Tüm kart ödemeleriniz 256-bit SSL şifreleme ve 3D Secure güvencesi ile korunmaktadır.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export { type Review };
export default ProductTabs;