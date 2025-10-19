import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const TextSizeContext = createContext(null);

const STORAGE_KEY = "plateful:text-scale";
const DEFAULT_SCALE = 1;
const MIN_SCALE = 0.80;
const MAX_SCALE = 1.30;

const clamp = (value) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));

const readInitialScale = () => {
  if (typeof window === "undefined") {
    return DEFAULT_SCALE;
  }

  const stored = window.localStorage?.getItem(STORAGE_KEY);
  if (!stored) {
    return DEFAULT_SCALE;
  }

  const parsed = Number.parseFloat(stored);
  if (Number.isFinite(parsed)) {
    return clamp(parsed);
  }

  return DEFAULT_SCALE;
};

export function TextSizeProvider({ children }) {
  const [scale, setScaleState] = useState(() => readInitialScale());
  const animationRef = useRef(null);
  const appliedScaleRef = useRef(scale);

  const applyFontSize = (value) => {
    if (typeof document === "undefined") {
      return;
    }

    const normalized = clamp(value);
    const root = document.documentElement;
    root.style.fontSize = `${(normalized * 100).toFixed(2)}%`;
    appliedScaleRef.current = normalized;
  };

  useEffect(() => {
    applyFontSize(appliedScaleRef.current);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const target = clamp(scale);

    if (typeof window !== "undefined") {
      window.localStorage?.setItem(STORAGE_KEY, String(target));
    }

    if (typeof window === "undefined" || typeof document === "undefined") {
      appliedScaleRef.current = target;
      return;
    }

    const start = appliedScaleRef.current;
    const delta = target - start;

    if (Math.abs(delta) < 0.001) {
      applyFontSize(target);
      return;
    }

    const duration = 180;
    const startTime = performance.now();

    const tick = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = start + delta * eased;
      applyFontSize(next);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(tick);
      } else {
        animationRef.current = null;
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    animationRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [scale]);

  const setScale = (next) => {
    setScaleState((current) => {
      const resolved =
        typeof next === "function" ? next(current) : Number.parseFloat(next);

      if (!Number.isFinite(resolved)) {
        return current;
      }

      const rounded = Math.round(resolved * 100) / 100;
      return clamp(rounded);
    });
  };

  const value = useMemo(
    () => ({
      scale,
      setScale,
      min: MIN_SCALE,
      max: MAX_SCALE,
    }),
    [scale]
  );

  return (
    <TextSizeContext.Provider value={value}>
      {children}
    </TextSizeContext.Provider>
  );
}

export function useTextSize() {
  const ctx = useContext(TextSizeContext);
  if (!ctx) {
    throw new Error("useTextSize must be used within TextSizeProvider");
  }
  return ctx;
}
