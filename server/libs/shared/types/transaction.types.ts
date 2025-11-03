import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { schemas } from '@/libs/db/schemas';

// ===== TRANSACTION 타입 =====
export type DbTransaction = PostgresJsDatabase<typeof schemas>;
