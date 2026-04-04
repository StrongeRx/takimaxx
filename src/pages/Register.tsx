import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import SEO from "@/components/SEO";

/* ── Sabit stiller (component dışında, bir kez tanımlanır) ── */
const labelStyle: React.CSSProperties = {
  display: "block", fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 600,
  letterSpacing: "0.1em", color: "#555", marginBottom: 6, textTransform: "uppercase",
};

const getInputStyle = (hasError: boolean): React.CSSProperties => ({
  width: "100%", padding: "10px 14px",
  border: `1px solid ${hasError ? "#e53e3e" : "#ddd"}`,
  fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#111", outline: "none",
  background: "#fff", boxSizing: "border-box", transition: "border-color 0.2s",
});

/* ── Field componenti DIŞARIDA tanımlanmalı (focus kaybını önler) ── */
interface FieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder: string;
  error?: string;
  onChange: (id: string, value: string) => void;
}

const Field = ({ id, label, type, value, placeholder, error, onChange }: FieldProps) => (
  <div style={{ marginBottom: 16 }}>
    <label style={labelStyle}>{label}</label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      style={getInputStyle(!!error)}
      onChange={e => onChange(id, e.target.value)}
      onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")}
      onBlur={e => (e.currentTarget.style.borderColor = error ? "#e53e3e" : "#ddd")}
    />
    {error && (
      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#e53e3e", marginTop: 4 }}>
        {error}
      </p>
    )}
  </div>
);

