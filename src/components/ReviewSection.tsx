import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Lock, User, ThumbsUp, ChevronDown, ChevronUp, X, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

/* ─── Tipler ─── */
interface Review {
  id: string;
  author: string;
  authorInitial: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
  verified: boolean;
}

interface ReviewSectionProps {
  productId: string | number;
  productName?: string;
}

/* ─── Örnek yorumlar (gerçek veritabanı olmadığından) ─── */
const DEMO_REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Ayşe K.",
    authorInitial: "A",
    rating: 5,
    date: "15 Şubat 2026",
    comment: "Ürün fotoğraftakinden çok daha güzel! Işıltısı harika, kalitesi mükemmel. Anneme hediye ettim, çok beğendi. Kesinlikle tavsiye ederim.",
    helpful: 12,
    verified: true,
  },
  {
    id: "r2",
    author: "Fatma D.",
    authorInitial: "F",
    rating: 4,
    date: "3 Şubat 2026",
    comment: "Genel olarak memnunum, kalite fiyat oranı çok iyi. Kargo biraz geç geldi ama ürün sağlam paketlenmişti.",
    helpful: 7,
    verified: true,
  },
  {
    id: "r3",
    author: "Zeynep A.",
    authorInitial: "Z",
    rating: 5,
    date: "22 Ocak 2026",
    comment: "Tam istediğim gibi. Gümüş rengi çok şık, her kıyafetle uyuyor. Üçüncü kez sipariş veriyorum bu markadan.",
    helpful: 19,
    verified: false,
  },
];

/* ─── Yıldız Komponenti ─── */
const StarRow = ({
  value,
  onChange,
  size = 20,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readonly?: boolean;
}) => {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = readonly ? i <= value : i <= (hover || value);
        return (
          <Star
            key={i}
            size={size}
            style={{
              color: filled ? "#f5a623" : "#ddd",
              fill: filled ? "#f5a623" : "none",
              cursor: readonly ? "default" : "pointer",
              transition: "transform 0.12s, color 0.12s",
              transform: !readonly && hover === i ? "scale(1.18)" : "scale(1)",
            }}
            onMouseEnter={() => !readonly && setHover(i)}
            onMouseLeave={() => !readonly && setHover(0)}
            onClick={() => !readonly && onChange?.(i)}
          />
        );
      })}
    </div>
  );
};

