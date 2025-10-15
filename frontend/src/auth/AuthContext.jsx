// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { api } from "../lib/api";

const AuthCtx = createContext(null);

const memoryStorage = new Map();

const getStorage = () =>
  typeof window !== "undefined" && window.localStorage
    ? window.localStorage
    : {
        getItem: (key) => (memoryStorage.has(key) ? memoryStorage.get(key) : null),
        setItem: (key, value) => memoryStorage.set(key, value),
        removeItem: (key) => memoryStorage.delete(key),
      };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const persistUserState = useCallback((updater) => {
    const storage = getStorage();
    setUser((prev) => {
      const nextValue = typeof updater === "function" ? updater(prev) : updater;
      if (nextValue) {
        try {
          storage.setItem("user", JSON.stringify(nextValue));
        } catch (err) {
          console.warn("Failed to persist user session", err);
        }
      } else {
        storage.removeItem("user");
      }
      return nextValue;
    });
  }, []);

  useEffect(() => {
    const storage = getStorage();
    const cached = storage.getItem("user");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setUser(parsed);
      } catch (err) {
        console.warn("Failed to parse cached user", err);
        storage.removeItem("user");
      }
    }
    setReady(true);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthed: !!user,
      setUserProfile: persistUserState,
      updateUserProfile(updates) {
        persistUserState((prev) => (prev ? { ...prev, ...updates } : updates));
      },

      // Call like: signIn({ email, password })
      async signIn({ email, password }) {
        const data = await api.login({ email: email.trim(), password });

        // Optional tokens if your backend returns them
        const storage = getStorage();
        if (data?.accessToken) storage.setItem("accessToken", data.accessToken);
        if (data?.refreshToken) storage.setItem("refreshToken", data.refreshToken);

        // Prefer user object from backend; otherwise derive from email
        const nextUser = data?.user
          ? data.user
          : {
              email: (data?.email ?? email).trim(),
              name: data?.user?.name ?? (data?.email ?? email).split("@")[0],
              username: (data?.email ?? email).split("@")[0],
            };

        persistUserState(nextUser);
      },

      // Call like: signUp({ email, password })
      async signUp({ email, password }) {
        return api.signup({ email, password }); // backend returns { email }
      },

      async signOut() {
        const storage = getStorage();
        try {
          await api.logout();
        } catch {}
        storage.removeItem("accessToken");
        storage.removeItem("refreshToken");
        persistUserState(null);
      },
    }),
    [user, persistUserState]
  );

  if (!ready) return null;
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
