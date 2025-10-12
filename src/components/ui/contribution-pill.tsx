import { formatCurrency } from '@/lib/utils';

interface ContributionPillProps {
  type: 'NONE' | 'MONEY' | 'ITEMS';
  priceCents?: number;
  note?: string | null;
}

export function ContributionPill({ type, priceCents, note }: ContributionPillProps) {
  if (type === 'NONE') {
    return <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Participation libre</span>;
  }
  if (type === 'MONEY') {
    return (
      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
        Contribution {priceCents ? formatCurrency(priceCents) : ''}
      </span>
    );
  }
  return (
    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
      {note ?? 'Apportez quelque chose'}
    </span>
  );
}