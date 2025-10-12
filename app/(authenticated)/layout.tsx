import { ReactNode } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/signin');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/sessions" className="text-lg font-semibold text-brand-700">
            TableRonde
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-600">
            <Link href="/sessions" className="hover:text-slate-900">
              Sessions
            </Link>
            <Link href="/sessions/new" className="hover:text-slate-900">
              Créer une session
            </Link>
            <Link href="/profile" className="hover:text-slate-900">
              {user.name ?? user.email}
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto min-h-[calc(100vh-80px)] w-full max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}