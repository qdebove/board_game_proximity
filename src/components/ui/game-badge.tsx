import { cn } from '@/lib/utils';

interface GameBadgeProps {
  name: string;
  category?: string;
  className?: string;
}

export function GameBadge({ name, category, className }: GameBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700',
        className
      )}
    >
      {name}
      {category ? <span className="text-[10px] uppercase text-slate-400">{category}</span> : null}
    </span>
  );
}