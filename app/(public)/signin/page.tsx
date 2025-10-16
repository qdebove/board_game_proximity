import { cookies } from 'next/headers';
import Link from 'next/link';

import { EmailSignInForm } from './signin-form';

export default async function SignInPage() {
  const cookieStore = await cookies();
  const csrfCookie = cookieStore.get('next-auth.csrf-token')?.value;
  const csrfToken = csrfCookie?.split('|')[0];

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-3xl bg-white p-8 shadow-sm">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Rejoindre TableRonde</h1>
        <p className="mt-2 text-sm text-slate-500">
          Connectez-vous pour réserver ou organiser des sessions. L’authentification par email est momentanément privilégiée.
        </p>
      </div>
      <EmailSignInForm csrfToken={csrfToken} />
      <div className="space-y-3 text-center text-sm text-slate-500">
        <p>Les connexions sociales seront bientôt disponibles.</p>
        <Link href="/" className="text-brand-700 hover:text-brand-900">
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
}
