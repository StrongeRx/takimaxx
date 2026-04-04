import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

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
  const [form, setForm] = useState({ email: registeredState?.email || "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    const result = await login(form.email, form.password);
    setIsLoading(false);
    if (!result.success) { setLoginError(result.error || "Giriş başarısız."); return; }
    navigate(redirectTo, { replace: true, state: redirectState });
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setErrors({ forgotEmail: "Geçerli bir e-posta giriniz." }); return;
    }
    setErrors({});
    try {
      const users: { email: string }[] = JSON.parse(localStorage.getItem("takimax_users") || "[]");
      const exists = users.some(u => u.email.toLowerCase() === forgotEmail.toLowerCase());
      setForgotState(exists ? "found" : "not_found");
    } catch { setForgotState("not_found"); }
  };

  const features = [
    { icon: "✦", text: "Siparişlerinizi kolayca takip edin" },
    { icon: "✦", text: "Favorilerinizi kaydedin" },
    { icon: "✦", text: "Özel indirim ve kampanyalardan haberdar olun" },
    { icon: "✦", text: "Hızlı ve güvenli ödeme" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#faf9f7", display: "flex", flexDirection: "column", paddingTop: 96 }}>
      <SEO
        title="Giriş Yap – Takimax"
        description="Takimax hesabınıza giriş yapın."
        canonical="/giris"
        noIndex={true}
      />
      <AnnouncementBar />
      <Header />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500;600;700;800&display=swap');

        .auth-input {
          width: 100%;
          padding: 14px 44px 14px 46px;
          border: 1.5px solid #e8e3dc;
          background: #fdfcfa;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          color: #111;
          outline: none;
          border-radius: 8px;
          box-sizing: border-box;
          transition: all 0.25s;
        }
        .auth-input:focus {
          border-color: #c9a96e;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(201,169,110,0.08);
        }
        .auth-input::placeholder { color: #c8c2b8; }
        .auth-input.error { border-color: #e53e3e; background: #fff9f9; }

        .auth-btn-primary {
          width: 100%;
          padding: 15px 0;
          background: #111;
          color: #fff;
          border: none;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          border-radius: 8px;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
        }
        .auth-btn-primary:hover:not(:disabled) {
          background: #c9a96e;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(201,169,110,0.35);
        }
        .auth-btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .left-panel-feature {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          animation: fadeSlideIn 0.6s ease both;
        }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        @keyframes formIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .form-animate { animation: formIn 0.45s ease both; }

        .show-pwd-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #bbb;
          display: flex;
          padding: 4px;
          transition: color 0.2s;
        }
        .show-pwd-btn:hover { color: #c9a96e; }

        .tab-switch {
          display: flex;
          gap: 4px;
          background: #f5f0e8;
          border-radius: 8px;
          padding: 4px;
          margin-bottom: 28px;
        }
        .tab-btn {
          flex: 1;
          padding: 9px 0;
          border: none;
          background: none;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #aaa;
          border-radius: 6px;
          transition: all 0.25s;
        }
        .tab-btn.active {
          background: #fff;
          color: #111;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        @media (max-width: 900px) {
          .auth-left { display: none !important; }
          .auth-right { border-radius: 0 !important; }
          .auth-wrapper { grid-template-columns: 1fr !important; min-height: auto !important; margin: 20px !important; }
        }
      `}</style>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px 80px" }}>
        <div
          className="auth-wrapper"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            width: "100%",
            maxWidth: 900,
            minHeight: 580,
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          {/* ─── SOL PANEL ─── */}
          <div
            className="auth-left"
            style={{
              background: "linear-gradient(150deg, #1a1208 0%, #2d1f0a 40%, #1a1208 100%)",
              padding: "52px 44px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Dekoratif daireler */}
            <div style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%", border: "1px solid rgba(201,169,110,0.12)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", border: "1px solid rgba(201,169,110,0.08)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -60, left: -60, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

            {/* Logo alanı */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 44 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1.5px solid rgba(201,169,110,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Sparkles size={14} style={{ color: "#c9a96e" }} />
                </div>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c9a96e" }}>Takimax</span>
              </div>

              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 38, fontWeight: 600, color: "#fff", lineHeight: 1.15, marginBottom: 12, letterSpacing: "-0.01em" }}>
                Hesabınıza<br />
                <em style={{ fontStyle: "italic", color: "#c9a96e" }}>Hoş Geldiniz</em>
              </h2>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 44, fontWeight: 400 }}>
                Takimax ailesinin bir parçası olarak özel ayrıcalıklardan yararlanın.
              </p>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {features.map((f, i) => (
                  <div key={i} className="left-panel-feature" style={{ animationDelay: `${i * 0.1}s` }}>
                    <span style={{ color: "#c9a96e", fontSize: 10, flexShrink: 0 }}>{f.icon}</span>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.65)", fontWeight: 400 }}>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alt kısım */}
            <div style={{ marginTop: 40 }}>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>
                Henüz üye değil misiniz?
              </p>
              <Link
                to="/kayit"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8, marginTop: 8,
                  fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  color: "#c9a96e", textDecoration: "none",
                  borderBottom: "1px solid rgba(201,169,110,0.35)",
                  paddingBottom: 2,
                  transition: "color 0.2s",
                }}
              >
                Kayıt Ol <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* ─── SAĞ PANEL ─── */}
          <div
            className="auth-right"
            style={{
              background: "#fff",
              padding: "52px 44px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* Tab switch */}
            <div className="tab-switch">
              <button className={`tab-btn ${tab === "giris" ? "active" : ""}`} onClick={() => { setTab("giris"); setErrors({}); setLoginError(""); }}>
                Giriş Yap
              </button>
              <button className={`tab-btn ${tab === "unuttum" ? "active" : ""}`} onClick={() => { setTab("unuttum"); setErrors({}); setLoginError(""); }}>
                Şifremi Unuttum
              </button>
            </div>

            {/* ── GİRİŞ FORMU ── */}
            {tab === "giris" && (
              <div className="form-animate">
                {/* Kayıt başarı mesajı */}
                {registeredState?.registered && (
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: "#16a34a", margin: 0 }}>
                      Hesabınız oluşturuldu! Giriş yapabilirsiniz.
                    </p>
                  </div>
                )}

                {loginError && (
                  <div style={{ background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: "#e53e3e", margin: 0 }}>⚠ {loginError}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* E-posta */}
                  <div>
                    <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#888", textTransform: "uppercase", marginBottom: 8 }}>
                      E-posta
                    </label>
                    <div style={{ position: "relative" }}>
                      <Mail size={15} style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: "#c9a96e", pointerEvents: "none" }} />
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); setLoginError(""); }}
                        placeholder="ornek@email.com"
                        className={`auth-input ${errors.email ? "error" : ""}`}
                        autoComplete="email"
                      />
                    </div>
                    {errors.email && <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: "#e53e3e", marginTop: 5 }}>{errors.email}</p>}
                  </div>

                  {/* Şifre */}
                  <div>
                    <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#888", textTransform: "uppercase", marginBottom: 8 }}>
                      Şifre
                    </label>
                    <div style={{ position: "relative" }}>
                      <Lock size={15} style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: "#c9a96e", pointerEvents: "none" }} />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={e => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: "" }); setLoginError(""); }}
                        placeholder="••••••••"
                        className={`auth-input ${errors.password ? "error" : ""}`}
                        autoComplete="current-password"
                      />
                      <button type="button" className="show-pwd-btn" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {errors.password && <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: "#e53e3e", marginTop: 5 }}>{errors.password}</p>}
                  </div>

                  <button type="submit" className="auth-btn-primary" disabled={isLoading}>
                    {isLoading ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                        Giriş Yapılıyor...
                      </span>
                    ) : (
                      <><span>Giriş Yap</span><ArrowRight size={14} /></>
                    )}
                  </button>
                </form>

                <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
                  <div style={{ flex: 1, height: 1, background: "#f0ece6" }} />
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: "#ccc", letterSpacing: "0.1em" }}>VEYA</span>
                  <div style={{ flex: 1, height: 1, background: "#f0ece6" }} />
                </div>

                {/* Google */}
                <button
                  onClick={() => alert("Google ile giriş yakında aktif olacak.")}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "12px 0", border: "1.5px solid #e8e3dc", background: "#fff", cursor: "pointer", fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 500, color: "#444", borderRadius: 8, transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#c9a96e"; e.currentTarget.style.background = "#fdfaf5"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8e3dc"; e.currentTarget.style.background = "#fff"; }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google ile Giriş Yap
                </button>

                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {/* ── ŞİFREMİ UNUTTUM ── */}
            {tab === "unuttum" && (
              <div className="form-animate">
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: "#888", marginBottom: 24, lineHeight: 1.7 }}>
                  Kayıtlı e-posta adresinizi girin, size yardımcı olalım.
                </p>

                {forgotState !== "found" && (
                  <form onSubmit={handleForgot} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#888", textTransform: "uppercase", marginBottom: 8 }}>E-posta</label>
                      <div style={{ position: "relative" }}>
                        <Mail size={15} style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: "#c9a96e", pointerEvents: "none" }} />
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={e => { setForgotEmail(e.target.value); setErrors({}); setForgotState("idle"); }}
                          placeholder="ornek@email.com"
                          className={`auth-input ${errors.forgotEmail ? "error" : ""}`}
                        />
                      </div>
                      {errors.forgotEmail && <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: "#e53e3e", marginTop: 5 }}>{errors.forgotEmail}</p>}
                    </div>

                    {forgotState === "not_found" && (
                      <div style={{ background: "#fff8f0", border: "1px solid #f6d68d", borderRadius: 8, padding: "12px 14px" }}>
                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: "#7a5c1e", margin: 0 }}>
                          Bu e-posta ile kayıtlı hesap bulunamadı.{" "}
                          <Link to="/kayit" style={{ color: "#c9a96e", fontWeight: 600 }}>Kayıt ol →</Link>
                        </p>
                      </div>
                    )}

                    <button type="submit" className="auth-btn-primary">
                      <span>Hesabımı Bul</span><ArrowRight size={14} />
                    </button>
                  </form>
                )}

                {forgotState === "found" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "12px 14px", marginBottom: 4 }}>
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: "#166534", margin: 0 }}>
                        <strong>{forgotEmail}</strong> adresine bağlı hesabınızı bulduk.
                      </p>
                    </div>
                    <div style={{ background: "#fefce8", border: "1px solid #fde68a", borderRadius: 8, padding: "12px 14px", marginBottom: 8 }}>
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: "#713f12", margin: 0, lineHeight: 1.65 }}>
                        <strong>Otomatik şifre sıfırlama aktif değil.</strong><br/>
                        Aşağıdan bize ulaşın, hemen yardımcı olalım.
                      </p>
                    </div>
                    <a href={`https://wa.me/905XXXXXXXXX?text=${encodeURIComponent("Merhaba, " + forgotEmail + " hesabımın şifresini sıfırlamak istiyorum.")}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", background: "#25D366", borderRadius: 8, textDecoration: "none" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      <div>
                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 700, color: "#fff", margin: 0 }}>WhatsApp ile Yaz</p>
                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.85)", margin: 0 }}>Birkaç dakika içinde yanıt</p>
                      </div>
                    </a>
                    <a href={`mailto:destek@takimax.com?subject=${encodeURIComponent("Şifre Sıfırlama")}&body=${encodeURIComponent("Merhaba,\n\n" + forgotEmail + " hesabımın şifresini sıfırlamak istiyorum.")}`}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", border: "1.5px solid #e8e3dc", borderRadius: 8, textDecoration: "none", background: "#fff" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
                      <div>
                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 700, color: "#111", margin: 0 }}>E-posta Gönder</p>
                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: "#888", margin: 0 }}>destek@takimax.com</p>
                      </div>
                    </a>
                    <button onClick={() => { setForgotState("idle"); setForgotEmail(""); }}
                      style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: "#bbb", textDecoration: "underline", padding: 0, marginTop: 4 }}>
                      Farklı e-posta dene
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;