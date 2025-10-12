import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CapacityDots } from '@/components/ui/capacity-dots';
import { ContributionPill } from '@/components/ui/contribution-pill';
import { GameBadge } from '@/components/ui/game-badge';
import { cn } from '@/lib/utils';

export interface SessionCardProps {
  session: {
    id: string;
    title: string;
    games: string[];
    startsAt: string;
    endsAt: string;
    addressApprox: string;
    capacity: number;
    attendeesCount: number;
    contribution: {
      type: 'NONE' | 'MONEY' | 'ITEMS';
      priceCents?: number;
      note?: string;
    };
    visibility: 'PUBLIC' | 'FRIENDS' | 'LINK';
    thumbnailUrl?: string | null;
  };
  compact?: boolean;
}

export function SessionCard({ session, compact = false }: SessionCardProps) {
  const startDate = new Date(session.startsAt);

  return (
    <article
      className={cn(
        'group flex w-full gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-300 hover:shadow-md',
        compact && 'items-center'
      )}
    >
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
        <Image
          src={session.thumbnailUrl ?? '/images/session-placeholder.svg'}
          alt={session.title}
          fill
          className="object-cover"
        />
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
          {session.visibility === 'PUBLIC'
            ? 'Publique'
            : session.visibility === 'FRIENDS'
            ? 'Amis'
            : 'Sur invitation'}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <Link href={`/sessions/${session.id}`} className="text-lg font-semibold text-slate-900 hover:text-brand-700">
            {session.title}
          </Link>
          <span className="text-sm text-slate-500">
            {format(startDate, "EEE d MMM à HH'h'mm", { locale: fr })}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <span>{session.addressApprox}</span>
          <CapacityDots capacity={session.capacity} taken={session.attendeesCount} />
          <ContributionPill {...session.contribution} />
        </div>
        <div className="flex flex-wrap gap-1">
          {session.games.map((game) => (
            <GameBadge key={game} name={game} />
          ))}
        </div>
      </div>
    </article>
  );
}