import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "plateful:theme"; // values: "light" | "dark" | "system"
const DEFAULT = "system";

const getSystemPref = () => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export function ThemeProvider({ children }) {
  // Always start as "system" by default (user requested)
  const [theme, setThemeState] = useState(DEFAULT); // "light" | "dark" | "system"
  const mediaRef = useRef(null);

  // Track the current system preference explicitly in state so we can react when it changes.
  const [systemPref, setSystemPref] = useState(() => getSystemPref());

  // effective now depends on both the theme selection and the live systemPref
  const effective = useMemo(() => (theme === "system" ? systemPref : theme), [theme, systemPref]);

  // apply class to documentElement whenever effective changes
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (effective === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [effective]);

  // persist theme & listen for system changes when in system mode
  useEffect(() => {
    // persist current theme selection to localStorage (so user's manual choice is saved)
    if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // ignore storage errors (e.g. privacy/no-storage)
      }
    }

    const isMatchMediaAvailable = typeof window !== "undefined" && typeof window.matchMedia === "function";
    if (!isMatchMediaAvailable) return;

    // set the initial system preference
    setSystemPref(getSystemPref());

    // If theme is "system", attach a listener to update systemPref on changes
    if (theme === "system") {
      // Clean up any old listener first
      if (mediaRef.current && mediaRef.current._listener) {
        const oldMq = mediaRef.current;
        if (oldMq.removeEventListener) oldMq.removeEventListener("change", oldMq._listener);
        else if (oldMq.removeListener) oldMq.removeListener(oldMq._listener);
        mediaRef.current = null;
      }

      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = (e) => {
        // e may be a MediaQueryListEvent or MediaQueryList depending on browser
        if (e && typeof e.matches === "boolean") {
          setSystemPref(e.matches ? "dark" : "light");
        } else {
          setSystemPref(getSystemPref());
        }
      };

      if (mq.addEventListener) mq.addEventListener("change", listener);
      else if (mq.addListener) mq.addListener(listener);

      // store reference for cleanup
      mq._listener = listener;
      mediaRef.current = mq;

      // cleanup when this effect re-runs or component unmounts
      return () => {
        if (mq.removeEventListener) mq.removeEventListener("change", listener);
        else if (mq.removeListener) mq.removeListener(listener);
        mediaRef.current = null;
      };
    } else {
      // not in system mode: ensure any previously attached listener is removed
      if (mediaRef.current && mediaRef.current._listener) {
        const old = mediaRef.current;
        if (old.removeEventListener) old.removeEventListener("change", old._listener);
        else if (old.removeListener) old.removeListener(old._listener);
        mediaRef.current = null;
      }
    }
  }, [theme]);

  // setter that validates input
  const setTheme = (next) => {
    setThemeState((cur) => {
      const resolved = typeof next === "function" ? next(cur) : next;
      if (resolved !== "light" && resolved !== "dark" && resolved !== "system") return cur;
      return resolved;
    });
  };

  // toggle only flips between light/dark (not system)
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
