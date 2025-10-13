import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  contributionTypeEnum,
  gameSessions,
  games,
  rsvps,
  sessionGames,
  sessionStatusEnum,
  visibilityEnum,
} from '@/lib/db/schema';

type ContributionType = (typeof contributionTypeEnum.enumValues)[number];
type Visibility = (typeof visibilityEnum.enumValues)[number];

type GameSessionRecord = typeof gameSessions.$inferSelect;
type SessionGameRecord = typeof sessionGames.$inferSelect;
type GameRecord = typeof games.$inferSelect;
type RsvpRecord = typeof rsvps.$inferSelect;

type GameSessionWithRelations = GameSessionRecord & {
  games: Array<SessionGameRecord & { game: GameRecord | null }>;
  rsvps: RsvpRecord[];
};

export type SessionSummary = {
  id: string;
  title: string;
  games: string[];
  startsAt: string;
  endsAt: string;
  addressApprox: string;
  description: string | null;
  capacity: number;
  attendeesCount: number;
  contribution:
    | { type: 'NONE' }
    | { type: 'MONEY'; priceCents: number }
    | { type: 'ITEMS'; note: string };
  visibility: Visibility;
  status: (typeof sessionStatusEnum.enumValues)[number];
  latitude: number | null;
  longitude: number | null;
};

const mapContribution = (type: ContributionType, priceCents?: number | null, note?: string | null) => {
  if (type === 'MONEY') {
    return { type: 'MONEY', priceCents: priceCents ?? 0 } as const;
  }
  if (type === 'ITEMS') {
    return { type: 'ITEMS', note: note ?? '' } as const;
  }
  return { type: 'NONE' } as const;
};

const serializeSession = (session: GameSessionWithRelations): SessionSummary => {
  const attendeesCount = session.rsvps.filter((entry) => entry.status !== 'DECLINED').length;
  const gamesList = session.games
    .map((entry) => entry.game?.name)
    .filter((name): name is string => Boolean(name));

  return {
    id: session.id,
    title: session.title,
    games: gamesList,
    startsAt: session.startsAt.toISOString(),
    endsAt: session.endsAt.toISOString(),
    addressApprox: session.addressApprox,
    description: session.description ?? null,
    capacity: session.capacity,
    attendeesCount,
    contribution: mapContribution(session.contributionType, session.priceCents, session.contributionNote),
    visibility: session.visibility,
    status: session.status,
    latitude: session.latitude ?? null,
    longitude: session.longitude ?? null,
  };
};

export async function listUpcomingSessions(limit?: number) {
  const sessions = await db.query.gameSessions.findMany({
    orderBy: (table, { asc: orderAsc, desc: orderDesc }) => [orderAsc(table.startsAt), orderDesc(table.createdAt)],
    limit,
    with: {
      games: {
        with: {
          game: true,
        },
      },
      rsvps: true,
    },
  });

  return sessions.map(serializeSession);
}

export async function listLatestSessions(limit: number) {
  const sessions = await db.query.gameSessions.findMany({
    orderBy: (table, { desc: orderDesc }) => [orderDesc(table.createdAt)],
    limit,
    with: {
      games: {
        with: {
          game: true,
        },
      },
      rsvps: true,
    },
  });

  return sessions.map(serializeSession);
}

export async function findSessionsByIds(ids: string[]) {
  if (ids.length === 0) {
    return [];
  }

  const sessions = await db.query.gameSessions.findMany({
    where: (table, { inArray: inArr }) => inArr(table.id, ids),
    with: {
      games: {
        with: {
          game: true,
        },
      },
      rsvps: true,
    },
  });

  return sessions.map(serializeSession);
}

export async function fetchSessionSummary(id: string) {
  const session = await db.query.gameSessions.findFirst({
    where: eq(gameSessions.id, id),
    with: {
      games: {
        with: {
          game: true,
        },
      },
      rsvps: true,
    },
  });

  return session ? serializeSession(session) : null;
}
