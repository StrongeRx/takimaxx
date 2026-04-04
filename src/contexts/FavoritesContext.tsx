import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Product } from "@/data/products";

const STORAGE_KEY = "takimax_favorites";

const loadFromStorage = (): Product[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

interface FavoritesContextType {
  favorites: Product[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (product: Product) => void;
  totalFavorites: number;
  isFavDrawerOpen: boolean;
  setIsFavDrawerOpen: (open: boolean) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  // ✅ Sayfa açılışında localStorage'dan yükle
  const [favorites, setFavorites] = useState<Product[]>(loadFromStorage);
  const [isFavDrawerOpen, setIsFavDrawerOpen] = useState(false);

  // ✅ Her değişiklikte localStorage'a kaydet
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // localStorage dolu veya erişilemez
    }
  }, [favorites]);

  const isFavorite = useCallback((id: string) => favorites.some((p) => p.id === id), [favorites]);

  const toggleFavorite = useCallback((product: Product) => {
    setFavorites((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  }, []);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      isFavorite,
      toggleFavorite,
      totalFavorites: favorites.length,
      isFavDrawerOpen,
      setIsFavDrawerOpen,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
};