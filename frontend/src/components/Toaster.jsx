import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastCtx = createContext(null);

export function ToasterProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((t) => {
    const id = crypto.randomUUID();
    const toast = { id, title: t.title, desc: t.description, type: t.type || "success", ms: t.ms ?? 2800 };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), toast.ms);
  }, []);

  const value = useMemo(() => ({ toast: push }), [push]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      {/* portal-ish fixed container */}
      <div className="fixed inset-x-0 top-4 z-[2000] flex justify-center px-4 pointer-events-none">
        <div className="w-full max-w-md space-y-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`pointer-events-auto rounded-xl shadow-lg ring-1 ring-slate-200 bg-white px-4 py-3 animate-in fade-in slide-in-from-top-2`}
            >
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 text-lg ${t.type === "success" ? "text-emerald-600" : t.type === "error" ? "text-rose-600" : "text-slate-600"}`}>
                  {t.type === "success" ? "✔" : t.type === "error" ? "✗" : "ℹ"}
                </span>
                <div>
                  <div className="font-semibold text-slate-800">{t.title}</div>
                  {t.desc && <div className="text-sm text-slate-600">{t.desc}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToasterProvider>");
  return ctx.toast;
}
