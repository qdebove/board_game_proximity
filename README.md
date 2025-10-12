# TableRonde – Board Game Proximity Starter

Base Next.js 14 (App Router) + Prisma + Tailwind pour connecter les joueurs de jeux de société autour de sessions proches.

## Démarrage rapide

```bash
pnpm install   # ou npm install
pnpm prisma migrate dev --name init
pnpm dev
```

### Scripts principaux

- `dev` – lance le serveur Next.js en mode développement.
- `build` – construit l'application pour la production.
- `start` – démarre Next.js en mode production.
- `lint` – exécute ESLint.
- `test` – lance Vitest en mode headless.

## Configuration

1. Dupliquez `.env.example` en `.env.local` et complétez les variables (NextAuth, providers OAuth, etc.).
2. Installez les dépendances (`pnpm install`).
3. Lancez `pnpm prisma migrate dev` pour appliquer le schéma sur votre base PostgreSQL (SQLite possible via URL `file:./dev.db`).
4. Générez les types Prisma via `pnpm prisma generate` (automatique via `prepare`).

## Tech Stack

- **Next.js 14** (App Router, server actions).
- **TypeScript** strict.
- **Tailwind CSS** + shadcn/ui primitives.
- **NextAuth** (email + OAuth Google/GitHub).
- **Prisma** (PostgreSQL par défaut, SQLite dev).
- **React Leaflet** + OpenStreetMap.
- **TanStack Query** pour la recherche/filtrage.
- **PWA** avec service worker Workbox-lite.
- **Vitest + Testing Library** pour les tests UI/API.

## Structure clé

Voir les sections du code pour les layouts publics, authentifiés, composants UI, routes API et formulaire de création de session.

## Assumptions

- Le schéma Prisma stocke les coordonnées comme JSON pour compatibilité Postgres/SQLite (conversion vers PostGIS possible lors du déploiement).
- Le service worker fournit un cache statique léger ; ajustez Workbox ou next-pwa pour des besoins avancés.
- Les formulaires utilisent des données fictives (mock) en attendant la connexion à de vraies API/serveurs d'emails.