/* ── Register sayfası ── */
const Register = () => {
  const navigate = useNavigate();
  const { isLoggedIn, register } = useAuth();

  useEffect(() => {
    if (isLoggedIn) navigate("/hesabim");
  }, [isLoggedIn, navigate]);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [registerError, setRegisterError] = useState("");
  const [consents, setConsents] = useState({ marketing: false, terms: false });

  const handleChange = (id: string, value: string) => {
    setForm(prev => ({ ...prev, [id]: value }));
    setErrors(prev => ({ ...prev, [id]: "" }));
    setRegisterError("");
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Ad Soyad zorunludur.";
    if (!form.email) e.email = "E-posta zorunludur.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Geçerli bir e-posta giriniz.";
    if (!form.password) e.password = "Şifre zorunludur.";
    else if (form.password.length < 6) e.password = "Şifre en az 6 karakter olmalıdır.";
    if (!form.confirmPassword) e.confirmPassword = "Şifre tekrarı zorunludur.";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Şifreler eşleşmiyor.";
    if (form.phone && !/^[0-9\s+-]{10,15}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Geçerli bir telefon numarası giriniz.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (!consents.terms) errs.terms = "Devam edebilmek için kabul etmeniz gerekiyor.";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    const result = await register(form.fullName.trim(), form.email, form.password, form.phone.trim() || undefined);
    if (!result.success) {
      setRegisterError(result.error || "Kayıt sırasında bir hata oluştu.");
      return;
    }
    navigate("/giris", { state: { registered: true, email: form.email } });
  };

  return (
    <div className="header-offset" style={{ minHeight: "100vh", background: "#faf9f7", display: "flex", flexDirection: "column", paddingTop: 96 }}>
      <SEO
        title="Üye Ol – Takimax"
        description="Takimax'e üye olun, ilk alışverişinizde özel indirimlerden yararlanın. Hızlı kayıt, güvenli alışveriş."
        canonical="/kayit"
        noIndex={true}
      />
      <AnnouncementBar />
      <Header />

      {/* ── Kayıt Ol Banner ── */}
      <div style={{ position: "relative", width: "100%", lineHeight: 0 }}>
        <svg width="100%" viewBox="0 0 1200 220" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
          <defs>
            <clipPath id="registerBannerClip"><rect width="1200" height="220" /></clipPath>
          </defs>
          <g clipPath="url(#registerBannerClip)">
            <rect width="1200" height="220" fill="#F5F0E8"/>
            <circle cx="-30" cy="110" r="160" fill="#E8DDD0" opacity="0.6"/>
            <circle cx="60" cy="200" r="90" fill="#DDD0BE" opacity="0.45"/>
            <circle cx="1230" cy="60" r="180" fill="#E2D6C5" opacity="0.55"/>
            <circle cx="1160" cy="185" r="100" fill="#D4C5AF" opacity="0.4"/>
            <circle cx="600" cy="110" r="280" fill="none" stroke="#C9B99A" strokeWidth="0.8" opacity="0.4"/>
            <circle cx="600" cy="110" r="240" fill="none" stroke="#C9B99A" strokeWidth="0.5" opacity="0.25"/>
            <path d="M80,40 C140,60 170,90 150,130 C130,170 90,185 110,200" fill="none" stroke="#A8917A" strokeWidth="1.2" opacity="0.6"/>
            <path d="M120,30 C185,55 215,88 195,132 C175,175 135,188 155,205" fill="none" stroke="#A8917A" strokeWidth="0.7" opacity="0.35"/>
            <circle cx="200" cy="70" r="22" fill="none" stroke="#B8A48C" strokeWidth="2.5" opacity="0.7"/>
            <circle cx="200" cy="70" r="14" fill="none" stroke="#B8A48C" strokeWidth="1" opacity="0.4"/>
            <circle cx="200" cy="70" r="5" fill="#C4A882" opacity="0.8"/>
            <circle cx="300" cy="45" r="7" fill="#C4A882" opacity="0.55"/>
            <circle cx="318" cy="50" r="5" fill="#B09070" opacity="0.45"/>
            <circle cx="334" cy="58" r="7" fill="#C4A882" opacity="0.55"/>
            <circle cx="350" cy="48" r="4" fill="#B09070" opacity="0.40"/>
            <circle cx="363" cy="55" r="6" fill="#C4A882" opacity="0.5"/>
            <circle cx="1050" cy="127" r="8" fill="#C4A882" opacity="0.75"/>
            <ellipse cx="1050" cy="127" rx="5" ry="5" fill="none" stroke="#E8DDD0" strokeWidth="1.5" opacity="0.6"/>
            <circle cx="820" cy="35" r="5" fill="#C4A882" opacity="0.5"/>
            <circle cx="835" cy="28" r="7" fill="#B8A48C" opacity="0.55"/>
            <circle cx="852" cy="35" r="5" fill="#C4A882" opacity="0.5"/>
            <circle cx="866" cy="26" r="6" fill="#B8A48C" opacity="0.5"/>
            <circle cx="880" cy="33" r="4" fill="#C4A882" opacity="0.45"/>
            <path d="M850,185 C880,175 910,180 940,172 C970,165 1000,170 1030,162" fill="none" stroke="#A8917A" strokeWidth="1.2" opacity="0.45"/>
            <line x1="30" y1="95" x2="130" y2="95" stroke="#B8A48C" strokeWidth="0.5" opacity="0.4"/>
            <line x1="30" y1="100" x2="110" y2="100" stroke="#B8A48C" strokeWidth="0.5" opacity="0.25"/>
            <line x1="1070" y1="95" x2="1180" y2="95" stroke="#B8A48C" strokeWidth="0.5" opacity="0.4"/>
            <line x1="1090" y1="100" x2="1180" y2="100" stroke="#B8A48C" strokeWidth="0.5" opacity="0.25"/>
            <polygon points="500,30 507,40 500,50 493,40" fill="#C4A882" opacity="0.45"/>
            <polygon points="700,165 706,175 700,185 694,175" fill="#C4A882" opacity="0.4"/>
            <polygon points="180,120 185,128 180,136 175,128" fill="#B8A48C" opacity="0.5"/>
            <rect x="350" y="60" width="500" height="100" fill="#3D3530" opacity="0.42" rx="2"/>
            <rect x="0" y="215" width="1200" height="5" fill="#C4A882" opacity="0.35"/>
          </g>
        </svg>
        {/* Tıklanabilir metin overlay */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: "clamp(4px, 1vw, 10px)",
        }}>
          <h1 style={{
            fontFamily: "Montserrat, Georgia, serif",
            fontSize: "clamp(18px, 3.2vw, 38px)",
            fontWeight: 700, color: "#fff",
            letterSpacing: "0.05em", margin: 0,
            textShadow: "0 1px 4px rgba(0,0,0,0.2)",
            lineHeight: 1.2,
          }}>
            Kayıt Ol
          </h1>
          <nav style={{
            display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 10px)",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "clamp(10px, 1.2vw, 13px)",
          }}>
            <Link to="/" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.72)")}
            >Ana Sayfa</Link>
            <span style={{ color: "rgba(255,255,255,0.45)" }}>/</span>
            <span style={{ color: "rgba(255,255,255,0.72)" }}>Kayıt Ol</span>
          </nav>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 20px" }}>
        <div style={{ width: "100%", maxWidth: 440, background: "#fff", border: "1px solid #eee", padding: "40px 36px" }}>

          {/* Google */}
          <button
            onClick={() => alert("Google ile kayıt (Demo)")}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "11px 0", border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 500, color: "#333", marginBottom: 12 }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#aaa")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#ddd")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google ile Kayıt Ol
          </button>

          {/* Facebook */}
          <button
            onClick={() => alert("Facebook ile kayıt (Demo)")}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "11px 0", border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 500, color: "#333", marginBottom: 20 }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#aaa")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#ddd")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook ile Kayıt Ol
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "#eee" }} />
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#bbb" }}>veya</span>
            <div style={{ flex: 1, height: 1, background: "#eee" }} />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {registerError && (
              <div style={{ background: "#fff5f5", border: "1px solid #fed7d7", padding: "10px 14px", marginBottom: 16, fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#e53e3e" }}>
                {registerError}
              </div>
            )}
            <Field id="fullName"        label="Ad Soyad"      type="text"     value={form.fullName}        placeholder="Adınız Soyadınız" error={errors.fullName}        onChange={handleChange} />
            <Field id="email"           label="E-posta"       type="email"    value={form.email}           placeholder="ornek@email.com"  error={errors.email}           onChange={handleChange} />
            <Field id="phone"           label="Telefon (İsteğe Bağlı)" type="tel" value={form.phone}      placeholder="05xx xxx xx xx"   error={errors.phone}           onChange={handleChange} />
            <Field id="password"        label="Şifre"         type="password" value={form.password}        placeholder="En az 6 karakter" error={errors.password}        onChange={handleChange} />
            <Field id="confirmPassword" label="Şifre Tekrar"  type="password" value={form.confirmPassword} placeholder="••••••••"         error={errors.confirmPassword} onChange={handleChange} />

            {/* Onay Kutuları */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "20px 0 4px" }}>

              {/* Pazarlama onayı */}
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <div
                  onClick={() => { setConsents(c => ({ ...c, marketing: !c.marketing })); setErrors(prev => ({ ...prev, marketing: "" })); }}
                  style={{
                    width: 18, height: 18, flexShrink: 0, marginTop: 1,
                    border: `2px solid ${consents.marketing ? "#111" : "#ccc"}`,
                    borderRadius: 4, background: consents.marketing ? "#111" : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s", cursor: "pointer",
                  }}
                >
                  {consents.marketing && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11.5, color: "#555", lineHeight: 1.55 }}>
                  Kampanya, duyuru ve bilgilendirmelerden e-posta ile haberdar olmak istiyorum.
                </span>
              </label>

              {/* Üyelik koşulları onayı */}
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <div
                  onClick={() => { setConsents(c => ({ ...c, terms: !c.terms })); setErrors(prev => ({ ...prev, terms: "" })); }}
                  style={{
                    width: 18, height: 18, flexShrink: 0, marginTop: 1,
                    border: `2px solid ${errors.terms ? "#e53e3e" : consents.terms ? "#111" : "#ccc"}`,
                    borderRadius: 4, background: consents.terms ? "#111" : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s", cursor: "pointer",
                  }}
                >
                  {consents.terms && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11.5, color: "#555", lineHeight: 1.55 }}>
                  <a href="/sozlesmeler" target="_blank" style={{ color: "#111", fontWeight: 600, textDecoration: "underline" }}>Üyelik koşullarını</a> ve{" "}
                  <a href="/gizlilik-politikasi" target="_blank" style={{ color: "#111", fontWeight: 600, textDecoration: "underline" }}>kişisel verilerimin korunmasını</a> kabul ediyorum.
                </span>
              </label>
              {errors.terms && (
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#e53e3e", margin: "-4px 0 0 28px" }}>⚠ {errors.terms}</p>
              )}
            </div>

            <button
              type="submit"
              style={{ width: "100%", padding: "13px 0", background: "#111", color: "#fff", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 8, transition: "background 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#c9a96e")}
              onMouseLeave={e => (e.currentTarget.style.background = "#111")}
            >
              Kayıt Ol
            </button>
          </form>

          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#888", textAlign: "center", marginTop: 24 }}>
            Zaten hesabınız var mı?{" "}
            <Link to="/giris" style={{ color: "#c9a96e", textDecoration: "underline", fontWeight: 600 }}>Giriş Yap</Link>
          </p>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;