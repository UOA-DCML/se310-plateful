import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "plateful:theme"; // values: "light" | "dark" | "system"
const DEFAULT = "system";

const readStored = () => {
  if (typeof window === "undefined") return DEFAULT;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw === "light" || raw === "dark" || raw === "system" ? raw : DEFAULT;
};

const getSystemPref = () => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => readStored()); // "light"|"dark"|"system"
  const mediaRef = useRef(null);

  const effective = useMemo(() => (theme === "system" ? getSystemPref() : theme), [theme]);

  // apply class to documentElement
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (effective === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [effective]);

  // persist theme & listen for system changes when in system mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }

    if (theme !== "system") {
      // remove any listener
      if (mediaRef.current) {
        mediaRef.current.removeEventListener("change", mediaRef.current._listener);
        mediaRef.current = null;
      }
      return;
    }

    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => {
        // force update; small trick: set state to itself to trigger effective recalculation
        setThemeState((t) => t);
      };
      mq.addEventListener ? mq.addEventListener("change", listener) : mq.addListener(listener);
      mq._listener = listener;
      mediaRef.current = mq;
      return () => {
        mq.removeEventListener ? mq.removeEventListener("change", listener) : mq.removeListener(listener);
      };
    }
  }, [theme]);

  const setTheme = (next) => {
    setThemeState((cur) => {
      const resolved = typeof next === "function" ? next(cur) : next;
      if (resolved !== "light" && resolved !== "dark" && resolved !== "system") return cur;
      return resolved;
    });
  };

  const toggle = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  const value = useMemo(
    () => ({
      theme, // "light"|"dark"|"system"
      effective, // "light"|"dark" (actual currently applied)
      setTheme,
      toggle,
      isDark: effective === "dark",
    }),
    [theme, effective]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
