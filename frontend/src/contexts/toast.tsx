import React, { createContext, useCallback, useContext, useState } from "react";

export type ToastType = "info" | "success" | "error";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastContextValue {
  toasts: ToastItem[];
  push: (toast: Omit<ToastItem, "id">) => string;
  remove: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((t: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2, 9);
    const item: ToastItem = { id, ...t };
    setToasts((s) => [item, ...s]);
    // auto-dismiss
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 6000);
    return id;
  }, []);

  const remove = useCallback((id: string) => setToasts((s) => s.filter((t) => t.id !== id)), []);

  return (
    <ToastContext.Provider value={{ toasts, push, remove }}>
      {children}
      {/* listen for window custom events to allow non-hook producers to push toasts */}
      <ToastEventListener onPush={(msg) => push(msg)} />
      <div aria-live="polite" className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6">
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`pointer-events-auto max-w-sm w-full rounded-md shadow-lg ring-1 ring-black/5 overflow-hidden ${
                t.type === "success" ? "bg-emerald-50" : t.type === "error" ? "bg-red-50" : "bg-white"
              }`}
            >
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-1 w-0">
                    <p className="text-sm font-semibold text-slate-900">{t.title ?? (t.type === "error" ? "Error" : t.type === "success" ? "Success" : "Info")}</p>
                    <p className="mt-1 text-sm text-slate-700">{t.message}</p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => remove(t.id)}
                      className="inline-flex rounded-md bg-white text-slate-500 hover:text-slate-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

function ToastEventListener({ onPush }: { onPush: (t: Omit<ToastItem, "id">) => void }) {
  React.useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent).detail as any;
      if (detail && detail.message) {
        onPush({ type: detail.type ?? "info", message: String(detail.message), title: detail.title });
      }
    }

    window.addEventListener("pdfnest:toast", handler as EventListener);
    return () => window.removeEventListener("pdfnest:toast", handler as EventListener);
  }, [onPush]);

  return null;
}
