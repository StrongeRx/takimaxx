import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import PageLayout from "@/components/PageLayout";
import { getOrders, STATUS_LABELS, type StoredOrder } from "@/lib/orderStorage";
import {
  User, Package, MapPin, Heart, RotateCcw, Settings, LogOut,
  ChevronRight, ChevronLeft, Plus, Trash2, Pencil, Check,
  AlertCircle, Eye, EyeOff, ArrowUpRight, Search, Truck, CheckCircle2, Home, Phone, Clock
} from "lucide-react";
import kargoImg from "@/assets/kargo.webp";

interface Address {
  id: string; title: string; fullName: string; phone: string;
  city: string; district: string; fullAddress: string; isDefault: boolean;
}
// StoredOrder, orderStorage'dan import edildi
interface ReturnRequest {
  id: string; orderId: string; productName: string; reason: string;
  detail: string; status: "beklemede" | "onaylandı" | "reddedildi"; date: string;
}
const STATUS_MAP = STATUS_LABELS; // orderStorage'dan gelen map kullanılır // orderStorage'dan gelen map kullanılır

const RETURN_REASONS = [
  "Ürün beklentilerimi karşılamadı","Yanlış ürün gönderildi","Ürün hasarlı / kusurlu geldi",
  "Ürün açıklamayla uyuşmuyor","Vazgeçtim / Fikrim değişti","Diğer",
];

const card: React.CSSProperties = { background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, overflow:"hidden" };
const menuRow: React.CSSProperties = { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", cursor:"pointer", background:"#fff", border:"none", width:"100%", textAlign:"left", transition:"background 0.15s" };
const inputStyle: React.CSSProperties = { width:"100%", padding:"10px 12px", border:"1px solid #d1d5db", borderRadius:8, fontFamily:"Montserrat, sans-serif", fontSize:13, color:"#111", outline:"none", boxSizing:"border-box" };
const btnPrimary: React.CSSProperties = { background:"#111", color:"#fff", border:"none", borderRadius:8, padding:"10px 20px", fontFamily:"Montserrat, sans-serif", fontSize:12, fontWeight:700, cursor:"pointer", letterSpacing:"0.06em" };
const btnOutline: React.CSSProperties = { background:"#fff", color:"#111", border:"1px solid #d1d5db", borderRadius:8, padding:"10px 20px", fontFamily:"Montserrat, sans-serif", fontSize:12, fontWeight:600, cursor:"pointer" };
const Divider = () => <div style={{ height:1, background:"#e5e7eb" }} />;

const BackHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
  <div className="acc-back-header" style={{ padding:"20px 24px", borderBottom:"1px solid #e5e7eb", display:"flex", alignItems:"center", gap:12 }}>
    <button onClick={onBack} style={{ background:"none", border:"1px solid #e5e7eb", borderRadius:8, cursor:"pointer", padding:"6px 10px", display:"flex", alignItems:"center", color:"#374151", flexShrink:0 }}>
      <ChevronLeft size={16} />
    </button>
    <h2 style={{ margin:0, fontFamily:"Montserrat, sans-serif", fontSize:15, fontWeight:700, color:"#111" }}>{title}</h2>
  </div>
);

