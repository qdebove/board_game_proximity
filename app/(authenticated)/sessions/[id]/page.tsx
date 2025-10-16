import { notFound } from 'next/navigation';
import { ContributionPill } from '@/components/ui/contribution-pill';
import { GameBadge } from '@/components/ui/game-badge';
import { MapCompact } from '@/components/map/map-compact';
import { CapacityDots } from '@/components/ui/capacity-dots';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MessageThread } from '@/components/session/message-thread';
import { fetchSessionSummary } from '@/lib/db/queries/sessions';

interface SessionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;
  const session = await fetchSessionSummary(id);
  if (!session) {
    notFound();
  }

  const startDate = new Date(session.startsAt);
  const endDate = new Date(session.endsAt);
  const hasLocation = typeof session.latitude === 'number' && typeof session.longitude === 'number';
  const fallbackLat = 45.76;
  const fallbackLng = 4.84;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold text-slate-900">{session.title}</h1>
            <p className="text-sm text-slate-500">
              {format(startDate, "EEEE d MMMM yyyy HH'h'mm", { locale: fr })} – {format(endDate, "HH'h'mm", { locale: fr })}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span>{session.addressApprox}</span>
            <CapacityDots capacity={session.capacity} taken={session.attendeesCount} />
            <ContributionPill {...session.contribution} />
          </div>
          <div className="flex flex-wrap gap-2">
            {session.games.map((game) => (
              <GameBadge key={game} name={game} />
            ))}
          </div>
          {session.description ? (
            <p className="text-sm text-slate-600">{session.description}</p>
          ) : null}
          <p className="text-sm text-slate-600">
            Adresse exacte partagée après validation de votre participation. Contactez l&rsquo;hôte via la messagerie ci-dessous.
          </p>
          <button className="inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700">
            Demander une place
          </button>
        </div>
        <MessageThread sessionId={session.id} />
      </div>
      <aside className="space-y-4">
        <div className="space-y-3 rounded-3xl bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Localisation approximative</h2>
          <MapCompact
            points={[
              {
                id: session.id,
                title: session.title,
                lat: hasLocation ? (session.latitude as number) : fallbackLat,
                lng: hasLocation ? (session.longitude as number) : fallbackLng,
                description: session.addressApprox,
              },
            ]}
            zoom={13}
            scrollWheelZoom={false}
          />
          <p className="text-xs text-slate-500">
            La position affichée est volontairement approximative. Vous recevrez l’adresse précise après validation par l’hôte.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <h2 className="text-base font-semibold text-slate-900">Contributions souhaitées</h2>
          <p>
            {session.contribution.type === 'ITEMS'
              ? session.contribution.note ?? 'Apporter boissons et snacks.'
              : session.contribution.type === 'MONEY'
              ? 'Participation financière suggérée.'
              : 'Participation libre.'}
          </p>
        </div>
      </aside>
    </div>
  );
}