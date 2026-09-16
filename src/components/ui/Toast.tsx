import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";

export type ToastVariant = "success" | "error";

export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onClose: () => void;
}

export default function Toast({ message, variant = "success", onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const isError = variant === "error";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-1000 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div
        className={`flex items-center gap-3 max-w-sm rounded-xl border bg-white dark:bg-[#090e1c] text-slate-800 dark:text-slate-100 shadow-xl px-4 py-3 ${
          isError ? "border-rose-500/30" : "border-emerald-500/30"
        }`}
      >
        {isError ? (
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
        )}
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
