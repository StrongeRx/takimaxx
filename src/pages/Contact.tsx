import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const CONTACT_INFO = {
  phone: "+90 (212) 000 00 00",
  email: "destek@takimax.com",
  address: "İstanbul, Türkiye",
  workingHours: "Pzt – Cum: 09:00 – 18:00",
};

const Contact = () => {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (field: string, value: string) => {
    setForm(p => ({ ...p, [field]: value }));
    setErrors(p => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Ad zorunludur.";
    if (!form.lastName.trim())  e.lastName  = "Soyad zorunludur.";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Geçerli e-posta giriniz.";
    if (form.phone && !/^[0-9\s+\-()\s]{7,15}$/.test(form.phone)) e.phone = "Geçerli telefon giriniz.";
    if (!form.message.trim()) e.message = "Mesaj zorunludur.";
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitting(true);
    setTimeout(() => {
      // Mesajı admin store'a kaydet
      // TODO: Yeni admin paneli API'sine mesaj gönderilecek
      setSubmitting(false);
      setSent(true);
    }, 1000);
  };

  const inputStyle = (hasErr: boolean): React.CSSProperties => ({
    width: "100%", padding: "11px 14px",
    fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#111",
    border: `1px solid ${hasErr ? "#dc2626" : "#e8e4df"}`,
    outline: "none", background: "#faf9f7",
    boxSizing: "border-box", transition: "border-color 0.2s",
  });

  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "Montserrat, sans-serif", fontSize: 10,
    fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
    color: "#888", marginBottom: 7,
  };

  const ErrMsg = ({ msg }: { msg?: string }) => msg
    ? <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#dc2626", marginTop: 5 }}>{msg}</p>
    : null;

  return (
    <div className="header-offset" style={{ minHeight: "100vh", background: "#faf9f7", display: "flex", flexDirection: "column", paddingTop: 96 }}>
      <SEO
        title="İletişim – Takimax | Bize Ulaşın"
        description="Takimax müşteri hizmetleriyle iletişime geçin."
        canonical="/iletisim"
      />
      <AnnouncementBar />
      <Header />

      <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "18px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#aaa" }}>
            <Link to="/" style={{ color: "#aaa", textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "#111"}
              onMouseLeave={e => e.currentTarget.style.color = "#aaa"}>Anasayfa</Link>
            <ChevronRight size={10} style={{ color: "#ddd" }} />
            <span style={{ color: "#111" }}>İletişim</span>
          </nav>
        </div>
      </div>

      <main style={{ flex: 1, maxWidth: 1100, margin: "0 auto", width: "100%", padding: "56px 24px 80px", boxSizing: "border-box" }}>

        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: "#999", marginBottom: 14 }}>
            Bize ulaşın
          </p>
          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(34px, 5vw, 52px)", fontWeight: 400, color: "#111", margin: "0 0 20px", letterSpacing: "-0.01em" }}>
            İletişim
          </h1>
          <div style={{ width: 40, height: 1, background: "#c9a96e", margin: "0 auto" }} />
        </div>

        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 40, alignItems: "start" }}>

          <aside>
            <div style={{ background: "#111", padding: "36px 32px", marginBottom: 2 }}>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#c9a96e", marginBottom: 20 }}>
                Takimax
              </p>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.85 }}>
                Sorularınız, önerileriniz veya siparişlerinizle ilgili her konuda bize ulaşabilirsiniz. En kısa sürede geri döneriz.
              </p>
            </div>

            <div style={{ border: "1px solid #ece9e4", background: "#fff" }}>
              <a href={`tel:${CONTACT_INFO.phone}`}
                style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "20px 24px", borderBottom: "1px solid #f0ede8", textDecoration: "none", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#faf9f7"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}
              >
                <div style={{ width: 36, height: 36, background: "#f5f2ee", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Phone size={15} style={{ color: "#c9a96e" }} />
                </div>
                <div>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", marginBottom: 5 }}>Telefon</p>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600, color: "#111", margin: 0 }}>{CONTACT_INFO.phone}</p>
                </div>
              </a>

              <a href={`mailto:${CONTACT_INFO.email}`}
                style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "20px 24px", borderBottom: "1px solid #f0ede8", textDecoration: "none", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#faf9f7"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}
              >
                <div style={{ width: 36, height: 36, background: "#f5f2ee", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Mail size={15} style={{ color: "#c9a96e" }} />
                </div>
                <div>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", marginBottom: 5 }}>E-posta</p>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600, color: "#111", margin: 0 }}>{CONTACT_INFO.email}</p>
                </div>
              </a>

              <a href={`https://maps.google.com/?q=${encodeURIComponent(CONTACT_INFO.address)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "20px 24px", borderBottom: "1px solid #f0ede8", textDecoration: "none", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#faf9f7"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}
              >
                <div style={{ width: 36, height: 36, background: "#f5f2ee", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MapPin size={15} style={{ color: "#c9a96e" }} />
                </div>
                <div>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", marginBottom: 5 }}>Adres</p>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600, color: "#111", margin: 0 }}>{CONTACT_INFO.address}</p>
                </div>
              </a>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "20px 24px" }}>
                <div style={{ width: 36, height: 36, background: "#f5f2ee", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Clock size={15} style={{ color: "#c9a96e" }} />
                </div>
                <div>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", marginBottom: 5 }}>Çalışma Saatleri</p>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, color: "#111", margin: 0 }}>{CONTACT_INFO.workingHours}</p>
                </div>
              </div>
            </div>
          </aside>

          <div style={{ background: "#fff", border: "1px solid #ece9e4", padding: "40px 36px" }}>
            {!sent ? (
              <>
                <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16, fontWeight: 700, color: "#111", margin: "0 0 28px" }}>
                  Mesaj Gönderin
                </h2>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
                    <div>
                      <label style={labelStyle}>Ad <span style={{ color: "#dc2626" }}>*</span></label>
                      <input type="text" value={form.firstName} placeholder="Adınız"
                        onChange={e => set("firstName", e.target.value)}
                        style={inputStyle(!!errors.firstName)}
                        onFocus={e => e.currentTarget.style.borderColor = "#111"}
                        onBlur={e => e.currentTarget.style.borderColor = errors.firstName ? "#dc2626" : "#e8e4df"}
                      />
                      <ErrMsg msg={errors.firstName} />
                    </div>
                    <div>
                      <label style={labelStyle}>Soyad <span style={{ color: "#dc2626" }}>*</span></label>
                      <input type="text" value={form.lastName} placeholder="Soyadınız"
                        onChange={e => set("lastName", e.target.value)}
                        style={inputStyle(!!errors.lastName)}
                        onFocus={e => e.currentTarget.style.borderColor = "#111"}
                        onBlur={e => e.currentTarget.style.borderColor = errors.lastName ? "#dc2626" : "#e8e4df"}
                      />
                      <ErrMsg msg={errors.lastName} />
                    </div>
                  </div>

                  <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
                    <div>
                      <label style={labelStyle}>E-posta <span style={{ color: "#dc2626" }}>*</span></label>
                      <input type="email" value={form.email} placeholder="ornek@mail.com"
                        onChange={e => set("email", e.target.value)}
                        style={inputStyle(!!errors.email)}
                        onFocus={e => e.currentTarget.style.borderColor = "#111"}
                        onBlur={e => e.currentTarget.style.borderColor = errors.email ? "#dc2626" : "#e8e4df"}
                      />
                      <ErrMsg msg={errors.email} />
                    </div>
                    <div>
                      <label style={labelStyle}>Telefon</label>
                      <input type="tel" value={form.phone} placeholder="+90 5__ ___ __ __"
                        onChange={e => set("phone", e.target.value)}
                        style={inputStyle(!!errors.phone)}
                        onFocus={e => e.currentTarget.style.borderColor = "#111"}
                        onBlur={e => e.currentTarget.style.borderColor = errors.phone ? "#dc2626" : "#e8e4df"}
                      />
                      <ErrMsg msg={errors.phone} />
                    </div>
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <label style={labelStyle}>Konu</label>
                    <input type="text" value={form.subject} placeholder="Mesajınızın konusu"
                      onChange={e => set("subject", e.target.value)}
                      style={inputStyle(false)}
                      onFocus={e => e.currentTarget.style.borderColor = "#111"}
                      onBlur={e => e.currentTarget.style.borderColor = "#e8e4df"}
                    />
                  </div>

                  <div style={{ marginBottom: 28 }}>
                    <label style={labelStyle}>Mesaj <span style={{ color: "#dc2626" }}>*</span></label>
                    <textarea value={form.message} rows={5}
                      placeholder="Mesajınızı buraya yazın..."
                      onChange={e => set("message", e.target.value)}
                      style={{ ...inputStyle(!!errors.message), resize: "vertical" }}
                      onFocus={e => e.currentTarget.style.borderColor = "#111"}
                      onBlur={e => e.currentTarget.style.borderColor = errors.message ? "#dc2626" : "#e8e4df"}
                    />
                    <ErrMsg msg={errors.message} />
                  </div>

                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, color: "#aaa", marginBottom: 20 }}>
                    <span style={{ color: "#dc2626" }}>*</span> ile işaretli alanlar zorunludur.
                  </p>

                  <button type="submit" disabled={submitting}
                    style={{
                      width: "100%", padding: "14px 0",
                      background: submitting ? "#555" : "#111",
                      color: "#fff", border: "none", cursor: submitting ? "not-allowed" : "pointer",
                      fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700,
                      letterSpacing: "0.2em", textTransform: "uppercase",
                      transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    }}
                    onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = "#c9a96e"; }}
                    onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = "#111"; }}
                  >
                    {submitting
                      ? <><span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Gönderiliyor...</>
                      : "Gönder"
                    }
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ width: 64, height: 64, background: "#f0fdf4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 400, color: "#111", margin: "0 0 12px" }}>
                  Mesajınız İletildi
                </h2>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "#888", lineHeight: 1.8, margin: "0 0 32px" }}>
                  En kısa sürede sizinle iletişime geçeceğiz.<br />Bize ulaştığınız için teşekkür ederiz.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" }); }}
                  style={{ padding: "11px 28px", background: "#111", color: "#fff", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#c9a96e"}
                  onMouseLeave={e => e.currentTarget.style.background = "#111"}
                >
                  Yeni Mesaj
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 860px) { .contact-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 480px) { .form-row { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
};

export default Contact;