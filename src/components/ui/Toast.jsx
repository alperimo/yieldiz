import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { TOAST_DURATION_MS } from '../../lib/constants';

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const toastStyles = {
  success: 'border-sg-success/30 bg-sg-success/10',
  error: 'border-sg-error/30 bg-sg-error/10',
  info: 'border-sg-accent-blue/30 bg-sg-accent-blue/10',
};

let addToastGlobal = null;

export function toast(message, type = 'info') {
  if (addToastGlobal) {
    addToastGlobal({ message, type, id: Date.now() });
  }
}

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((t) => {
    setToasts((prev) => {
      // Deduplicate: skip if same message is already visible
      if (prev.some((existing) => existing.message === t.message && existing.type === t.type)) {
        return prev;
      }
      return [...prev, t];
    });
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== t.id));
    }, TOAST_DURATION_MS);
  }, []);

  useEffect(() => {
    addToastGlobal = addToast;
    return () => { addToastGlobal = null; };
  }, [addToast]);

  const dismiss = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => {
        const Icon = toastIcons[t.type] || Info;
        return (
          <div
            key={t.id}
            className={`
              flex items-start gap-3 p-4 rounded-card border
              bg-sg-bg-secondary backdrop-blur-sm
              ${toastStyles[t.type]}
              animate-[slideIn_200ms_ease-out]
            `}
          >
            <Icon size={18} className="mt-0.5 shrink-0" />
            <span className="text-body text-sg-text flex-1">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="text-sg-text-tertiary hover:text-sg-text">
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
