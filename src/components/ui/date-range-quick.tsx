'use client';

import { cn } from '@/lib/utils';

const ranges = [
  { value: 'today', label: "Ce soir" },
  { value: 'weekend', label: 'Ce week-end' },
  { value: 'week', label: 'Cette semaine' },
  { value: 'custom', label: 'Dates...' },
];

interface DateRangeQuickProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function DateRangeQuick({ value, onValueChange }: DateRangeQuickProps) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1 text-xs font-semibold">
      {ranges.map((range) => (
        <button
          key={range.value}
          type="button"
          className={cn(
            'rounded-full px-3 py-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1',
            value === range.value ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          )}
          onClick={() => onValueChange(range.value)}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}