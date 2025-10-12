'use client';

import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

type Toast = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  duration?: number;
};

const ToastViewport = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Viewport>, React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>>(
  ({ className, ...props }, ref) => (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn('fixed top-0 right-0 z-50 flex max-h-screen w-full max-w-sm flex-col gap-2 p-4', className)}
      {...props}
    />
  )
);
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

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

const ToastContext = React.createContext<{
  toasts: ToastProps[];
  dismiss: (id: string) => void;
  publish: (toast: Omit<ToastProps, 'id'>) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const publish = React.useCallback((toast: Omit<ToastProps, 'id'>) => {
    setToasts((prev) => [...prev, { ...toast, id: crypto.randomUUID() }]);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, dismiss, publish }}>
      {children}
      <ToastPrimitives.Provider swipeDirection="right">
        {toasts.map(({ id, variant, title, description, action, duration }) => (
          <ToastPrimitives.Root
            key={id}
            duration={duration ?? 5000}
            onOpenChange={(open) => {
              if (!open) dismiss(id);
            }}
            className={toastVariants({ variant })}
          >
            <div className="flex flex-col gap-1">
              {title ? <p className="font-semibold">{title}</p> : null}
              {description ? <p className="text-sm text-slate-600">{description}</p> : null}
            </div>
            {action}
          </ToastPrimitives.Root>
        ))}
        <ToastViewport />
      </ToastPrimitives.Provider>
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