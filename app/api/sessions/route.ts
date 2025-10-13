import { NextResponse } from 'next/server';
import { z } from 'zod';
import { inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { gameSessions, games as gamesTable, sessionGames as sessionGamesTable } from '@/lib/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { geohashFromCoords } from '@/lib/utils';
import { fetchSessionSummary } from '@/lib/db/queries/sessions';

const sessionPayloadSchema = z.object({
  title: z.string().min(4),
  description: z.string().optional(),
  games: z.array(z.string().min(1)),
  addressApprox: z.string().min(3),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  capacity: z.number().min(2).max(12),
  visibility: z.enum(['PUBLIC', 'FRIENDS', 'LINK']).default('PUBLIC'),
  contributionType: z.enum(['NONE', 'MONEY', 'ITEMS']).default('NONE'),
  contributionNote: z.string().nullable().optional(),
  priceCents: z.number().nullable().optional(),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const json = await request.json();
  const parsed = sessionPayloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const {
    title,
    description,
    games,
    addressApprox,
    latitude,
    longitude,
    startsAt,
    endsAt,
    capacity,
    visibility,
    contributionType,
    contributionNote,
    priceCents,
  } = parsed.data;

  const geohash = latitude && longitude ? geohashFromCoords({ lat: latitude, lng: longitude }) : addressApprox.slice(0, 12);

  const normalizedGameNames = [...new Set(games.map((name) => name.trim()))];

  if (normalizedGameNames.length === 0) {
    return NextResponse.json({ error: 'Au moins un jeu est requis.' }, { status: 400 });
  }

  const existingGames = await db
    .select()
    .from(gamesTable)
    .where(inArray(gamesTable.name, normalizedGameNames));

  const missingGames = normalizedGameNames.filter(
    (name) => !existingGames.some((game) => game.name === name),
  );

  if (missingGames.length > 0) {
    await db
      .insert(gamesTable)
      .values(
        missingGames.map((name) => ({
          name,
          category: 'Divers',
          minPlayers: 2,
          maxPlayers: 6,
          durationMin: 60,
        })),
      )
      .onConflictDoNothing({ target: gamesTable.name });
  }

  const allGames = await db
    .select()
    .from(gamesTable)
    .where(inArray(gamesTable.name, normalizedGameNames));

  const [newSession] = await db
    .insert(gameSessions)
    .values({
      hostId: user.id,
      title,
      description,
      addressApprox,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      geohash,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      capacity,
      visibility,
      contributionType,
      contributionNote: contributionType === 'ITEMS' ? contributionNote ?? null : null,
      priceCents: contributionType === 'MONEY' ? priceCents ?? 0 : null,
    })
    .returning();

  if (!newSession) {
    return NextResponse.json({ error: 'Impossible de créer la session.' }, { status: 500 });
  }

  if (allGames.length > 0) {
    await db
      .insert(sessionGamesTable)
      .values(
        allGames.map((game) => ({
          sessionId: newSession.id,
          gameId: game.id,
        })),
      )
      .onConflictDoNothing({ target: [sessionGamesTable.sessionId, sessionGamesTable.gameId] });
  }

  const session = await fetchSessionSummary(newSession.id);

  return NextResponse.json({ session });
}