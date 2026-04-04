import SEO from "@/components/SEO";
import { useState } from "react";
import PageLayout from "@/components/PageLayout";

const mesafeli = [
  {
    title: "Taraflar",
    content: `SATICI:
Unvan: Takımax Aksesuar ve Mücevherat Ticaret A.Ş.
Adres: İstanbul, Türkiye
E-posta: destek@takimax.com
Web: www.takimax.com

ALICI:
Sipariş esnasında sisteme kayıtlı isim, adres ve iletişim bilgilerine sahip kişi.`,
  },
  {
    title: "Sözleşmenin Konusu",
    content: `İşbu sözleşme, ALICI'nın SATICI'ya ait www.takimax.com web sitesi üzerinden elektronik ortamda sipariş verdiği aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerini kapsamaktadır.`,
  },
  {
    title: "Teslimat & Kargo",
    content: `• Ürün, sipariş onayından sonra 1-3 iş günü içinde kargoya verilir.
• Teslimat, ALICI'nın belirttiği adrese yapılır.
• Kargo süresi, kargoya verildikten itibaren 1-2 iş günüdür.
• 250 TL ve üzeri alışverişlerde kargo ücretsizdir.
• Hasarlı veya eksik teslimat durumunda ALICI, kargo firması ile birlikte Takımax müşteri hizmetlerine başvurmalıdır.`,
  },
  {
    title: "Ödeme Koşulları",
    content: `• Ödeme, sipariş anında kredi/banka kartı veya havale/EFT ile yapılır.
• Kart bilgileri Takımax sunucularında saklanmaz; PCI-DSS uyumlu altyapı kullanılır.
• Taksitli ödemelerde ilgili banka taksit koşulları geçerlidir.
• Fatura, sipariş tamamlandıktan sonra kayıtlı e-posta adresine gönderilir.`,
  },
  {
    title: "Cayma Hakkı",
    content: `ALICI, teslim tarihinden itibaren 14 (on dört) gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin cayma hakkını kullanabilir.

Cayma hakkının kullanılması için:
1. destek@takimax.com adresine cayma bildirimi yapılması
2. Ürünün 10 gün içinde SATICI'ya gönderilmesi gerekmektedir.

Cayma hakkı; kişiye özel üretilen, ses veya görüntü kayıtlarının açıldığı, dijital içeriklerin teslim edildiği durumlarda kullanılamaz.`,
  },
  {
    title: "Uyuşmazlık Çözümü",
    content: `İşbu sözleşmeden doğan uyuşmazlıklarda Türk hukuku uygulanır. Tüketici olarak başvurabileceğiniz resmi kanallar:

• Tüketici Hakem Heyetleri (belirlenen parasal sınırlar dahilinde)
• Tüketici Mahkemeleri (belirlenen parasal sınırların üzerinde)
• Ticaret Bakanlığı Tüketici Bilgi Sistemi (TÜBİS): tuketici.gov.tr`,
  },
];

const uyelik = [
  {
    title: "Üyelik Koşulları",
    content: `• Üye olabilmek için 18 yaşını doldurmuş olmak gerekmektedir.
• Üyelik kaydı sırasında verilen bilgilerin doğru ve güncel olması zorunludur.
• Her kullanıcı yalnızca bir hesap oluşturabilir.
• Üyelik ücretsizdir.`,
  },
  {
    title: "Üyenin Yükümlülükleri",
    content: `• Hesap bilgilerinizin (kullanıcı adı, şifre) güvenliğinden siz sorumlusunuz.
• Hesabınız üzerinden gerçekleşen tüm işlemlerden siz sorumlu tutulursunuz.
• Başkalarına ait kişisel bilgileri kullanmak, yanıltıcı veya sahte hesap oluşturmak yasaktır.
• Platform üzerinde spam, kötü amaçlı yazılım yaymak veya sisteme zarar verici faaliyetlerde bulunmak kesinlikle yasaktır.`,
  },
  {
    title: "Hesap Güvenliği",
    content: `• Şifrenizi düzenli aralıklarla değiştirmenizi öneririz.
• Şifrenizi kimseyle paylaşmamalısınız.
• Hesabınızda yetkisiz erişim tespit ederseniz derhal destek@takimax.com adresine bildirin.
• Takımax, sizi asla şifrenizi e-posta veya telefon ile paylaşmanız için aramaz.`,
  },
  {
    title: "Üyeliğin Sona Ermesi",
    content: `Üyeliğinizi istediğiniz zaman "Hesabım" sayfasından veya destek@takimax.com adresine başvurarak sonlandırabilirsiniz.

Takımax, aşağıdaki durumlarda üyeliği askıya alabilir veya sonlandırabilir:
• Yanlış veya yanıltıcı bilgi verilmesi
• Platform kurallarının ihlal edilmesi
• Uzun süreli inaktif hesaplar (önceden bildirim yapılarak)`,
  },
  {
    title: "Kişisel Veri Güvencesi",
    content: `Üyelik sürecinde toplanan kişisel verileriniz, Gizlilik Politikamız ve KVKK kapsamında işlenmektedir. Verilerinizi pazarlama amaçlı üçüncü taraflara satmıyor ya da kiralamıyoruz. Detaylı bilgi için Gizlilik Politikamızı inceleyebilirsiniz.`,
  },
];

const Agreements = () => {
  const [active, setActive] = useState<"mesafeli" | "uyelik">("mesafeli");
  const data = active === "mesafeli" ? mesafeli : uyelik;

  return (
    <>
    <SEO
      title="Mesafeli Satış Sözleşmesi – Takimax"
      description="Takimax kullanım koşulları, mesafeli satış sözleşmesi ve üyelik şartları. Alışveriş yapmadan önce sözleşme detaylarını inceleyin."
      canonical="/sozlesmeler"
    />
    <PageLayout title="Sözleşmeler">
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(24px,3vw,36px)", fontWeight: 700, color: "#111", marginBottom: 32 }}>Sözleşmeler</h1>

        {/* Tab */}
        <div style={{ display: "flex", borderBottom: "2px solid #eee", marginBottom: 40 }}>
          {[
            { id: "mesafeli", label: "Mesafeli Satış Sözleşmesi" },
            { id: "uyelik", label: "Üyelik Sözleşmesi" },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActive(tab.id as "mesafeli" | "uyelik")}
              style={{
                padding: "14px 28px", background: "none", border: "none", cursor: "pointer",
                fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: active === tab.id ? "#111" : "#aaa",
                borderBottom: active === tab.id ? "2px solid #c9a96e" : "2px solid transparent",
                marginBottom: -2, transition: "color 0.2s",
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ background: "#fff", border: "1px solid #eee", padding: "10px 20px", marginBottom: 40, borderLeft: "3px solid #c9a96e" }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#666", lineHeight: 1.8 }}>
            Son güncelleme: <strong>Ocak 2025</strong> — Takımax Aksesuar ve Mücevherat Ticaret A.Ş.
          </p>
        </div>

        {data.map((s, i) => (
          <div key={s.title} style={{ marginBottom: 44, paddingBottom: 44, borderBottom: i < data.length - 1 ? "1px solid #f0ede8" : "none" }}>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 22, fontWeight: 600, color: "#111", marginBottom: 16, display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#c9a96e", fontWeight: 700 }}>{String(i + 1).padStart(2, "0")}</span>
              {s.title}
            </h2>
            {s.content.split("\n").map((line, j) => (
              <p key={j} style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: line.startsWith("•") ? "#555" : "#666", lineHeight: 1.9, marginBottom: line.startsWith("•") ? 4 : 8, paddingLeft: line.startsWith("•") ? 8 : 0 }}>
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