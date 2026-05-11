"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning";

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={16} className="text-green-600" />,
  error:   <XCircle    size={16} className="text-red-600"   />,
  warning: <AlertCircle size={16} className="text-amber-600" />,
};

const styles: Record<ToastType, string> = {
  success: "border-green-200 bg-green-50",
  error:   "border-red-200   bg-red-50",
  warning: "border-amber-200 bg-amber-50",
};

let _setToasts: React.Dispatch<React.SetStateAction<ToastMessage[]>> | null = null;

export function toast(type: ToastType, message: string) {
  const id = Math.random().toString(36).slice(2);
  _setToasts?.((prev) => [...prev, { id, type, message }]);
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  _setToasts = setToasts;

  const dismiss = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => dismiss(toasts[0].id), 4000);
    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-80"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className={cn(
            "flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slide-in",
            styles[t.type],
          )}
        >
          <span className="flex-shrink-0 mt-0.5">{icons[t.type]}</span>
          <p className="text-sm text-neutral-800 flex-1">{t.message}</p>
          <button
            onClick={() => dismiss(t.id)}
            aria-label="Dismiss"
            className="flex-shrink-0 text-neutral-400 hover:text-neutral-600"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
