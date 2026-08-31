/**
 * Simple Toast Context and Provider.
 * @module shared/context/ToastContext
 */
import React, { createContext, useContext, useState, useCallback } from "react";
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, XIcon } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((type: ToastType, title: string, description?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, description }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success": return <CircleCheckIcon className="text-green-500 size-5" />;
      case "error": return <OctagonXIcon className="text-red-500 size-5" />;
      case "warning": return <TriangleAlertIcon className="text-amber-500 size-5" />;
      case "info": return <InfoIcon className="text-blue-500 size-5" />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 p-4 bg-popover text-popover-foreground border rounded-xl shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2"
          >
            {getIcon(t.type)}
            <div className="flex-1">
              <h4 className="text-sm font-semibold">{t.title}</h4>
              {t.description && <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <XIcon className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Hook to access custom toast manager.
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}