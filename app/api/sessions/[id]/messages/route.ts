import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { messages as messagesTable } from '@/lib/db/schema';
import { getCurrentUser } from '@/lib/auth';

const messageSchema = z.object({
  body: z.string().min(1).max(500),
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const json = await request.json();
  const parsed = messageSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [message] = await db
    .insert(messagesTable)
    .values({
      body: parsed.data.body,
      sessionId: id,
      authorId: user.id,
    })
    .returning();

  return NextResponse.json({ message });
}