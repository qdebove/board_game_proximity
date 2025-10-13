import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { schema } from './schema';

neonConfig.fetchConnectionCache = true;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(connectionString);

export const db: NeonHttpDatabase<typeof schema> = drizzle(sql, { schema, logger: process.env.NODE_ENV === 'development' });
export type DB = typeof db;
export { schema };