const Account = () => {
  const [orders, setOrders] = React.useState<import("@/lib/orderStorage").StoredOrder[]>([]);
  useEffect(() => { setOrders(getOrders()); }, []);
  const { user, isLoggedIn, logout, updateUser, changePassword } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { tab?: string } | null;

  const [section, setSection] = useState<"menu"|"orders"|"addresses"|"favorites"|"returns"|"settings"|"tracking">(
    (locationState?.tab as "menu"|"orders"|"addresses"|"favorites"|"returns"|"settings"|"tracking") || "menu"
  );
  const [addresses, setAddresses] = useState<Address[]>(() => { try { return JSON.parse(localStorage.getItem("tkx_addresses")||"[]"); } catch { return []; } });
  const [addressForm, setAddressForm] = useState<Partial<Address>|null>(null);
  const [returns, setReturns] = useState<ReturnRequest[]>(() => { try { return JSON.parse(localStorage.getItem("tkx_returns")||"[]"); } catch { return []; } });
  const [returnForm, setReturnForm] = useState<{ orderId:string; productName:string; reason:string; detail:string }|null>(null);
  const [returnSuccess, setReturnSuccess] = useState(false);

  // Sipariş takibi state
  const [trackOrderNo, setTrackOrderNo] = useState("");
  const [trackResult, setTrackResult] = useState<{ step: number; status: string; name: string; product: string; address: string; cargo: string; cargoNo: string } | null>(null);
  const [trackNotFound, setTrackNotFound] = useState(false);
  const [trackSearching, setTrackSearching] = useState(false);
  const [truckPos, setTruckPos] = useState(0);
  const [editField, setEditField] = useState<"name"|"phone"|"password"|null>(null);
  const [editValue, setEditValue] = useState("");
  const [editValue2, setEditValue2] = useState("");
  const [editCurrentPw, setEditCurrentPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [editMsg, setEditMsg] = useState<{ type:"ok"|"err"; text:string }|null>(null);

  useEffect(() => { if (!isLoggedIn) navigate("/giris"); }, [isLoggedIn, navigate]);
  useEffect(() => { localStorage.setItem("tkx_addresses", JSON.stringify(addresses)); }, [addresses]);
  useEffect(() => { localStorage.setItem("tkx_returns", JSON.stringify(returns)); }, [returns]);

  if (!user) return null;

  // Kamyon animasyonu (sipariş takibi bölümü açıkken)
  useEffect(() => {
    if (section !== "tracking") return;
    const interval = setInterval(() => {
      setTruckPos(p => (p >= 110 ? -10 : p + 0.4));
    }, 16);
    return () => clearInterval(interval);
  }, [section]);

  const TRACK_STEPS = [
    { id: 0, label: "Sipariş Alındı",  desc: "Siparişiniz başarıyla oluşturuldu.",  icon: "order" as const },
    { id: 1, label: "Hazırlanıyor",    desc: "Ürününüz kargoya hazırlanıyor.",      icon: "prepare" as const },
    { id: 2, label: "Kargoya Verildi", desc: "Ürününüz kargoya teslim edildi.",     icon: "cargo" as const },
    { id: 3, label: "Dağıtımda",       desc: "Ürününüz dağıtım şubesinde.",         icon: "delivery" as const },
    { id: 4, label: "Teslim Edildi",   desc: "Ürününüz teslim edildi.",             icon: "delivered" as const },
  ];

  const TRACK_STATUS_STEP: Record<string, number> = {
    beklemede: 0, onaylandı: 1, kargoya_verildi: 2, teslim_edildi: 4,
    iptal_edildi: -1, iade_edildi: -1,
  };

  const handleTrackSearch = () => {
    if (!trackOrderNo.trim()) return;
    setTrackSearching(true);
    setTrackResult(null);
    setTrackNotFound(false);
    setTimeout(() => {
      try {
        const rawOrders = localStorage.getItem("tkx_orders");
        const allOrders = rawOrders ? JSON.parse(rawOrders) : [];
        const order = allOrders.find(
          (o: { id?: string | number; status: string; items?: { name: string; quantity: number }[]; customer?: string; address?: string; cargoCompany?: string; trackingNo?: string }) =>
            o.id?.toString().toUpperCase() === trackOrderNo.trim().toUpperCase()
        );
        if (order) {
          const productNames = Array.isArray(order.items)
            ? order.items.map((i: { name: string; quantity: number }) => `${i.name}${i.quantity > 1 ? ` x${i.quantity}` : ""}`).join(", ")
            : "-";
          setTrackResult({
            step: TRACK_STATUS_STEP[order.status] ?? 0,
            status: order.status,
            name: order.customer || "-",
            product: productNames,
            address: order.address || "-",
            cargo: order.cargoCompany || "Kargo",
            cargoNo: order.trackingNo || "-",
          });
        } else {
          setTrackNotFound(true);
        }
      } catch {
        setTrackNotFound(true);
      }
      setTrackSearching(false);
    }, 1200);
  };

  const TrackStepIcon = ({ type, active, done }: { type: string; active: boolean; done: boolean }) => {
    const color = done || active ? "#fff" : "#9ca3af";
    if (type === "order")    return <CheckCircle2 size={16} color={color} />;
    if (type === "prepare")  return <Package size={16} color={color} />;
    if (type === "cargo")    return <Truck size={16} color={color} />;
    if (type === "delivery") return <MapPin size={16} color={color} />;
    return <Home size={16} color={color} />;
  };

  const saveAddress = () => {
    if (!addressForm) return;
    const { title, fullName, phone, city, district, fullAddress } = addressForm;
    if (!title||!fullName||!phone||!city||!district||!fullAddress) return;
    if (addressForm.id) {
      setAddresses(prev => prev.map(a => a.id === addressForm.id ? { ...addressForm as Address } : a));
    } else {
      setAddresses(prev => [...prev, { ...addressForm as Address, id: Date.now().toString(), isDefault: prev.length===0 }]);
    }
    setAddressForm(null);
  };

  const deleteAddress = (id: string) => setAddresses(prev => prev.filter(a => a.id !== id));
  const setDefault = (id: string) => setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));

  const submitReturn = () => {
    if (!returnForm||!returnForm.orderId||!returnForm.reason) return;
    const order = orders.find(o => o.id === returnForm.orderId);
    setReturns(prev => [{ id:`RET-${Date.now()}`, orderId:returnForm.orderId, productName:returnForm.productName||(order?.items[0]?.name??""), reason:returnForm.reason, detail:returnForm.detail, status:"beklemede", date:new Date().toLocaleDateString("tr-TR") }, ...prev]);
    setReturnForm(null); setReturnSuccess(true);
    setTimeout(() => setReturnSuccess(false), 4000);
  };

  const saveEdit = async () => {
    setEditMsg(null);
    if (editField === "password") {
      if (!editCurrentPw||!editValue||!editValue2) { setEditMsg({ type:"err", text:"Tüm alanları doldurun." }); return; }
      if (editValue !== editValue2) { setEditMsg({ type:"err", text:"Yeni şifreler eşleşmiyor." }); return; }
      if (editValue.length < 6) { setEditMsg({ type:"err", text:"Şifre en az 6 karakter olmalı." }); return; }
      const result = await changePassword(editCurrentPw, editValue);
      if (result.success) { setEditMsg({ type:"ok", text:"Şifre güncellendi." }); setEditField(null); }
      else setEditMsg({ type:"err", text:result.error||"Hata oluştu." });
    } else if (editField === "name") {
      if (!editValue.trim()) { setEditMsg({ type:"err", text:"İsim boş olamaz." }); return; }
      updateUser({ name: editValue.trim() }); setEditMsg({ type:"ok", text:"İsim güncellendi." }); setEditField(null);
    } else if (editField === "phone") {
      updateUser({ phone: editValue.trim() }); setEditMsg({ type:"ok", text:"Telefon güncellendi." }); setEditField(null);
    }
  };

  const cancelEdit = () => { setEditField(null); setEditMsg(null); setEditValue(""); setEditValue2(""); setEditCurrentPw(""); };

  return (
    <PageLayout title="Hesabım" breadcrumb="Hesabım" showBanner>
      <style>{`
        @media(max-width:640px){
          .acc-container{padding:0!important}
          .acc-card{border-radius:0!important;border-left:none!important;border-right:none!important}
          .acc-menu-row{padding:14px 16px!important}
          .acc-fav-row{padding:12px 16px!important}
          .acc-back-header{padding:16px!important}
        }
      `}</style>
      <div className="acc-container" style={{ maxWidth:640, margin:"0 auto", fontFamily:"Montserrat, sans-serif" }}>

        {/* ── MENÜ ── */}
        {section === "menu" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ ...card, padding:"24px 20px", display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ width:56, height:56, borderRadius:"50%", background:"#111", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <User size={26} color="#fff" />
              </div>
              <div>
                <p style={{ margin:0, fontFamily:"Montserrat, sans-serif", fontSize:16, fontWeight:700, color:"#111" }}>{user.name}</p>
                <p style={{ margin:"4px 0 0", fontFamily:"Montserrat, sans-serif", fontSize:12, color:"#6b7280" }}>{user.email}</p>
                {user.phone && <p style={{ margin:"2px 0 0", fontFamily:"Montserrat, sans-serif", fontSize:12, color:"#9ca3af" }}>{user.phone}</p>}
              </div>
            </div>
            <div style={card}>
              {[
                { id:"orders",    icon:<Package size={18}/>,   label:"Siparişlerim",    badge:orders.length },
                { id:"tracking",  icon:<Truck size={18}/>,     label:"Sipariş Takibi",  badge:null },
                { id:"addresses", icon:<MapPin size={18}/>,    label:"Adreslerim",      badge:addresses.length },
                { id:"favorites", icon:<Heart size={18}/>,     label:"Favorilerim",     badge:favorites.length },
                { id:"returns",   icon:<RotateCcw size={18}/>, label:"İade Taleplerim", badge:returns.length },
                { id:"settings",  icon:<Settings size={18}/>,  label:"Hesap Detayları", badge:null },
              ].map((item, i, arr) => (
                <div key={item.id}>
                  <button style={menuRow} onClick={() => setSection(item.id as typeof section)}
                    onMouseEnter={e=>(e.currentTarget.style.background="#f9fafb")}
                    onMouseLeave={e=>(e.currentTarget.style.background="#fff")}>
                    <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                      <div style={{ color:"#374151" }}>{item.icon}</div>
                      <span style={{ fontFamily:"Montserrat, sans-serif", fontSize:14, fontWeight:500, color:"#111" }}>{item.label}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      {item.badge !== null && item.badge > 0 && (
                        <span style={{ background:"#111", color:"#fff", fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:12 }}>{item.badge}</span>
                      )}
                      <ChevronRight size={16} color="#9ca3af" />
                    </div>
                  </button>
                  {i < arr.length-1 && <Divider/>}
                </div>
              ))}
            </div>
            <div style={card}>
              <button style={{ ...menuRow, color:"#dc2626" }} onClick={() => { logout(); navigate("/"); }}
                onMouseEnter={e=>(e.currentTarget.style.background="#fef2f2")}
                onMouseLeave={e=>(e.currentTarget.style.background="#fff")}>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <LogOut size={18} color="#dc2626"/>
                  <span style={{ fontFamily:"Montserrat, sans-serif", fontSize:14, fontWeight:500, color:"#dc2626" }}>Çıkış Yap</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ── SİPARİŞLER ── */}
        {section === "orders" && (
          <div style={card}>
            <BackHeader title="Siparişlerim" onBack={() => setSection("menu")}/>
            {orders.length === 0 ? (
              <div style={{ padding:"40px 24px", textAlign:"center" }}>
                <Package size={32} color="#d1d5db" style={{ marginBottom:10 }}/>
                <p style={{ margin:0, fontFamily:"Montserrat, sans-serif", fontSize:13, color:"#9ca3af" }}>Henüz siparişiniz bulunmuyor.</p>
              </div>
            ) : orders.map((order, i) => {
              const st = STATUS_MAP[order.status];
              return (
                <div key={order.id}>
                  <div style={{ padding:"20px 24px" }}>
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12, flexWrap:"wrap", gap:8 }}>
                      <div>
                        <p style={{ margin:0, fontFamily:"Montserrat, sans-serif", fontSize:13, fontWeight:700, color:"#111" }}>{order.id}</p>
                        <p style={{ margin:"3px 0 0", fontFamily:"Montserrat, sans-serif", fontSize:11, color:"#9ca3af" }}>{new Date(order.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</p>
                      </div>
                      <span style={{ background:st.bg, color:st.color, fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:20, whiteSpace:"nowrap" }}>{st.label}</span>
                    </div>
                    {order.items.map((item, j) => (
                      <div key={j} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderTop:j===0?"1px solid #f3f4f6":"none" }}>
                        <span style={{ fontFamily:"Montserrat, sans-serif", fontSize:12, color:"#374151" }}>{item.name} <span style={{ color:"#9ca3af" }}>x{item.quantity}</span></span>
                        <span style={{ fontFamily:"Montserrat, sans-serif", fontSize:12, fontWeight:600, color:"#111" }}>{(item.price*item.quantity).toLocaleString("tr-TR",{minimumFractionDigits:2})} ₺</span>
                      </div>
                    ))}
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:10, paddingTop:10, borderTop:"1px solid #e5e7eb" }}>
                      <span style={{ fontFamily:"Montserrat, sans-serif", fontSize:12, fontWeight:700, color:"#111" }}>Toplam</span>
                      <span style={{ fontFamily:"Montserrat, sans-serif", fontSize:13, fontWeight:800, color:"#111" }}>{order.total.toLocaleString("tr-TR",{minimumFractionDigits:2})} ₺</span>
                    </div>
                  </div>
                  {i < orders.length-1 && <Divider/>}
                </div>
              );
            })}
          </div>
        )}

        {/* ── ADRESLER ── */}
        {section === "addresses" && (
          <div style={card}>
            <BackHeader title="Adreslerim" onBack={() => { setSection("menu"); setAddressForm(null); }}/>
            {addressForm !== null ? (
              <div style={{ padding:24 }}>
                <p style={{ margin:"0 0 18px", fontFamily:"Montserrat, sans-serif", fontSize:13, fontWeight:700, color:"#111" }}>{addressForm.id?"Adresi Düzenle":"Yeni Adres Ekle"}</p>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {[
                    { key:"title",       label:"Adres Başlığı (Ev, İş...)", placeholder:"Ev" },
                    { key:"fullName",    label:"Ad Soyad",                   placeholder:"Ad Soyad" },
                    { key:"phone",       label:"Telefon",                    placeholder:"05XX XXX XX XX" },
                    { key:"city",        label:"İl",                         placeholder:"İstanbul" },
                    { key:"district",    label:"İlçe",                       placeholder:"Kadıköy" },
                    { key:"fullAddress", label:"Açık Adres",                 placeholder:"Mahalle, sokak, bina no..." },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display:"block", fontFamily:"Montserrat, sans-serif", fontSize:11, fontWeight:600, color:"#374151", marginBottom:5 }}>{f.label}</label>
                      {f.key === "fullAddress" ? (
                        <textarea rows={3} placeholder={f.placeholder} value={(addressForm as Record<string,string>)[f.key]||""} onChange={e=>setAddressForm(prev=>({...prev,[f.key]:e.target.value}))} style={{ ...inputStyle, resize:"vertical", minHeight:80 }}/>
                      ) : (
                        <input type="text" placeholder={f.placeholder} value={(addressForm as Record<string,string>)[f.key]||""} onChange={e=>setAddressForm(prev=>({...prev,[f.key]:e.target.value}))} style={inputStyle}/>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:10, marginTop:20 }}>
                  <button style={btnPrimary} onClick={saveAddress}>Kaydet</button>
                  <button style={btnOutline} onClick={() => setAddressForm(null)}>Vazgeç</button>
                </div>
              </div>
            ) : (
              <>
                {addresses.length === 0 ? (
                  <div style={{ padding:32, textAlign:"center" }}>
                    <MapPin size={32} color="#d1d5db" style={{ marginBottom:10 }}/>
                    <p style={{ margin:0, fontFamily:"Montserrat, sans-serif", fontSize:13, color:"#9ca3af" }}>Kayıtlı adresiniz bulunmuyor.</p>
                  </div>
                ) : (
                  addresses.map((addr, i) => (
                    <div key={addr.id}>
                      <div style={{ padding:"18px 24px", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                            <span style={{ fontFamily:"Montserrat, sans-serif", fontSize:13, fontWeight:700, color:"#111" }}>{addr.title}</span>
                            {addr.isDefault && <span style={{ background:"#111", color:"#fff", fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:12 }}>Varsayılan</span>}
                          </div>
                          <p style={{ margin:"0 0 2px", fontFamily:"Montserrat, sans-serif", fontSize:12, color:"#374151" }}>{addr.fullName} · {addr.phone}</p>
                          <p style={{ margin:0, fontFamily:"Montserrat, sans-serif", fontSize:12, color:"#6b7280" }}>{addr.fullAddress}, {addr.district} / {addr.city}</p>
                        </div>
                        <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                          {!addr.isDefault && <button onClick={() => setDefault(addr.id)} style={{ ...btnOutline, padding:"6px 10px", fontSize:10 }}>Varsayılan Yap</button>}
                          <button onClick={() => setAddressForm({...addr})} style={{ ...btnOutline, padding:"6px 8px" }}><Pencil size={13}/></button>
                          <button onClick={() => deleteAddress(addr.id)} style={{ ...btnOutline, padding:"6px 8px", color:"#dc2626", borderColor:"#fca5a5" }}><Trash2 size={13}/></button>
                        </div>
                      </div>
                      {i < addresses.length-1 && <Divider/>}
                    </div>
                  ))
                )}
                <div style={{ padding:"16px 24px", borderTop:addresses.length>0?"1px solid #e5e7eb":"none" }}>
                  <button style={{ ...btnPrimary, display:"flex", alignItems:"center", gap:8 }} onClick={() => setAddressForm({ isDefault:false })}>
                    <Plus size={14}/> Yeni Adres Ekle
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── FAVORİLER ── */}
        {section === "favorites" && (
          <div style={card}>
            <BackHeader title="Favorilerim" onBack={() => setSection("menu")}/>
            {favorites.length === 0 ? (
              <div style={{ padding:40, textAlign:"center" }}>
                <Heart size={32} color="#d1d5db" style={{ marginBottom:10 }}/>
                <p style={{ margin:0, fontFamily:"Montserrat, sans-serif", fontSize:13, color:"#9ca3af" }}>Favori ürününüz bulunmuyor.</p>
              </div>
            ) : (
              favorites.map((product, i) => (
                <div key={product.id}>
                  <div className="acc-fav-row" style={{ padding:"14px 24px", display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:52, height:52, borderRadius:8, overflow:"hidden", flexShrink:0, background:"#f3f4f6", border:"1px solid #e5e7eb" }}>
                      <img loading="lazy" src={product.image} alt={product.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ margin:0, fontFamily:"Montserrat, sans-serif", fontSize:13, fontWeight:600, color:"#111", overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{product.name}</p>
                      <p style={{ margin:"3px 0 0", fontFamily:"Montserrat, sans-serif", fontSize:12, color:"#6b7280" }}>{product.price.toLocaleString("tr-TR",{minimumFractionDigits:2})} ₺</p>
                    </div>
                    <button onClick={() => navigate(`/urun/${product.id}`)} style={{ ...btnOutline, padding:"6px 10px", display:"flex", alignItems:"center", gap:4, flexShrink:0, fontSize:11, whiteSpace:"nowrap" }}>
                      İncele <ArrowUpRight size={12}/>
                    </button>
                  </div>
                  {i < favorites.length-1 && <Divider/>}
                </div>
              ))
            )}
          </div>
        )}

        {/* ── İADE TALEPLERİ ── */}
        {section === "returns" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {returnSuccess && (
              <div style={{ background:"#f0fdf4", border:"1px solid #86efac", borderRadius:10, padding:"14px 18px", display:"flex", alignItems:"center", gap:10 }}>
                <Check size={16} color="#16a34a"/>
                <span style={{ fontFamily:"Montserrat, sans-serif", fontSize:13, color:"#15803d", fontWeight:600 }}>İade talebiniz alındı. En kısa sürede incelenecektir.</span>
              </div>
            )}
            <div style={card}>
              <BackHeader title="İade Taleplerim" onBack={() => { setSection("menu"); setReturnForm(null); }}/>
              {returnForm !== null ? (
                <div style={{ padding:24 }}>
                  <p style={{ margin:"0 0 16px", fontFamily:"Montserrat, sans-serif", fontSize:13, fontWeight:700, color:"#111" }}>Yeni İade Talebi Oluştur</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    <div>
                      <label style={{ display:"block", fontFamily:"Montserrat, sans-serif", fontSize:11, fontWeight:600, color:"#374151", marginBottom:5 }}>Sipariş Seçin *</label>
                      <select value={returnForm.orderId} onChange={e => { const order=orders.find(o=>o.id===e.target.value); setReturnForm(prev=>({...prev!,orderId:e.target.value,productName:order?.items[0]?.name||""})); }} style={{ ...inputStyle, background:"#fff" }}>
                        <option value="">Sipariş seçin...</option>
                        {orders.filter(o=>o.status==="teslim edildi").map(o=><option key={o.id} value={o.id}>{o.id} — {new Date(o.createdAt).toLocaleDateString('tr-TR')}</option>)}
                      </select>
                    </div>
                    {returnForm.orderId && (
                      <div>
                        <label style={{ display:"block", fontFamily:"Montserrat, sans-serif", fontSize:11, fontWeight:600, color:"#374151", marginBottom:5 }}>İade Edilecek Ürün *</label>
                        <select value={returnForm.productName} onChange={e=>setReturnForm(prev=>({...prev!,productName:e.target.value}))} style={{ ...inputStyle, background:"#fff" }}>
                          <option value="">Ürün seçin...</option>
                          {orders.find(o=>o.id===returnForm.orderId)?.items.map((item,i)=><option key={i} value={item.name}>{item.name}</option>)}
                        </select>
                      </div>
                    )}
                    <div>
                      <label style={{ display:"block", fontFamily:"Montserrat, sans-serif", fontSize:11, fontWeight:600, color:"#374151", marginBottom:5 }}>İade Sebebi *</label>
                      <select value={returnForm.reason} onChange={e=>setReturnForm(prev=>({...prev!,reason:e.target.value}))} style={{ ...inputStyle, background:"#fff" }}>
                        <option value="">Sebep seçin...</option>
                        {RETURN_REASONS.map(r=><option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display:"block", fontFamily:"Montserrat, sans-serif", fontSize:11, fontWeight:600, color:"#374151", marginBottom:5 }}>Ek Açıklama</label>
                      <textarea rows={3} placeholder="Sorunu daha ayrıntılı açıklayabilirsiniz..." value={returnForm.detail} onChange={e=>setReturnForm(prev=>({...prev!,detail:e.target.value}))} style={{ ...inputStyle, resize:"vertical", minHeight:80 }}/>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:10, marginTop:20 }}>
                    <button style={{ ...btnPrimary, opacity:(!returnForm.orderId||!returnForm.reason)?0.4:1 }} onClick={submitReturn} disabled={!returnForm.orderId||!returnForm.reason}>Talebi Gönder</button>
                    <button style={btnOutline} onClick={() => setReturnForm(null)}>Vazgeç</button>
                  </div>
                </div>
              ) : (
                <div style={{ padding:"16px 24px" }}>
                  <button style={{ ...btnPrimary, display:"flex", alignItems:"center", gap:8 }} onClick={() => setReturnForm({ orderId:"", productName:"", reason:"", detail:"" })}>
                    <Plus size={14}/> Yeni İade Talebi
                  </button>
                </div>
              )}
            </div>
            {returns.length > 0 && (
              <div style={card}>
                <div style={{ padding:"16px 24px", borderBottom:"1px solid #e5e7eb" }}>
                  <p style={{ margin:0, fontFamily:"Montserrat, sans-serif", fontSize:13, fontWeight:700, color:"#111" }}>Geçmiş Talepler</p>
                </div>
                {returns.map((req, i) => {
                  const stMap = { "beklemede":{ label:"İnceleniyor", color:"#92400e", bg:"#fef3c7" }, "onaylandı":{ label:"Onaylandı", color:"#166534", bg:"#dcfce7" }, "reddedildi":{ label:"Reddedildi", color:"#991b1b", bg:"#fee2e2" } };
                  const st = stMap[req.status];
                  return (
                    <div key={req.id}>
                      <div style={{ padding:"16px 24px" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, flexWrap:"wrap" }}>
                          <div>
                            <p style={{ margin:0, fontFamily:"Montserrat, sans-serif", fontSize:12, fontWeight:700, color:"#111" }}>{req.productName}</p>
                            <p style={{ margin:"3px 0 0", fontFamily:"Montserrat, sans-serif", fontSize:11, color:"#6b7280" }}>Sipariş: {req.orderId} · {req.date}</p>
                            <p style={{ margin:"3px 0 0", fontFamily:"Montserrat, sans-serif", fontSize:11, color:"#9ca3af" }}>{req.reason}</p>
                          </div>
                          <span style={{ background:st.bg, color:st.color, fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, whiteSpace:"nowrap" }}>{st.label}</span>
                        </div>
                      </div>
                      {i < returns.length-1 && <Divider/>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── SİPARİŞ TAKİBİ ── */}
        {section === "tracking" && (
          <div style={card}>
            <BackHeader title="Sipariş Takibi" onBack={() => { setSection("menu"); setTrackResult(null); setTrackNotFound(false); setTrackOrderNo(""); }}/>
            <div style={{ padding:"20px 16px" }}>

              {/* Kamyon animasyonu */}
              <div style={{ position:"relative", height:44, marginBottom:14, overflow:"hidden" }}>
                <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:"#e5e7eb" }}/>
                <div style={{ position:"absolute", bottom:0, left:`${truckPos}%`, transform:"translateX(-50%)" }}>
                  <img src={kargoImg} alt="Kargo" loading="lazy" style={{ height:40, width:"auto", objectFit:"contain", filter:"drop-shadow(1px 2px 4px rgba(0,0,0,0.2))" }}/>
                </div>
              </div>

              {/* Arama kutusu — mobilde dikey düzen */}
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:8 }}>
                <input
                  type="text"
                  value={trackOrderNo}
                  onChange={e => setTrackOrderNo(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleTrackSearch()}
                  placeholder="Sipariş numaranızı girin (TKM1234567)"
                  style={{ width:"100%", padding:"13px 14px", border:"1px solid #e5e7eb", borderRadius:8, outline:"none", fontFamily:"Montserrat, sans-serif", fontSize:13, color:"#111", boxSizing:"border-box" }}
                />
                <button
                  onClick={handleTrackSearch}
                  disabled={trackSearching}
                  style={{ ...btnPrimary, width:"100%", padding:"13px 0", display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity:trackSearching?0.7:1, borderRadius:8 }}
                >
                  {trackSearching
                    ? <span style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"tkx-spin 0.7s linear infinite" }}/>
                    : <Search size={14}/>}
                  Sorgula
                </button>
              </div>
              <p style={{ fontFamily:"Montserrat, sans-serif", fontSize:10, color:"#9ca3af", textAlign:"center", marginBottom:16 }}>
                Sipariş numaranız onay e-postanızda yer almaktadır.
              </p>

              {/* Bulunamadı */}
              {trackNotFound && (
                <div style={{ textAlign:"center", padding:"28px 16px", border:"1px solid #e5e7eb", borderRadius:8, background:"#f9fafb" }}>
                  <Package size={32} color="#d1d5db" style={{ marginBottom:10 }}/>
                  <p style={{ fontFamily:"Montserrat, sans-serif", fontSize:14, fontWeight:600, color:"#111", marginBottom:4 }}>Sipariş Bulunamadı</p>
                  <p style={{ fontFamily:"Montserrat, sans-serif", fontSize:12, color:"#6b7280" }}>Sipariş numarasını kontrol edip tekrar deneyin.</p>
                </div>
              )}

              {/* Sonuç */}
              {trackResult && (() => {
                const currentStep = trackResult.step >= 0 ? trackResult.step : 0;
                const isCancelled = trackResult.status === "iptal_edildi";
                const isReturned  = trackResult.status === "iade_edildi";
                return (
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

                    {/* Sipariş bilgileri */}
                    <div style={{ border:"1px solid #e5e7eb", borderRadius:8, overflow:"hidden" }}>
                      {/* Başlık + badge */}
                      <div style={{ padding:"12px 14px", borderBottom:"1px solid #e5e7eb", display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                        <div>
                          <p style={{ fontFamily:"Montserrat, sans-serif", fontSize:10, color:"#9ca3af", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 3px" }}>Sipariş No</p>
                          <p style={{ fontFamily:"Montserrat, sans-serif", fontSize:13, fontWeight:700, color:"#111", margin:0, wordBreak:"break-all" }}>{trackOrderNo.toUpperCase()}</p>
                        </div>
                        <span style={{
                          background: isCancelled?"#fee2e2":isReturned?"#ffedd5":currentStep===4?"#dcfce7":currentStep>=2?"#fdf8f0":"#f3f4f6",
                          color: isCancelled?"#dc2626":isReturned?"#ea580c":currentStep===4?"#16a34a":currentStep>=2?"#c9a96e":"#6b7280",
                          fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, whiteSpace:"nowrap", flexShrink:0
                        }}>
                          {isCancelled?"İptal Edildi":isReturned?"İade Edildi":TRACK_STEPS[currentStep]?.label}
                        </span>
                      </div>
                      {/* Bilgi grid — mobilde tek sütun */}
                      <div>
                        {[
                          { label:"Alıcı", value:trackResult.name },
                          { label:"Ürün", value:trackResult.product },
                          { label:"Teslimat Adresi", value:trackResult.address },
                          { label:"Kargo", value:`${trackResult.cargo}${trackResult.cargoNo!=="-"?" · "+trackResult.cargoNo:""}` },
                        ].map((item, i) => (
                          <div key={i} style={{ padding:"10px 14px", borderTop:"1px solid #e5e7eb" }}>
                            <p style={{ fontFamily:"Montserrat, sans-serif", fontSize:10, color:"#9ca3af", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 2px" }}>{item.label}</p>
                            <p style={{ fontFamily:"Montserrat, sans-serif", fontSize:12, color:"#374151", margin:0, wordBreak:"break-word" }}>{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Kargo adımları */}
                    <div style={{ border:"1px solid #e5e7eb", borderRadius:8, padding:"14px" }}>
                      <p style={{ fontFamily:"Montserrat, sans-serif", fontSize:13, fontWeight:700, color:"#111", margin:"0 0 14px" }}>Kargo Durumu</p>
                      {(isCancelled || isReturned) ? (
                        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", background:isCancelled?"#fef2f2":"#fff7ed", borderRadius:8, border:`1px solid ${isCancelled?"#fecaca":"#fed7aa"}` }}>
                          <span style={{ fontSize:20, flexShrink:0 }}>{isCancelled?"❌":"↩️"}</span>
                          <p style={{ fontFamily:"Montserrat, sans-serif", fontSize:12, color:isCancelled?"#dc2626":"#ea580c", fontWeight:600, margin:0 }}>
                            {isCancelled?"Bu sipariş iptal edilmiştir.":"Bu sipariş iade sürecindedir."}
                          </p>
                        </div>
                      ) : (
                        <div style={{ position:"relative" }}>
                          <div style={{ position:"absolute", left:17, top:18, bottom:18, width:1, background:"#e5e7eb" }}/>
                          <div style={{ position:"absolute", left:17, top:18, width:1, background:"#c9a96e", transition:"height 0.8s", height:`${Math.min(currentStep/(TRACK_STEPS.length-1),1)*100}%` }}/>
                          <div style={{ display:"flex", flexDirection:"column" }}>
                            {TRACK_STEPS.map((step, i) => {
                              const done   = i < currentStep;
                              const active = i === currentStep;
                              const future = i > currentStep;
                              return (
                                <div key={step.id} style={{ display:"flex", alignItems:"flex-start", gap:12, paddingBottom: i < TRACK_STEPS.length-1 ? 18 : 0 }}>
                                  <div style={{
                                    position:"relative", zIndex:1, width:34, height:34, borderRadius:"50%", flexShrink:0,
                                    display:"flex", alignItems:"center", justifyContent:"center",
                                    background: done?"#c9a96e":active?"#111":"#f3f4f6",
                                    border: active?"2.5px solid #c9a96e":"none",
                                    boxShadow: active?"0 0 0 3px rgba(201,169,110,0.15)":"none",
                                    transition:"all 0.4s",
                                  }}>
                                    {active && <span style={{ position:"absolute", inset:0, borderRadius:"50%", background:"rgba(201,169,110,0.3)", animation:"tkx-ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }}/>}
                                    <TrackStepIcon type={step.icon} active={active} done={done}/>
                                  </div>
                                  <div style={{ paddingTop:6, flex:1, minWidth:0 }}>
                                    <p style={{ fontFamily:"Montserrat, sans-serif", fontSize:12, fontWeight:active||done?600:400, color:future?"#9ca3af":"#111", margin:"0 0 1px" }}>{step.label}</p>
                                    <p style={{ fontFamily:"Montserrat, sans-serif", fontSize:11, color:future?"#d1d5db":"#6b7280", margin:0 }}>{step.desc}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
            <style>{`
              @keyframes tkx-spin { to { transform: rotate(360deg); } }
              @keyframes tkx-ping { 75%,100% { transform: scale(1.8); opacity: 0; } }
            `}</style>
          </div>
        )}

        {/* ── HESAP DETAYLARI ── */}
        {section === "settings" && (
          <div style={card}>
            <BackHeader title="Hesap Detayları" onBack={() => { setSection("menu"); cancelEdit(); }}/>
            <div style={{ padding:"18px 24px", borderBottom:"1px solid #e5e7eb" }}>
              <p style={{ margin:"0 0 4px", fontFamily:"Montserrat, sans-serif", fontSize:11, color:"#9ca3af", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em" }}>E-Posta</p>
              <p style={{ margin:0, fontFamily:"Montserrat, sans-serif", fontSize:13, color:"#374151" }}>{user.email}</p>
            </div>

            {/* Ad Soyad */}
            <div style={{ padding:"18px 24px", borderBottom:"1px solid #e5e7eb" }}>
              <p style={{ margin:"0 0 4px", fontFamily:"Montserrat, sans-serif", fontSize:11, color:"#9ca3af", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em" }}>Ad Soyad</p>
              {editField === "name" ? (
                <div style={{ marginTop:8 }}>
                  <input type="text" placeholder="Ad Soyad" value={editValue} onChange={e=>setEditValue(e.target.value)} style={inputStyle} autoFocus/>
                  {editMsg && <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:8 }}>{editMsg.type==="ok"?<Check size={13} color="#16a34a"/>:<AlertCircle size={13} color="#dc2626"/>}<span style={{ fontFamily:"Montserrat, sans-serif", fontSize:11, color:editMsg.type==="ok"?"#16a34a":"#dc2626" }}>{editMsg.text}</span></div>}
                  <div style={{ display:"flex", gap:8, marginTop:12 }}><button style={btnPrimary} onClick={saveEdit}>Kaydet</button><button style={btnOutline} onClick={cancelEdit}>İptal</button></div>
                </div>
              ) : (
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontFamily:"Montserrat, sans-serif", fontSize:13, color:"#374151" }}>{user.name}</span>
                  <button onClick={() => { setEditField("name"); setEditValue(user.name); setEditMsg(null); }} style={{ background:"none", border:"none", cursor:"pointer", color:"#6b7280", display:"flex", alignItems:"center", gap:5, fontFamily:"Montserrat, sans-serif", fontSize:12 }}><Pencil size={13}/> Düzenle</button>
                </div>
              )}
            </div>

            {/* Telefon */}
            <div style={{ padding:"18px 24px", borderBottom:"1px solid #e5e7eb" }}>
              <p style={{ margin:"0 0 4px", fontFamily:"Montserrat, sans-serif", fontSize:11, color:"#9ca3af", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em" }}>Telefon</p>
              {editField === "phone" ? (
                <div style={{ marginTop:8 }}>
                  <input type="text" placeholder="05XX XXX XX XX" value={editValue} onChange={e=>setEditValue(e.target.value)} style={inputStyle} autoFocus/>
                  {editMsg && <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:8 }}>{editMsg.type==="ok"?<Check size={13} color="#16a34a"/>:<AlertCircle size={13} color="#dc2626"/>}<span style={{ fontFamily:"Montserrat, sans-serif", fontSize:11, color:editMsg.type==="ok"?"#16a34a":"#dc2626" }}>{editMsg.text}</span></div>}
                  <div style={{ display:"flex", gap:8, marginTop:12 }}><button style={btnPrimary} onClick={saveEdit}>Kaydet</button><button style={btnOutline} onClick={cancelEdit}>İptal</button></div>
                </div>
              ) : (
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontFamily:"Montserrat, sans-serif", fontSize:13, color:"#374151" }}>{user.phone||"—"}</span>
                  <button onClick={() => { setEditField("phone"); setEditValue(user.phone||""); setEditMsg(null); }} style={{ background:"none", border:"none", cursor:"pointer", color:"#6b7280", display:"flex", alignItems:"center", gap:5, fontFamily:"Montserrat, sans-serif", fontSize:12 }}><Pencil size={13}/> Düzenle</button>
                </div>
              )}
            </div>

            {/* Şifre */}
            <div style={{ padding:"18px 24px" }}>
              <p style={{ margin:"0 0 4px", fontFamily:"Montserrat, sans-serif", fontSize:11, color:"#9ca3af", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em" }}>Şifre</p>
              {editField === "password" ? (
                <div style={{ marginTop:8 }}>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    <input type="password" placeholder="Mevcut şifre" value={editCurrentPw} onChange={e=>setEditCurrentPw(e.target.value)} style={inputStyle} autoFocus/>
                    <div style={{ position:"relative" }}>
                      <input type={showPw?"text":"password"} placeholder="Yeni şifre" value={editValue} onChange={e=>setEditValue(e.target.value)} style={{ ...inputStyle, paddingRight:40 }}/>
                      <button onClick={()=>setShowPw(v=>!v)} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#9ca3af" }}>{showPw?<EyeOff size={15}/>:<Eye size={15}/>}</button>
                    </div>
                    <input type={showPw?"text":"password"} placeholder="Yeni şifre tekrar" value={editValue2} onChange={e=>setEditValue2(e.target.value)} style={inputStyle}/>
                  </div>
                  {editMsg && <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:8 }}>{editMsg.type==="ok"?<Check size={13} color="#16a34a"/>:<AlertCircle size={13} color="#dc2626"/>}<span style={{ fontFamily:"Montserrat, sans-serif", fontSize:11, color:editMsg.type==="ok"?"#16a34a":"#dc2626" }}>{editMsg.text}</span></div>}
                  <div style={{ display:"flex", gap:8, marginTop:12 }}><button style={btnPrimary} onClick={saveEdit}>Kaydet</button><button style={btnOutline} onClick={cancelEdit}>İptal</button></div>
                </div>
              ) : (
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontFamily:"Montserrat, sans-serif", fontSize:13, color:"#374151" }}>••••••••</span>
                  <button onClick={() => { setEditField("password"); setEditValue(""); setEditValue2(""); setEditCurrentPw(""); setEditMsg(null); }} style={{ background:"none", border:"none", cursor:"pointer", color:"#6b7280", display:"flex", alignItems:"center", gap:5, fontFamily:"Montserrat, sans-serif", fontSize:12 }}><Pencil size={13}/> Düzenle</button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </PageLayout>
  );
};

export default Account;