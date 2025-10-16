import { Suspense } from 'react';
import { FilterBar } from '@/components/layout/filter-bar';
import { MapCompact } from '@/components/map/map-compact';
import { SessionCard } from '@/components/session/session-card';
import { listUpcomingSessions } from '@/lib/db/queries/sessions';

export const dynamic = 'force-dynamic';

export default async function SessionsPage() {
  const sessions = await listUpcomingSessions();
  const points = sessions
    .filter((session) => typeof session.latitude === 'number' && typeof session.longitude === 'number')
    .map((session) => ({
      id: session.id,
      title: session.title,
      lat: session.latitude as number,
      lng: session.longitude as number,
      description: session.addressApprox,
      href: `/sessions/${session.id}`,
    }));

  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<div className="text-sm text-slate-500">Chargement des filtres…</div>}>
        <FilterBar />
      </Suspense>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-4">
          {sessions.length > 0 ? (
            sessions.map((session) => <SessionCard key={session.id} session={session} />)
          ) : (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
              Aucune session à afficher pour le moment.
            </p>
          )}
        </div>
        <div className="lg:sticky lg:top-24">
          <div className="space-y-3 rounded-3xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Carte des sessions</h2>
              <span className="text-xs text-slate-500">
                {points.length > 0
                  ? `${points.length} session${points.length > 1 ? 's' : ''} localisée${
                      points.length > 1 ? 's' : ''
                    }`
                  : 'Aucune session géolocalisée'}
              </span>
            </div>
            <MapCompact points={points} className="h-[420px]" scrollWheelZoom={false} />
            {points.length === 0 ? (
              <p className="text-xs text-slate-500">
                Ajoutez une adresse lors de la création d’une session pour l’afficher sur la carte.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}