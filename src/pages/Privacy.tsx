import SEO from "@/components/SEO";
import PageLayout from "@/components/PageLayout";

const sections = [
  {
    title: "Veri Sorumlusu",
    content: `Bu Gizlilik Politikası, Takımax Aksesuar ve Mücevherat Ticaret A.Ş. ("Takımax", "biz" veya "şirket") tarafından hazırlanmıştır.

Şirket Unvanı: Takımax Aksesuar ve Mücevherat Ticaret A.Ş.
Adres: İstanbul, Türkiye
E-posta: kvkk@takimax.com
Web: www.takimax.com

6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla, kişisel verilerinizi aşağıda açıklanan amaç ve yöntemlerle işlemekteyiz.`,
  },
  {
    title: "Toplanan Kişisel Veriler",
    content: `Hizmetlerimizi kullanmanız sırasında aşağıdaki kişisel verileriniz toplanabilir:

• Kimlik Bilgileri: Ad, soyad
• İletişim Bilgileri: E-posta adresi, telefon numarası, teslimat adresi
• Finansal Bilgiler: Fatura adresi (kart numarası gibi hassas veriler tarafımızca saklanmaz)
• İşlem Bilgileri: Sipariş geçmişi, iade talepleri, ürün incelemeleri
• Teknik Veriler: IP adresi, tarayıcı türü, cihaz bilgisi, çerez verileri
• Pazarlama Tercihleri: E-bülten aboneliği, iletişim izinleri`,
  },
  {
    title: "Kişisel Verilerin İşlenme Amacı",
    content: `Toplanan kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:

• Sipariş ve teslimat süreçlerinin yönetimi
• Fatura düzenlenmesi ve yasal yükümlülüklerin yerine getirilmesi
• Müşteri hizmetleri ve destek sağlanması
• Hesap oluşturma ve yönetimi
• E-bülten ve kampanya bildirimleri (açık rızanız ile)
• Web sitesi performansının analizi ve iyileştirilmesi
• Dolandırıcılık ve güvenlik tehditlerinin önlenmesi`,
  },
  {
    title: "Verilerin Aktarımı",
    content: `Kişisel verileriniz, yalnızca hizmetin sunulabilmesi amacıyla ve gerekli güvenlik önlemleri alınarak aşağıdaki taraflarla paylaşılabilir:

• Kargo ve lojistik firmaları (teslimat işlemleri için)
• Ödeme altyapı sağlayıcıları (ödeme güvenliği için)
• E-posta servisleri (sipariş bildirimleri için)
• Yasal zorunluluk halinde ilgili kamu kurum ve kuruluşları

Verileriniz hiçbir koşulda reklam amaçlı üçüncü taraflara satılmaz veya devredilmez.`,
  },
  {
    title: "Çerez Politikası",
    content: `Web sitemiz, kullanıcı deneyimini iyileştirmek amacıyla çerez kullanmaktadır:

• Zorunlu Çerezler: Sitenin düzgün çalışması için gereklidir; kapatılamaz.
• Tercih Çerezleri: Dil, bölge gibi tercihlerinizi hatırlar.
• Analitik Çerezler: Site kullanımını anlamamıza yardımcı olur (Google Analytics).
• Pazarlama Çerezleri: İlgi alanlarınıza uygun içerik sunmak için kullanılır.

Tarayıcı ayarlarınızdan çerezleri yönetebilir veya silebilirsiniz.`,
  },
  {
    title: "Veri Sahibinin Hakları",
    content: `KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:

• Kişisel verilerinizin işlenip işlenmediğini öğrenme
• İşlenen verilere ilişkin bilgi talep etme
• Verilerin işlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme
• Verilerin aktarıldığı yurt içi/dışı üçüncü kişileri öğrenme
• Eksik veya yanlış verilerin düzeltilmesini talep etme
• KVKK 7. madde çerçevesinde verilerin silinmesini talep etme
• İşlemenin yasal dayanağı sona erdiğinde itiraz etme hakkı`,
  },
  {
    title: "İletişim & Başvuru",
    content: `KVKK kapsamındaki taleplerinizi aşağıdaki kanallar üzerinden iletebilirsiniz:

• E-posta: kvkk@takimax.com
• Yazılı Başvuru: Takımax Aksesuar ve Mücevherat Ticaret A.Ş., İstanbul, Türkiye
• İletişim Formu: takimax.com/iletisim

Başvurularınız, kimliğinizi doğruladıktan sonra en geç 30 gün içinde yanıtlanacaktır.`,
  },
];

const Privacy = () => (
  <>
  <SEO
    title="Gizlilik Politikası & KVKK – Takimax"
    description="Takimax kişisel veri işleme politikası, KVKK kapsamında haklarınız ve çerez kullanımı hakkında bilgi edinin."
    canonical="/gizlilik-politikasi"
  />
  <PageLayout title="Gizlilik Politikası & KVKK">
    <div style={{ maxWidth: 780, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(24px,3vw,36px)", fontWeight: 700, color: "#111", marginBottom: 24 }}>Gizlilik Politikası & KVKK</h1>
      <div style={{ background: "#fff", border: "1px solid #eee", padding: "10px 20px", marginBottom: 40, borderLeft: "3px solid #c9a96e" }}>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#666", lineHeight: 1.8 }}>
          Son güncelleme: <strong>Ocak 2025</strong> — 6698 sayılı KVKK kapsamında hazırlanmıştır.
        </p>
      </div>

      {sections.map((s, i) => (
        <div key={s.title} style={{ marginBottom: 44, paddingBottom: 44, borderBottom: i < sections.length - 1 ? "1px solid #f0ede8" : "none" }}>
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

export default Privacy;