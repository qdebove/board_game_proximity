import { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className={cn('text-lg font-semibold text-brand-700')}>
            TableRonde
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/sessions" className="text-slate-600 hover:text-slate-900">
              Sessions
            </Link>
            <Link href="/sessions/new" className="rounded-full bg-brand-600 px-4 py-2 text-white shadow-sm">
              Proposer une session
            </Link>
            <Link href="/signin" className="text-slate-600 hover:text-slate-900">
              Connexion
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 bg-slate-50">{children}</main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} TableRonde.</p>
          <div className="flex gap-3">
            <Link href="/legal" className="hover:text-slate-700">
              Mentions légales
            </Link>
            <Link href="/privacy" className="hover:text-slate-700">
              Confidentialité
            </Link>
            <Link href="/terms" className="hover:text-slate-700">
              CGU
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}