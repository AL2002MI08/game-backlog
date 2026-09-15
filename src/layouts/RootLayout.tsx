import { useCallback, useMemo, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";
import FormModal from "@/components/FormModal";
import Form from "@/components/game-detail/Form";
import Toast from "@/components/ui/Toast";

export interface RootLayoutContext {
  openAddGame: () => void;
  showToast: (message: string) => void;
}

const TOAST_DURATION_MS = 3000;

export default function RootLayout() {
  const [showAdd, setShowAdd] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const showToast = useCallback((message: string) => {
    clearTimeout(toastTimeoutRef.current);
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), TOAST_DURATION_MS);
  }, []);

  const outletContext = useMemo<RootLayoutContext>(
    () => ({ openAddGame: () => setShowAdd(true), showToast }),
    [showToast]
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Navbar onAddGame={outletContext.openAddGame} />
      <FormModal opened={showAdd} onClose={() => setShowAdd(false)} title="Add Game">
        <Form
          mode="add"
          onSuccess={() => {
            setShowAdd(false);
            showToast("Game added successfully");
          }}
        />
      </FormModal>
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => {
            clearTimeout(toastTimeoutRef.current);
            setToastMessage(null);
          }}
        />
      )}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6">
        <Outlet context={outletContext} />
      </main>
    </div>
  );
}
