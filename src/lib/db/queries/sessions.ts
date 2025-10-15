import { asc, desc, eq, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  contributionTypeEnum,
  gameSessions,
  games,
  rsvps,
  sessionGames,
  sessionStatusEnum,
  visibilityEnum,
  rsvpStatusEnum,
} from '@/lib/db/schema';

type ContributionType = (typeof contributionTypeEnum.enumValues)[number];
type Visibility = (typeof visibilityEnum.enumValues)[number];

type GameSessionRecord = typeof gameSessions.$inferSelect;
type RsvpStatus = (typeof rsvpStatusEnum.enumValues)[number];

type SessionRelations = {
  games: string[];
  rsvpStatuses: RsvpStatus[];
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

const serializeSession = (session: GameSessionRecord, relations: SessionRelations): SessionSummary => {
  const attendeesCount = relations.rsvpStatuses.filter((status) => status !== 'DECLINED').length;
  const gamesList = relations.games.filter((name): name is string => Boolean(name));

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
  const baseQuery = db
    .select()
    .from(gameSessions)
    .orderBy(asc(gameSessions.startsAt), desc(gameSessions.createdAt));
  const sessions = await (typeof limit === 'number' ? baseQuery.limit(limit) : baseQuery);

  return hydrateSessions(sessions);
}

export async function listLatestSessions(limit: number) {
  const baseQuery = db.select().from(gameSessions).orderBy(desc(gameSessions.createdAt));
  const sessions = await baseQuery.limit(limit);

  return hydrateSessions(sessions);
}

export async function findSessionsByIds(ids: string[]) {
  if (ids.length === 0) {
    return [];
  }

  const sessions = await db
    .select()
    .from(gameSessions)
    .where(inArray(gameSessions.id, ids));

  return hydrateSessions(sessions);
}

export async function fetchSessionSummary(id: string) {
  const session = await db
    .select()
    .from(gameSessions)
    .where(eq(gameSessions.id, id))
    .limit(1);

  if (session.length === 0) {
    return null;
  }

  const [summary] = await hydrateSessions(session);

  return summary ?? null;
}

async function hydrateSessions(sessions: GameSessionRecord[]): Promise<SessionSummary[]> {
  if (sessions.length === 0) {
    return [];
  }

  const sessionIds = sessions.map((session) => session.id);
  const gamesBySession = new Map<string, string[]>();
  const rsvpsBySession = new Map<string, RsvpStatus[]>();

  for (const id of sessionIds) {
    gamesBySession.set(id, []);
    rsvpsBySession.set(id, []);
  }

  const sessionGamesRows = await db
    .select({
      sessionId: sessionGames.sessionId,
      gameName: games.name,
    })
    .from(sessionGames)
    .leftJoin(games, eq(sessionGames.gameId, games.id))
    .where(inArray(sessionGames.sessionId, sessionIds));

  for (const row of sessionGamesRows) {
    if (!row.sessionId) {
      continue;
    }

    if (row.gameName) {
      gamesBySession.get(row.sessionId)?.push(row.gameName);
    }
  }

  const rsvpsRows = await db
    .select({
      sessionId: rsvps.sessionId,
      status: rsvps.status,
    })
    .from(rsvps)
    .where(inArray(rsvps.sessionId, sessionIds));

  for (const row of rsvpsRows) {
    if (!row.sessionId) {
      continue;
    }

    rsvpsBySession.get(row.sessionId)?.push(row.status);
  }

  return sessions.map((session) =>
    serializeSession(session, {
      games: gamesBySession.get(session.id) ?? [],
      rsvpStatuses: rsvpsBySession.get(session.id) ?? [],
    }),
  );
}
