import Link from 'next/link';
import { Suspense } from 'react';
import { FilterBar } from '@/components/layout/filter-bar';
import { MapCompact } from '@/components/map/map-compact';
import { SessionCard } from '@/components/session/session-card';
import { listUpcomingSessions } from '@/lib/db/queries/sessions';

export default async function HomePage() {
  const sessions = await listUpcomingSessions(9);
  const heroSessions = sessions.slice(0, 3);
  const weekendSessions = sessions.slice(3);
  const mapPoints = sessions
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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <section className="grid gap-6 rounded-3xl bg-white px-6 py-8 shadow-sm md:grid-cols-[1.2fr_1fr] md:px-10 md:py-12">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-sm text-brand-700">
            Trouve ta prochaine partie
          </span>
          <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            Annoncez ou rejoignez une session de jeux de société proche de chez vous.
          </h1>
          <p className="text-lg text-slate-600">
            TableRonde connecte les joueurs passionnés pour des parties conviviales. Filtrez par jeu, date et proximité.
          </p>
          <Suspense fallback={<div className="text-sm text-slate-500">Chargement des filtres…</div>}>
            <FilterBar variant="hero" />
          </Suspense>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl bg-slate-900/90 p-6 text-white">
          <p className="text-sm uppercase tracking-wide text-white/70">Ce soir</p>
          {heroSessions.length > 0 ? (
            heroSessions.map((session) => <SessionCard key={session.id} session={session} compact />)
          ) : (
            <p className="text-sm text-white/80">Aucune session ce soir. Proposez la vôtre !</p>
          )}
          <Link href="/sessions" className="mt-3 text-sm font-medium text-brand-200 hover:text-white">
            Voir toutes les sessions →
          </Link>
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">Ce week-end</h2>
            <Link href="/sessions" className="text-sm font-medium text-brand-700 hover:text-brand-900">
              Voir toutes les sessions
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {weekendSessions.length > 0 ? (
              weekendSessions.map((session) => <SessionCard key={session.id} session={session} />)
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                Encore aucune partie programmée. Soyez le premier à lancer une session !
              </p>
            )}
          </div>
        </div>
        <aside className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">Explorer sur la carte</h2>
            <p className="text-sm text-slate-600">
              Visualisez les prochaines parties autour de vous et rejoignez-les en un clin d’œil.
            </p>
          </div>
          <MapCompact points={mapPoints} className="h-80" scrollWheelZoom={false} />
          <div className="space-y-1 text-sm text-slate-500">
            <p>
              {mapPoints.length > 0
                ? `${mapPoints.length} session${mapPoints.length > 1 ? 's' : ''} localisée${
                    mapPoints.length > 1 ? 's' : ''
                  } près de chez vous.`
                : 'Les prochaines parties géolocalisées apparaîtront ici.'}
            </p>
            <Link href="/sessions" className="font-medium text-brand-700 hover:text-brand-900">
              Ouvrir la carte détaillée
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}