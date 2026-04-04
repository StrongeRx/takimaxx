// Kategori görselleri — Unsplash'ten gerçek takı fotoğrafları
const categoryImages: Record<string, string> = {
  "yeni-urunler":     "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=533&fit=crop&crop=center",
  "populer-urunler":  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=533&fit=crop&crop=center",
  "kadin-aksesuar":   "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=533&fit=crop&crop=center",
  "erkek-aksesuar":   "https://images.unsplash.com/photo-1622464780965-13ab5d000069?w=400&h=533&fit=crop&crop=center",
  "cocuk-aksesuar":   "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=533&fit=crop&crop=center",
  "sac-urunleri":     "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=533&fit=crop&crop=center",
  "hediyelik-setler": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=533&fit=crop&crop=center",
  "kozmetik":         "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=533&fit=crop&crop=center",
};

// Her kategori için mega menü sağ paneli görselleri (2 adet)
const megaImages = {
  "yeni-urunler": [
    { src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=280&h=200&fit=crop", label: "2026 Koleksiyonu" },
    { src: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=280&h=200&fit=crop", label: "Sezon Yenileri" },
  ],
  "populer-urunler": [
    { src: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=280&h=200&fit=crop", label: "Çok Satanlar" },
    { src: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=280&h=200&fit=crop", label: "Trend Takılar" },
  ],
  "kadin-aksesuar": [
    { src: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=280&h=200&fit=crop", label: "Kadın Kolye" },
    { src: "https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=280&h=200&fit=crop", label: "Kadın Küpe" },
  ],
  "erkek-aksesuar": [
    { src: "https://images.unsplash.com/photo-1622464780965-13ab5d000069?w=280&h=200&fit=crop", label: "Erkek Kolye" },
    { src: "https://images.unsplash.com/photo-1573408301185-9519f94816c5?w=280&h=200&fit=crop", label: "Erkek Bileklik" },
  ],
  "cocuk-aksesuar": [
    { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=280&h=200&fit=crop", label: "Çocuk Takıları" },
    { src: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=280&h=200&fit=crop", label: "Bebek Kolye" },
  ],
  "sac-urunleri": [
    { src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=280&h=200&fit=crop", label: "Saç Tokaları" },
    { src: "https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=280&h=200&fit=crop", label: "Saç Bandı" },
  ],
  "hediyelik-setler": [
    { src: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=280&h=200&fit=crop", label: "Sevgiliye Özel" },
    { src: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=280&h=200&fit=crop", label: "Hediye Setleri" },
  ],
  "kozmetik": [
    { src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=280&h=200&fit=crop", label: "Cilt Bakımı" },
    { src: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=280&h=200&fit=crop", label: "Makyaj" },
  ],
};

export interface MegaMenuImage {
  src: string;
  label: string;
}

export interface SubCategory {
  label: string;
  slug: string;
}

export interface MainCategory {
  label: string;
  slug: string;
  image: string;
  description: string;
  subcategories: SubCategory[];
  megaImages: MegaMenuImage[];
}

export const mainCategories: MainCategory[] = [
  {
    label: "Yeni Ürünler",
    slug: "yeni-urunler",
    image: categoryImages["yeni-urunler"],
    
    description: "En yeni koleksiyonlar",
    megaImages: megaImages["yeni-urunler"],
    subcategories: [
      { label: "Bu Haftanın Yenileri", slug: "yeni-urunler" },
      { label: "Yeni Gelenler", slug: "yeni-urunler" },
      { label: "Sezona Özel", slug: "yeni-urunler" },
    ],
  },
  {
    label: "Popüler Ürünler",
    slug: "populer-urunler",
    image: categoryImages["populer-urunler"],
    
    description: "En çok tercih edilenler",
    megaImages: megaImages["populer-urunler"],
    subcategories: [
      { label: "Çok Satanlar", slug: "populer-urunler" },
      { label: "Trend Ürünler", slug: "populer-urunler" },
      { label: "Öne Çıkanlar", slug: "populer-urunler" },
    ],
  },
  {
    label: "Kadın Aksesuar",
    slug: "kadin-aksesuar",
    image: categoryImages["kadin-aksesuar"],
    
    description: "Kolye, küpe, bileklik ve daha fazlası",
    megaImages: megaImages["kadin-aksesuar"],
    subcategories: [
      { label: "Kolye", slug: "kadin-aksesuar/kolye" },
      { label: "Küpe", slug: "kadin-aksesuar/kupe" },
      { label: "Bileklik", slug: "kadin-aksesuar/bileklik" },
      { label: "Yüzük", slug: "kadin-aksesuar/yuzuk" },
      { label: "Broş & Toka", slug: "kadin-aksesuar/bros-toka" },
      { label: "Set & Kombin", slug: "kadin-aksesuar/set" },
    ],
  },
  {
    label: "Erkek Aksesuar",
    slug: "erkek-aksesuar",
    image: categoryImages["erkek-aksesuar"],
    
    description: "Şık ve modern erkek takıları",
    megaImages: megaImages["erkek-aksesuar"],
    subcategories: [
      { label: "Erkek Kolye", slug: "erkek-aksesuar/kolye" },
      { label: "Erkek Bileklik", slug: "erkek-aksesuar/bileklik" },
      { label: "Erkek Yüzük", slug: "erkek-aksesuar/yuzuk" },
      { label: "Erkek Küpe", slug: "erkek-aksesuar/kupe" },
      { label: "Kol Düğmesi", slug: "erkek-aksesuar/kol-dugmesi" },
    ],
  },
  {
    label: "Çocuk Aksesuar",
    slug: "cocuk-aksesuar",
    image: categoryImages["cocuk-aksesuar"],
    
    description: "Güvenli ve eğlenceli çocuk takıları",
    megaImages: megaImages["cocuk-aksesuar"],
    subcategories: [
      { label: "Çocuk Kolye", slug: "cocuk-aksesuar/kolye" },
      { label: "Çocuk Küpe", slug: "cocuk-aksesuar/kupe" },
      { label: "Çocuk Bileklik", slug: "cocuk-aksesuar/bileklik" },
      { label: "Çocuk Yüzük", slug: "cocuk-aksesuar/yuzuk" },
      { label: "Bebek Takıları", slug: "cocuk-aksesuar/bebek" },
    ],
  },
  {
    label: "Saç Ürünleri",
    slug: "sac-urunleri",
    image: categoryImages["sac-urunleri"],
    
    description: "Tokalar, bantlar ve saç aksesuarları",
    megaImages: megaImages["sac-urunleri"],
    subcategories: [
      { label: "Saç Tokası", slug: "sac-urunleri/toka" },
      { label: "Saç Bandı", slug: "sac-urunleri/bant" },
      { label: "Saç Klipsi", slug: "sac-urunleri/klips" },
      { label: "Taç & Diadem", slug: "sac-urunleri/tac" },
      { label: "Saç İğnesi", slug: "sac-urunleri/igne" },
    ],
  },
  {
    label: "Hediyelik Setler",
    slug: "hediyelik-setler",
    image: categoryImages["hediyelik-setler"],
    
    description: "Sevdiklerinize özel hediye setleri",
    megaImages: megaImages["hediyelik-setler"],
    subcategories: [
      { label: "Sevgiliye Özel", slug: "hediyelik-setler/sevgili" },
      { label: "Doğum Günü Seti", slug: "hediyelik-setler/dogum-gunu" },
      { label: "Yıl Dönümü Seti", slug: "hediyelik-setler/yil-donumu" },
      { label: "Anneler Günü Seti", slug: "hediyelik-setler/anneler-gunu" },
      { label: "Nişan & Düğün Seti", slug: "hediyelik-setler/nisan-dugun" },
    ],
  },
  {
    label: "Kozmetik",
    slug: "kozmetik",
    image: categoryImages["kozmetik"],
    
    description: "Bakım ve güzellik ürünleri",
    megaImages: megaImages["kozmetik"],
    subcategories: [
      { label: "Cilt Bakımı", slug: "kozmetik/cilt-bakimi" },
      { label: "Parfüm & Deodorant", slug: "kozmetik/parfum" },
      { label: "Makyaj", slug: "kozmetik/makyaj" },
      { label: "Saç Bakımı", slug: "kozmetik/sac-bakimi" },
      { label: "El & Vücut", slug: "kozmetik/el-vucut" },
    ],
  },
];

// Slug'dan ana kategori bul
export const getCategoryBySlug = (slug: string): MainCategory | undefined =>
  mainCategories.find(c => c.slug === slug || slug.startsWith(c.slug + "/"));

// Header nav formatına dönüştür
export const navLinks = mainCategories.map(cat => ({
  label: cat.label,
  href: `/kategori/${cat.slug}`,
  dropdown: cat.subcategories.map(sub => ({
    label: sub.label,
    href: `/kategori/${sub.slug}`,
  })),
}));