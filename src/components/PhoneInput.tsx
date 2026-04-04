/**
 * PhoneInput — Uluslararası telefon kodu seçici
 * Bayraklar: flagcdn.com CDN üzerinden gerçek PNG görseller (emoji yok, %100 çalışır)
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Search, X } from "lucide-react";

export interface CountryCode {
  code: string;  // "+90"
  iso: string;   // "TR"
  name: string;  // "Türkiye"
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: "+90",  iso: "TR", name: "Türkiye" },
  { code: "+1",   iso: "US", name: "ABD" },
  { code: "+44",  iso: "GB", name: "İngiltere" },
  { code: "+49",  iso: "DE", name: "Almanya" },
  { code: "+33",  iso: "FR", name: "Fransa" },
  { code: "+31",  iso: "NL", name: "Hollanda" },
  { code: "+32",  iso: "BE", name: "Belçika" },
  { code: "+41",  iso: "CH", name: "İsviçre" },
  { code: "+43",  iso: "AT", name: "Avusturya" },
  { code: "+39",  iso: "IT", name: "İtalya" },
  { code: "+34",  iso: "ES", name: "İspanya" },
  { code: "+351", iso: "PT", name: "Portekiz" },
  { code: "+30",  iso: "GR", name: "Yunanistan" },
  { code: "+46",  iso: "SE", name: "İsveç" },
  { code: "+47",  iso: "NO", name: "Norveç" },
  { code: "+45",  iso: "DK", name: "Danimarka" },
  { code: "+358", iso: "FI", name: "Finlandiya" },
  { code: "+48",  iso: "PL", name: "Polonya" },
  { code: "+420", iso: "CZ", name: "Çekya" },
  { code: "+36",  iso: "HU", name: "Macaristan" },
  { code: "+40",  iso: "RO", name: "Romanya" },
  { code: "+359", iso: "BG", name: "Bulgaristan" },
  { code: "+7",   iso: "RU", name: "Rusya" },
  { code: "+380", iso: "UA", name: "Ukrayna" },
  { code: "+994", iso: "AZ", name: "Azerbaycan" },
  { code: "+995", iso: "GE", name: "Gürcistan" },
  { code: "+374", iso: "AM", name: "Ermenistan" },
  { code: "+966", iso: "SA", name: "Suudi Arabistan" },
  { code: "+971", iso: "AE", name: "BAE" },
  { code: "+974", iso: "QA", name: "Katar" },
  { code: "+973", iso: "BH", name: "Bahreyn" },
  { code: "+965", iso: "KW", name: "Kuveyt" },
  { code: "+968", iso: "OM", name: "Umman" },
  { code: "+962", iso: "JO", name: "Ürdün" },
  { code: "+961", iso: "LB", name: "Lübnan" },
  { code: "+972", iso: "IL", name: "İsrail" },
  { code: "+20",  iso: "EG", name: "Mısır" },
  { code: "+212", iso: "MA", name: "Fas" },
  { code: "+216", iso: "TN", name: "Tunus" },
  { code: "+213", iso: "DZ", name: "Cezayir" },
  { code: "+218", iso: "LY", name: "Libya" },
  { code: "+91",  iso: "IN", name: "Hindistan" },
  { code: "+86",  iso: "CN", name: "Çin" },
  { code: "+81",  iso: "JP", name: "Japonya" },
  { code: "+82",  iso: "KR", name: "Güney Kore" },
  { code: "+65",  iso: "SG", name: "Singapur" },
  { code: "+60",  iso: "MY", name: "Malezya" },
  { code: "+66",  iso: "TH", name: "Tayland" },
  { code: "+62",  iso: "ID", name: "Endonezya" },
  { code: "+63",  iso: "PH", name: "Filipinler" },
  { code: "+84",  iso: "VN", name: "Vietnam" },
  { code: "+61",  iso: "AU", name: "Avustralya" },
  { code: "+64",  iso: "NZ", name: "Yeni Zelanda" },
  { code: "+55",  iso: "BR", name: "Brezilya" },
  { code: "+52",  iso: "MX", name: "Meksika" },
  { code: "+54",  iso: "AR", name: "Arjantin" },
  { code: "+56",  iso: "CL", name: "Şili" },
  { code: "+57",  iso: "CO", name: "Kolombiya" },
  { code: "+1",   iso: "CA", name: "Kanada" },
];

/** flagcdn.com'dan gerçek PNG bayrak URL'i */
function getFlagUrl(iso: string): string {
  return `https://flagcdn.com/w40/${iso.toLowerCase()}.png`;
}

/** Bayrak resmi — hata olursa ISO kodu gösterir */
const FlagImg = ({ iso }: { iso: string }) => {
  const [err, setErr] = useState(false);

  if (err) {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 24, height: 16,
        background: "#e8e3dc", borderRadius: 2,
        fontSize: 9, color: "#888", fontWeight: 800,
        fontFamily: "monospace", flexShrink: 0, letterSpacing: 0,
      }}>
        {iso}
      </span>
    );
  }

  return (
    <img
      src={getFlagUrl(iso)}
      alt={iso}
      width={24}
      height={16}
      loading="lazy"
      onError={() => setErr(true)}
      style={{
        display: "block",
        width: 24,
        height: 16,
        objectFit: "cover",
        borderRadius: 2,
        flexShrink: 0,
        border: "1px solid rgba(0,0,0,0.08)",
        background: "#f0ece6",
      }}
    />
  );
};

