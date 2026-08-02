export interface AuthUser {
  email: string;
  name: string;
  role: string;
  avatar: string;
}

const USERS = [
  { email: "admin@bhandariandco.com", password: "Admin@123", name: "Jitinder Singh", role: "Super Admin", avatar: "JS" },
  { email: "staff@bhandariandco.com",  password: "Staff@123",  name: "Priya Sharma",   role: "Staff",       avatar: "PS" },
];

const KEY = "bc_admin_v1";

export function getAuth(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); }
  catch { return null; }
}

export function setAuth(user: AuthUser) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}

export function doLogin(email: string, password: string): AuthUser | null {
  const u = USERS.find(u => u.email === email && u.password === password);
  if (!u) return null;
  const user: AuthUser = { email: u.email, name: u.name, role: u.role, avatar: u.avatar };
  setAuth(user);
  return user;
}
