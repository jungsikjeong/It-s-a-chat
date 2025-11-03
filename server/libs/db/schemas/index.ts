import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { NeonDatabase } from 'drizzle-orm/neon-serverless';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 5 }).notNull(),
  nickname: varchar('nickname', { length: 8 }).notNull().unique(),
  loginId: varchar('loginId', { length: 20 }).notNull().unique(),
  password: varchar('password', { length: 20 }).notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  deletedAt: timestamp('deletedAt'),
});

export const tables = {
  users,
} as const;

export const schemas = {
  ...tables,
} as const;

export type Database = NeonDatabase<typeof schemas>;
export type DbTx = Parameters<Parameters<Database['transaction']>[0]>[0];
