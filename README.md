# TableRonde – Board Game Proximity Starter

Base Next.js 15 (App Router) intégrée avec Auth.js, Drizzle ORM et la stack serverless Neon pour connecter les joueurs de jeux de société autour de sessions proches.

## Démarrage rapide

```bash
npm install
npm run db:push
npm run dev
```

### Scripts principaux

- `dev` – lance le serveur Next.js en mode développement.
- `build` – construit l'application pour la production.
- `start` – démarre Next.js en mode production.
- `lint` – exécute ESLint.
- `test` – lance Vitest en mode headless.
- `db:generate` – génère une migration Drizzle à partir du schéma TypeScript.
- `db:migrate` – exécute les migrations Drizzle générées.
- `db:push` – synchronise directement le schéma Drizzle avec votre base Neon/Postgres.

## Configuration

1. Dupliquez `.env.example` en `.env.local` et complétez les variables obligatoires :
   - `DATABASE_URL` (connexion Neon/Postgres serverless).
   - `AUTH_SECRET` et `AUTH_URL` pour Auth.js.
   - `RESEND_API_KEY` et `EMAIL_FROM` pour l'envoi des liens magiques.
   - `NEXT_PUBLIC_APP_URL` et `NEXT_PUBLIC_MAPTILER_API_KEY` pour l'interface et les cartes MapTiler.
2. Installez les dépendances (`npm install`).
3. Appliquez le schéma Drizzle avec `npm run db:push` (ou `npm run db:migrate` si vous gérez des migrations versionnées).
4. Lancez l'application avec `npm run dev`.

## Tech Stack

- **Next.js 15** (App Router, server actions).
- **TypeScript** strict.
- **Tailwind CSS** + shadcn/ui primitives.
- **Auth.js (NextAuth v5)** avec lien magique via **Resend**.
- **Drizzle ORM** + **Neon serverless Postgres**.
- **React Leaflet** + **MapTiler** pour les fonds de carte.
- **TanStack Query** pour la recherche/filtrage.
- **PWA** avec service worker Workbox-lite.
- **Vitest + Testing Library** pour les tests UI/API.

## Structure clé

Voir les sections du code pour les layouts publics, authentifiés, composants UI, routes API et formulaire de création de session.

## Assumptions

- Le schéma Drizzle stocke latitude/longitude sous forme de doubles pour rester compatible avec une éventuelle extension PostGIS.
- Le service worker fournit un cache statique léger ; ajustez Workbox ou next-pwa pour des besoins avancés.
- L'interface s'appuie désormais sur les données issues de la base Postgres via Drizzle (fini les mocks en mémoire).