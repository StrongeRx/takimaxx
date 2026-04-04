import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";

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

const Login = () => {
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();
  const location = useLocation();
  const registeredState = location.state as { registered?: boolean; email?: string; from?: string; tab?: string } | null;
  const redirectTo = registeredState?.from || "/hesabim";
  const redirectState = useMemo(
    () => registeredState?.tab ? { tab: registeredState.tab } : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (isLoggedIn) navigate(redirectTo, { replace: true, state: redirectState });
  }, [isLoggedIn, navigate, redirectTo, redirectState]);
  const [tab, setTab] = useState<"giris" | "unuttum">("giris");
  const [form, setForm] = useState({ email: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginError, setLoginError] = useState("");
  // "unuttum" tab state'i
  type ForgotState = "idle" | "not_found" | "found";
  const [forgotState, setForgotState] = useState<ForgotState>("idle");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = "E-posta zorunludur.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Geçerli bir e-posta giriniz.";
    if (!form.password) e.password = "Şifre zorunludur.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    const result = await login(form.email, form.password);
    if (!result.success) {
      setLoginError(result.error || "Giriş başarısız.");
      return;
    }
    navigate(redirectTo, { replace: true, state: redirectState });
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setErrors({ forgotEmail: "Geçerli bir e-posta giriniz." });
      return;
    }
    setErrors({});
    // localStorage'daki kayıtlı kullanıcıları kontrol et
    try {
      const users: { email: string }[] = JSON.parse(localStorage.getItem("takimax_users") || "[]");
      const exists = users.some(u => u.email.toLowerCase() === forgotEmail.toLowerCase());
      setForgotState(exists ? "found" : "not_found");
    } catch {
      setForgotState("not_found");
    }
  };

  return (
    <div className="header-offset" style={{ minHeight: "100vh", background: "#faf9f7", display: "flex", flexDirection: "column", paddingTop: 96 }}>
      <SEO
        title="Giriş Yap – Takimax"
        description="Takimax hesabınıza giriş yapın. Siparişlerinizi takip edin, favorilerinizi yönetin ve özel avantajlardan yararlanın."
        canonical="/giris"
        noIndex={true}
      />
      <AnnouncementBar />
      <Header />

      {/* ── Giriş Yap Banner ── */}
      <div style={{ position: "relative", width: "100%", lineHeight: 0 }}>
        <svg width="100%" viewBox="0 0 1200 220" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
          <defs>
            <clipPath id="loginBannerClip"><rect width="1200" height="220" /></clipPath>
          </defs>
          <g clipPath="url(#loginBannerClip)">
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
            Giriş Yap
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
            <span style={{ color: "rgba(255,255,255,0.72)" }}>Giriş Yap</span>
          </nav>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 20px" }}>
        <div style={{ width: "100%", maxWidth: 440, background: "#fff", border: "1px solid #eee", padding: "40px 36px" }}>

          {tab === "giris" && (
            <>
              {/* Kayıt başarı mesajı */}
              {registeredState?.registered && (
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <div>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: "#16a34a", marginBottom: 2 }}>Hesabınız oluşturuldu!</p>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#15803d" }}>
                      {registeredState.email} ile giriş yapabilirsiniz.
                    </p>
                  </div>
                </div>
              )}

              {/* Google */}
              <button onClick={() => alert("Google ile giriş (Demo)")}
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
                Google ile Giriş Yap
              </button>

              {/* Facebook */}
              <button onClick={() => alert("Facebook ile giriş (Demo)")}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "11px 0", border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 500, color: "#333", marginBottom: 20 }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#aaa")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#ddd")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook ile Giriş Yap
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, background: "#eee" }} />
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#bbb" }}>veya</span>
                <div style={{ flex: 1, height: 1, background: "#eee" }} />
              </div>

              {/* Genel giriş hatası */}
              {loginError && (
                <div style={{ background: "#fff5f5", border: "1px solid #fed7d7", padding: "10px 14px", marginBottom: 16, fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#e53e3e" }}>
                  {loginError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>E-posta</label>
                  <input type="email" value={form.email}
                    onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); setLoginError(""); }}
                    placeholder="ornek@email.com" style={getInputStyle(!!errors.email)}
                    onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")}
                    onBlur={e => (e.currentTarget.style.borderColor = errors.email ? "#e53e3e" : "#ddd")}
                  />
                  {errors.email && <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#e53e3e", marginTop: 4 }}>{errors.email}</p>}
                </div>

                <div style={{ marginBottom: 8 }}>
                  <label style={labelStyle}>Şifre</label>
                  <input type="password" value={form.password}
                    onChange={e => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: "" }); setLoginError(""); }}
                    placeholder="••••••••" style={getInputStyle(!!errors.password)}
                    onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")}
                    onBlur={e => (e.currentTarget.style.borderColor = errors.password ? "#e53e3e" : "#ddd")}
                  />
                  {errors.password && <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#e53e3e", marginTop: 4 }}>{errors.password}</p>}
                </div>

                <div style={{ textAlign: "right", marginBottom: 24 }}>
                  <button type="button" onClick={() => { setTab("unuttum"); setLoginError(""); setErrors({}); }}
                    style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#c9a96e", textDecoration: "underline" }}>
                    Şifremi Unuttum
                  </button>
                </div>

                <button type="submit"
                  style={{ width: "100%", padding: "13px 0", background: "#111", color: "#fff", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", transition: "background 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#c9a96e")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#111")}>
                  Giriş Yap
                </button>
              </form>

              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#888", textAlign: "center", marginTop: 24 }}>
                Hesabınız yok mu?{" "}
                <Link to="/kayit" style={{ color: "#c9a96e", textDecoration: "underline", fontWeight: 600 }}>Kayıt Ol</Link>
              </p>
            </>
          )}

          {tab === "unuttum" && (
            <>
              <button onClick={() => { setTab("giris"); setForgotState("idle"); setForgotEmail(""); setErrors({}); }}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#888", marginBottom: 20, padding: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                Geri Dön
              </button>

              {/* Açıklama */}
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#888", marginBottom: 24, lineHeight: 1.7 }}>
                Hesabınıza bağlı e-posta adresini girin.
              </p>

              {/* Form — idle veya not_found durumunda göster */}
              {forgotState !== "found" && (
                <form onSubmit={handleForgot} noValidate>
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>E-posta</label>
                    <input type="email" value={forgotEmail}
                      onChange={e => { setForgotEmail(e.target.value); setErrors({}); setForgotState("idle"); }}
                      placeholder="ornek@email.com" style={getInputStyle(!!errors.forgotEmail)}
                      onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")}
                      onBlur={e => (e.currentTarget.style.borderColor = errors.forgotEmail ? "#e53e3e" : "#ddd")}
                    />
                    {errors.forgotEmail && (
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#e53e3e", marginTop: 4 }}>{errors.forgotEmail}</p>
                    )}
                  </div>

                  {/* Hesap bulunamadı uyarısı */}
                  {forgotState === "not_found" && (
                    <div style={{ background: "#fff8f0", border: "1px solid #f6d68d", borderRadius: 4, padding: "12px 14px", marginBottom: 16, display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#7a5c1e", lineHeight: 1.6, margin: 0 }}>
                        Bu e-posta adresiyle kayıtlı hesap bulunamadı.{" "}
                        <a href="/kayit" style={{ color: "#c9a96e", fontWeight: 600 }}>Yeni hesap oluştur</a>
                      </p>
                    </div>
                  )}

                  <button type="submit"
                    style={{ width: "100%", padding: "13px 0", background: "#111", color: "#fff", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#c9a96e")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#111")}>
                    Hesabımı Bul
                  </button>
                </form>
              )}

              {/* Hesap bulundu — dürüst bilgi + iletişim seçenekleri */}
              {forgotState === "found" && (
                <div>
                  {/* Hesap bulundu bildirimi */}
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 4, padding: "12px 14px", marginBottom: 16, display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 1 }}><polyline points="20 6 9 17 4 12"/></svg>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#166534", lineHeight: 1.6, margin: 0 }}>
                      <strong>{forgotEmail}</strong> adresine kayıtlı hesabınızı bulduk.
                    </p>
                  </div>

                  {/* Dürüst açıklama */}
                  <div style={{ background: "#fefce8", border: "1px solid #fde68a", borderRadius: 4, padding: "12px 14px", marginBottom: 20 }}>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#713f12", lineHeight: 1.7, margin: 0 }}>
                      <strong>Otomatik şifre sıfırlama şu an aktif değil.</strong><br />
                      Şifrenizi sıfırlamak için aşağıdaki kanallardan bize ulaşın, size hemen yardımcı olacağız.
                    </p>
                  </div>

                  {/* İletişim seçenekleri */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <a
                      href={"https://wa.me/905XXXXXXXXX?text=" + encodeURIComponent("Merhaba, " + forgotEmail + " e-posta adresli hesabımın şifresini sıfırlamak istiyorum.")}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#25D366", borderRadius: 4, textDecoration: "none" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      <div>
                        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: "#fff", margin: 0 }}>WhatsApp ile Yaz</p>
                        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "rgba(255,255,255,0.85)", margin: 0 }}>Genellikle birkaç dakika içinde yanıt</p>
                      </div>
                    </a>

                    <a
                      href={"mailto:destek@takimax.com?subject=" + encodeURIComponent("Şifre Sıfırlama Talebi") + "&body=" + encodeURIComponent("Merhaba,\n\n" + forgotEmail + " adresli hesabımın şifresini sıfırlamak istiyorum.")}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", border: "1px solid #ddd", borderRadius: 4, textDecoration: "none", background: "#fff" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
                      <div>
                        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: "#111", margin: 0 }}>E-posta Gönder</p>
                        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#888", margin: 0 }}>destek@takimax.com</p>
                      </div>
                    </a>

                    <a href="/iletisim"
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", border: "1px solid #ddd", borderRadius: 4, textDecoration: "none", background: "#fff" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/></svg>
                      <div>
                        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 700, color: "#111", margin: 0 }}>İletişim Sayfası</p>
                        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#888", margin: 0 }}>Diğer destek kanalları</p>
                      </div>
                    </a>
                  </div>

                  <button onClick={() => { setForgotState("idle"); setForgotEmail(""); }}
                    style={{ marginTop: 20, background: "none", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "#888", textDecoration: "underline", padding: 0 }}>
                    Farklı bir e-posta dene
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;