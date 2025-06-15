import { useState, useCallback } from 'react';

type ToastVariant = 'default' | 'destructive' | 'success';

export interface ToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastState extends ToastProps {
  id: string;
}

interface ToastContextType {
  toasts: ToastState[];
  toast: (props: ToastProps) => void;
  dismiss: (id: string) => void;
}

export const useToast = (): ToastContextType => {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const toast = useCallback(
    ({ title, description, variant = 'default', duration = 5000 }: ToastProps) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = { id, title, description, variant, duration };
      
      setToasts((prevToasts) => [...prevToasts, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
        }, duration);
      }

      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return { toasts, toast, dismiss };
};