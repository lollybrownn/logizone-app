// src/context/ToastContext.jsx
// Lightweight toast notifications, used after every create/update/delete
// action across all FR pages (e.g. "Barang berhasil didata", "Zona tidak
// dapat dihapus karena masih berisi barang" from the backend's VR messages).
import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message, { type = "info", duration = 4000 } = {}) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss],
  );

  const success = useCallback((message, opts) => show(message, { ...opts, type: "success" }), [show]);
  const error = useCallback((message, opts) => show(message, { ...opts, type: "error" }), [show]);

  const value = { toasts, show, success, error, dismiss };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
