import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { rsvps as rsvpsTable } from '@/lib/db/schema';
import { getCurrentUser } from '@/lib/auth';

const rsvpSchema = z.object({
  note: z.string().optional(),
  willBring: z.string().optional(),
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const json = await request.json();
  const parsed = rsvpSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [rsvp] = await db
    .insert(rsvpsTable)
    .values({
      sessionId: id,
      userId: user.id,
      note: parsed.data.note ?? null,
      willBring: parsed.data.willBring ?? null,
      status: 'PENDING',
    })
    .onConflictDoUpdate({
      target: [rsvpsTable.sessionId, rsvpsTable.userId],
      set: {
        note: parsed.data.note ?? null,
        willBring: parsed.data.willBring ?? null,
        status: 'PENDING',
        createdAt: new Date(),
      },
    })
    .returning();

  return NextResponse.json({ rsvp });
}