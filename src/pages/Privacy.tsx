import SEO from "@/components/SEO";
import PageLayout from "@/components/PageLayout";
import { useState } from "react";

const kvkkSections = [
  {
    title: "Veri Sorumlusu",
    content: [
      "Takımax Aksesuar ve Mücevherat Ticaret A.Ş. — İstanbul, Türkiye",
      "E-posta: kvkk@takimax.com",
      "6698 sayılı KVKK kapsamında veri sorumlusu sıfatıyla kişisel verilerinizi işlemekteyiz.",
    ],
  },
  {
    title: "Toplanan Kişisel Veriler",
    content: [
      "Kimlik bilgileri: Ad, soyad",
      "İletişim bilgileri: E-posta, telefon numarası, teslimat adresi",
      "Finansal bilgiler: Fatura adresi (kart numarası gibi hassas veriler saklanmaz)",
      "İşlem bilgileri: Sipariş geçmişi, iade talepleri",
      "Teknik veriler: IP adresi, tarayıcı türü, çerez verileri",
    ],
  },
  {
    title: "İşlenme Amacı",
    content: [
      "Sipariş ve teslimat süreçlerinin yönetimi",
      "Fatura düzenlenmesi ve yasal yükümlülüklerin yerine getirilmesi",
      "Müşteri hizmetleri sağlanması",
      "İzninizle e-bülten ve kampanya bildirimleri gönderilmesi",
    ],
  },
  {
    title: "Verilerin Aktarımı",
    content: [
      "Kişisel verileriniz yalnızca hizmetin yürütülmesi amacıyla kargo firmaları, ödeme altyapı sağlayıcıları ve yasal zorunluluk halinde kamu kurumlarıyla paylaşılabilir.",
      "Verileriniz reklam amacıyla hiçbir üçüncü tarafa satılmaz veya devredilmez.",
    ],
  },
  {
    title: "Haklarınız (KVKK Md. 11)",
    content: [
      "Verilerinizin işlenip işlenmediğini öğrenme",
      "İşlenen verilerinize ilişkin bilgi talep etme",
      "Eksik veya yanlış verilerin düzeltilmesini isteme",
      "Koşulların oluşması halinde verilerin silinmesini talep etme",
    ],
  },
  {
    title: "Başvuru",
    content: [
      "KVKK kapsamındaki taleplerinizi kvkk@takimax.com adresine iletebilirsiniz.",
      "Başvurularınız kimlik doğrulamasının ardından en geç 30 gün içinde yanıtlanır.",
    ],
  },
];

const gizlilikSections = [
  {
    title: "Genel Bakış",
    content: [
      "Bu Gizlilik Politikası, Takımax Aksesuar ve Mücevherat Ticaret A.Ş. tarafından hazırlanmıştır.",
      "Sitemizi kullandığınızda bu politikayı kabul etmiş sayılırsınız.",
    ],
  },
  {
    title: "Çerez Politikası",
    content: [
      "Zorunlu çerezler: Sitenin düzgün çalışması için gereklidir.",
      "Tercih çerezleri: Dil ve bölge gibi tercihlerinizi hatırlar.",
      "Analitik çerezler: Site kullanımını anlamamıza yardımcı olur.",
      "Pazarlama çerezleri: İlgi alanlarınıza uygun içerik sunar.",
      "Tarayıcı ayarlarınızdan çerezleri yönetebilir veya silebilirsiniz.",
    ],
  },
  {
    title: "Veri Güvenliği",
    content: [
      "Verileriniz SSL şifreleme ile korunur.",
      "Kart bilgileri sistemimizde saklanmaz; PCI-DSS uyumlu altyapı kullanılır.",
      "Sistemlerimize yetkisiz erişimi önlemek için düzenli güvenlik denetimleri yapılır.",
    ],
  },
  {
    title: "Üçüncü Taraf Bağlantılar",
    content: [
      "Sitemizde üçüncü taraf web sitelerine bağlantılar bulunabilir.",
      "Bu sitelerin gizlilik politikalarından sorumlu değiliz.",
    ],
  },
  {
    title: "Politika Değişiklikleri",
    content: [
      "Bu politikayı güncelleme hakkımızı saklı tutarız.",
      "Önemli değişiklikler sitede ve/veya e-posta yoluyla duyurulur.",
    ],
  },
  {
    title: "İletişim",
    content: [
      "Gizlilik politikasına ilişkin sorularınız için: kvkk@takimax.com",
    ],
  },
];

type Tab = "kvkk" | "gizlilik";

const tabs: { id: Tab; label: string }[] = [
  { id: "kvkk", label: "Kişisel Verilerin Korunması" },
  { id: "gizlilik", label: "Gizlilik Politikası" },
];

const Privacy = () => {
  const [active, setActive] = useState<Tab>("kvkk");
  const data = active === "kvkk" ? kvkkSections : gizlilikSections;

  return (
    <>
      <SEO
        title="Gizlilik & KVKK – Takimax"
        description="Kişisel verilerin korunması ve gizlilik politikası."
        canonical="/gizlilik-politikasi"
      />
      <PageLayout title="Gizlilik & KVKK">
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 4px" }}>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #e8e8e8", marginBottom: 32, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                style={{
                  padding: "12px 20px",
                  background: "none",
                  border: "none",
                  borderBottom: active === tab.id ? "2px solid #111" : "2px solid transparent",
                  cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 12,
                  fontWeight: active === tab.id ? 700 : 400,
                  color: active === tab.id ? "#111" : "#999",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                  marginBottom: -1,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Meta */}
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#bbb", marginBottom: 32 }}>
            Son güncelleme: Ocak 2025 — 6698 sayılı KVKK kapsamında hazırlanmıştır.
          </p>

          {/* Sections */}
          {data.map((section, i) => (
            <div
              key={section.title}
              style={{
                marginBottom: 32,
                paddingBottom: 32,
                borderBottom: i < data.length - 1 ? "1px solid #f0f0f0" : "none",
              }}
            >
              <h2 style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: "#111",
                marginBottom: 12,
                marginTop: 0,
                letterSpacing: "0.02em",
              }}>
                {section.title}
              </h2>
              {section.content.map((line, j) => (
                <p key={j} style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 13,
                  color: "#555",
                  lineHeight: 1.8,
                  margin: "0 0 8px 0",
                }}>
                  {line}
                </p>
              ))}
            </div>
          ))}

        </div>
      </PageLayout>
    </>
  );
};

export default Privacy;