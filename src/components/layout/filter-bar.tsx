'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChipFilter } from '@/components/ui/chip-filter';
import { DateRangeQuick } from '@/components/ui/date-range-quick';
import { MapPin, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

const gameFilters = ['Deck-building', 'Party game', 'Coop', 'Stratégie', 'Familial'];
const radiusFilters = [1, 5, 10, 25];

interface FilterBarProps {
  variant?: 'hero' | 'inline';
}

export function FilterBar({ variant = 'inline' }: FilterBarProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [selectedGame, setSelectedGame] = useState(params.get('category') ?? '');
  const [radius, setRadius] = useState(Number(params.get('radius') ?? 10));
  const [dateRange, setDateRange] = useState(params.get('when') ?? 'weekend');

  const applyFilters = () => {
    const url = new URL(window.location.href);
    if (selectedGame) {
      url.searchParams.set('category', selectedGame);
    } else {
      url.searchParams.delete('category');
    }
    url.searchParams.set('radius', radius.toString());
    url.searchParams.set('when', dateRange);
    router.push(url.pathname + url.search);
  };

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:gap-3 md:p-3',
        variant === 'hero' && 'border-none bg-transparent p-0 shadow-none'
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <ChipFilter
          label="Autour de moi"
          icon={MapPin}
          selected={!params.get('lat')}
          onClick={() => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const url = new URL(window.location.href);
                url.searchParams.set('lat', position.coords.latitude.toString());
                url.searchParams.set('lng', position.coords.longitude.toString());
                router.push(url.pathname + url.search);
              },
              () => {
                alert('Impossible de récupérer votre position.');
              }
            );
          }}
        />
        {gameFilters.map((filter) => (
          <ChipFilter
            key={filter}
            label={filter}
            selected={selectedGame === filter}
            onClick={() => setSelectedGame(selectedGame === filter ? '' : filter)}
          />
        ))}
      </div>
      <div className="flex flex-col gap-3 md:ml-auto md:flex-row md:items-center">
        <DateRangeQuick value={dateRange} onValueChange={setDateRange} />
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Rayon :</span>
          <div className="flex items-center gap-1">
            {radiusFilters.map((value) => (
              <button
                key={value}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                  radius === value ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
                onClick={() => setRadius(value)}
                type="button"
              >
                {value} km
              </button>
            ))}
          </div>
        </div>
        <button
          className="inline-flex items-center justify-center rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          type="button"
          onClick={applyFilters}
        >
          Appliquer
        </button>
      </div>
    </div>
  );
}