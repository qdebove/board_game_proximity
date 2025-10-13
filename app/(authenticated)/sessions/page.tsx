import { Suspense } from 'react';
import { FilterBar } from '@/components/layout/filter-bar';
import { MapCompact } from '@/components/map/map-compact';
import { SessionCard } from '@/components/session/session-card';
import { mockSessions } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export default function SessionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<div className="text-sm text-slate-500">Chargement des filtres…</div>}>
        <FilterBar />
      </Suspense>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-4">
          {mockSessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
        <div className="lg:sticky lg:top-24">
          <MapCompact
            points={mockSessions.map((session, index) => ({
              id: session.id,
              title: session.title,
              lat: 45.75 + index * 0.01,
              lng: 4.85 + index * 0.01,
            }))}
          />
        </div>
      </div>
    </div>
  );
}