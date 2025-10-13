import Link from 'next/link';
import { Suspense } from 'react';
import { FilterBar } from '@/components/layout/filter-bar';
import { SessionCard } from '@/components/session/session-card';
import { listUpcomingSessions } from '@/lib/db/queries/sessions';

export default async function HomePage() {
  const sessions = await listUpcomingSessions(9);
  const heroSessions = sessions.slice(0, 3);
  const weekendSessions = sessions.slice(3);

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
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Ce week-end</h2>
          <Link href="/sessions" className="text-sm font-medium text-brand-700 hover:text-brand-900">
            Explorer la carte
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
      </section>
    </div>
  );
}