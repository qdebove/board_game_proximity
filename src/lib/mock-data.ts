import { addHours } from 'date-fns';
import { SessionCardProps } from '@/components/session/session-card';

const baseDate = new Date();

export const mockSessions: SessionCardProps['session'][] = [
  {
    id: '1',
    title: 'Soirée Catan chez Léa',
    games: ['Catan'],
    startsAt: baseDate.toISOString(),
    endsAt: addHours(baseDate, 3).toISOString(),
    addressApprox: 'Lyon 3e',
    capacity: 4,
    attendeesCount: 2,
    contribution: {
      type: 'ITEMS',
      note: 'Apportez des boissons',
    },
    visibility: 'PUBLIC',
  },
  {
    id: '2',
    title: 'Pandemic Legacy Session',
    games: ['Pandemic Legacy'],
    startsAt: addHours(baseDate, 24).toISOString(),
    endsAt: addHours(baseDate, 27).toISOString(),
    addressApprox: 'Villeurbanne',
    capacity: 5,
    attendeesCount: 3,
    contribution: {
      type: 'MONEY',
      priceCents: 500,
    },
    visibility: 'FRIENDS',
  },
  {
    id: '3',
    title: 'Après-midi Jeux coopératifs',
    games: ['Hanabi', 'The Crew'],
    startsAt: addHours(baseDate, 48).toISOString(),
    endsAt: addHours(baseDate, 52).toISOString(),
    addressApprox: 'Lyon Confluence',
    capacity: 6,
    attendeesCount: 4,
    contribution: {
      type: 'NONE',
    },
    visibility: 'PUBLIC',
  },
  {
    id: '4',
    title: 'Tournoi 7 Wonders Duel',
    games: ['7 Wonders Duel'],
    startsAt: addHours(baseDate, 60).toISOString(),
    endsAt: addHours(baseDate, 64).toISOString(),
    addressApprox: 'Caluire',
    capacity: 8,
    attendeesCount: 8,
    contribution: {
      type: 'MONEY',
      priceCents: 800,
    },
    visibility: 'PUBLIC',
  },
  {
    id: '5',
    title: 'Matinée party games',
    games: ['Just One', 'Dixit'],
    startsAt: addHours(baseDate, 72).toISOString(),
    endsAt: addHours(baseDate, 76).toISOString(),
    addressApprox: 'Vieux Lyon',
    capacity: 10,
    attendeesCount: 7,
    contribution: {
      type: 'ITEMS',
      note: 'Apportez un gâteau',
    },
    visibility: 'PUBLIC',
  },
  {
    id: '6',
    title: 'Legacy du dimanche',
    games: ['Gloomhaven'],
    startsAt: addHours(baseDate, 96).toISOString(),
    endsAt: addHours(baseDate, 102).toISOString(),
    addressApprox: 'Bron',
    capacity: 4,
    attendeesCount: 4,
    contribution: {
      type: 'MONEY',
      priceCents: 300,
    },
    visibility: 'LINK',
  },
];