import { useCallback, useMemo, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";
import FormModal from "@/components/FormModal";
import Form from "@/components/game-detail/Form";
import Toast, { ToastVariant } from "@/components/ui/Toast";

export interface RootLayoutContext {
  openAddGame: () => void;
  showToast: (message: string, variant?: ToastVariant) => void;
}

const TOAST_DURATION_MS = 3000;

export default function RootLayout() {
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant: ToastVariant } | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const showToast = useCallback((message: string, variant: ToastVariant = "success") => {
    clearTimeout(toastTimeoutRef.current);
    setToast({ message, variant });
    toastTimeoutRef.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);

  const outletContext = useMemo<RootLayoutContext>(
    () => ({ openAddGame: () => setShowAdd(true), showToast }),
    [showToast]
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col md:pl-16 sm:md:pl-20 transition-colors duration-200">
      <Sidebar />
      <Navbar onAddGame={outletContext.openAddGame} />
      <FormModal opened={showAdd} onClose={() => setShowAdd(false)} title="Add Game">
        <Form
          mode="add"
          onSuccess={() => {
            setShowAdd(false);
            showToast("Game added successfully");
          }}
          onError={(message) => showToast(message, "error")}
        />
      </FormModal>
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => {
            clearTimeout(toastTimeoutRef.current);
            setToast(null);
          }}
        />
      )}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6">
        <Outlet context={outletContext} />
      </main>
    </div>
  );
}
