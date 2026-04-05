import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { Search, Package, CheckCircle2, Truck, Home, Clock, MapPin, Phone, ChevronRight } from "lucide-react";
import kargoImg from "@/assets/kargo.webp";

interface OrderStep {
  id: number;
  label: string;
  desc: string;
  icon: "order" | "prepare" | "cargo" | "delivery" | "delivered";
}

const steps: OrderStep[] = [
  { id: 0, label: "Sipariş Alındı",  desc: "Siparişiniz başarıyla oluşturuldu.",  icon: "order" },
  { id: 1, label: "Hazırlanıyor",    desc: "Ürününüz kargoya hazırlanıyor.",      icon: "prepare" },
  { id: 2, label: "Kargoya Verildi", desc: "Ürününüz kargoya teslim edildi.",     icon: "cargo" },
  { id: 3, label: "Dağıtımda",       desc: "Ürününüz dağıtım şubesinde.",         icon: "delivery" },
  { id: 4, label: "Teslim Edildi",   desc: "Ürününüz teslim edildi.",             icon: "delivered" },
];

// store.ts'deki AdminOrder status değerleriyle birebir eşleşiyor
const STATUS_STEP: Record<string, number> = {
  beklemede:        0,
  onaylandı:        1,
  kargoya_verildi:  2,
  teslim_edildi:    4,
  // İptal/iade: adım göstermek yerine ayrı badge ile gösterilir
  iptal_edildi:     -1,
  iade_edildi:      -1,
};

const StepIcon = ({ type, active, done }: { type: OrderStep["icon"]; active: boolean; done: boolean }) => {
  const cls = `w-5 h-5 ${done || active ? "text-white" : "text-muted-foreground"}`;
  if (type === "order")    return <CheckCircle2 className={cls} />;
  if (type === "prepare")  return <Package className={cls} />;
  if (type === "cargo")    return <Truck className={cls} />;
  if (type === "delivery") return <MapPin className={cls} />;
  return <Home className={cls} />;
};

