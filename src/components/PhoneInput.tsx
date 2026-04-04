import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Search, X } from "lucide-react";

export interface CountryCode {
  code: string;     // "+90"
  iso: string;      // "TR"
  name: string;     // "Türkiye"
  flag: string;     // "🇹🇷"
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: "+90",  iso: "TR", name: "Türkiye",        flag: "🇹🇷" },
  { code: "+1",   iso: "US", name: "ABD",             flag: "🇺🇸" },
  { code: "+44",  iso: "GB", name: "İngiltere",       flag: "🇬🇧" },
  { code: "+49",  iso: "DE", name: "Almanya",         flag: "🇩🇪" },
  { code: "+33",  iso: "FR", name: "Fransa",          flag: "🇫🇷" },
  { code: "+31",  iso: "NL", name: "Hollanda",        flag: "🇳🇱" },
  { code: "+32",  iso: "BE", name: "Belçika",         flag: "🇧🇪" },
  { code: "+41",  iso: "CH", name: "İsviçre",         flag: "🇨🇭" },
  { code: "+43",  iso: "AT", name: "Avusturya",       flag: "🇦🇹" },
  { code: "+39",  iso: "IT", name: "İtalya",          flag: "🇮🇹" },
  { code: "+34",  iso: "ES", name: "İspanya",         flag: "🇪🇸" },
  { code: "+351", iso: "PT", name: "Portekiz",        flag: "🇵🇹" },
  { code: "+30",  iso: "GR", name: "Yunanistan",      flag: "🇬🇷" },
  { code: "+46",  iso: "SE", name: "İsveç",           flag: "🇸🇪" },
  { code: "+47",  iso: "NO", name: "Norveç",          flag: "🇳🇴" },
  { code: "+45",  iso: "DK", name: "Danimarka",       flag: "🇩🇰" },
  { code: "+358", iso: "FI", name: "Finlandiya",      flag: "🇫🇮" },
  { code: "+48",  iso: "PL", name: "Polonya",         flag: "🇵🇱" },
  { code: "+420", iso: "CZ", name: "Çekya",           flag: "🇨🇿" },
  { code: "+36",  iso: "HU", name: "Macaristan",      flag: "🇭🇺" },
  { code: "+40",  iso: "RO", name: "Romanya",         flag: "🇷🇴" },
  { code: "+359", iso: "BG", name: "Bulgaristan",     flag: "🇧🇬" },
  { code: "+7",   iso: "RU", name: "Rusya",           flag: "🇷🇺" },
  { code: "+380", iso: "UA", name: "Ukrayna",         flag: "🇺🇦" },
  { code: "+994", iso: "AZ", name: "Azerbaycan",      flag: "🇦🇿" },
  { code: "+995", iso: "GE", name: "Gürcistan",       flag: "🇬🇪" },
  { code: "+374", iso: "AM", name: "Ermenistan",      flag: "🇦🇲" },
  { code: "+966", iso: "SA", name: "Suudi Arabistan", flag: "🇸🇦" },
  { code: "+971", iso: "AE", name: "BAE",             flag: "🇦🇪" },
  { code: "+974", iso: "QA", name: "Katar",           flag: "🇶🇦" },
  { code: "+973", iso: "BH", name: "Bahreyn",         flag: "🇧🇭" },
  { code: "+965", iso: "KW", name: "Kuveyt",          flag: "🇰🇼" },
  { code: "+968", iso: "OM", name: "Umman",           flag: "🇴🇲" },
  { code: "+962", iso: "JO", name: "Ürdün",           flag: "🇯🇴" },
  { code: "+961", iso: "LB", name: "Lübnan",          flag: "🇱🇧" },
  { code: "+972", iso: "IL", name: "İsrail",          flag: "🇮🇱" },
  { code: "+20",  iso: "EG", name: "Mısır",           flag: "🇪🇬" },
  { code: "+212", iso: "MA", name: "Fas",             flag: "🇲🇦" },
  { code: "+216", iso: "TN", name: "Tunus",           flag: "🇹🇳" },
  { code: "+213", iso: "DZ", name: "Cezayir",         flag: "🇩🇿" },
  { code: "+218", iso: "LY", name: "Libya",           flag: "🇱🇾" },
  { code: "+91",  iso: "IN", name: "Hindistan",       flag: "🇮🇳" },
  { code: "+86",  iso: "CN", name: "Çin",             flag: "🇨🇳" },
  { code: "+81",  iso: "JP", name: "Japonya",         flag: "🇯🇵" },
  { code: "+82",  iso: "KR", name: "Güney Kore",      flag: "🇰🇷" },
  { code: "+65",  iso: "SG", name: "Singapur",        flag: "🇸🇬" },
  { code: "+60",  iso: "MY", name: "Malezya",         flag: "🇲🇾" },
  { code: "+66",  iso: "TH", name: "Tayland",         flag: "🇹🇭" },
  { code: "+62",  iso: "ID", name: "Endonezya",       flag: "🇮🇩" },
  { code: "+63",  iso: "PH", name: "Filipinler",      flag: "🇵🇭" },
  { code: "+84",  iso: "VN", name: "Vietnam",         flag: "🇻🇳" },
  { code: "+61",  iso: "AU", name: "Avustralya",      flag: "🇦🇺" },
  { code: "+64",  iso: "NZ", name: "Yeni Zelanda",    flag: "🇳🇿" },
  { code: "+55",  iso: "BR", name: "Brezilya",        flag: "🇧🇷" },
  { code: "+52",  iso: "MX", name: "Meksika",         flag: "🇲🇽" },
  { code: "+54",  iso: "AR", name: "Arjantin",        flag: "🇦🇷" },
  { code: "+56",  iso: "CL", name: "Şili",            flag: "🇨🇱" },
  { code: "+57",  iso: "CO", name: "Kolombiya",       flag: "🇨🇴" },
  { code: "+1",   iso: "CA", name: "Kanada",          flag: "🇨🇦" },
];

