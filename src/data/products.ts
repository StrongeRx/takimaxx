export interface Product {
  id: string;
  name: string;
  image: string;
  images?: string[];
  price: number;
  oldPrice?: number;
  discount?: number;
  reviews: number;
  description: string;
  material: string;
  category: string;
  categorySlug: string;
  stock: number;
  // Ürün detay sayfası özellik alanları
  specs?: { label: string; value: string }[];       // Teknik özellik tablosu
  features?: string[];                               // Öne çıkan özellikler listesi
  careNote?: string;                                 // Bakım talimatı
  active?: boolean;
  featured?: boolean;
  tags?: string[];
  barcode?: string;
  // SEO alanları
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export const products: Product[] = [

  // ─── KADIN AKSESUAR ───────────────────────────────────────────────────────

  {
    id: "kadin-kolye",
    name: "Kadın Kolye",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop&crop=center",
    ],
    price: 899.90, oldPrice: 1059.90, discount: 15, reviews: 142,
    description: "Zarif ve şık kadın kolye koleksiyonumuzu keşfedin.",
    material: "925 Ayar Gümüş", category: "Kolye", categorySlug: "kadin-aksesuar/kolye", stock: 50,
  },
  {
    id: "kadin-kupe",
    name: "Kadın Küpe",
    image: "https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=600&h=600&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&h=600&fit=crop&crop=center",
    ],
    price: 324.90, oldPrice: 384.90, discount: 16, reviews: 255,
    description: "Her tarza uygun kadın küpe çeşitleri.",
    material: "Paslanmaz Çelik", category: "Küpe", categorySlug: "kadin-aksesuar/kupe", stock: 80,
  },
  {
    id: "kadin-bileklik",
    name: "Kadın Bileklik",
    image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&h=600&fit=crop&crop=center",
    price: 549.90, oldPrice: 699.90, discount: 21, reviews: 89,
    description: "Şık ve dayanıklı kadın bileklik koleksiyonu.",
    material: "925 Ayar Gümüş", category: "Bileklik", categorySlug: "kadin-aksesuar/bileklik", stock: 35,
  },
  {
    id: "kadin-yuzuk",
    name: "Kadın Yüzük",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop&crop=center",
    price: 749.90, oldPrice: 899.90, discount: 17, reviews: 63,
    description: "Özel tasarım kadın yüzük modelleri.",
    material: "925 Ayar Gümüş", category: "Yüzük", categorySlug: "kadin-aksesuar/yuzuk", stock: 28,
  },
  {
    id: "kadin-bros-toka",
    name: "Broş & Toka",
    image: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=600&h=600&fit=crop&crop=center",
    price: 199.90, oldPrice: 279.90, discount: 29, reviews: 47,
    description: "Şıklığınızı tamamlayacak broş ve toka modelleri.",
    material: "Çelik & Emaye", category: "Broş & Toka", categorySlug: "kadin-aksesuar/bros-toka", stock: 60,
  },
  {
    id: "kadin-set-kombin",
    name: "Set & Kombin",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&h=600&fit=crop&crop=center",
    price: 1299.90, oldPrice: 1799.90, discount: 28, reviews: 112,
    description: "Kolye, küpe ve bileklikten oluşan uyumlu set koleksiyonları.",
    material: "925 Ayar Gümüş", category: "Set & Kombin", categorySlug: "kadin-aksesuar/set", stock: 20,
  },

  // ─── ERKEK AKSESUAR ───────────────────────────────────────────────────────

  {
    id: "erkek-kolye",
    name: "Erkek Kolye",
    image: "https://images.unsplash.com/photo-1622464780965-13ab5d000069?w=600&h=600&fit=crop&crop=center",
    price: 649.90, oldPrice: 799.90, discount: 19, reviews: 78,
    description: "Güçlü ve şık erkek kolye modelleri.",
    material: "316L Paslanmaz Çelik", category: "Erkek Kolye", categorySlug: "erkek-aksesuar/kolye", stock: 40,
  },
  {
    id: "erkek-bileklik",
    name: "Erkek Bileklik",
    image: "https://images.unsplash.com/photo-1573408301185-9519f94816c5?w=600&h=600&fit=crop&crop=center",
    price: 449.90, oldPrice: 549.90, discount: 18, reviews: 55,
    description: "Modern erkek bileklik ve zincir koleksiyonu.",
    material: "316L Paslanmaz Çelik", category: "Erkek Bileklik", categorySlug: "erkek-aksesuar/bileklik", stock: 45,
  },
  {
    id: "erkek-yuzuk",
    name: "Erkek Yüzük",
    image: "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?w=600&h=600&fit=crop&crop=center",
    price: 849.90, oldPrice: 999.90, discount: 15, reviews: 34,
    description: "Sade ve etkileyici erkek yüzük tasarımları.",
    material: "925 Ayar Gümüş", category: "Erkek Yüzük", categorySlug: "erkek-aksesuar/yuzuk", stock: 22,
  },
  {
    id: "erkek-kupe",
    name: "Erkek Küpe",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&h=600&fit=crop&crop=center",
    price: 249.90, oldPrice: 349.90, discount: 29, reviews: 41,
    description: "Minimal ve şık erkek küpe modelleri.",
    material: "316L Paslanmaz Çelik", category: "Erkek Küpe", categorySlug: "erkek-aksesuar/kupe", stock: 55,
  },
  {
    id: "kol-dugmesi",
    name: "Kol Düğmesi",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop&crop=center",
    price: 379.90, oldPrice: 449.90, discount: 16, reviews: 28,
    description: "Klasik ve modern kol düğmesi çeşitleri.",
    material: "Pirinç & Gümüş Kaplama", category: "Kol Düğmesi", categorySlug: "erkek-aksesuar/kol-dugmesi", stock: 30,
  },

  // ─── ÇOCUK AKSESUAR ───────────────────────────────────────────────────────

  {
    id: "cocuk-kolye",
    name: "Çocuk Kolye",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop&crop=center",
    price: 199.90, oldPrice: 279.90, discount: 29, reviews: 67,
    description: "Güvenli ve renkli çocuk kolye modelleri.",
    material: "Hipoalerjenik Gümüş", category: "Çocuk Kolye", categorySlug: "cocuk-aksesuar/kolye", stock: 70,
  },
  {
    id: "cocuk-kupe",
    name: "Çocuk Küpe",
    image: "https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=600&h=600&fit=crop&crop=center",
    price: 149.90, oldPrice: 199.90, discount: 25, reviews: 93,
    description: "Cilde dost malzemeden üretilmiş çocuk küpe çeşitleri.",
    material: "Hipoalerjenik Çelik", category: "Çocuk Küpe", categorySlug: "cocuk-aksesuar/kupe", stock: 90,
  },
  {
    id: "cocuk-bileklik",
    name: "Çocuk Bileklik",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop&crop=center",
    price: 129.90, oldPrice: 179.90, discount: 28, reviews: 51,
    description: "Dayanıklı ve şirin çocuk bileklik modelleri.",
    material: "Hipoalerjenik Gümüş", category: "Çocuk Bileklik", categorySlug: "cocuk-aksesuar/bileklik", stock: 65,
  },
  {
    id: "cocuk-yuzuk",
    name: "Çocuk Yüzük",
    image: "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=600&h=600&fit=crop&crop=center",
    price: 99.90, oldPrice: 149.90, discount: 33, reviews: 38,
    description: "Renkli ve eğlenceli çocuk yüzük koleksiyonu.",
    material: "Hipoalerjenik Çelik", category: "Çocuk Yüzük", categorySlug: "cocuk-aksesuar/yuzuk", stock: 80,
  },
  {
    id: "bebek-takisi",
    name: "Bebek Takıları",
    image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&h=600&fit=crop&crop=center",
    price: 179.90, oldPrice: 249.90, discount: 28, reviews: 102,
    description: "Bebeklere özel güvenli ve nazik takı koleksiyonu.",
    material: "Hipoalerjenik Gümüş", category: "Bebek Takıları", categorySlug: "cocuk-aksesuar/bebek", stock: 45,
  },

  // ─── SAÇ ÜRÜNLERİ ─────────────────────────────────────────────────────────

  {
    id: "sac-tokasi",
    name: "Saç Tokası",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=600&fit=crop&crop=center",
    price: 89.90, oldPrice: 129.90, discount: 31, reviews: 187,
    description: "Her saç tipine uygun şık saç tokası modelleri.",
    material: "Reçine & Metal", category: "Saç Tokası", categorySlug: "sac-urunleri/toka", stock: 120,
  },
  {
    id: "sac-bandi",
    name: "Saç Bandı",
    image: "https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=600&h=600&fit=crop&crop=center",
    price: 69.90, oldPrice: 99.90, discount: 30, reviews: 143,
    description: "Rahat ve şık saç bandı çeşitleri.",
    material: "Kadife & Plastik", category: "Saç Bandı", categorySlug: "sac-urunleri/bant", stock: 150,
  },
  {
    id: "sac-klipsi",
    name: "Saç Klipsi",
    image: "https://images.unsplash.com/photo-1559056961-1f4ca0e97e42?w=600&h=600&fit=crop&crop=center",
    price: 59.90, oldPrice: 89.90, discount: 33, reviews: 219,
    description: "Pratik ve dayanıklı saç klipsi modelleri.",
    material: "Metal & Plastik", category: "Saç Klipsi", categorySlug: "sac-urunleri/klips", stock: 200,
  },
  {
    id: "tac-diadem",
    name: "Taç & Diadem",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=600&fit=crop&crop=center",
    price: 349.90, oldPrice: 449.90, discount: 22, reviews: 74,
    description: "Özel günler için zarif taç ve diadem koleksiyonu.",
    material: "Metal & Kristal", category: "Taç & Diadem", categorySlug: "sac-urunleri/tac", stock: 25,
  },
  {
    id: "sac-ignesi",
    name: "Saç İğnesi",
    image: "https://images.unsplash.com/photo-1512495039889-52a3b799c9bc?w=600&h=600&fit=crop&crop=center",
    price: 49.90, oldPrice: 79.90, discount: 38, reviews: 98,
    description: "Zarif ve işlevsel saç iğnesi çeşitleri.",
    material: "Metal & İnci", category: "Saç İğnesi", categorySlug: "sac-urunleri/igne", stock: 180,
  },

  // ─── HEDİYELİK SETLER ─────────────────────────────────────────────────────

  {
    id: "sevgiliye-ozel",
    name: "Sevgiliye Özel Set",
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&h=600&fit=crop&crop=center",
    price: 1499.90, oldPrice: 1999.90, discount: 25, reviews: 321,
    description: "Sevgilinizi mutlu edecek özel hazırlanmış takı setleri.",
    material: "925 Ayar Gümüş", category: "Sevgiliye Özel", categorySlug: "hediyelik-setler/sevgili", stock: 30,
  },
  {
    id: "dogum-gunu-seti",
    name: "Doğum Günü Seti",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&h=600&fit=crop&crop=center",
    price: 999.90, oldPrice: 1399.90, discount: 29, reviews: 178,
    description: "Doğum günleri için hazırlanmış şık hediye setleri.",
    material: "925 Ayar Gümüş", category: "Doğum Günü Seti", categorySlug: "hediyelik-setler/dogum-gunu", stock: 40,
  },
  {
    id: "yil-donumu-seti",
    name: "Yıl Dönümü Seti",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop&crop=center",
    price: 1799.90, oldPrice: 2299.90, discount: 22, reviews: 89,
    description: "Yıl dönümlerini unutulmaz kılacak özel takı setleri.",
    material: "925 Ayar Gümüş & Altın Kaplama", category: "Yıl Dönümü Seti", categorySlug: "hediyelik-setler/yil-donumu", stock: 18,
  },
  {
    id: "anneler-gunu-seti",
    name: "Anneler Günü Seti",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop&crop=center",
    price: 1199.90, oldPrice: 1599.90, discount: 25, reviews: 245,
    description: "Annenize en güzel hediyeyi verin.",
    material: "925 Ayar Gümüş", category: "Anneler Günü Seti", categorySlug: "hediyelik-setler/anneler-gunu", stock: 35,
  },
  {
    id: "nisan-dugun-seti",
    name: "Nişan & Düğün Seti",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop&crop=center",
    price: 3999.90, oldPrice: 5499.90, discount: 27, reviews: 134,
    description: "O özel günü taçlandıracak nişan ve düğün takı setleri.",
    material: "925 Ayar Gümüş & Zirkon", category: "Nişan & Düğün Seti", categorySlug: "hediyelik-setler/nisan-dugun", stock: 12,
  },

  // ─── KOZMETİK ─────────────────────────────────────────────────────────────

  {
    id: "cilt-bakimi",
    name: "Cilt Bakımı",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop&crop=center",
    price: 349.90, oldPrice: 499.90, discount: 30, reviews: 312,
    description: "Cildinizi besleyecek özel bakım ürünleri.",
    material: "Doğal İçerik", category: "Cilt Bakımı", categorySlug: "kozmetik/cilt-bakimi", stock: 100,
  },
  {
    id: "parfum-deodorant",
    name: "Parfüm & Deodorant",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=600&fit=crop&crop=center",
    price: 499.90, oldPrice: 699.90, discount: 29, reviews: 198,
    description: "Uzun süre kalıcı parfüm ve deodorant çeşitleri.",
    material: "Alkol & Esans Bazlı", category: "Parfüm & Deodorant", categorySlug: "kozmetik/parfum", stock: 75,
  },
  {
    id: "makyaj",
    name: "Makyaj",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop&crop=center",
    price: 279.90, oldPrice: 399.90, discount: 30, reviews: 267,
    description: "Profesyonel kalitede makyaj ürünleri.",
    material: "Dermatolojik Test Edilmiş", category: "Makyaj", categorySlug: "kozmetik/makyaj", stock: 90,
  },
  {
    id: "sac-bakimi-kozmetik",
    name: "Saç Bakımı",
    image: "https://images.unsplash.com/photo-1590393802688-9c703c78d883?w=600&h=600&fit=crop&crop=center",
    price: 229.90, oldPrice: 329.90, discount: 30, reviews: 143,
    description: "Saçlarınıza özel bakım ve güzelleştirme ürünleri.",
    material: "Doğal Keratin & Argan", category: "Saç Bakımı", categorySlug: "kozmetik/sac-bakimi", stock: 110,
  },
  {
    id: "el-vucut",
    name: "El & Vücut",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&h=600&fit=crop&crop=center",
    price: 189.90, oldPrice: 269.90, discount: 30, reviews: 189,
    description: "El ve vücut bakımı için özel formüle edilmiş ürünler.",
    material: "Doğal Bitkisel İçerik", category: "El & Vücut", categorySlug: "kozmetik/el-vucut", stock: 130,
  },

];

// Stok durumu yardımcı fonksiyonu
export type StockStatus = "out" | "critical" | "low" | "ok";
export const getStockStatus = (stock: number): StockStatus => {
  if (stock === 0) return "out";
  if (stock <= 3) return "critical";
  if (stock <= 10) return "low";
  return "ok";
};

// ─── Ürün erişim fonksiyonları ───────────────────────────────────────────────
export const getProducts = (): Product[] => products.filter((p) => p.active !== false);

export const getProductById = (id: string): Product | undefined => {
  return getProducts().find((p) => p.id === id);
};

export const getProductsByCategorySlug = (slug: string): Product[] => {
  return getProducts().filter((p) => p.categorySlug === slug || p.categorySlug.startsWith(slug));
};