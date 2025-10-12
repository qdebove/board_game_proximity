import './globals.css';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { ReactNode } from 'react';
import { QueryProvider } from '@/providers/query-provider';
import { ToastProvider } from '@/components/ui/use-toast';
import { PwaProvider } from '@/providers/pwa-provider';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: {
    default: 'TableRonde',
    template: '%s | TableRonde',
  },
  description: 'Trouvez et organisez des sessions de jeux de société près de chez vous.',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-slate-50 text-slate-900', GeistSans.variable)}>
        <QueryProvider>
          <ToastProvider>
            <PwaProvider />
            {children}
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}