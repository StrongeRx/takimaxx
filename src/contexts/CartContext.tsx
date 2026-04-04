import { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef, type ReactNode, type Dispatch, type SetStateAction } from "react";
import type { Product } from "@/data/products";

const SHIPPING_FEE = 49.90;
const FREE_SHIPPING_THRESHOLD = 400;
const STORAGE_KEY = "takimax_cart";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AppliedCoupon {
  code: string;
  type: "percent" | "fixed" | "shipping";
  value: number;
  label: string;
}

interface PersistedCart {
  items: CartItem[];
  appliedCoupon: AppliedCoupon | null;
  giftWrap: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  appliedCoupon: AppliedCoupon | null;
  setAppliedCoupon: (coupon: AppliedCoupon | null) => void;
  discountAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  onAddToCart?: (product: Product) => void;
  setOnAddToCart: (fn: (product: Product) => void) => void;
  giftWrap: boolean;
  setGiftWrap: Dispatch<SetStateAction<boolean>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// localStorage'dan tüm sepet verisini yükle
const loadCart = (): PersistedCart => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [], appliedCoupon: null, giftWrap: false };
    const parsed = JSON.parse(raw) as Partial<PersistedCart>;
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      appliedCoupon: parsed.appliedCoupon ?? null,
      giftWrap: parsed.giftWrap ?? false,
    };
  } catch {
    return { items: [], appliedCoupon: null, giftWrap: false };
  }
};

// localStorage'a tüm sepet verisini kaydet
const saveCart = (data: PersistedCart) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* localStorage dolu veya erişilemez */ }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const initial = loadCart();

  const [items, setItems] = useState<CartItem[]>(initial.items);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCouponState] = useState<AppliedCoupon | null>(initial.appliedCoupon);
  const [giftWrap, setGiftWrap] = useState(initial.giftWrap);
  // BUG FIX #4: onAddToCart ref ile tutulur — stale closure sorununu önler
  // useState kullansaydık addToCart her callback değişiminde yeniden oluşurdu
  const onAddToCartRef = useRef<((product: Product) => void) | undefined>(undefined);

  const setOnAddToCart = useCallback((fn: (product: Product) => void) => {
    onAddToCartRef.current = fn;
  }, []);

  // items, appliedCoupon veya giftWrap değişince localStorage'a kaydet
  useEffect(() => {
    saveCart({ items, appliedCoupon, giftWrap });
  }, [items, appliedCoupon, giftWrap]);

  const setAppliedCoupon = useCallback((coupon: AppliedCoupon | null) => {
    setAppliedCouponState(coupon);
  }, []);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const currentQty = existing ? existing.quantity : 0;
      const maxQty = product.stock;

      if (maxQty === 0) return prev;

      const addable = Math.min(quantity, maxQty - currentQty);
      if (addable <= 0) return prev;

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + addable }
            : item
        );
      }
      return [...prev, { product, quantity: addable }];
    });
    if (onAddToCartRef.current) onAddToCartRef.current(product);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id !== productId) return item;
        const safeQty = Math.min(quantity, item.product.stock);
        return { ...item, quantity: safeQty };
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCouponState(null);
    setGiftWrap(false);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const discountAmount = useMemo(() => {
    const baseShipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "percent")  return totalPrice * (appliedCoupon.value / 100);
    if (appliedCoupon.type === "fixed")    return Math.min(appliedCoupon.value, totalPrice);
    if (appliedCoupon.type === "shipping") return baseShipping;
    return 0;
  }, [appliedCoupon, totalPrice]);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, totalPrice,
      appliedCoupon, setAppliedCoupon, discountAmount,
      isCartOpen, setIsCartOpen,
      onAddToCart: onAddToCartRef.current, setOnAddToCart,
      giftWrap, setGiftWrap,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};