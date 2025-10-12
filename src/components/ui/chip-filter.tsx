'use client';

import { ButtonHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type ChipFilterProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  selected?: boolean;
  icon?: LucideIcon;
};

export function ChipFilter({ label, selected, icon: Icon, className, ...props }: ChipFilterProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        selected ? 'border-brand-500 bg-brand-100 text-brand-800' : 'border-transparent bg-slate-100 text-slate-600 hover:bg-slate-200',
        className
      )}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
      <span>{label}</span>
    </button>
  );
}