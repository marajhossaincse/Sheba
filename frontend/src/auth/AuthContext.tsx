import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, type User } from "../api/client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (input: {
    name: string;
    email: string;
    password: string;
    role: User["role"];
  }) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { user } = await api.login({ email, password });
    setUser(user);
    return user;
  }

  async function signup(input: {
    name: string;
    email: string;
    password: string;
    role: User["role"];
  }) {
    const { user } = await api.signup(input);
    setUser(user);
    return user;
  }

  async function logout() {
    await api.logout().catch(() => {
      /* clear local state regardless of network/API errors */
    });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