/* ─── Giriş Zorunlu Modal ─── */
const LoginRequiredModal = ({
  onClose,
  onLogin,
  onRegister,
}: {
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
}) => {
  /* ESC ile kapat */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(3px)",
          zIndex: 900,
          animation: "fadeIn 0.2s ease",
        }}
      />

      {/* Modal kutusu */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 901,
          background: "#fff",
          width: "min(440px, 92vw)",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
          animation: "modalSlideIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Altın üst şerit */}
        <div style={{ height: 3, background: "linear-gradient(90deg, #c9a96e, #e8cc9a, #c9a96e)" }} />

        {/* Kapat butonu */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#aaa",
            display: "flex",
            padding: 4,
            borderRadius: "50%",
            transition: "color 0.2s, background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#111";
            e.currentTarget.style.background = "#f5f5f5";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#aaa";
            e.currentTarget.style.background = "none";
          }}
        >
          <X size={18} />
        </button>

        {/* İçerik */}
        <div style={{ padding: "36px 36px 32px" }}>
          {/* İkon */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #fdf8f0, #f5ead8)",
              border: "1.5px solid #e8d5b0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 22,
            }}
          >
            <Lock size={26} style={{ color: "#c9a96e" }} />
          </div>

          <h3
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 26,
              fontWeight: 600,
              color: "#111",
              margin: "0 0 10px",
              lineHeight: 1.2,
            }}
          >
            Yorum Yapın
          </h3>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 14,
              color: "#666",
              lineHeight: 1.7,
              margin: "0 0 28px",
            }}
          >
            Yorum yapabilmek ve puan verebilmek için{" "}
            <strong style={{ color: "#111" }}>üye girişi</strong> yapmanız
            gerekmektedir.
          </p>

          {/* Yıldız önizleme — dekoratif */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "12px 16px",
              background: "#faf7f2",
              borderRadius: 6,
              marginBottom: 28,
              border: "1px solid #f0ead8",
            }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={16}
                style={{ color: "#e0d5c0", fill: "none" }}
              />
            ))}
            <span
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                color: "#bbb",
                marginLeft: 4,
              }}
            >
              Puan vermek için giriş yapın
            </span>
          </div>

          {/* Butonlar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={onLogin}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                width: "100%",
                padding: "14px",
                background: "#111",
                color: "#fff",
                border: "none",
                borderRadius: 2,
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#c9a96e")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#111")
              }
            >
              <LogIn size={16} />
              Giriş Yap
            </button>

            <button
              onClick={onRegister}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                width: "100%",
                padding: "14px",
                background: "transparent",
                color: "#111",
                border: "1.5px solid #ddd",
                borderRadius: 2,
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#c9a96e";
                e.currentTarget.style.color = "#c9a96e";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#ddd";
                e.currentTarget.style.color = "#111";
              }}
            >
              <UserPlus size={16} />
              Ücretsiz Kayıt Ol
            </button>
          </div>

          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 11,
              color: "#bbb",
              textAlign: "center",
              marginTop: 18,
              lineHeight: 1.6,
            }}
          >
            Kayıt olarak{" "}
            <span style={{ color: "#c9a96e" }}>Kullanım Koşulları</span>'nı
            kabul etmiş olursunuz.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translate(-50%, -46%) scale(0.94); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </>
  );
};

/* ─── Tek Yorum Kartı ─── */
const ReviewCard = ({ review }: { review: Review }) => {
  const [helpful, setHelpful] = useState(review.helpful);
  const [voted, setVoted] = useState(false);

  return (
    <div
      style={{
        padding: "22px 0",
        borderBottom: "1px solid #f0ece6",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 10,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        {/* Sol: avatar + isim */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #c9a96e, #e8cc9a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Montserrat, sans-serif",
              fontSize: 17,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {review.authorInitial}
          </div>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginBottom: 3,
              }}
            >
              <span
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#111",
                }}
              >
                {review.author}
              </span>
              {review.verified && (
                <span
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#2e7d32",
                    background: "#f1f8f1",
                    border: "1px solid #c8e6c9",
                    borderRadius: 3,
                    padding: "2px 6px",
                  }}
                >
                  ✓ Doğrulanmış Alışveriş
                </span>
              )}
            </div>
            <StarRow value={review.rating} readonly size={13} />
          </div>
        </div>

        {/* Sağ: tarih */}
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 11,
            color: "#bbb",
            flexShrink: 0,
          }}
        >
          {review.date}
        </span>
      </div>

      {/* Yorum metni */}
      <p
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: 13.5,
          color: "#444",
          lineHeight: 1.75,
          margin: "10px 0 14px",
        }}
      >
        {review.comment}
      </p>

      {/* Faydalı mı? */}
      <button
        onClick={() => {
          if (!voted) {
            setHelpful((v) => v + 1);
            setVoted(true);
          }
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: `1px solid ${voted ? "#c9a96e" : "#e8e2d9"}`,
          borderRadius: 3,
          padding: "5px 12px",
          cursor: voted ? "default" : "pointer",
          fontFamily: "Montserrat, sans-serif",
          fontSize: 11,
          color: voted ? "#c9a96e" : "#888",
          transition: "border-color 0.2s, color 0.2s",
        }}
        onMouseEnter={(e) => {
          if (!voted) {
            e.currentTarget.style.borderColor = "#c9a96e";
            e.currentTarget.style.color = "#c9a96e";
          }
        }}
        onMouseLeave={(e) => {
          if (!voted) {
            e.currentTarget.style.borderColor = "#e8e2d9";
            e.currentTarget.style.color = "#888";
          }
        }}
      >
        <ThumbsUp size={12} />
        Faydalı ({helpful})
      </button>
    </div>
  );
};

