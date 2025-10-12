import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { geohashFromCoords } from '@/lib/utils';

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

  const geo = latitude && longitude ? { latitude, longitude } : undefined;
  const geohash = latitude && longitude ? geohashFromCoords({ lat: latitude, lng: longitude }) : addressApprox.slice(0, 12);

  const session = await prisma.session.create({
    data: {
      title,
      description,
      addressApprox,
      geo,
      geohash,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      capacity,
      visibility,
      contributionType,
      contributionNote,
      priceCents: contributionType === 'MONEY' ? priceCents ?? 0 : null,
      host: {
        connect: { id: user.id },
      },
      games: {
        connectOrCreate: games.map((name) => ({
          where: { name },
          create: {
            name,
            category: 'Divers',
            minPlayers: 2,
            maxPlayers: 6,
            durationMin: 60,
          },
        })),
      },
    },
    include: {
      games: true,
    },
  });

  return NextResponse.json({ session });
}