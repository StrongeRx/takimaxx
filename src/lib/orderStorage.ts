// ─── Sipariş Depolama Yardımcıları ───────────────────────────────────────────
// Siparişler localStorage'da "tkx_orders" anahtarıyla tutulur.

export type OrderStatus = "beklemede" | "hazırlanıyor" | "kargoda" | "teslim edildi" | "iptal";

export interface StoredOrderItem {
  productId: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

export interface StoredOrder {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  items: StoredOrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  couponCode: string;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "tkx_orders";

export function getOrders(): StoredOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredOrder[];
  } catch {
    return [];
  }
}

export function saveOrder(order: StoredOrder): void {
  try {
    const existing = getOrders();
    // Aynı id varsa güncelle, yoksa başa ekle
    const idx = existing.findIndex(o => o.id === order.id);
    if (idx >= 0) {
      existing[idx] = order;
    } else {
      existing.unshift(order);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // localStorage erişilemez — sessizce geç
  }
}

export function getOrderById(id: string): StoredOrder | null {
  return getOrders().find(o => o.id === id) ?? null;
}

/** Sipariş durumunu "status" alanından okunabilir Türkçe etikete çevirir */
export const STATUS_LABELS: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  beklemede:       { label: "Beklemede",     color: "#92400e", bg: "#fef3c7" },
  "hazırlanıyor":  { label: "Hazırlanıyor",  color: "#1e40af", bg: "#dbeafe" },
  kargoda:         { label: "Kargoda",       color: "#0f766e", bg: "#ccfbf1" },
  "teslim edildi": { label: "Teslim Edildi", color: "#166534", bg: "#dcfce7" },
  iptal:           { label: "İptal Edildi",  color: "#991b1b", bg: "#fee2e2" },
};

/** Belirli bir e-postaya ait siparişleri döner */
export function getOrdersByEmail(email: string): StoredOrder[] {
  const normalized = email.toLowerCase().trim();
  return getOrders().filter(o => (o.email || "").toLowerCase().trim() === normalized);
}