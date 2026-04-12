import SEO from "@/components/SEO";
import PageLayout from "@/components/PageLayout";
import { useState } from "react";

const mesafeli = [
  {
    title: "Taraflar",
    content: [
      "SATICI: Takımax Aksesuar ve Mücevherat Ticaret A.Ş. — İstanbul, Türkiye — demo@takimax.com",
      "ALICI: Sipariş sırasında sisteme kayıtlı ad, adres ve iletişim bilgilerine sahip kişi.",
    ],
  },
  {
    title: "Sözleşmenin Konusu",
    content: [
      "Bu sözleşme; ALICI'nın www.takimax.com üzerinden verdiği siparişe konu ürünün satışı ve teslimatına ilişkin tarafların hak ve yükümlülüklerini, 6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği çerçevesinde düzenler.",
    ],
  },
  {
    title: "Teslimat & Kargo",
    content: [
      "Sipariş onayından itibaren 1–3 iş günü içinde kargoya verilir.",
      "Kargoya verildikten sonra tahmini teslimat süresi 1–2 iş günüdür.",
      "250 TL ve üzeri siparişlerde kargo ücretsizdir.",
      "Hasarlı veya eksik teslimat durumunda müşteri hizmetlerimizle iletişime geçiniz.",
    ],
  },
  {
    title: "Ödeme Koşulları",
    content: [
      "Ödeme, sipariş anında kredi/banka kartı veya havale/EFT ile alınır.",
      "Kart bilgileri sistemimizde saklanmaz; PCI-DSS uyumlu altyapı kullanılır.",
      "Fatura, sipariş tamamlandıktan sonra kayıtlı e-postanıza iletilir.",
    ],
  },
  {
    title: "Cayma Hakkı",
    content: [
      "Teslim tarihinden itibaren 14 gün içinde gerekçesiz cayma hakkınızı kullanabilirsiniz.",
      "Cayma için demo@takimax.com adresine bildirim yapılması ve ürünün 10 gün içinde iade edilmesi gerekir.",
      "Kişiye özel üretilen ürünlerde cayma hakkı kullanılamaz.",
    ],
  },
  {
    title: "Uyuşmazlık Çözümü",
    content: [
      "Anlaşmazlıklarda Türk hukuku uygulanır.",
      "Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri başvurabileceğiniz resmi kanallardır.",
      "Ticaret Bakanlığı Tüketici Bilgi Sistemi: tuketici.gov.tr",
    ],
  },
];

const uyelik = [
  {
    title: "Üyelik Koşulları",
    content: [
      "Üye olabilmek için 18 yaşını doldurmuş olmak gerekir.",
      "Kayıt sırasında verilen bilgilerin doğru ve güncel olması zorunludur.",
      "Her kullanıcı yalnızca bir hesap oluşturabilir. Üyelik ücretsizdir.",
    ],
  },
  {
    title: "Üyenin Yükümlülükleri",
    content: [
      "Hesap bilgilerinizin güvenliğinden siz sorumlusunuz.",
      "Başkalarına ait bilgileri kullanmak veya sahte hesap oluşturmak yasaktır.",
      "Platform üzerinde zararlı, yanıltıcı veya spam içerik paylaşmak yasaktır.",
    ],
  },
  {
    title: "Hesap Güvenliği",
    content: [
      "Şifrenizi düzenli olarak değiştirmenizi ve kimseyle paylaşmamanızı öneririz.",
      "Yetkisiz erişim tespit ederseniz derhal demo@takimax.com adresine bildirin.",
      "Takımax, sizi şifrenizi paylaşmanız için hiçbir zaman aramaz veya e-posta göndermez.",
    ],
  },
  {
    title: "Üyeliğin Sona Ermesi",
    content: [
      "Üyeliğinizi \"Hesabım\" sayfasından veya demo@takimax.com adresine başvurarak istediğiniz zaman sonlandırabilirsiniz.",
      "Yanlış bilgi verilmesi veya platform kurallarının ihlali durumunda Takımax üyeliği askıya alabilir.",
    ],
  },
  {
    title: "Kişisel Veri Güvencesi",
    content: [
      "Üyelik sürecinde toplanan verileriniz KVKK ve Gizlilik Politikamız kapsamında işlenir.",
      "Verileriniz pazarlama amacıyla üçüncü taraflara satılmaz veya kiralanmaz.",
    ],
  },
];

type Tab = "mesafeli" | "uyelik";

const tabs: { id: Tab; label: string }[] = [
  { id: "mesafeli", label: "Mesafeli Satış Sözleşmesi" },
  { id: "uyelik", label: "Üyelik Sözleşmesi" },
];

const Agreements = () => {
  const [active, setActive] = useState<Tab>("mesafeli");
  const data = active === "mesafeli" ? mesafeli : uyelik;

  return (
    <>
      <SEO
        title="Sözleşmeler – Takimax"
        description="Mesafeli satış sözleşmesi ve üyelik koşulları."
        canonical="/sozlesmeler"
      />
      <PageLayout title="Sözleşmeler">
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
            Son güncelleme: Ocak 2025
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

export default Agreements;