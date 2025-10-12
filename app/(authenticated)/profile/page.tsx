import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function ProfilePage() {
  const sessionUser = await getCurrentUser();
  const user = sessionUser
    ? await prisma.user.findUnique({
        where: { id: sessionUser.id },
        include: { favoriteGames: true },
      })
    : null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Préférences</h1>
        <p className="text-sm text-slate-500">Personnalisez vos filtres par défaut et vos jeux favoris.</p>
      </header>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Rayon par défaut</h2>
        <p className="text-sm text-slate-600">Actuel : {user?.radiusKmDefault ?? 10} km</p>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {[1, 5, 10, 25].map((radius) => (
            <button
              key={radius}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 hover:border-brand-300"
            >
              {radius} km
            </button>
          ))}
        </div>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Jeux favoris</h2>
        <p className="text-sm text-slate-500">Ajoutez vos jeux préférés pour les retrouver plus vite.</p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
          {user?.favoriteGames?.length ? (
            user.favoriteGames.map((game) => (
              <span key={game.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {game.name}
              </span>
            ))
          ) : (
            'Aucun jeu favori pour le moment.'
          )}
        </div>
      </section>
    </div>
  );
}