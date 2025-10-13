import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  doublePrecision,
} from 'drizzle-orm/pg-core';

export const visibilityEnum = pgEnum('visibility', ['PUBLIC', 'FRIENDS', 'LINK']);
export const sessionStatusEnum = pgEnum('session_status', ['OPEN', 'FULL', 'CANCELLED', 'DONE']);
export const contributionTypeEnum = pgEnum('contribution_type', ['NONE', 'MONEY', 'ITEMS']);
export const rsvpStatusEnum = pgEnum('rsvp_status', ['PENDING', 'ACCEPTED', 'DECLINED', 'WAITLIST']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('email_verified', { withTimezone: true }),
  image: text('image'),
  homeLocation: jsonb('home_location'),
  radiusKmDefault: integer('radius_km_default').default(10),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const accounts = pgTable(
  'accounts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refreshToken: text('refresh_token'),
    accessToken: text('access_token'),
    expiresAt: integer('expires_at'),
    tokenType: text('token_type'),
    scope: text('scope'),
    idToken: text('id_token'),
    sessionState: text('session_state'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    providerProviderAccountIdKey: uniqueIndex('accounts_provider_provider_account_id_key').on(
      table.provider,
      table.providerAccountId,
    ),
  }),
);

export const authSessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sessionToken: text('session_token').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    sessionTokenKey: uniqueIndex('sessions_session_token_key').on(table.sessionToken),
  }),
);

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { withTimezone: true }).notNull(),
  },
  (table) => ({
    compositePk: primaryKey({ columns: [table.identifier, table.token] }),
  }),
);

export const games = pgTable(
  'games',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    category: text('category').notNull(),
    minPlayers: integer('min_players').notNull(),
    maxPlayers: integer('max_players').notNull(),
    durationMin: integer('duration_min').notNull(),
    thumbnailUrl: text('thumbnail_url'),
    bggId: integer('bgg_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    nameIndex: uniqueIndex('games_name_key').on(table.name),
  }),
);

export const gameSessions = pgTable(
  'game_sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    hostId: uuid('host_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    addressApprox: text('address_approx').notNull(),
    latitude: doublePrecision('latitude'),
    longitude: doublePrecision('longitude'),
    geohash: text('geohash').notNull(),
    startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
    endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
    capacity: integer('capacity').notNull(),
    visibility: visibilityEnum('visibility').default('PUBLIC').notNull(),
    contributionType: contributionTypeEnum('contribution_type').default('NONE').notNull(),
    contributionNote: text('contribution_note'),
    priceCents: integer('price_cents'),
    status: sessionStatusEnum('status').default('OPEN').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    geohashIdx: index('game_sessions_geohash_idx').on(table.geohash),
    startsAtIdx: index('game_sessions_starts_at_idx').on(table.startsAt),
  }),
);

export const sessionGames = pgTable(
  'game_session_games',
  {
    sessionId: uuid('session_id')
      .notNull()
      .references(() => gameSessions.id, { onDelete: 'cascade' }),
    gameId: uuid('game_id')
      .notNull()
      .references(() => games.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.sessionId, table.gameId] }),
  }),
);

export const favoriteGames = pgTable(
  'favorite_games',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    gameId: uuid('game_id')
      .notNull()
      .references(() => games.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.gameId] }),
  }),
);

export const rsvps = pgTable(
  'rsvps',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sessionId: uuid('session_id')
      .notNull()
      .references(() => gameSessions.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: rsvpStatusEnum('status').default('PENDING').notNull(),
    note: text('note'),
    willBring: text('will_bring'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    sessionUserKey: uniqueIndex('rsvps_session_user_key').on(table.sessionId, table.userId),
  }),
);

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id')
    .notNull()
    .references(() => gameSessions.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  body: text('body').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(authSessions),
  favoriteGames: many(favoriteGames),
  hostedSessions: many(gameSessions),
  rsvps: many(rsvps),
  messages: many(messages),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const authSessionsRelations = relations(authSessions, ({ one }) => ({
  user: one(users, { fields: [authSessions.userId], references: [users.id] }),
}));

export const verificationTokensRelations = relations(verificationTokens, ({}) => ({}));

export const gamesRelations = relations(games, ({ many }) => ({
  sessions: many(sessionGames),
  favoritedBy: many(favoriteGames),
}));

export const gameSessionsRelations = relations(gameSessions, ({ one, many }) => ({
  host: one(users, { fields: [gameSessions.hostId], references: [users.id] }),
  games: many(sessionGames),
  rsvps: many(rsvps),
  messages: many(messages),
}));

export const sessionGamesRelations = relations(sessionGames, ({ one }) => ({
  session: one(gameSessions, { fields: [sessionGames.sessionId], references: [gameSessions.id] }),
  game: one(games, { fields: [sessionGames.gameId], references: [games.id] }),
}));

export const favoriteGamesRelations = relations(favoriteGames, ({ one }) => ({
  user: one(users, { fields: [favoriteGames.userId], references: [users.id] }),
  game: one(games, { fields: [favoriteGames.gameId], references: [games.id] }),
}));

export const rsvpsRelations = relations(rsvps, ({ one }) => ({
  session: one(gameSessions, { fields: [rsvps.sessionId], references: [gameSessions.id] }),
  user: one(users, { fields: [rsvps.userId], references: [users.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  session: one(gameSessions, { fields: [messages.sessionId], references: [gameSessions.id] }),
  author: one(users, { fields: [messages.authorId], references: [users.id] }),
}));

export const schema = {
  users,
  accounts,
  authSessions,
  verificationTokens,
  games,
  gameSessions,
  sessionGames,
  favoriteGames,
  rsvps,
  messages,
};
