import {
  createContext, useContext, useState, useCallback,
  useEffect, useRef, ReactNode,
} from "react";
import { Product } from "@/data/products";

/* ─────────────────────────────────────────────
   TİPLER
───────────────────────────────────────────── */
interface UserProfile {
  /** Kategori → kaç kez görüntülendi */
  categoryViews: Record<string, number>;
  /** Malzeme → kaç kez görüntülendi */
  materialViews: Record<string, number>;
  /** Görüntülenen ürün fiyatları (medyan fiyat aralığı hesabı için) */
  priceHistory: number[];
  /** Favori ürün id'leri */
  favoriteIds: string[];
  /** Sepete eklenen ürün id'leri */
  cartIds: string[];
  /** Toplam inceleme süresi (ms) — hangi ürünlerde daha fazla zaman geçirdi */
  productDwellTime: Record<string, number>;
}

interface RecommendationContextType {
  profile: UserProfile;
  trackView: (product: Product) => void;
  trackFavorite: (productId: string, added: boolean) => void;
  trackCart: (productId: string) => void;
  trackDwellTime: (productId: string, ms: number) => void;
  getScore: (product: Product, currentProductId?: string) => number;
  getRecommendations: (
    allProducts: Product[],
    opts?: { exclude?: string[]; limit?: number; strategy?: RecommendationStrategy }
  ) => Product[];
}

export type RecommendationStrategy =
  | "personal"       // Kullanıcı profiline göre
  | "similar"        // Belirli bir ürüne benzer
  | "trending"       // En çok incelenen/yorum alan
  | "price_match"    // Benzer fiyat aralığı
  | "cross_sell"     // Tamamlayıcı kategoriler
  | "new_arrivals";  // Yeni + puanlı

/* ─────────────────────────────────────────────
   TAMAMLAYICI KATEGORİ HARİTASI
   (cross-sell mantığı için)
───────────────────────────────────────────── */
const CROSS_SELL_MAP: Record<string, string[]> = {
  "kadin-aksesuar/kolye":    ["kadin-aksesuar/kupe", "kadin-aksesuar/bileklik", "kadin-aksesuar/set"],
  "kadin-aksesuar/kupe":     ["kadin-aksesuar/kolye", "kadin-aksesuar/yuzuk"],
  "kadin-aksesuar/bileklik": ["kadin-aksesuar/kolye", "kadin-aksesuar/set"],
  "kadin-aksesuar/yuzuk":    ["kadin-aksesuar/kupe", "kadin-aksesuar/bileklik"],
  "erkek-aksesuar/kolye":    ["erkek-aksesuar/bileklik", "erkek-aksesuar/yuzuk"],
  "erkek-aksesuar/bileklik": ["erkek-aksesuar/kolye", "erkek-aksesuar/kupe"],
  "hediyelik-setler":        ["kozmetik", "sac-urunleri"],
  "kozmetik":                ["hediyelik-setler", "sac-urunleri"],
};

/* ─────────────────────────────────────────────
   BOŞ PROFİL
───────────────────────────────────────────── */
const emptyProfile = (): UserProfile => ({
  categoryViews: {},
  materialViews: {},
  priceHistory: [],
  favoriteIds: [],
  cartIds: [],
  productDwellTime: {},
});

const STORAGE_KEY = "tkx_user_profile";

const loadProfile = (): UserProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...emptyProfile(), ...JSON.parse(raw) } : emptyProfile();
  } catch {
    return emptyProfile();
  }
};

const saveProfile = (p: UserProfile) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (_e) { /* localStorage erişilemez */ }
};

/* ─────────────────────────────────────────────
   CONTEXT
───────────────────────────────────────────── */
const RecommendationContext = createContext<RecommendationContextType | undefined>(undefined);

