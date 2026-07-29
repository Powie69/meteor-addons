import { createContext, type ComponentChildren } from "preact";
import {
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "preact/hooks";

type ToastType = "success" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ComponentChildren }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const popoverRef = useRef<HTMLDivElement>(null);

  const addToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    [],
  );

  useEffect(() => {
    const el = popoverRef.current;
    if (!el) return;
    try {
      if (toasts.length > 0) el.showPopover();
      else el.hidePopover();
    } catch {}
  }, [toasts.length]);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div
        ref={popoverRef}
        popover="manual"
        class="fixed bottom-5 right-5 flex flex-col gap-2 inset-auto m-0 border-none bg-transparent p-0 overflow-visible"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            class={`animate-[slideUp_0.3s_ease-out] px-4 py-2 rounded shadow-lg text-sm font-medium text-white ${
              t.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
