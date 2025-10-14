import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

const url = process.env.DATABASE_URL_MIGRATIONS ?? process.env.DATABASE_URL;
if (url == null) {
   throw new Error('DATABASE_URL(_MIGRATIONS) manquante');
}

async function main() {
  // URL "directe" de Neon recommandée ici (sans -pooler). Pas besoin de sslmode/channel_binding.
  const sql = neon(url!);
  const db = drizzle(sql);
  await migrate(db, { migrationsFolder: 'drizzle' });
  console.log('✅ Migrations appliquées via HTTP');
}

main().catch((e) => {
  console.error('❌ Migration échouée', e);
  process.exit(1);
});
