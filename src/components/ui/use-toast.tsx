'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

type Toast = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  duration?: number;
};

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'text-slate-900',
        destructive: 'border-red-200 bg-red-50 text-red-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type ToastProps = Toast & VariantProps<typeof toastVariants>;

type ToastContextValue = {
  toasts: ToastProps[];
  dismiss: (id: string) => void;
  publish: (toast: Omit<ToastProps, 'id'>) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

function ToastViewport({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none fixed top-0 right-0 z-50 flex max-h-screen w-full max-w-sm flex-col gap-2 p-4">
      {children}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastProps; onDismiss: (id: string) => void }) {
  React.useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return;

    const timeout = window.setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => window.clearTimeout(timeout);
  }, [toast, onDismiss]);

  return (
    <div className={cn(toastVariants({ variant: toast.variant }))} role="status">
      <div className="flex flex-col gap-1">
        {toast.title ? <p className="font-semibold">{toast.title}</p> : null}
        {toast.description ? <p className="text-sm text-slate-600">{toast.description}</p> : null}
      </div>
      {toast.action}
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const publish = React.useCallback((toast: Omit<ToastProps, 'id'>) => {
    setToasts((prev) => [...prev, { ...toast, id: crypto.randomUUID(), duration: toast.duration ?? 5000 }]);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, dismiss, publish }}>
      {children}
      <ToastViewport>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </ToastViewport>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}