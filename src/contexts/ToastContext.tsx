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
  spawnHearts: (x: number, y: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ICONS = {
  success: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
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
  success: { bg: "#f0fdf4", border: "#bbf7d0", icon: "#16a34a", bar: "#22c55e" },
  error:   { bg: "#fef2f2", border: "#fecaca", icon: "#dc2626", bar: "#ef4444" },
  info:    { bg: "#f0f9ff", border: "#bae6fd", icon: "#0284c7", bar: "#0ea5e9" },
  warning: { bg: "#fdf8f0", border: "#e8d5b0", icon: "#c9a96e", bar: "#c9a96e" },
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hearts, setHearts] = useState<HeartParticle[]>([]);

  const showToast = useCallback((
    message: string,
    type: ToastType = "success",
    image?: string,
    subtitle?: string
  ) => {
    const id = Date.now();
    setToasts(prev => [...prev.slice(-2), { id, message, type, image, subtitle, exiting: false }]);

    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    }, 3200);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3600);
  }, []);

  const spawnHearts = useCallback((x: number, y: number) => {
    const count = 10;
    const newHearts: HeartParticle[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      dx: (Math.random() - 0.5) * 120,
      dy: -(Math.random() * 100 + 60),
      size: Math.random() * 14 + 10,
      delay: Math.random() * 0.2,
    }));
    setHearts(prev => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.find(n => n.id === h.id)));
    }, 2000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, spawnHearts }}>
      {children}

      {/* ── Kalp Parçacıkları ── */}
      {hearts.map((h) => (
        <div
          key={h.id}
          style={{
            position: "fixed",
            left: h.x,
            top: h.y,
            pointerEvents: "none",
            zIndex: 99998,
            animation: `heartFloat 1.8s ease-out forwards`,
            animationDelay: `${h.delay}s`,
            "--dx": `${h.dx}px`,
            "--dy": `${h.dy}px`,
          } as React.CSSProperties}
        >
          <svg
            width={h.size}
            height={h.size}
            viewBox="0 0 24 24"
            fill="#e11d48"
            style={{ filter: "drop-shadow(0 0 4px rgba(225,29,72,0.4))" }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
      ))}

      {/* ── Toast Container ── */}
      <div style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "flex-end",
        pointerEvents: "none",
      }}>
        {toasts.map((toast) => {
          const c = COLORS[toast.type];
          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: "all",
                width: "clamp(300px, 90vw, 380px)",
                background: "#fff",
                border: "1px solid #e8e4de",
                borderRadius: 12,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
                overflow: "hidden",
                animation: toast.exiting
                  ? "toastOut 0.35s cubic-bezier(0.4,0,1,1) forwards"
                  : "toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                cursor: "pointer",
              }}
              onClick={() => dismiss(toast.id)}
            >
              <div style={{ height: 3, background: c.bar }} />
              <div style={{ padding: "14px 16px 12px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                {toast.image ? (
                  <div style={{
                    width: 48, height: 48, borderRadius: 8, flexShrink: 0,
                    overflow: "hidden", border: "1px solid #f0ede8", background: "#faf9f7",
                  }}>
                    <img src={toast.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ) : (
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: c.bg, border: `1px solid ${c.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center", color: c.icon,
                  }}>
                    {ICONS[toast.type]}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    {toast.image && (
                      <span style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: 16, height: 16, borderRadius: 4, background: c.bg, color: c.icon,
                      }}>
                        {ICONS[toast.type]}
                      </span>
                    )}
                    <span style={{
                      fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700,
                      letterSpacing: "0.1em", textTransform: "uppercase", color: c.icon,
                    }}>
                      {toast.type === "success" ? "Başarılı" : toast.type === "error" ? "Hata" : "Bilgi"}
                    </span>
                  </div>
                  <p style={{
                    fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600,
                    color: "#111", margin: 0, lineHeight: 1.4,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {toast.message}
                  </p>
                  {toast.subtitle && (
                    <p style={{
                      fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#888",
                      margin: "3px 0 0", lineHeight: 1.4,
                    }}>
                      {toast.subtitle}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); dismiss(toast.id); }}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    padding: 4, color: "#ccc", display: "flex", flexShrink: 0,
                    borderRadius: 4, transition: "color 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#666")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#ccc")}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div style={{ height: 2, background: "#f5f2ee", margin: "0 16px 12px" }}>
                <div style={{
                  height: "100%", background: c.bar, borderRadius: 99,
                  animation: "toastProgress 3.2s linear forwards",
                }} />
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(24px) scale(0.96); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(32px); }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to   { width: 0%; }
        }
        @keyframes heartFloat {
          0%   { opacity: 1; transform: translate(0, 0) scale(1) rotate(0deg); }
          60%  { opacity: 0.8; }
          100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.4) rotate(20deg); }
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