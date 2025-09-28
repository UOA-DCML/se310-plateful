// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem("user");
    if (cached) setUser(JSON.parse(cached));
    setReady(true);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthed: !!user,

      // Call like: signIn({ email, password })
      async signIn({ email, password }) {
        const data = await api.login({ email: email.trim(), password });

        // Optional tokens if your backend returns them
        if (data?.accessToken) localStorage.setItem("accessToken", data.accessToken);
        if (data?.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);

        // Prefer user object from backend; otherwise derive from email
        const nextUser = data?.user
          ? data.user
          : { email: data?.email ?? email.trim(), username: (data?.email ?? email).split("@")[0] };

        localStorage.setItem("user", JSON.stringify(nextUser));
        setUser(nextUser);
      },

      // Call like: signUp({ email, password })
      async signUp({ email, password }) {
        return api.signup({ email, password }); // backend returns { email }
      },

      async signOut() {
        try { await api.logout(); } catch {}
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setUser(null);
      },
    }),
    [user]
  );

  if (!ready) return null;
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
