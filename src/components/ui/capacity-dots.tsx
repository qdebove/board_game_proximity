import { cn } from '@/lib/utils';

interface CapacityDotsProps {
  capacity: number;
  taken: number;
}

export function CapacityDots({ capacity, taken }: CapacityDotsProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: capacity }).map((_, index) => (
        <span
          key={index}
          className={cn(
            'inline-flex h-2.5 w-2.5 rounded-full border border-slate-200',
            index < taken ? 'bg-brand-500' : 'bg-white'
          )}
          aria-hidden
        />
      ))}
      <span className="text-xs text-slate-500">{taken}/{capacity}</span>
    </div>
  );
}