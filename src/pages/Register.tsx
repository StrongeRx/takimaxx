import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import SEO from "@/components/SEO";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Check, Sparkles } from "lucide-react";

/* ─── Şifre Güç Hesaplama ─── */
const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
  if (!password) return { score: 0, label: "", color: "#e8e3dc" };
  let score = 0;
  if (password.length >= 6)  score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: "Çok Zayıf", color: "#e53e3e" };
  if (score === 2) return { score, label: "Zayıf", color: "#f6921e" };
  if (score === 3) return { score, label: "Orta", color: "#ecc94b" };
  if (score === 4) return { score, label: "Güçlü", color: "#48bb78" };
  return { score, label: "Çok Güçlü", color: "#38a169" };
};

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // 2 adımlı form

  const strength = getPasswordStrength(form.password);

  const handleChange = (id: string, value: string) => {
    setForm(prev => ({ ...prev, [id]: value }));
    setErrors(prev => ({ ...prev, [id]: "" }));
    setRegisterError("");
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Ad Soyad zorunludur.";
    if (!form.email) e.email = "E-posta zorunludur.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Geçerli bir e-posta giriniz.";
    if (form.phone && !/^[0-9\s+-]{10,15}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Geçerli telefon: 05xx xxx xx xx";
    return e;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.password) e.password = "Şifre zorunludur.";
    else if (form.password.length < 6) e.password = "Şifre en az 6 karakter olmalıdır.";
    if (!form.confirmPassword) e.confirmPassword = "Şifre tekrarı zorunludur.";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Şifreler eşleşmiyor.";
    return e;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateStep1();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateStep2();
    if (!consents.terms) errs.terms = "Devam edebilmek için kabul etmeniz gerekiyor.";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);
    const result = await register(form.fullName.trim(), form.email, form.password, form.phone.trim() || undefined);
    setIsLoading(false);
    if (!result.success) { setRegisterError(result.error || "Kayıt sırasında bir hata oluştu."); return; }
    navigate("/giris", { state: { registered: true, email: form.email } });
  };

  const perks = [
    "İlk alışverişte %10 indirim",
    "Ücretsiz kargo fırsatları",
    "Yeni koleksiyon önizlemesi",
    "Özel kampanya bildirimleri",
  ];

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "14px 44px 14px 46px",
    border: `1.5px solid ${hasError ? "#e53e3e" : "#e8e3dc"}`,
    background: hasError ? "#fff9f9" : "#fdfcfa",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 13,
    color: "#111",
    outline: "none",
    borderRadius: 8,
    boxSizing: "border-box" as const,
    transition: "all 0.25s",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#faf9f7", display: "flex", flexDirection: "column", paddingTop: 96 }}>
      <SEO
        title="Üye Ol – Takimax"
        description="Takimax'e üye olun, özel indirimlerden yararlanın."
        canonical="/kayit"
        noIndex={true}
      />
      <AnnouncementBar />
      <Header />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500;600;700;800&display=swap');

        .reg-input {
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
        .reg-input:focus { border-color: #c9a96e; background: #fff; box-shadow: 0 0 0 4px rgba(201,169,110,0.08); }
        .reg-input::placeholder { color: #c8c2b8; }
        .reg-input.error { border-color: #e53e3e; background: #fff9f9; }
        .reg-input.no-left-icon { padding-left: 16px; }

        .reg-btn {
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
        }
        .reg-btn:hover:not(:disabled) { background: #c9a96e; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(201,169,110,0.35); }
        .reg-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .reg-btn.secondary { background: #fff; color: #111; border: 1.5px solid #e8e3dc; }
        .reg-btn.secondary:hover { background: #fdfaf5; border-color: #c9a96e; transform: translateY(-1px); box-shadow: none; }

        .perk-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          animation: fadeSlideIn 0.6s ease both;
        }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes formIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .form-animate { animation: formIn 0.4s ease both; }

        .step-dot {
          width: 28px; height: 28px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px; font-weight: 700;
          transition: all 0.3s;
        }
        .step-dot.active { background: #111; color: #fff; }
        .step-dot.done { background: #c9a96e; color: #fff; }
        .step-dot.inactive { background: #f0ece6; color: #bbb; }

        .show-pwd-btn {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #bbb; display: flex; padding: 4px; transition: color 0.2s;
        }
        .show-pwd-btn:hover { color: #c9a96e; }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 900px) {
          .reg-left { display: none !important; }
          .reg-wrapper { grid-template-columns: 1fr !important; min-height: auto !important; margin: 20px !important; }
        }
      `}</style>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px 80px" }}>
        <div
          className="reg-wrapper"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            width: "100%",
            maxWidth: 900,
            minHeight: 600,
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          {/* ─── SOL PANEL ─── */}
          <div
            className="reg-left"
            style={{
              background: "linear-gradient(150deg, #0e1a14 0%, #162b1e 50%, #0e1a14 100%)",
              padding: "52px 44px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: -80, right: -80, width: 260, height: 260, borderRadius: "50%", border: "1px solid rgba(201,169,110,0.1)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 44 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1.5px solid rgba(201,169,110,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Sparkles size={14} style={{ color: "#c9a96e" }} />
                </div>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c9a96e" }}>Takimax</span>
              </div>

              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 36, fontWeight: 600, color: "#fff", lineHeight: 1.15, marginBottom: 12 }}>
                Ailemize<br />
                <em style={{ fontStyle: "italic", color: "#c9a96e" }}>Katılın</em>
              </h2>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: 40 }}>
                Üye olun, özel ayrıcalıkların keyfini çıkarın.
              </p>

              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c9a96e", marginBottom: 12 }}>
                Üye Avantajları
              </p>
              <div>
                {perks.map((p, i) => (
                  <div key={i} className="perk-item" style={{ animationDelay: `${i * 0.08}s` }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", border: "1.5px solid rgba(201,169,110,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={11} style={{ color: "#c9a96e" }} />
                    </div>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 40 }}>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>
                Zaten üye misiniz?
              </p>
              <Link to="/giris" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 8, fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a96e", textDecoration: "none", borderBottom: "1px solid rgba(201,169,110,0.35)", paddingBottom: 2 }}>
                Giriş Yap <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* ─── SAĞ PANEL ─── */}
          <div style={{ background: "#fff", padding: "52px 44px", display: "flex", flexDirection: "column", justifyContent: "center" }}>

            {/* Step indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 36 }}>
              <div className={`step-dot ${step === 1 ? "active" : "done"}`}>
                {step > 1 ? <Check size={13} /> : "1"}
              </div>
              <div style={{ flex: 1, height: 1.5, background: step > 1 ? "#c9a96e" : "#f0ece6", transition: "background 0.4s", margin: "0 8px" }} />
              <div className={`step-dot ${step === 2 ? "active" : "inactive"}`}>2</div>
              <div style={{ flex: 1, height: 1.5, background: "#f0ece6", margin: "0 8px" }} />
              <div className="step-dot inactive" style={{ fontSize: 9 }}>✓</div>
            </div>

            {registerError && (
              <div style={{ background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: "#e53e3e", margin: 0 }}>⚠ {registerError}</p>
              </div>
            )}

            {/* ADIM 1 */}
            {step === 1 && (
              <form className="form-animate" onSubmit={handleNext} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a96e", marginBottom: 4 }}>
                  Adım 1 — Kişisel Bilgiler
                </p>

                {/* Ad Soyad */}
                <div>
                  <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#888", textTransform: "uppercase", marginBottom: 8 }}>Ad Soyad</label>
                  <div style={{ position: "relative" }}>
                    <User size={15} style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: "#c9a96e", pointerEvents: "none" }} />
                    <input type="text" value={form.fullName} onChange={e => handleChange("fullName", e.target.value)} placeholder="Adınız Soyadınız" className={`reg-input ${errors.fullName ? "error" : ""}`} autoComplete="name" />
                  </div>
                  {errors.fullName && <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: "#e53e3e", marginTop: 5 }}>{errors.fullName}</p>}
                </div>

                {/* E-posta */}
                <div>
                  <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#888", textTransform: "uppercase", marginBottom: 8 }}>E-posta</label>
                  <div style={{ position: "relative" }}>
                    <Mail size={15} style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: "#c9a96e", pointerEvents: "none" }} />
                    <input type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} placeholder="ornek@email.com" className={`reg-input ${errors.email ? "error" : ""}`} autoComplete="email" />
                  </div>
                  {errors.email && <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: "#e53e3e", marginTop: 5 }}>{errors.email}</p>}
                </div>

                {/* Telefon */}
                <div>
                  <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#888", textTransform: "uppercase", marginBottom: 8 }}>
                    Telefon <span style={{ color: "#ccc", fontWeight: 400 }}>(isteğe bağlı)</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <Phone size={15} style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: "#c9a96e", pointerEvents: "none" }} />
                    <input type="tel" value={form.phone} onChange={e => handleChange("phone", e.target.value)} placeholder="05xx xxx xx xx" className={`reg-input ${errors.phone ? "error" : ""}`} autoComplete="tel" />
                  </div>
                  {errors.phone && <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: "#e53e3e", marginTop: 5 }}>{errors.phone}</p>}
                </div>

                <button type="submit" className="reg-btn" style={{ marginTop: 4 }}>
                  <span>Devam Et</span><ArrowRight size={14} />
                </button>
              </form>
            )}

            {/* ADIM 2 */}
            {step === 2 && (
              <form className="form-animate" onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a96e", marginBottom: 4 }}>
                  Adım 2 — Şifre Oluşturun
                </p>

                {/* Şifre */}
                <div>
                  <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#888", textTransform: "uppercase", marginBottom: 8 }}>Şifre</label>
                  <div style={{ position: "relative" }}>
                    <Lock size={15} style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: "#c9a96e", pointerEvents: "none" }} />
                    <input type={showPassword ? "text" : "password"} value={form.password} onChange={e => handleChange("password", e.target.value)} placeholder="En az 6 karakter" className={`reg-input ${errors.password ? "error" : ""}`} autoComplete="new-password" />
                    <button type="button" className="show-pwd-btn" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: "#e53e3e", marginTop: 5 }}>{errors.password}</p>}

                  {/* Şifre güç göstergesi */}
                  {form.password && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= strength.score ? strength.color : "#f0ece6", transition: "background 0.3s" }} />
                        ))}
                      </div>
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: strength.color, fontWeight: 600, letterSpacing: "0.06em" }}>
                        {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Şifre Tekrar */}
                <div>
                  <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#888", textTransform: "uppercase", marginBottom: 8 }}>Şifre Tekrar</label>
                  <div style={{ position: "relative" }}>
                    <Lock size={15} style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: "#c9a96e", pointerEvents: "none" }} />
                    <input type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={e => handleChange("confirmPassword", e.target.value)} placeholder="••••••••" className={`reg-input ${errors.confirmPassword ? "error" : ""}`} autoComplete="new-password" />
                    <button type="button" className="show-pwd-btn" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: "#e53e3e", marginTop: 5 }}>{errors.confirmPassword}</p>}
                </div>

                {/* Onay kutuları */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { key: "marketing", label: "Kampanya ve bilgilendirmelerden e-posta ile haberdar olmak istiyorum." },
                    { key: "terms", label: null },
                  ].map((item) => (
                    <label key={item.key} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                      <div
                        onClick={() => { setConsents(c => ({ ...c, [item.key]: !c[item.key as keyof typeof c] })); setErrors(prev => ({ ...prev, [item.key]: "" })); }}
                        style={{ width: 18, height: 18, flexShrink: 0, marginTop: 1, border: `2px solid ${errors[item.key] ? "#e53e3e" : consents[item.key as keyof typeof consents] ? "#111" : "#ddd"}`, borderRadius: 4, background: consents[item.key as keyof typeof consents] ? "#111" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", cursor: "pointer" }}
                      >
                        {consents[item.key as keyof typeof consents] && <Check size={11} style={{ color: "#fff" }} />}
                      </div>
                      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11.5, color: "#666", lineHeight: 1.55 }}>
                        {item.key === "terms" ? (
                          <><a href="/sozlesmeler" target="_blank" style={{ color: "#111", fontWeight: 600, textDecoration: "underline" }}>Üyelik koşullarını</a> ve <a href="/gizlilik-politikasi" target="_blank" style={{ color: "#111", fontWeight: 600, textDecoration: "underline" }}>gizlilik politikasını</a> kabul ediyorum.</>
                        ) : item.label}
                      </span>
                    </label>
                  ))}
                  {errors.terms && <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: "#e53e3e", margin: "-4px 0 0 28px" }}>⚠ {errors.terms}</p>}
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button type="button" className="reg-btn secondary" onClick={() => setStep(1)} style={{ flex: "0 0 auto", width: "auto", padding: "15px 20px" }}>
                    ← Geri
                  </button>
                  <button type="submit" className="reg-btn" disabled={isLoading} style={{ flex: 1 }}>
                    {isLoading ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                        Kaydediliyor...
                      </span>
                    ) : (
                      <><span>Kayıt Ol</span><ArrowRight size={14} /></>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;