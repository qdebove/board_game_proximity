import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-3xl bg-white p-8 shadow-sm">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Rejoindre TableRonde</h1>
        <p className="mt-2 text-sm text-slate-500">
          Connectez-vous pour réserver ou organiser des sessions. L’authentification par email est momentanément privilégiée.
        </p>
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
        <button
          type="submit"
          className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
        >
          Recevoir un lien magique
        </button>
      </form>
      <div className="space-y-3 text-center text-sm text-slate-500">
        <p>Les connexions sociales seront bientôt disponibles.</p>
        <Link href="/" className="text-brand-700 hover:text-brand-900">
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
}
