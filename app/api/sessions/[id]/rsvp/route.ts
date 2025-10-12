import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const rsvpSchema = z.object({
  note: z.string().optional(),
  willBring: z.string().optional(),
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const json = await request.json();
  const parsed = rsvpSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const rsvp = await prisma.rsvp.upsert({
    where: {
      sessionId_userId: {
        sessionId: params.id,
        userId: user.id,
      },
    },
    update: {
      note: parsed.data.note,
      willBring: parsed.data.willBring,
      status: 'PENDING',
    },
    create: {
      sessionId: params.id,
      userId: user.id,
      note: parsed.data.note,
      willBring: parsed.data.willBring,
    },
  });

  return NextResponse.json({ rsvp });
}