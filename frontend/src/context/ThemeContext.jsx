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

  // Track the current system preference explicitly in state so we can react when it changes.
  const [systemPref, setSystemPref] = useState(() => getSystemPref());

  // effective now depends on both the theme selection and the live systemPref
  const effective = useMemo(() => (theme === "system" ? systemPref : theme), [theme, systemPref]);

  // apply class to documentElement whenever effective changes
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

    const isMatchMediaAvailable = typeof window !== "undefined" && typeof window.matchMedia === "function";
    if (!isMatchMediaAvailable) return;

    // always ensure we have the latest systemPref initially
    setSystemPref(getSystemPref());

    // when theme is system, attach listener; otherwise remove any existing listener
    if (theme === "system") {
      // remove old listener first if present
      if (mediaRef.current && mediaRef.current._listener) {
        const oldMq = mediaRef.current;
        if (oldMq.removeEventListener) oldMq.removeEventListener("change", oldMq._listener);
        else if (oldMq.removeListener) oldMq.removeListener(oldMq._listener);
        mediaRef.current = null;
      }

      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = (e) => {
        // update our systemPref state so effective recalculates
        setSystemPref(e && typeof e.matches === "boolean" ? (e.matches ? "dark" : "light") : getSystemPref());
      };

      if (mq.addEventListener) mq.addEventListener("change", listener);
      else if (mq.addListener) mq.addListener(listener);

      mq._listener = listener;
      mediaRef.current = mq;

      return () => {
        if (mq.removeEventListener) mq.removeEventListener("change", listener);
        else if (mq.removeListener) mq.removeListener(listener);
      };
    } else {
      // if not in system mode, cleanup any attached listener
      if (mediaRef.current && mediaRef.current._listener) {
        const old = mediaRef.current;
        if (old.removeEventListener) old.removeEventListener("change", old._listener);
        else if (old.removeListener) old.removeListener(old._listener);
        mediaRef.current = null;
      }
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
