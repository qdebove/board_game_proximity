import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { listUpcomingSessions } from '@/lib/db/queries/sessions';

const searchSchema = z.object({
  games: z.array(z.string().min(1)).optional(),
  visibility: z.enum(['PUBLIC', 'FRIENDS', 'LINK']).optional(),
  limit: z.number().min(1).max(50).optional(),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const json = await request.json();
  const parsed = searchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { games: gameFilters, visibility, limit } = parsed.data;

  const sessions = await listUpcomingSessions(limit);

  const filtered = sessions.filter((session) => {
    if (visibility && session.visibility !== visibility) {
      return false;
    }
    if (gameFilters && !gameFilters.some((game) => session.games.includes(game))) {
      return false;
    }
    return true;
  });

  return NextResponse.json({ sessions: filtered });
}