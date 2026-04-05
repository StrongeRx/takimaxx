import React from "react";

type AlertType = "error" | "success" | "warn";

interface AlertMsgProps {
  type: AlertType;
  title: string;
  message: string;
  style?: React.CSSProperties;
  dark?: boolean; // footer gibi koyu arka plan için
}

const STRIPE_COLOR: Record<AlertType, string> = {
  error:   "#e53e3e",
  success: "#c9a96e",
  warn:    "#d69e2e",
};

const TITLE_COLOR: Record<AlertType, string> = {
  error:   "#7a1f1f",
  success: "#3a2e10",
  warn:    "#5f370e",
};

const SUB_COLOR: Record<AlertType, string> = {
  error:   "#a03030",
  success: "#6b5520",
  warn:    "#8a5a0f",
};

const BG: Record<AlertType, string> = {
  error:   "#fff8f8",
  success: "#fdfbf5",
  warn:    "#fffdf5",
};

const BORDER: Record<AlertType, string> = {
  error:   "#f5d5d5",
  success: "#eddfc0",
  warn:    "#f5e8a0",
};

// Koyu arka plan (footer) versiyonu
const DARK_STRIPE: Record<AlertType, string> = {
  error:   "#e53e3e",
  success: "#4ade80",
  warn:    "#f6c90e",
};

const DARK_TITLE: Record<AlertType, string> = {
  error:   "#ffb3b3",
  success: "#bbf7d0",
  warn:    "#fde68a",
};

const DARK_SUB: Record<AlertType, string> = {
  error:   "rgba(255,179,179,0.7)",
  success: "rgba(187,247,208,0.7)",
  warn:    "rgba(253,230,138,0.7)",
};

const DARK_BG: Record<AlertType, string> = {
  error:   "rgba(229,62,62,0.08)",
  success: "rgba(74,222,128,0.07)",
  warn:    "rgba(246,201,14,0.07)",
};

const DARK_BORDER: Record<AlertType, string> = {
  error:   "rgba(229,62,62,0.25)",
  success: "rgba(74,222,128,0.2)",
  warn:    "rgba(246,201,14,0.2)",
};

const AlertMsg = ({ type, title, message, style, dark = false }: AlertMsgProps) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      padding: "11px 14px",
      borderRadius: 7,
      background: dark ? DARK_BG[type] : BG[type],
      border: `0.5px solid ${dark ? DARK_BORDER[type] : BORDER[type]}`,
      boxShadow: dark ? "none" : "0 2px 10px rgba(0,0,0,0.04)",
      marginTop: 8,
      animation: "tmNotifPop 0.28s cubic-bezier(0.16,1,0.3,1)",
      ...style,
    }}
  >
    {/* Sol şerit */}
    <div style={{
      width: 3,
      borderRadius: 3,
      flexShrink: 0,
      alignSelf: "stretch",
      minHeight: 24,
      background: dark ? DARK_STRIPE[type] : STRIPE_COLOR[type],
    }} />

    {/* İçerik */}
    <div>
      <p style={{
        fontFamily: "Montserrat, sans-serif",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.04em",
        color: dark ? DARK_TITLE[type] : TITLE_COLOR[type],
        margin: "0 0 2px",
        textTransform: "uppercase",
      }}>
        {title}
      </p>
      <p style={{
        fontFamily: "Montserrat, sans-serif",
        fontSize: 11.5,
        fontWeight: 400,
        color: dark ? DARK_SUB[type] : SUB_COLOR[type],
        margin: 0,
        lineHeight: 1.5,
      }}>
        {message}
      </p>
    </div>
  </div>
);

/* Küçük form altı hata — tek satır için */
export const FieldError = ({ msg }: { msg?: string }) => {
  if (!msg) return null;
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 9,
      padding: "8px 12px",
      borderRadius: 6,
      background: "#fff8f8",
      border: "0.5px solid #f5d5d5",
      boxShadow: "0 1px 6px rgba(0,0,0,0.03)",
      marginTop: 6,
      animation: "tmNotifPop 0.25s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ width: 2, borderRadius: 2, flexShrink: 0, alignSelf: "stretch", minHeight: 18, background: "#e53e3e" }} />
      <p style={{
        fontFamily: "Montserrat, sans-serif",
        fontSize: 11,
        fontWeight: 500,
        color: "#a03030",
        margin: 0,
        lineHeight: 1.5,
      }}>
        {msg}
      </p>
    </div>
  );
};

export default AlertMsg;