const OrderTracking = () => {
  const [orderNo, setOrderNo]     = useState("");
  const [result, setResult] = useState<{ step: number; status: string; name: string; product: string; address: string; cargo: string; cargoNo: string } | null>(null);
  const [notFound, setNotFound]   = useState(false);
  const [truckPos, setTruckPos]   = useState(0);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTruckPos(p => (p >= 110 ? -10 : p + 0.4));
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (!orderNo.trim()) return;
    setSearching(true);
    setResult(null);
    setNotFound(false);
    setTimeout(() => {
      try {
        // Siparişler tkx_orders anahtarında tutulur (orderStorage.ts ile uyumlu)
        const rawOrders = localStorage.getItem("tkx_orders");
        const orders = rawOrders ? JSON.parse(rawOrders) : [];
        interface StoredOrder { id?: string | number; status: string; items?: { name: string; quantity: number }[]; customer?: string; total?: number; date?: string; address?: string; }
        const order = orders.find(
          (o: StoredOrder) => o.id?.toString().toUpperCase() === orderNo.trim().toUpperCase()
        );
        if (order) {
          const productNames = Array.isArray(order.items)
            ? order.items.map((i: { name: string; quantity: number }) => `${i.name}${i.quantity > 1 ? ` x${i.quantity}` : ""}`).join(", ")
            : "-";
          setResult({
            step:    STATUS_STEP[order.status] ?? 0,
            status:  order.status,
            name:    order.customer || "-",
            product: productNames,
            address: order.address || "-",
            cargo:   order.cargoCompany || "Kargo",
            cargoNo: order.trackingNo || "-",
          });
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      }
      setSearching(false);
    }, 1200);
  };

  const currentStep = (result && result.step >= 0) ? result.step : 0;
  const isCancelled = result?.status === "iptal_edildi";
  const isReturned  = result?.status === "iade_edildi";

  return (
    <div className="min-h-screen bg-background header-offset" style={{ paddingTop: 96 }}>
      <AnnouncementBar />
      <Header />

      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 font-body text-xs text-muted-foreground">
          <Link to="/" className="hover:text-accent transition-colors">Anasayfa</Link>
          <span>/</span>
          <span className="text-foreground">Sipariş Takibi</span>
        </nav>
      </div>

      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-2xl mx-auto">

          <div className="text-center mb-10">
            <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground mb-3">Sipariş Takibi</h1>
            <p className="font-body text-sm text-muted-foreground">Sipariş numaranızı girerek kargonuzun durumunu öğrenin.</p>
          </div>

          <div className="relative mb-10">
            <div className="absolute -top-16 left-0 right-0 h-16 overflow-hidden pointer-events-none">
              <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
              <div className="absolute bottom-0 left-0 right-0 h-2" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.04), transparent)" }} />
              <div className="absolute bottom-0 transition-none" style={{ left: `${truckPos}%`, transform: "translateX(-50%)" }}>
                <img src={kargoImg} alt="Kargo Aracı" loading="lazy" decoding="async" style={{ display: "block", height: "60px", width: "auto", filter: "drop-shadow(2px 3px 6px rgba(0,0,0,0.25))", objectFit: "contain" }} />
              </div>
            </div>

            <div className="flex gap-0 border border-border bg-card overflow-hidden shadow-sm">
              <input
                type="text"
                value={orderNo}
                onChange={e => setOrderNo(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Sipariş numaranızı giriniz (örn: TKM1234567)"
                className="flex-1 px-5 py-4 font-body text-sm bg-transparent focus:outline-none placeholder:text-muted-foreground/50"
              />
              <button
                onClick={handleSearch}
                disabled={searching}
                className="flex items-center gap-2 px-6 py-4 bg-primary text-primary-foreground font-body text-xs tracking-[0.2em] uppercase hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-60"
              >
                {searching ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
                Sorgula
              </button>
            </div>
            <p className="font-body text-[10px] text-muted-foreground mt-2 text-center">
              Sipariş numaranız onay e-postanızda yer almaktadır.
            </p>
          </div>

          {notFound && (
            <div className="text-center py-12 border border-border bg-card animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
              <p className="font-heading text-lg text-foreground mb-2">Sipariş Bulunamadı</p>
              <p className="font-body text-sm text-muted-foreground">Girdiğiniz sipariş numarasına ait kayıt bulunamadı.<br />Lütfen kontrol edip tekrar deneyin.</p>
              <Link to="/iletisim" className="inline-flex items-center gap-1 mt-4 font-body text-xs text-accent hover:underline">
                <Phone className="w-3 h-3" /> Destek hattını ara
              </Link>
            </div>
          )}

          {result && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">

              <div className="border border-border bg-card p-5">
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-border">
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Sipariş No</p>
                    <p className="font-heading text-lg font-semibold text-foreground">{orderNo.toUpperCase()}</p>
                  </div>
                  <span className={`font-body text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-sm font-semibold ${
                    isCancelled                ? "bg-red-50 text-red-500" :
                    isReturned                 ? "bg-orange-50 text-orange-500" :
                    currentStep === 4          ? "bg-green-50 text-green-600" :
                    currentStep >= 2           ? "bg-accent/10 text-accent" :
                                                 "bg-secondary text-muted-foreground"
                  }`}>
                    {isCancelled ? "İptal Edildi" : isReturned ? "İade Edildi" : steps[currentStep]?.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 font-body text-sm">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Alıcı</p>
                    <p className="text-foreground">{result.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Ürün</p>
                    <p className="text-foreground">{result.product}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Teslimat Adresi</p>
                    <p className="text-foreground">{result.address}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Kargo Firması</p>
                    <p className="text-foreground">
                      {result.cargo}
                      {result.cargoNo !== "-" && <span className="text-muted-foreground"> · {result.cargoNo}</span>}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-border bg-card p-6">
                <h2 className="font-heading text-base font-semibold text-foreground mb-6">Kargo Durumu</h2>
                {(isCancelled || isReturned) ? (
                  <div className={`flex items-center gap-3 p-4 rounded-md ${isCancelled ? "bg-red-50 border border-red-100" : "bg-orange-50 border border-orange-100"}`}>
                    <span className="text-2xl">{isCancelled ? "❌" : "↩️"}</span>
                    <div>
                      <p className={`font-body text-sm font-semibold ${isCancelled ? "text-red-600" : "text-orange-600"}`}>
                        {isCancelled ? "Bu sipariş iptal edilmiştir." : "Bu sipariş iade sürecindedir."}
                      </p>
                      <p className="font-body text-xs text-muted-foreground mt-0.5">
                        Detaylı bilgi için müşteri hizmetleriyle iletişime geçin.
                      </p>
                    </div>
                  </div>
                ) : (
                <div className="relative">
                  <div className="absolute left-5 top-5 bottom-5 w-px bg-border" />
                  <div className="absolute left-5 top-5 w-px bg-accent transition-all duration-1000" style={{ height: `${Math.min(currentStep / (steps.length - 1), 1) * 100}%` }} />
                  <div className="space-y-0">
                    {steps.map((step, i) => {
                      const done   = i < currentStep;
                      const active = i === currentStep;
                      const future = i > currentStep;
                      return (
                        <div key={step.id} className="relative flex items-start gap-4 pb-8 last:pb-0">
                          <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                            done   ? "bg-accent" :
                            active ? "bg-primary ring-4 ring-accent/20" :
                                     "bg-secondary border border-border"
                          }`}>
                            {active && <span className="absolute inset-0 rounded-full bg-accent/30 animate-ping" />}
                            <StepIcon type={step.icon} active={active} done={done} />
                          </div>
                          <div className="pt-1.5">
                            <p className={`font-body text-sm font-semibold ${future ? "text-muted-foreground" : "text-foreground"}`}>{step.label}</p>
                            <p className={`font-body text-xs mt-0.5 ${future ? "text-muted-foreground/50" : "text-muted-foreground"}`}>{step.desc}</p>
                          </div>
                          {active && <ChevronRight className="absolute right-0 top-2 w-4 h-4 text-accent animate-pulse" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
                )}
              </div>

              <div className="flex items-center justify-between border border-border bg-card p-4">
                <div>
                  <p className="font-body text-sm text-foreground font-medium">Sorun mu yaşıyorsunuz?</p>
                  <p className="font-body text-xs text-muted-foreground">Müşteri hizmetlerimize ulaşın.</p>
                </div>
                <Link to="/iletisim" className="flex items-center gap-2 font-body text-xs tracking-wider uppercase border border-border px-4 py-2.5 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                  İletişim
                </Link>
              </div>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OrderTracking;