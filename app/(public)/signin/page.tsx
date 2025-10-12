import { getProviders } from 'next-auth/react';
import Link from 'next/link';

export default async function SignInPage() {
  const providers = await getProviders();

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-3xl bg-white p-8 shadow-sm">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Rejoindre TableRonde</h1>
        <p className="mt-2 text-sm text-slate-500">Connectez-vous pour réserver ou organiser des sessions.</p>
      </div>
      <form className="flex flex-col gap-4" method="post" action="/api/auth/signin/email">
        <label className="space-y-2 text-left">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            placeholder="vous@example.com"
          />
        </label>
        <button type="submit" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700">
          Recevoir un lien magique
        </button>
      </form>
      <div className="space-y-3">
        <p className="text-xs text-slate-400">Ou continuez avec :</p>
        <div className="grid gap-2">
          {providers &&
            Object.values(providers)
              .filter((provider) => provider.type !== 'email')
              .map((provider) => (
                <Link
                  key={provider.id}
                  href={`/api/auth/signin/${provider.id}`}
                  className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-300"
                >
                  Continuer avec {provider.name}
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}