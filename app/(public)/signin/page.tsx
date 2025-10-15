import Link from 'next/link';

import { MagicLinkForm } from './magic-link-form';
import { AUTH_ERROR_MESSAGES, type MagicLinkActionState } from './actions';

function getInitialState(searchParams?: Record<string, string | string[] | undefined>): MagicLinkActionState {
  const error = searchParams?.error;

  if (!error) {
    return { status: 'idle' };
  }

  const errorKey = Array.isArray(error) ? error[0] : error;

  if (!errorKey) {
    return { status: 'idle' };
  }

  return {
    status: 'error',
    message:
      AUTH_ERROR_MESSAGES[errorKey] ??
      'Impossible de finaliser la connexion. Veuillez réessayer ou contacter le support si le problème persiste.',
  };
}

export default function SignInPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const initialState = getInitialState(searchParams);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-3xl bg-white p-8 shadow-sm">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Rejoindre TableRonde</h1>
        <p className="mt-2 text-sm text-slate-500">
          Connectez-vous pour réserver ou organiser des sessions. L’authentification par email est momentanément privilégiée.
        </p>
      </div>
      <MagicLinkForm initialState={initialState} />
      <div className="space-y-3 text-center text-sm text-slate-500">
        <p>Les connexions sociales seront bientôt disponibles.</p>
        <Link href="/" className="text-brand-700 hover:text-brand-900">
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
}
