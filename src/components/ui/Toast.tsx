import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

export interface ToastProps {
  message: string;
  onClose: () => void;
}

// A minimal, self-built toast — no new dependency. Mantine ships this as a
// separate `@mantine/notifications` package we don't have installed, and
// pulling it in for one success message wasn't worth a new library; this is
// just a fixed-position card using the same Tailwind + lucide-react
// primitives as the rest of the UI.
export default function Toast({ message, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Mount transition: render off-screen/transparent for one frame, then
    // transition in, rather than popping in abruptly.
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-[1000] transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div className="flex items-center gap-3 max-w-sm rounded-xl border border-emerald-500/30 bg-white dark:bg-[#090e1c] text-slate-800 dark:text-slate-100 shadow-xl px-4 py-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
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
