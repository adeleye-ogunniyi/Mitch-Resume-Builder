import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useToast, ToastProps } from './useToast';

export const Toaster: React.FC = () => {
  const { toasts, dismiss } = useToast();

  // Close toast on ESC key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && toasts.length > 0) {
        dismiss(toasts[toasts.length - 1].id);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toasts, dismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-2 md:max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
};

interface ToastComponentProps {
  toast: ToastProps & { id: string };
  onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastComponentProps> = ({ toast, onDismiss }) => {
  const { id, title, description, variant = 'default' } = toast;

  const bgColor = 
    variant === 'destructive' ? 'bg-red-50 border-red-200' : 
    variant === 'success' ? 'bg-green-50 border-green-200' : 
    'bg-white border-slate-200';

  const textColor = 
    variant === 'destructive' ? 'text-red-800' : 
    variant === 'success' ? 'text-green-800' : 
    'text-slate-800';
  
  const iconColor = 
    variant === 'destructive' ? 'text-red-500' : 
    variant === 'success' ? 'text-green-500' : 
    'text-blue-500';

  return (
    <div 
      className={`w-full rounded-lg border shadow-lg ${bgColor} p-4 flex items-start animate-slide-in transition-all duration-200`}
      style={{ transformOrigin: 'bottom right' }}
    >
      <div className={`flex-shrink-0 mr-3 pt-0.5 ${iconColor}`}>
        {variant === 'destructive' ? (
          <AlertCircle className="h-5 w-5" />
        ) : variant === 'success' ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <Info className="h-5 w-5" />
        )}
      </div>
      <div className="flex-1 mr-2">
        <h3 className={`text-sm font-medium ${textColor}`}>{title}</h3>
        {description && <p className={`mt-1 text-sm ${variant === 'default' ? 'text-slate-500' : textColor}`}>{description}</p>}
      </div>
      <button
        className={`flex-shrink-0 ${variant === 'default' ? 'text-slate-400 hover:text-slate-500' : textColor}`}
        onClick={() => onDismiss(id)}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};