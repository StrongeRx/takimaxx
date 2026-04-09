import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";

const faqs = [
  {
    category: "Sipariş & Kargo",
    items: [
      { q: "Kargo süresi ne kadar?", a: "Siparişleriniz onaylandıktan sonra 1-3 iş günü içinde kargoya verilmektedir. Standart teslimat süresi kargoya verildikten itibaren 1-2 iş günüdür. Toplam tahmini teslimat süresi 2-4 iş günüdür." },
      { q: "Ücretsiz kargo var mı?", a: "250 TL ve üzeri alışverişlerde kargo tamamen ücretsizdir. Bu tutarın altındaki siparişlerde sabit bir kargo ücreti uygulanmaktadır." },
      { q: "Siparişimi nasıl takip edebilirim?", a: "Siparişiniz kargoya verildikten sonra kayıtlı e-posta adresinize takip kodu gönderilmektedir. Bu kod ile kargo firmasının web sitesi veya uygulaması üzerinden siparişinizi anlık olarak takip edebilirsiniz." },
      { q: "Aynı gün kargo mümkün mü?", a: "Hafta içi saat 14:00'a kadar verilen siparişler aynı gün kargoya verilmektedir. Bu saatin dışında verilen siparişler en geç ertesi iş günü kargoya teslim edilir." },
      { q: "Yurt dışına gönderim yapıyor musunuz?", a: "Şu an için yalnızca Türkiye içi teslimat yapılmaktadır. Yurt dışı gönderim seçeneği yakında hizmete girecektir." },
    ],
  },
  {
    category: "Ürün & Kalite",
    items: [
      { q: "Ürünler gerçek 925 ayar gümüş mü?", a: "Evet. Gümüş etiketiyle sunduğumuz tüm ürünler %92.5 saf gümüş içeren, uluslararası standartlardaki 925 ayar gümüştür. Her ürün kalite kontrolünden geçirilmekte ve gerekli sertifikasyonlara sahip olmaktadır." },
      { q: "Ürünler alerjik reaksiyon yapar mı?", a: "925 ayar gümüş, nikel içermediğinden hassas ciltler için güvenlidir. Yine de nadiren görülen hassasiyetler için ürün açıklamalarındaki malzeme bilgisini incelemenizi öneririz." },
      { q: "Takıları nasıl temizlemeliyim?", a: "Gümüş takılarınızı yumuşak bir bez ile hafifçe silerek temizleyebilirsiniz. Kimyasal maddelerden, parfüm ve losyondan uzak tutmanız ürünün ömrünü uzatır. Kullanmadığınızda kuru ve serin bir yerde saklamanızı öneririz." },
      { q: "Stokta olmayan ürünleri sipariş edebilir miyim?", a: "Stok dışı ürünler için ön talep bırakabilirsiniz. Ürün tekrar stoka girdiğinde kayıtlı e-posta adresinize bildirim gönderilir." },
    ],
  },
  {
    category: "Ödeme",
    items: [
      { q: "Hangi ödeme yöntemlerini kabul ediyorsunuz?", a: "Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Visa, Mastercard ve Troy logolu tüm kartlar kabul edilmektedir." },
      { q: "Taksit imkânı var mı?", a: "Anlaşmalı bankalar aracılığıyla 3'e kadar taksit imkânı sunulmaktadır. Taksit seçeneklerini ödeme sayfasında kart bilgilerinizi girdikten sonra görebilirsiniz." },
      { q: "Ödeme bilgilerim güvende mi?", a: "Tüm ödeme işlemleri SSL şifreleme ile korunmaktadır. Kart bilgileriniz Takımax sunucularında saklanmaz; ödemeler PCI-DSS sertifikalı altyapı üzerinden gerçekleştirilir." },
    ],
  },
  {
    category: "İade & Değişim",
    items: [
      { q: "İade için kaç günüm var?", a: "Teslimat tarihinden itibaren 14 gün içinde iade talebinde bulunabilirsiniz. Ürünün kullanılmamış, orijinal ambalajında ve etiketleri sökülmemiş olması gerekmektedir." },
      { q: "İade için ne yapmalıyım?", a: "İade talebinizi demo@takimax.com adresine veya iletişim formu üzerinden iletebilirsiniz. Size iade kargo etiketi ve talimatları gönderilecektir. Onaylanan iadeler 5-7 iş günü içinde orijinal ödeme yönteminize iade edilir." },
      { q: "Hangi ürünler iade edilemez?", a: "Kişiselleştirilmiş (isim/harf yazılı) ürünler, hijyenik açıdan uygunsuz hale gelen ürünler ve kampanya kapsamındaki özel ürünler iade alınmamaktadır." },
    ],
  },
];

const FAQ = () => {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
    <SEO
      title="Sıkça Sorulan Sorular – Takimax"
      description="Takimax hakkında merak ettiğiniz her şey: kargo süreleri, iade koşulları, ödeme yöntemleri, ürün garantisi ve daha fazlası."
      canonical="/sikca-sorulan-sorular"
      schema={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.flatMap(cat => cat.items).map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      }}
    />
    <PageLayout title="Sıkça Sorulan Sorular">
      <div style={{ maxWidth: 780, margin: "0 auto" }}>

        {/* Kısa açıklama — başlık tekrar etmeden */}
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#777", lineHeight: 1.8, marginBottom: 48 }}>
          En çok merak edilen konuları derledik. Cevabını bulamadığınız sorular için{" "}
          <a href="/iletisim" style={{ color: "#c9a96e", textDecoration: "underline" }}>bize ulaşabilirsiniz.</a>
        </p>

        {faqs.map((section) => (
          <div key={section.category} style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 24, fontWeight: 600, color: "#111", margin: 0 }}>{section.category}</h2>
              <div style={{ flex: 1, height: 1, background: "#eee" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {section.items.map((item) => {
                const key = `${section.category}-${item.q}`;
                const isOpen = open === key;
                return (
                  <div key={key} style={{ border: "1px solid #eee", background: "#fff", transition: "border-color 0.2s" }}>
                    <button onClick={() => setOpen(isOpen ? null : key)}
                      style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 16 }}>
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, color: isOpen ? "#c9a96e" : "#111", transition: "color 0.2s" }}>{item.q}</span>
                      <span style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.3s cubic-bezier(.4,0,.2,1)", color: "#c9a96e", fontSize: 22, fontWeight: 300, flexShrink: 0, lineHeight: 1 }}>+</span>
                    </button>
                    <div style={{ maxHeight: isOpen ? 300 : 0, overflow: "hidden", transition: "max-height 0.4s ease" }}>
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#666", lineHeight: 1.85, padding: "0 22px 20px", borderTop: "1px solid #f5f2ee" }}>
                        {item.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}



      </div>
    </PageLayout>
    </>
  );
};

export default FAQ;