import SEO from "@/components/SEO";
import PageLayout from "@/components/PageLayout";

const Returns = () => {
  // Sabit değerler — yeni admin panelinden yönetilecek
  const returnDays      = 14;
  const deliveryDays    = "2-4 iş günü";
  const shippingFee     = 49.90;
  const freeLimit       = 400;
  const shippingCompany = "Yurtiçi Kargo";
  const email           = "demo@takimax.com";
  const phone           = "+90 (212) 000 00 00";

  const sections = [
    {
      title: "İade Koşulları",
      content: [
        `Takimax'tan satın aldığınız ürünleri, teslimat tarihinden itibaren ${returnDays} gün içinde iade edebilirsiniz.`,
        "• Ürün kullanılmamış, yıpratılmamış ve temiz olmalıdır.",
        "• Orijinal ambalajı, etiketi ve varsa sertifikası eksiksiz olmalıdır.",
        "• Ürünle birlikte gelen tüm aksesuar ve hediyeler de iade paketine dahil edilmelidir.",
        "• Fatura veya sipariş belgesi iade paketiyle birlikte gönderilmelidir.",
      ],
    },
    {
      title: "Değişim Koşulları",
      content: [
        `Yanlış beden, renk veya kusurlu ürün teslim aldıysanız ücretsiz değişim hakkınız bulunmaktadır. Değişim talebinizi ${returnDays} gün içinde iletmeniz yeterlidir.`,
        "• Stok durumuna göre aynı ürünün farklı çeşidiyle değişim yapılabilir.",
        "• Stokta bulunmayan durumlarda iade ve yeni sipariş seçeneği sunulur.",
        "• Değişim kargo ücreti Takimax tarafından karşılanır.",
      ],
    },
    {
      title: "Kargo Bilgileri",
      content: [
        `Siparişleriniz ${shippingCompany} ile gönderilmektedir. Tahmini teslimat süresi ${deliveryDays}.`,
        `• ${freeLimit}₺ ve üzeri siparişlerde kargo ücretsizdir.`,
        `• ${freeLimit}₺ altı siparişlerde kargo ücreti ${shippingFee.toFixed(2)}₺'dir.`,
        "• Kargo takip numarası, siparişiniz kargoya verildikten sonra e-posta ile iletilir.",
      ],
    },
    {
      title: "İade Süreci",
      content: [
        "İade talebinizi başlatmak için şu adımları izleyin:",
        `1. ${email} adresine veya iletişim sayfamızdaki form üzerinden iade talebinizi iletin.`,
        "2. Sipariş numaranızı ve iade nedeninizi belirtin.",
        "3. Müşteri hizmetlerimiz size 1 iş günü içinde iade kargo etiketi gönderecektir.",
        "4. Ürünü orijinal ambalajında, etiketi sökmeden kargo görevlisine teslim edin.",
        "5. Ürün bize ulaştıktan sonra kalite kontrolü yapılır (1–2 iş günü).",
        "6. Onaylanan iadeler için para iadesi 5–7 iş günü içinde orijinal ödeme yönteminize aktarılır.",
      ],
    },
    {
      title: "İade Edilemeyen Ürünler",
      content: [
        "Aşağıdaki durumlarda iade talebi kabul edilmemektedir:",
        "• Kişiye özel üretilmiş, üzerine isim, harf veya tarih yazılmış ürünler",
        "• Kullanılmış, kirlenmiş veya hasar görmüş ürünler",
        "• Orijinal ambalajı açılmış ve etiketi sökülmüş ürünler",
        `• Teslimat tarihinden ${returnDays} gün sonra iletilen talepler`,
        "• Kampanya ve indirim dönemlerinde \"İade Edilemez\" olarak işaretlenmiş ürünler",
      ],
    },
    {
      title: "Para İadesi",
      content: [
        "İade onaylandıktan sonra ödeme iadeniz şu şekilde gerçekleşir:",
        "• Kredi kartı ile ödemelerde: İade tutarı 5–7 iş günü içinde kartınıza yansır.",
        "• Havale/EFT ile ödemelerde: İade, belirttiğiniz IBAN'a 3–5 iş günü içinde aktarılır.",
        "• Kargo ücreti iade tutarından düşülmez; ürün kusurundan kaynaklanan iadelerde kargo ücreti de iade edilir.",
      ],
    },
  ];

  const infoCards = [
    { icon: "↩", title: `${returnDays} Gün`, desc: "İade süresi" },
    { icon: "✦",  title: "Ücretsiz",         desc: "Kusurlu ürün değişimi" },
    { icon: "◎",  title: deliveryDays,        desc: "Teslimat süresi" },
  ];

  return (
    <>
      <SEO
        title="İade ve Değişim Koşulları – Takimax"
        description={`Takimax iade ve değişim politikası. ${returnDays} gün içinde kolay iade, ücretsiz değişim ve hızlı para iadesi.`}
        canonical="/iade-ve-degisim"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "İade ve Değişim Koşulları – Takimax",
          "description": `Takimax ${returnDays} günlük iade politikası, değişim koşulları ve kargo bilgileri.`,
          "url": "https://takimax.com/iade-ve-degisim",
        }}
      />

      <PageLayout title="İade ve Değişim Koşulları">
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(24px,3vw,36px)", fontWeight: 700, color: "#111", marginBottom: 32 }}>İade ve Değişim Koşulları</h1>

          {/* Üst bilgi kartları */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 1,
            marginBottom: 48,
            border: "1px solid #eee",
            borderRadius: 4,
            overflow: "hidden",
          }}>
            {infoCards.map((item, i) => (
              <div key={item.title} style={{
                padding: "28px 24px",
                background: i === 1 ? "#111" : "#fff",
                textAlign: "center",
                borderRight: i < infoCards.length - 1 ? "1px solid #eee" : "none",
              }}>
                <p style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 28,
                  color: "#c9a96e",
                  margin: "0 0 8px",
                }}>
                  {item.icon}
                </p>
                <p style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 20,
                  fontWeight: 600,
                  color: i === 1 ? "#fff" : "#111",
                  margin: "0 0 4px",
                }}>
                  {item.title}
                </p>
                <p style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 11,
                  color: i === 1 ? "rgba(255,255,255,0.6)" : "#888",
                  margin: 0,
                  letterSpacing: "0.04em",
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* İletişim notu */}
          <div style={{
            background: "#fff",
            border: "1px solid #eee",
            borderLeft: "3px solid #c9a96e",
            padding: "12px 20px",
            marginBottom: 40,
            borderRadius: "0 4px 4px 0",
          }}>
            <p style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 12,
              color: "#666",
              lineHeight: 1.8,
              margin: 0,
            }}>
              Sorularınız için{" "}
              <a href={`mailto:${email}`} style={{ color: "#c9a96e", textDecoration: "none" }}>
                {email}
              </a>{" "}
              adresine yazabilir ya da{" "}
              <strong style={{ color: "#333" }}>{phone}</strong>{" "}
              numaralı hattı arayabilirsiniz.
            </p>
          </div>

          {/* Bölümler */}
          {sections.map((section, i) => (
            <div
              key={section.title}
              style={{
                marginBottom: 44,
                paddingBottom: 44,
                borderBottom: i < sections.length - 1 ? "1px solid #f0ede8" : "none",
              }}
            >
              <h2 style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 22,
                fontWeight: 600,
                color: "#111",
                marginBottom: 16,
                marginTop: 0,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}>
                <span style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 11,
                  color: "#c9a96e",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  flexShrink: 0,
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {section.title}
              </h2>

              {section.content.map((line, j) => {
                const isBullet  = line.startsWith("•");
                const isNumeric = /^\d+\./.test(line);
                return (
                  <p
                    key={j}
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: 13,
                      color: isBullet || isNumeric ? "#555" : "#666",
                      lineHeight: 1.9,
                      margin: `0 0 ${isBullet ? 4 : 8}px`,
                      paddingLeft: isBullet || isNumeric ? 8 : 0,
                    }}
                  >
                    {line}
                  </p>
                );
              })}
            </div>
          ))}

          {/* Alt CTA */}
          <div style={{
            background: "linear-gradient(135deg, #fdf8f0 0%, #f5ead8 100%)",
            border: "1px solid #ead9b8",
            borderRadius: 8,
            padding: "28px 32px",
            textAlign: "center",
            marginTop: 16,
          }}>
            <p style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 18,
              fontWeight: 600,
              color: "#111",
              margin: "0 0 8px",
            }}>
              Hâlâ sorunuz mu var?
            </p>
            <p style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 12,
              color: "#888",
              margin: "0 0 20px",
              lineHeight: 1.7,
            }}>
              Müşteri hizmetlerimiz hafta içi 09:00–18:00 arasında hizmetinizdedir.
            </p>
            <a
              href="/iletisim"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 28px",
                background: "#111",
                color: "#fff",
                textDecoration: "none",
                fontFamily: "Montserrat, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                borderRadius: 2,
                transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#c9a96e")}
              onMouseLeave={e => (e.currentTarget.style.background = "#111")}
            >
              Bize Ulaşın
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

        </div>
      </PageLayout>
    </>
  );
};

export default Returns;