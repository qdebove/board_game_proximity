import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export type SessionCardProps = {
  session: {
    id: string;
    title: string;
    games: string[];
    startsAt: string;
    endsAt: string;
    addressApprox: string;
    capacity: number;
    attendeesCount: number;
    contribution:
      | { type: 'NONE' }
      | { type: 'MONEY'; priceCents: number }
      | { type: 'ITEMS'; note: string };
    visibility: 'PUBLIC' | 'FRIENDS' | 'LINK';
  };
  compact?: boolean;
};

const VISIBILITY_LABEL: Record<SessionCardProps['session']['visibility'], string> = {
  PUBLIC: 'Publique',
  FRIENDS: 'Amis',
  LINK: 'Privée (lien)',
};

const visibilityColors: Record<SessionCardProps['session']['visibility'], string> = {
  PUBLIC: 'bg-emerald-100 text-emerald-700',
  FRIENDS: 'bg-blue-100 text-blue-700',
  LINK: 'bg-amber-100 text-amber-700',
};

function formatDateRange(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);

  const startLabel = format(start, "EEEE d MMMM · HH'h'mm", { locale: fr });
  const endLabel = format(end, "HH'h'mm", { locale: fr });

  return `${startLabel} – ${endLabel}`;
}

function formatContribution(contribution: SessionCardProps['session']['contribution']) {
  if (contribution.type === 'MONEY') {
    return `Participation : ${(contribution.priceCents / 100).toFixed(2)} €`;
  }
  if (contribution.type === 'ITEMS') {
    return `À apporter : ${contribution.note}`;
  }
  return 'Aucune participation demandée';
}

export function SessionCard({ session, compact = false }: SessionCardProps) {
  const spotsLeft = Math.max(session.capacity - session.attendeesCount, 0);
  const occupancy = Math.min(Math.round((session.attendeesCount / session.capacity) * 100), 100);

  return (
    <article
      className={cn(
        'rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md',
        compact ? 'p-4' : 'p-6'
      )}
    >
      <header className={cn('flex items-start justify-between gap-4', compact && 'flex-col gap-2')}
      >
        <div>
          <h3 className={cn('font-semibold text-slate-900', compact ? 'text-base' : 'text-lg')}>{session.title}</h3>
          <p className={cn('text-slate-500', compact ? 'text-xs' : 'text-sm')}>{session.addressApprox}</p>
        </div>
        <span
          className={cn(
            'rounded-full px-3 py-1 text-xs font-semibold uppercase',
            visibilityColors[session.visibility]
          )}
        >
          {VISIBILITY_LABEL[session.visibility]}
        </span>
      </header>

      <dl className={cn('mt-4 space-y-3 text-sm', compact && 'space-y-2 text-xs')}
      >
        <div className="flex flex-col gap-1">
          <dt className={cn('font-medium text-slate-700', compact && 'text-xs text-slate-600')}>Horaires</dt>
          <dd className="text-slate-600 capitalize">{formatDateRange(session.startsAt, session.endsAt)}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="font-medium text-slate-700">Jeux prévus</dt>
          <dd className="flex flex-wrap gap-2">
            {session.games.map((game) => (
              <span
                key={game}
                className={cn(
                  'rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700',
                  compact && 'px-2 py-0.5 text-[11px]'
                )}
              >
                {game}
              </span>
            ))}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="font-medium text-slate-700">Participants</dt>
          <dd className={cn('text-slate-600', compact && 'text-xs')}>
            {session.attendeesCount} / {session.capacity} inscrits · {spotsLeft === 0 ? 'Complet' : `${spotsLeft} places restantes`}
          </dd>
          {compact ? null : (
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${occupancy}%` }} aria-hidden />
            </div>
          )}
        </div>
        {compact ? null : (
          <div className="flex flex-col gap-1">
            <dt className="font-medium text-slate-700">Participation</dt>
            <dd className="text-slate-600">{formatContribution(session.contribution)}</dd>
          </div>
        )}
      </dl>
    </article>
  );
}
