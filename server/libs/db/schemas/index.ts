import { relations } from 'drizzle-orm';
import { NeonDatabase } from 'drizzle-orm/neon-serverless';
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const roomTypes = pgEnum('roomTypes', ['public', 'private']);

export const messageTypeEnum = pgEnum('messageTypeEnum', [
  'text',
  'image',
  'audio',
  'video',
  'system',
]);

/**
 * users table 스키마
 */
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

/**
 * rooms table 스키마
 */
export const rooms = pgTable('rooms', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('ownerId')
    .references(() => users.id)
    .notNull(),
  name: varchar('name', { length: 20 }).notNull(),
  type: roomTypes('type').notNull(),
  joinCode: varchar('joinCode', { length: 6 }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  deletedAt: timestamp('deletedAt'),
});

export const roommembers = pgTable('roommembers', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('roomId')
    .references(() => rooms.id)
    .notNull(),
  userId: uuid('userId')
    .references(() => users.id)
    .notNull(), // 참여자
  // last_read_message_id
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  deletedAt: timestamp('deletedAt'),
});

/**
 * messages table 스키마
 */
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('roomId')
    .references(() => rooms.id)
    .notNull(),
  userId: uuid('userId')
    .references(() => users.id)
    .notNull(),
  type: messageTypeEnum('type').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  deletedAt: timestamp('deletedAt'),
});

export const messageeadReceipts = pgTable('messageeadReceipts', {
  id: uuid('id').primaryKey().defaultRandom(),
  messageId: uuid('messageId')
    .references(() => messages.id)
    .notNull(),
  userId: uuid('userId')
    .references(() => users.id)
    .notNull(),
  read_at: timestamp('read_at').notNull().defaultNow(),
});

/**
 * relations
 */
export const usersRelations = relations(users, ({ many }) => ({
  rooms: many(rooms),
}));

export const roomsRelations = relations(rooms, ({ one }) => ({
  owner: one(users, {
    fields: [rooms.ownerId],
    references: [users.id],
  }),
}));

export const roommembersRelations = relations(roommembers, ({ one }) => ({
  room: one(rooms, {
    fields: [roommembers.roomId],
    references: [rooms.id],
  }),
  user: one(users, {
    fields: [roommembers.userId],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  room: one(rooms, {
    fields: [messages.roomId],
    references: [rooms.id],
  }),
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
}));

export const messageeadReceiptsRelations = relations(
  messageeadReceipts,
  ({ one }) => ({
    message: one(messages, {
      fields: [messageeadReceipts.messageId],
      references: [messages.id],
    }),
    user: one(users, {
      fields: [messageeadReceipts.userId],
      references: [users.id],
    }),
  }),
);

export const relationsSchema = {
  usersRelations,
  roomsRelations,
  roommembersRelations,
  messagesRelations,
  messageeadReceiptsRelations,
};

export const tables = {
  users,
} as const;

export const schemas = {
  ...tables,
  ...relationsSchema,
} as const;

export type Database = NeonDatabase<typeof schemas>;
export type DbTx = Parameters<Parameters<Database['transaction']>[0]>[0];