/* ─── ANA ReviewSection ─── */
const ReviewSection = ({ productId, productName }: ReviewSectionProps) => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState<Review[]>(DEMO_REVIEWS);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);

  /* Form state */
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [ratingError, setRatingError] = useState(false);
  const [commentError, setCommentError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* Ortalama puan */
  const avg =
    reviews.reduce((s, r) => s + r.rating, 0) / reviews.length || 0;
  const dist = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => r.rating === s).length,
  }));

  /* Yorum butonu tıklandı */
  const handleWriteClick = () => {
    if (!isLoggedIn) {
      setShowModal(true);
    } else {
      setShowForm((v) => !v);
    }
  };

  /* Yıldız tıklandı — giriş yoksa modal */
  const handleStarClick = (v: number) => {
    if (!isLoggedIn) {
      setShowModal(true);
    } else {
      setRating(v);
      setShowForm(true);
      setRatingError(false);
    }
  };

  /* Formu gönder */
  const handleSubmit = () => {
    let hasErr = false;
    if (rating === 0) { setRatingError(true); hasErr = true; }
    if (comment.trim().length < 10) { setCommentError(true); hasErr = true; }
    if (hasErr) return;

    const newReview: Review = {
      id: `r_${Date.now()}`,
      author: user!.name,
      authorInitial: user!.name.charAt(0).toUpperCase(),
      rating,
      date: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
      comment: comment.trim(),
      helpful: 0,
      verified: false,
    };

    setReviews((prev) => [newReview, ...prev]);
    setRating(0);
    setComment("");
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const visibleReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <section style={{ maxWidth: 860, margin: "0 auto" }}>
      {/* ── Başlık ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 32,
          paddingBottom: 20,
          borderBottom: "2px solid #f0ece6",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 28,
              fontWeight: 600,
              color: "#111",
              margin: "0 0 4px",
            }}
          >
            Değerlendirmeler
          </h2>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 12,
              color: "#aaa",
              margin: 0,
            }}
          >
            {reviews.length} müşteri değerlendirmesi
          </p>
        </div>

        {/* Yorum yaz butonu */}
        <button
          onClick={handleWriteClick}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 24px",
            background: isLoggedIn ? "#111" : "transparent",
            color: isLoggedIn ? "#fff" : "#111",
            border: `1.5px solid ${isLoggedIn ? "#111" : "#ddd"}`,
            borderRadius: 2,
            cursor: "pointer",
            fontFamily: "Montserrat, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#c9a96e";
            e.currentTarget.style.borderColor = "#c9a96e";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isLoggedIn ? "#111" : "transparent";
            e.currentTarget.style.borderColor = isLoggedIn ? "#111" : "#ddd";
            e.currentTarget.style.color = isLoggedIn ? "#fff" : "#111";
          }}
        >
          {!isLoggedIn && <Lock size={13} />}
          {isLoggedIn && showForm ? "İptal" : "Yorum Yaz"}
        </button>
      </div>

      {/* ── Başarı mesajı ── */}
      {submitted && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 18px",
            background: "#f0faf0",
            border: "1px solid #c3e6cb",
            borderRadius: 4,
            marginBottom: 24,
            fontFamily: "Montserrat, sans-serif",
            fontSize: 13,
            color: "#2e7d32",
            animation: "fadeIn 0.3s ease",
          }}
        >
          ✓ Yorumunuz başarıyla eklendi! Teşekkür ederiz.
        </div>
      )}

      {/* ── Özet + Dağılım ── */}
      <div
        style={{
          display: "flex",
          gap: 40,
          alignItems: "flex-start",
          marginBottom: 32,
          flexWrap: "wrap",
        }}
      >
        {/* Ortalama */}
        <div style={{ textAlign: "center", minWidth: 100 }}>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 52,
              fontWeight: 700,
              color: "#111",
              lineHeight: 1,
              margin: "0 0 8px",
            }}
          >
            {avg.toFixed(1)}
          </p>
          <StarRow value={Math.round(avg)} readonly size={16} />
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 11,
              color: "#aaa",
              marginTop: 6,
            }}
          >
            {reviews.length} yorum
          </p>
        </div>

        {/* Dağılım barları */}
        <div style={{ flex: 1, minWidth: 180 }}>
          {dist.map((d) => {
            const pct = reviews.length ? (d.count / reviews.length) * 100 : 0;
            return (
              <div
                key={d.star}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 11,
                    color: "#555",
                    width: 18,
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  {d.star}
                </span>
                <Star size={11} style={{ color: "#f5a623", fill: "#f5a623", flexShrink: 0 }} />
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    background: "#f0ece6",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #c9a96e, #e8cc9a)",
                      borderRadius: 3,
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 11,
                    color: "#aaa",
                    width: 18,
                    flexShrink: 0,
                  }}
                >
                  {d.count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Giriş yapmamış kullanıcı için davet kutusu */}
        {!isLoggedIn && (
          <div
            style={{
              flex: 1,
              minWidth: 200,
              padding: "18px 20px",
              background: "linear-gradient(135deg, #fdf8f0, #faf3e8)",
              border: "1px solid #ead9b8",
              borderRadius: 6,
            }}
          >
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: "#c9a96e",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                margin: "0 0 6px",
              }}
            >
              Deneyiminizi paylaşın
            </p>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                color: "#888",
                lineHeight: 1.6,
                margin: "0 0 14px",
              }}
            >
              Bu ürünü satın aldınız mı? Yorum yaparak diğer alışverişçilere yardımcı olun.
            </p>
            {/* Tıklanabilir yıldızlar — modal açar */}
            <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={22}
                  style={{
                    color: "#ddd",
                    fill: "none",
                    cursor: "pointer",
                    transition: "color 0.15s, transform 0.12s",
                  }}
                  onClick={() => handleStarClick(i)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#f5a623";
                    e.currentTarget.style.transform = "scale(1.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#ddd";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 11,
                color: "#bbb",
              }}
            >
              Puan vermek için tıklayın
            </span>
          </div>
        )}
      </div>

      {/* ── Yorum Formu (giriş yapmış kullanıcılar için) ── */}
      {isLoggedIn && showForm && (
        <div
          style={{
            background: "#faf9f7",
            border: "1px solid #ede8df",
            borderRadius: 6,
            padding: "28px 28px 24px",
            marginBottom: 32,
            animation: "slideDown 0.25s ease",
          }}
        >
          <h3
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 20,
              fontWeight: 600,
              color: "#111",
              margin: "0 0 6px",
            }}
          >
            Yorumunuzu Yazın
          </h3>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 12,
              color: "#aaa",
              margin: "0 0 22px",
            }}
          >
            <User size={11} style={{ verticalAlign: "middle", marginRight: 4 }} />
            {user?.name} olarak yorum yapıyorsunuz
          </p>

          {/* Puan */}
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#555",
                display: "block",
                marginBottom: 10,
              }}
            >
              Puan <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <StarRow value={rating} onChange={handleStarClick} size={28} />
            {ratingError && (
              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 11,
                  color: "#e53e3e",
                  marginTop: 6,
                }}
              >
                ⚠ Lütfen bir puan seçin.
              </p>
            )}
          </div>

          {/* Yorum metni */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#555",
                display: "block",
                marginBottom: 10,
              }}
            >
              Yorumunuz <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                if (e.target.value.trim().length >= 10) setCommentError(false);
              }}
              placeholder="Bu ürün hakkındaki düşüncelerinizi paylaşın... (en az 10 karakter)"
              rows={4}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: `1px solid ${commentError ? "#e53e3e" : "#ddd"}`,
                borderRadius: 4,
                fontFamily: "Montserrat, sans-serif",
                fontSize: 13,
                color: "#333",
                resize: "vertical",
                outline: "none",
                background: "#fff",
                boxSizing: "border-box",
                lineHeight: 1.6,
                transition: "border-color 0.2s",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = commentError ? "#e53e3e" : "#c9a96e")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = commentError ? "#e53e3e" : "#ddd")
              }
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              {commentError ? (
                <p
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 11,
                    color: "#e53e3e",
                    margin: 0,
                  }}
                >
                  ⚠ Yorumunuz en az 10 karakter olmalıdır.
                </p>
              ) : (
                <span />
              )}
              <span
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 11,
                  color: "#bbb",
                }}
              >
                {comment.length} / 500
              </span>
            </div>
          </div>

          {/* Gönder */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleSubmit}
              style={{
                padding: "13px 28px",
                background: "#111",
                color: "#fff",
                border: "none",
                borderRadius: 2,
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#c9a96e")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#111")
              }
            >
              Yorumu Gönder
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                padding: "13px 20px",
                background: "transparent",
                color: "#888",
                border: "1px solid #ddd",
                borderRadius: 2,
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#111";
                e.currentTarget.style.borderColor = "#111";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#888";
                e.currentTarget.style.borderColor = "#ddd";
              }}
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {/* ── Yorum listesi ── */}
      <div>
        {visibleReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Daha fazla / daha az */}
      {reviews.length > 3 && (
        <button
          onClick={() => setShowAll((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            margin: "20px auto 0",
            background: "none",
            border: "1px solid #e0dbd2",
            borderRadius: 2,
            padding: "11px 24px",
            cursor: "pointer",
            fontFamily: "Montserrat, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#555",
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#c9a96e";
            e.currentTarget.style.color = "#c9a96e";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e0dbd2";
            e.currentTarget.style.color = "#555";
          }}
        >
          {showAll ? (
            <>
              <ChevronUp size={14} /> Daha Az Göster
            </>
          ) : (
            <>
              <ChevronDown size={14} /> Tüm Yorumları Gör ({reviews.length})
            </>
          )}
        </button>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <LoginRequiredModal
          onClose={() => setShowModal(false)}
          onLogin={() => {
            setShowModal(false);
            navigate("/giris", { state: { from: window.location.pathname } });
          }}
          onRegister={() => {
            setShowModal(false);
            navigate("/kayit");
          }}
        />
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </section>
  );
};

export default ReviewSection;