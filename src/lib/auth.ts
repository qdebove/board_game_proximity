import { NextResponse } from 'next/server';

type AuthenticatedUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

const demoUser: AuthenticatedUser = {
  id: 'demo-user',
  name: 'Invité TableRonde',
  email: 'demo@tableronde.fr',
};

export const handlers = {
  async GET() {
    return NextResponse.json({ error: 'Authentification non configurée.' }, { status: 501 });
  },
  async POST() {
    return NextResponse.json({ error: 'Authentification non configurée.' }, { status: 501 });
  },
};

export async function auth() {
  if (process.env.NEXT_PUBLIC_ENABLE_DEMO_AUTH === 'true') {
    return { user: demoUser };
  }
  return { user: null };
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const session = await auth();
  return session.user;
}
