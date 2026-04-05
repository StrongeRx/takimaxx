import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "@/lib/firebase";

interface User {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface StoredUser extends User {
  passwordHash: string;
  createdAt?: string;
}

interface LegacyStoredUser extends StoredUser {
  password?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithFacebook: () => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

// ─── PBKDF2 (Web Crypto API) ──────────────────────────────────────────────────

const generateSalt = (): string => {
  const arr = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
};

const hexToBytes = (hex: string): ArrayBuffer => {
  const bytes = hex.match(/.{2}/g)!.map(b => parseInt(b, 16));
  const buffer = new ArrayBuffer(bytes.length);
  const view = new Uint8Array(buffer);
  bytes.forEach((b, i) => { view[i] = b; });
  return buffer;
};

const bytesToHex = (bytes: ArrayBuffer): string =>
  Array.from(new Uint8Array(bytes)).map(b => b.toString(16).padStart(2, "0")).join("");

const hashPassword = async (password: string, salt?: string): Promise<string> => {
  const usedSalt = salt ?? generateSalt();
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: hexToBytes(usedSalt), iterations: 200_000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return `pbkdf2$${usedSalt}$${bytesToHex(derived)}`;
};

const legacyHash = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `tkx_${Math.abs(hash).toString(36)}_${password.length}`;
};

const verifyPassword = async (password: string, storedHash: string): Promise<boolean> => {
  if (storedHash.startsWith("pbkdf2$")) {
    const [, salt] = storedHash.split("$");
    return (await hashPassword(password, salt)) === storedHash;
  }
  if (storedHash.startsWith("tkx_")) return legacyHash(password) === storedHash;
  return password === storedHash;
};

// ─── Depolama katmanı ─────────────────────────────────────────────────────────
// Kullanıcı listesi (hash dahil) → localStorage (kalıcı, sadece hash barındırır)
// Oturum (kişisel bilgiler, hash yok) → sessionStorage (sekme kapanınca silinir)
// XSS saldırısında sessionStorage daha kısa süre açıkta kalır; hash hiç açıkta kalmaz.

const STORAGE_USERS_KEY   = "takimax_users";
const STORAGE_SESSION_KEY = "takimax_session";

const loadUsers = (): StoredUser[] => {
  try { const r = localStorage.getItem(STORAGE_USERS_KEY); return r ? JSON.parse(r) : []; }
  catch { return []; }
};
const saveUsers = (u: StoredUser[]) => localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(u));

// Session: sadece name, email, phone, avatar — passwordHash ASLA yazılmaz
const loadSession = (): User | null => {
  try { const r = sessionStorage.getItem(STORAGE_SESSION_KEY); return r ? JSON.parse(r) : null; }
  catch { return null; }
};
const saveSession = (u: User | null) => {
  if (!u) { sessionStorage.removeItem(STORAGE_SESSION_KEY); return; }
  // passwordHash veya password alanı varsa çıkar
  const { name, email, phone, avatar } = u as User & { passwordHash?: string; password?: string };
  sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify({ name, email, phone, avatar }));
};

// ─── Provider ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(loadSession);

  useEffect(() => { saveSession(user); }, [user]);

  const register = useCallback(async (name: string, email: string, password: string, phone?: string) => {
    const all = loadUsers();
    if (all.find(u => u.email.toLowerCase() === email.toLowerCase()))
      return { success: false, error: "Bu e-posta adresiyle zaten bir hesap mevcut." };
    const newUser: StoredUser = { name, email, passwordHash: await hashPassword(password), createdAt: new Date().toLocaleDateString("tr-TR"), ...(phone ? { phone } : {}) };
    saveUsers([...all, newUser]);
    return { success: true };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const all = loadUsers() as LegacyStoredUser[];
    const found = all.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return { success: false, error: "E-posta veya şifre hatalı." };
    const hashToCheck = found.passwordHash ?? found.password ?? "";
    if (!(await verifyPassword(password, hashToCheck))) return { success: false, error: "E-posta veya şifre hatalı." };
    if (!hashToCheck.startsWith("pbkdf2$")) {
      const upgraded = await hashPassword(password);
      saveUsers(all.map(u => u.email.toLowerCase() === email.toLowerCase() ? { ...u, passwordHash: upgraded, password: undefined } : u));
    }
    const sessionUser: User = { name: found.name, email: found.email, phone: found.phone };
    setUser(sessionUser); saveSession(sessionUser);
    return { success: true };
  }, []);

  // ─── Google ile Giriş ─────────────────────────────────────────────────────
  const loginWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const sessionUser: User = {
        name: firebaseUser.displayName ?? "Kullanıcı",
        email: firebaseUser.email ?? "",
        avatar: firebaseUser.photoURL ?? undefined,
      };
      // Kullanıcı daha önce kayıtlı değilse localStorage'a kaydet
      const all = loadUsers();
      if (!all.find(u => u.email.toLowerCase() === sessionUser.email.toLowerCase())) {
        saveUsers([...all, { ...sessionUser, passwordHash: "google_oauth", createdAt: new Date().toLocaleDateString("tr-TR") }]);
      }
      setUser(sessionUser);
      saveSession(sessionUser);
      return { success: true };
    } catch (err: unknown) {
      const error = err as { code?: string };
      if (error.code === "auth/popup-closed-by-user") return { success: false, error: "Giriş penceresi kapatıldı." };
      return { success: false, error: "Google ile giriş başarısız oldu." };
    }
  }, []);

  // ─── Facebook ile Giriş ───────────────────────────────────────────────────
  const loginWithFacebook = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const firebaseUser = result.user;
      const sessionUser: User = {
        name: firebaseUser.displayName ?? "Kullanıcı",
        email: firebaseUser.email ?? "",
        avatar: firebaseUser.photoURL ?? undefined,
      };
      const all = loadUsers();
      if (!all.find(u => u.email.toLowerCase() === sessionUser.email.toLowerCase())) {
        saveUsers([...all, { ...sessionUser, passwordHash: "facebook_oauth", createdAt: new Date().toLocaleDateString("tr-TR") }]);
      }
      setUser(sessionUser);
      saveSession(sessionUser);
      return { success: true };
    } catch (err: unknown) {
      const error = err as { code?: string };
      if (error.code === "auth/popup-closed-by-user") return { success: false, error: "Giriş penceresi kapatıldı." };
      return { success: false, error: "Facebook ile giriş başarısız oldu." };
    }
  }, []);

  const logout = useCallback(() => { setUser(null); saveSession(null); }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      saveSession(updated);
      saveUsers(loadUsers().map(u => u.email.toLowerCase() === prev.email.toLowerCase() ? { ...u, ...data } : u));
      return updated;
    });
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!user) return { success: false, error: "Oturum açık değil." };
    const all = loadUsers() as LegacyStoredUser[];
    const found = all.find(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (!found) return { success: false, error: "Kullanıcı bulunamadı." };
    const hashToCheck = found.passwordHash ?? found.password ?? "";
    if (!(await verifyPassword(currentPassword, hashToCheck))) return { success: false, error: "Mevcut şifreniz hatalı." };
    const newHash = await hashPassword(newPassword);
    saveUsers(all.map(u => u.email.toLowerCase() === user.email.toLowerCase() ? { ...u, passwordHash: newHash, password: undefined } : u));
    return { success: true };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, loginWithGoogle, loginWithFacebook, register, logout, updateUser, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};