export const RecommendationProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(loadProfile);

  // Her profil değişiminde kaydet
  useEffect(() => { saveProfile(profile); }, [profile]);

  /* ── Yardımcı: state güncelleyici ── */
  const update = useCallback((fn: (prev: UserProfile) => UserProfile) => {
    setProfile(prev => {
      const next = fn(prev);
      return next;
    });
  }, []);

  /* ── Ürün görüntüleme ── */
  const trackView = useCallback((product: Product) => {
    update(prev => ({
      ...prev,
      categoryViews: {
        ...prev.categoryViews,
        [product.categorySlug]: (prev.categoryViews[product.categorySlug] || 0) + 1,
      },
      materialViews: {
        ...prev.materialViews,
        [product.material]: (prev.materialViews[product.material] || 0) + 1,
      },
      priceHistory: [...prev.priceHistory, product.price].slice(-20),
    }));
  }, [update]);

  /* ── Favori ekleme/çıkarma ── */
  const trackFavorite = useCallback((productId: string, added: boolean) => {
    update(prev => ({
      ...prev,
      favoriteIds: added
        ? [...new Set([...prev.favoriteIds, productId])]
        : prev.favoriteIds.filter(id => id !== productId),
    }));
  }, [update]);

  /* ── Sepete ekleme ── */
  const trackCart = useCallback((productId: string) => {
    update(prev => ({
      ...prev,
      cartIds: [...new Set([...prev.cartIds, productId])].slice(-10),
    }));
  }, [update]);

  /* ── Sayfa üzerinde geçirilen süre ── */
  const trackDwellTime = useCallback((productId: string, ms: number) => {
    update(prev => ({
      ...prev,
      productDwellTime: {
        ...prev.productDwellTime,
        [productId]: (prev.productDwellTime[productId] || 0) + ms,
      },
    }));
  }, [update]);

  /* ─────────────────────────────────────────
     PUANLAMA ALGORİTMASI
     Her ürün için 0-100 arası kişiselleştirilmiş skor üretir.
  ───────────────────────────────────────── */
  const getScore = useCallback((product: Product, currentProductId?: string): number => {
    if (product.id === currentProductId) return -1;

    let score = 0;

    // 1. Kategori tercihi (max 30 puan)
    const catViews = profile.categoryViews[product.categorySlug] || 0;
    const maxCatViews = Math.max(...Object.values(profile.categoryViews), 1);
    score += (catViews / maxCatViews) * 30;

    // 2. Malzeme tercihi (max 20 puan)
    const matViews = profile.materialViews[product.material] || 0;
    const maxMatViews = Math.max(...Object.values(profile.materialViews), 1);
    score += (matViews / maxMatViews) * 20;

    // 3. Fiyat aralığı uyumu (max 20 puan)
    if (profile.priceHistory.length > 0) {
      const sorted = [...profile.priceHistory].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      const priceRange = median * 0.5; // ±%50 aralık
      const diff = Math.abs(product.price - median);
      if (diff <= priceRange) score += (1 - diff / priceRange) * 20;
    }

    // 4. Favori ürün bonusu (max 15 puan)
    if (profile.favoriteIds.includes(product.id)) score += 15;

    // 5. Popülerlik bonusu (max 10 puan) — çok yorumlanan = güvenilir
    const reviewScore = Math.min(product.reviews / 200, 1);
    score += reviewScore * 10;

    // 6. İndirim bonusu (max 5 puan)
    if (product.discount && product.discount > 0) score += (product.discount / 100) * 5;

    return Math.min(score, 100);
  }, [profile]);

  /* ─────────────────────────────────────────
     ÖNERI ÜRETICI
  ───────────────────────────────────────── */
  const getRecommendations = useCallback((
    allProducts: Product[],
    opts: { exclude?: string[]; limit?: number; strategy?: RecommendationStrategy } = {}
  ): Product[] => {
    const { exclude = [], limit = 8, strategy = "personal" } = opts;
    const pool = allProducts.filter(p => !exclude.includes(p.id) && p.stock > 0);

    switch (strategy) {

      case "personal": {
        // Kişisel skor ile sırala
        return pool
          .map(p => ({ product: p, score: getScore(p) }))
          .sort((a, b) => b.score - a.score)
          .slice(0, limit)
          .map(x => x.product);
      }

      case "trending": {
        // En çok yorum alan + stokta olan
        return [...pool]
          .sort((a, b) => b.reviews - a.reviews)
          .slice(0, limit);
      }

      case "price_match": {
        // Kullanıcının medyan fiyat aralığına en yakın
        if (profile.priceHistory.length === 0) {
          return pool.slice(0, limit);
        }
        const sorted = [...profile.priceHistory].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        return [...pool]
          .sort((a, b) => Math.abs(a.price - median) - Math.abs(b.price - median))
          .slice(0, limit);
      }

      case "cross_sell": {
        // Kullanıcının baktığı kategorilerin tamamlayıcılarından öner
        const viewedCats = Object.keys(profile.categoryViews);
        const crossCats = new Set(
          viewedCats.flatMap(cat => CROSS_SELL_MAP[cat] || [])
        );
        const crossPool = pool.filter(p =>
          [...crossCats].some(c => p.categorySlug.startsWith(c))
        );
        return crossPool.length > 0
          ? crossPool.sort((a, b) => b.reviews - a.reviews).slice(0, limit)
          : pool.sort((a, b) => b.reviews - a.reviews).slice(0, limit);
      }

      case "new_arrivals": {
        // İndirimli + yüksek puanlı (yeni ürünü simüle eder)
        return [...pool]
          .filter(p => p.discount && p.discount > 0)
          .sort((a, b) => (b.discount || 0) - (a.discount || 0))
          .slice(0, limit);
      }

      default:
        return pool.slice(0, limit);
    }
  }, [profile, getScore]);

  return (
    <RecommendationContext.Provider value={{
      profile,
      trackView,
      trackFavorite,
      trackCart,
      trackDwellTime,
      getScore,
      getRecommendations,
    }}>
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendation = () => {
  const ctx = useContext(RecommendationContext);
  if (!ctx) throw new Error("useRecommendation must be used within RecommendationProvider");
  return ctx;
};