interface PhoneInputProps {
  value: string;           // Sadece numara (ülke kodu hariç)
  countryCode: CountryCode;
  onChange: (value: string) => void;
  onCountryChange: (country: CountryCode) => void;
  placeholder?: string;
  hasError?: boolean;
  className?: string;
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
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = COUNTRY_CODES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.includes(search) ||
    c.iso.toLowerCase().includes(search.toLowerCase())
  );

  // Dışarı tıklayınca kapat
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Açılınca arama inputuna odaklan
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 80);
  }, [open]);

  const select = useCallback((c: CountryCode) => {
    onCountryChange(c);
    setOpen(false);
    setSearch("");
  }, [onCountryChange]);

  // Telefon numarası girilirken sadece rakam ve +, -, boşluk kabul et
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d\s\-]/g, "");
    onChange(raw);
  };

  const dropdownTop = 54; // input yüksekliği

  return (
    <div ref={wrapRef} style={{ position: "relative", display: "flex", gap: 0 }}>
      {/* Ülke seçici butonu */}
      <button
        type="button"
        onClick={() => { setOpen(v => !v); }}
        disabled={disabled}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 12px",
          height: 50,
          background: open ? "#fdfaf5" : "#faf8f4",
          border: `1.5px solid ${hasError ? "#e53e3e" : open ? "#c9a96e" : "#e8e3dc"}`,
          borderRight: "none",
          borderRadius: "8px 0 0 8px",
          cursor: disabled ? "not-allowed" : "pointer",
          flexShrink: 0,
          transition: "all 0.2s",
          minWidth: 86,
          boxSizing: "border-box",
        }}
      >
        <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{countryCode.flag}</span>
        <span style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          color: "#444",
          letterSpacing: "0.02em",
        }}>{countryCode.code}</span>
        <ChevronDown
          size={12}
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
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={handlePhoneChange}
        placeholder={placeholder ?? (countryCode.iso === "TR" ? "5xx xxx xx xx" : "Telefon numarası")}
        disabled={disabled}
        className={`${inputClassName} ${hasError ? "error" : ""}`}
        style={{
          borderRadius: "0 8px 8px 0",
          paddingLeft: 14,
          paddingRight: 14,
          flex: 1,
          // Sol ikon yoktur artık (ülke butonu var)
          ...(hasError ? { borderColor: "#e53e3e", background: "#fff9f9" } : {}),
        }}
        autoComplete="tel-national"
      />

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: dropdownTop,
            left: 0,
            zIndex: 999,
            background: "#fff",
            border: "1.5px solid #e8e3dc",
            borderRadius: 10,
            boxShadow: "0 12px 40px rgba(0,0,0,0.13)",
            width: 260,
            overflow: "hidden",
            animation: "phoneDropIn 0.18s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* Arama */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 12px",
            borderBottom: "1px solid #f0ece6",
          }}>
            <Search size={13} style={{ color: "#c9a96e", flexShrink: 0 }} />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Ülke ara..."
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
                style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", display: "flex", padding: 0 }}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Liste */}
          <div
            ref={listRef}
            style={{ maxHeight: 240, overflowY: "auto", overscrollBehavior: "contain" }}
          >
            {filtered.length === 0 ? (
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: "#bbb", padding: "14px 14px", margin: 0, textAlign: "center" }}>
                Sonuç bulunamadı
              </p>
            ) : (
              filtered.map(c => {
                const isActive = c.iso === countryCode.iso && c.code === countryCode.code;
                return (
                  <button
                    key={`${c.iso}-${c.code}`}
                    type="button"
                    onClick={() => select(c)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      padding: "9px 14px",
                      border: "none",
                      background: isActive ? "#fdf8f0" : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.12s",
                      borderLeft: isActive ? "3px solid #c9a96e" : "3px solid transparent",
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#faf7f2"; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  >
                    <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{c.flag}</span>
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
                      fontWeight: 600,
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
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PhoneInput;