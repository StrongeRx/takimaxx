import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  image?: string;
  subtitle?: string;
  exiting?: boolean;
}

interface CartModal {
  open: boolean;
  productName: string;
  productImage?: string;
}

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  delay: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, image?: string, subtitle?: string) => void;
  showCartModal: (productName: string, productImage?: string) => void;
  spawnHearts: (x: number, y: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ICONS = {
  error: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  info: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  warning: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
};

const COLORS = {
  error:   { bg: "#fef2f2", border: "#fecaca", icon: "#dc2626", bar: "#ef4444" },
  info:    { bg: "#f0f9ff", border: "#bae6fd", icon: "#0284c7", bar: "#0ea5e9" },
  warning: { bg: "#fdf8f0", border: "#e8d5b0", icon: "#c9a96e", bar: "#c9a96e" },
};

const CartSuccessModal = ({
  modal,
  onClose,
  onGoCart,
}: {
  modal: CartModal;
  onClose: () => void;
  onGoCart: () => void;
}) => {
  if (!modal.open) return null;

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 99997,
        background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)",
        animation: "cartModalOverlayIn 0.2s ease",
      }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 99998,
        background: "#fff", borderRadius: 16,
        boxShadow: "0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)",
        width: "clamp(300px, 90vw, 420px)",
        overflow: "hidden",
        animation: "cartModalIn 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <div style={{ height: 4, background: "linear-gradient(90deg, #c9a96e, #e8cc9a, #c9a96e)" }} />
        <div style={{ padding: "28px 28px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "linear-gradient(135deg, #c9a96e, #e8cc9a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(201,169,110,0.4)",
              animation: "cartModalIconPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both",
              marginBottom: 14,
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 style={{
              fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 700,
              color: "#111", margin: 0, textAlign: "center",
            }}>Sepete Eklendi!</h3>
          </div>

          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            background: "#faf8f5", borderRadius: 10,
            border: "1px solid #ede9e2", padding: "12px 14px", marginBottom: 22,
          }}>
            {modal.productImage && (
              <div style={{
                width: 56, height: 56, borderRadius: 8, overflow: "hidden",
                flexShrink: 0, border: "1px solid #ede9e2", background: "#f5f0eb",
              }}>
                <img src={modal.productImage} alt={modal.productName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 600,
                color: "#c9a96e", margin: "0 0 3px",
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}>Ürün Sepete Eklendi</p>
              <p style={{
                fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600,
                color: "#222", margin: 0, lineHeight: 1.4,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{modal.productName}</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{
              flex: 1, height: 46, background: "#f5f2ee",
              border: "1.5px solid #e0dbd2", borderRadius: 8, cursor: "pointer",
              fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700,
              color: "#555", letterSpacing: "0.06em", transition: "all 0.18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#ede9e2"; e.currentTarget.style.color = "#111"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#f5f2ee"; e.currentTarget.style.color = "#555"; }}
            >Alışverişe Devam Et</button>

            <button onClick={onGoCart} style={{
              flex: 1, height: 46, background: "#111",
              border: "1.5px solid #111", borderRadius: 8, cursor: "pointer",
              fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700,
              color: "#fff", letterSpacing: "0.06em", transition: "all 0.18s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#c9a96e"; e.currentTarget.style.borderColor = "#c9a96e"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#111"; e.currentTarget.style.borderColor = "#111"; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              Sepete Git
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes cartModalOverlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cartModalIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.92); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes cartModalIconPop {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          60%  { transform: scale(1.15) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hearts, setHearts] = useState<HeartParticle[]>([]);
  const [cartModal, setCartModal] = useState<CartModal>({ open: false, productName: "", productImage: undefined });

  const showToast = useCallback((
    message: string,
    type: ToastType = "success",
    _image?: string,
    _subtitle?: string
  ) => {
    if (type === "success") return; // success artık modal hallediyor
    const id = Date.now();
    setToasts(prev => [...prev.slice(-2), { id, message, type, exiting: false }]);
    setTimeout(() => setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t)), 3200);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3600);
  }, []);

  const showCartModal = useCallback((productName: string, productImage?: string) => {
    setCartModal({ open: true, productName, productImage });
  }, []);

  const closeCartModal = useCallback(() => {
    setCartModal(prev => ({ ...prev, open: false }));
  }, []);

  // Router bağımlılığı yok — window.location ile navigate
  const goToCart = useCallback(() => {
    setCartModal(prev => ({ ...prev, open: false }));
    window.location.href = "/sepet";
  }, []);

  const spawnHearts = useCallback((x: number, y: number) => {
    const newHearts: HeartParticle[] = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i, x, y,
      dx: (Math.random() - 0.5) * 120,
      dy: -(Math.random() * 100 + 60),
      size: Math.random() * 14 + 10,
      delay: Math.random() * 0.2,
    }));
    setHearts(prev => [...prev, ...newHearts]);
    setTimeout(() => setHearts(prev => prev.filter(h => !newHearts.find(n => n.id === h.id))), 2000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, showCartModal, spawnHearts }}>
      {children}

      <CartSuccessModal modal={cartModal} onClose={closeCartModal} onGoCart={goToCart} />

      {hearts.map((h) => (
        <div key={h.id} style={{
          position: "fixed", left: h.x, top: h.y,
          pointerEvents: "none", zIndex: 99998,
          animation: `heartFloat 1.8s ease-out forwards`,
          animationDelay: `${h.delay}s`,
          "--dx": `${h.dx}px`, "--dy": `${h.dy}px`,
        } as React.CSSProperties}>
          <svg width={h.size} height={h.size} viewBox="0 0 24 24" fill="#e11d48"
            style={{ filter: "drop-shadow(0 0 4px rgba(225,29,72,0.4))" }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
      ))}

      <div style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 99999,
        display: "flex", flexDirection: "column", gap: 10,
        alignItems: "flex-end", pointerEvents: "none",
      }}>
        {toasts.map((toast) => {
          const c = COLORS[toast.type as keyof typeof COLORS];
          if (!c) return null;
          return (
            <div key={toast.id} style={{
              pointerEvents: "all", width: "clamp(300px, 90vw, 380px)",
              background: "#fff", border: "1px solid #e8e4de", borderRadius: 12,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)", overflow: "hidden",
              animation: toast.exiting ? "toastOut 0.35s cubic-bezier(0.4,0,1,1) forwards" : "toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
              cursor: "pointer",
            }} onClick={() => dismiss(toast.id)}>
              <div style={{ height: 3, background: c.bar }} />
              <div style={{ padding: "14px 16px 12px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: c.bg, border: `1px solid ${c.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center", color: c.icon,
                }}>
                  {ICONS[toast.type as keyof typeof ICONS]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.1em", textTransform: "uppercase", color: c.icon,
                  }}>
                    {toast.type === "error" ? "Hata" : "Bilgi"}
                  </span>
                  <p style={{
                    fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600,
                    color: "#111", margin: "3px 0 0", lineHeight: 1.4,
                  }}>{toast.message}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); dismiss(toast.id); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#ccc", display: "flex" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#666")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#ccc")}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div style={{ height: 2, background: "#f5f2ee", margin: "0 16px 12px" }}>
                <div style={{ height: "100%", background: c.bar, borderRadius: 99, animation: "toastProgress 3.2s linear forwards" }} />
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes toastIn { from { opacity:0; transform:translateX(24px) scale(0.96); } to { opacity:1; transform:translateX(0) scale(1); } }
        @keyframes toastOut { from { opacity:1; } to { opacity:0; transform:translateX(32px); } }
        @keyframes toastProgress { from { width:100%; } to { width:0%; } }
        @keyframes heartFloat {
          0%   { opacity:1; transform:translate(0,0) scale(1) rotate(0deg); }
          60%  { opacity:0.8; }
          100% { opacity:0; transform:translate(var(--dx),var(--dy)) scale(0.4) rotate(20deg); }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};