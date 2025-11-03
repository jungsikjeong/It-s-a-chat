import { defineConfig } from 'drizzle-kit';
import { join } from 'path';
import { config } from 'dotenv';

config({ path: join(__dirname, '../../.env'), override: true });
console.log('DATABASE_URL', process.env.DATABASE_URL);

export default defineConfig({
  schema: 'src/libs/db/schema.ts',
  out: 'src/libs/db/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  verbose: true,
});
