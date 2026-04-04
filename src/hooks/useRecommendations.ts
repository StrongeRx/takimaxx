import { useMemo, useEffect, useRef, useCallback } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useRecommendation, RecommendationStrategy } from "@/contexts/RecommendationContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Product } from "@/data/products";

/**
 * Birden fazla stratejiyi bir arada döndüren ana hook.
 *
 * @param currentProduct  - Şu an görüntülenen ürün (varsa)
 * @param limit           - Her bölüm için ürün sayısı (varsayılan: 8)
 */
export function useRecommendations(currentProduct?: Product, limit = 8) {
  const allProducts = useProducts();
  const { getRecommendations, trackView, trackDwellTime, profile } = useRecommendation();
  const { recentlyViewed } = useRecentlyViewed();
  const { favorites } = useFavorites();

  const currentProductId = currentProduct?.id;

  const excludeIds = useMemo(() => {
    const ids = new Set<string>();
    if (currentProduct) ids.add(currentProduct.id);
    return [...ids];
  }, [currentProduct]);

  // Ürün görüntülenince takip et
  const stableTrackView = useCallback(trackView, [trackView]);
  useEffect(() => {
    if (currentProduct) stableTrackView(currentProduct);
  }, [currentProductId, stableTrackView]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sayfa üzerinde geçirilen süreyi takip et (dwell time)
  const entryTime = useRef(Date.now());
  const stableTrackDwellTime = useCallback(trackDwellTime, [trackDwellTime]);
  useEffect(() => {
    if (!currentProduct) return;
    entryTime.current = Date.now();
    return () => {
      const ms = Date.now() - entryTime.current;
      if (ms > 2000) stableTrackDwellTime(currentProduct.id, ms); // 2sn altı sayılmaz
    };
  }, [currentProductId, stableTrackDwellTime]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Benzer ürünler (kategori + malzeme tabanlı skor) ── */
  const similar = useMemo(() => {
    if (!currentProduct) return [];
    return allProducts
      .filter(p => p.id !== currentProduct.id && p.stock > 0)
      .map(p => {
        let score = 0;
        // Aynı kategoriyse +40
        if (p.categorySlug === currentProduct.categorySlug) score += 40;
        // Aynı üst kategoriyse +20
        else if (p.categorySlug.split("/")[0] === currentProduct.categorySlug.split("/")[0]) score += 20;
        // Aynı malzeme +25
        if (p.material === currentProduct.material) score += 25;
        // Benzer fiyat aralığı (±%40) +15
        const priceDiff = Math.abs(p.price - currentProduct.price) / currentProduct.price;
        if (priceDiff <= 0.4) score += (1 - priceDiff / 0.4) * 15;
        // Popülerlik +10
        score += Math.min(p.reviews / 200, 1) * 10;
        // İndirim +5
        if (p.discount && p.discount > 0) score += 5;
        return { product: p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(x => x.product);
  }, [currentProductId, allProducts, limit, currentProduct]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Kişisel öneriler (kullanıcı profili tabanlı) ── */
  const personal = useMemo(() =>
    getRecommendations(allProducts, { exclude: excludeIds, limit, strategy: "personal" as RecommendationStrategy }),
    [allProducts, excludeIds, limit, getRecommendations]
  );

  /* ── Tamamlayıcı ürünler (cross-sell) ── */
  const crossSell = useMemo(() =>
    getRecommendations(allProducts, { exclude: excludeIds, limit, strategy: "cross_sell" as RecommendationStrategy }),
    [allProducts, excludeIds, limit, getRecommendations]
  );

  /* ── Fiyat aralığındaki popülerler ── */
  const priceMatch = useMemo(() =>
    getRecommendations(allProducts, { exclude: excludeIds, limit, strategy: "price_match" as RecommendationStrategy }),
    [allProducts, excludeIds, limit, getRecommendations]
  );

  /* ── Trend ürünler ── */
  const trending = useMemo(() =>
    getRecommendations(allProducts, { exclude: excludeIds, limit, strategy: "trending" as RecommendationStrategy }),
    [allProducts, excludeIds, limit, getRecommendations]
  );

  /* ── Son görüntülenenler (mevcut hariç) ── */
  const recentlyViewedFiltered = useMemo(() =>
    recentlyViewed.filter(p => p.id !== currentProductId).slice(0, limit),
    [recentlyViewed, currentProductId, limit]
  );

  /* ── Favori kategorisinden yeni keşifler ── */
  const fromFavorites = useMemo(() => {
    if (favorites.length === 0) return [];
    const favCats = new Set(favorites.map(f => f.categorySlug));
    return allProducts
      .filter(p =>
        p.stock > 0 &&
        !excludeIds.includes(p.id) &&
        !favorites.some(f => f.id === p.id) &&
        favCats.has(p.categorySlug)
      )
      .sort((a, b) => b.reviews - a.reviews)
      .slice(0, limit);
  }, [favorites, allProducts, excludeIds, limit]);

  /* ── Kullanıcının profilinin dolmuşluğunu hesapla ── */
  const profileRichness = useMemo(() => {
    const catCount = Object.keys(profile.categoryViews).length;
    const priceCount = profile.priceHistory.length;
    const favCount = profile.favoriteIds.length;
    return Math.min((catCount * 2 + priceCount + favCount * 3) / 20, 1); // 0-1 arası
  }, [profile]);

  return {
    similar,
    personal,
    crossSell,
    priceMatch,
    trending,
    recentlyViewed: recentlyViewedFiltered,
    fromFavorites,
    profileRichness,
    hasPersonalData: profileRichness > 0.1,
  };
}