interface PhoneInputProps {
  value: string;
  countryCode: CountryCode;
  onChange: (value: string) => void;
  onCountryChange: (country: CountryCode) => void;
  placeholder?: string;
  hasError?: boolean;
  inputClassName?: string;
  disabled?: boolean;
}

const PhoneInput = ({
  value,
  countryCode,
  onChange,
  onCountryChange,
  placeholder,
  hasError = false,
  inputClassName = "auth-input",
  disabled = false,
}: PhoneInputProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const filtered = COUNTRY_CODES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.includes(search) ||
    c.iso.toLowerCase().includes(search.toLowerCase())
  );

  // Dışarı tıklayınca kapat
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Escape ile kapat
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); setSearch(""); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // Açılınca arama inputuna odaklan
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 80);
  }, [open]);

  const select = useCallback((c: CountryCode) => {
    onCountryChange(c);
    setOpen(false);
    setSearch("");
    setTimeout(() => phoneRef.current?.focus(), 60);
  }, [onCountryChange]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Yalnızca rakam, boşluk ve tire
    const raw = e.target.value.replace(/[^\d\s\-]/g, "");
    onChange(raw);
  };

  const defaultPlaceholder =
    placeholder ?? (countryCode.iso === "TR" ? "5xx xxx xx xx" : "Numara giriniz");

  const borderColor = hasError ? "#e53e3e" : open ? "#c9a96e" : "#e8e3dc";

  return (
    <div ref={wrapRef} style={{ position: "relative", display: "flex" }}>

      {/* Ülke seçici */}
      <button
        type="button"
        onClick={() => { if (!disabled) setOpen(v => !v); }}
        disabled={disabled}
        aria-label="Ülke kodu seç"
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 10px",
          height: 50,
          background: open ? "#fdfaf5" : "#faf8f4",
          border: `1.5px solid ${borderColor}`,
          borderRight: "none",
          borderRadius: "8px 0 0 8px",
          cursor: disabled ? "not-allowed" : "pointer",
          flexShrink: 0,
          transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
          minWidth: 90,
          boxSizing: "border-box",
          boxShadow: open ? "0 0 0 3px rgba(201,169,110,0.10)" : "none",
          outline: "none",
        }}
      >
        <FlagImg iso={countryCode.iso} />
        <span style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          color: "#333",
          whiteSpace: "nowrap",
        }}>
          {countryCode.code}
        </span>
        <ChevronDown
          size={11}
          style={{
            color: "#bbb",
            transition: "transform 0.22s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        />
      </button>

      {/* Numara input */}
      <input
        ref={phoneRef}
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={handlePhoneChange}
        placeholder={defaultPlaceholder}
        disabled={disabled}
        className={`${inputClassName}${hasError ? " error" : ""}`}
        style={{
          borderRadius: "0 8px 8px 0",
          paddingLeft: 14,
          paddingRight: 14,
          flex: 1,
          boxSizing: "border-box",
          ...(hasError ? { borderColor: "#e53e3e", background: "#fff9f9" } : {}),
        }}
        autoComplete="tel-national"
      />

      {/* Dropdown listesi */}
      {open && (
        <div
          role="listbox"
          aria-label="Ülke seçin"
          style={{
            position: "absolute",
            top: 54,
            left: 0,
            zIndex: 1200,
            background: "#fff",
            border: "1.5px solid #e0dbd2",
            borderRadius: 10,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.06)",
            width: 275,
            overflow: "hidden",
            animation: "phoneDropIn 0.18s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          {/* Arama */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 12px",
            borderBottom: "1px solid #f0ece6",
            background: "#faf9f7",
          }}>
            <Search size={13} style={{ color: "#c9a96e", flexShrink: 0 }} />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Ülke adı veya kod..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 12,
                color: "#111",
                background: "transparent",
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", display: "flex", padding: 2 }}
                aria-label="Aramayı temizle"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Sonuç listesi */}
          <div style={{ maxHeight: 252, overflowY: "auto", overscrollBehavior: "contain" }}>
            {filtered.length === 0 ? (
              <p style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 12,
                color: "#bbb",
                padding: "16px",
                margin: 0,
                textAlign: "center",
              }}>
                Sonuç bulunamadı
              </p>
            ) : (
              filtered.map((c, idx) => {
                const isActive = c.iso === countryCode.iso && c.code === countryCode.code;
                return (
                  <button
                    key={`${c.iso}-${c.code}-${idx}`}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => select(c)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      padding: "8px 14px",
                      border: "none",
                      borderLeft: `3px solid ${isActive ? "#c9a96e" : "transparent"}`,
                      background: isActive ? "#fdf8f0" : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.1s",
                      outline: "none",
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#faf7f2"; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  >
                    <FlagImg iso={c.iso} />
                    <span style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: 12,
                      color: "#333",
                      flex: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {c.name}
                    </span>
                    <span style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      color: isActive ? "#c9a96e" : "#aaa",
                      flexShrink: 0,
                    }}>
                      {c.code}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes phoneDropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default PhoneInput;