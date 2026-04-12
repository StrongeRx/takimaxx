import SEO from "@/components/SEO";
import PageLayout from "@/components/PageLayout";

const sections = [
  {
    title: "İade Koşulları",
    content: [
      "Ürünleri teslim tarihinden itibaren 14 gün içinde iade edebilirsiniz.",
      "Ürün kullanılmamış, yıpratılmamış ve temiz olmalıdır.",
      "Orijinal ambalajı, etiketi ve varsa sertifikası eksiksiz olmalıdır.",
      "Fatura veya sipariş belgesi iade paketiyle birlikte gönderilmelidir.",
    ],
  },
  {
    title: "Değişim Koşulları",
    content: [
      "Yanlış beden, renk veya kusurlu ürün teslim aldıysanız ücretsiz değişim hakkınız vardır.",
      "Değişim talebinizi 14 gün içinde iletmeniz yeterlidir.",
      "Stok durumuna göre aynı ürünün farklı çeşidiyle değişim yapılabilir.",
      "Stokta bulunmayan durumlarda iade ve yeni sipariş seçeneği sunulur.",
    ],
  },
  {
    title: "İade Süreci",
    content: [
      "1. demo@takimax.com adresine sipariş numaranız ve iade nedeninizle başvurun.",
      "2. Müşteri hizmetlerimiz 1 iş günü içinde iade kargo etiketi gönderir.",
      "3. Ürünü orijinal ambalajında kargo görevlisine teslim edin.",
      "4. Ürün ulaştıktan sonra 1–2 iş günü içinde kalite kontrolü yapılır.",
      "5. Onaylanan iadeler 5–7 iş günü içinde orijinal ödeme yönteminize iade edilir.",
    ],
  },
  {
    title: "Kargo Bilgileri",
    content: [
      "Siparişleriniz Yurtiçi Kargo ile gönderilmektedir. Tahmini teslimat 2–4 iş günüdür.",
      "400 TL ve üzeri siparişlerde kargo ücretsizdir.",
      "400 TL altı siparişlerde kargo ücreti 49,90 TL'dir.",
      "Kargo takip numarası, kargoya verildikten sonra e-posta ile iletilir.",
    ],
  },
  {
    title: "İade Edilemeyen Ürünler",
    content: [
      "Kişiye özel üretilmiş, üzerine isim veya tarih yazılmış ürünler",
      "Kullanılmış, kirlenmiş veya hasar görmüş ürünler",
      "Orijinal ambalajı açılmış ve etiketi sökülmüş ürünler",
      "Teslimattan 14 gün sonra iletilen talepler",
    ],
  },
  {
    title: "Para İadesi",
    content: [
      "Kredi kartı ile ödemelerde iade 5–7 iş günü içinde kartınıza yansır.",
      "Havale/EFT ile ödemelerde iade 3–5 iş günü içinde belirtilen IBAN'a aktarılır.",
      "Ürün kusurundan kaynaklanan iadelerde kargo ücreti de iade edilir.",
    ],
  },
];

const Returns = () => (
  <>
    <SEO
      title="İade ve Değişim Koşulları – Takimax"
      description="14 gün içinde kolay iade, ücretsiz değişim ve hızlı para iadesi."
      canonical="/iade-ve-degisim"
    />
    <PageLayout title="İade ve Değişim Koşulları">
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 4px" }}>

        {/* Meta */}
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#bbb", marginBottom: 32 }}>
          Son güncelleme: Ocak 2025 — Sorularınız için: demo@takimax.com
        </p>

        {/* Sections */}
        {sections.map((section, i) => (
          <div
            key={section.title}
            style={{
              marginBottom: 32,
              paddingBottom: 32,
              borderBottom: i < sections.length - 1 ? "1px solid #f0f0f0" : "none",
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

export default Returns;