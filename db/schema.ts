import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  integer,
  pgEnum,
  unique,
  boolean,
} from 'drizzle-orm/pg-core'
import type { AdapterAccountType } from '@auth/core/adapters'
import { createId } from '@paralleldrive/cuid2'

export const userRoles = pgEnum('userRole', ['ADMIN', 'USER'])
export type UserRole = (typeof userRoles.enumValues)[number]

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  email: text('email')
    .unique() // 같은 이메일의 OAuth 로그인 못 함
    .notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  // not null 로 설정하면 OAuth(Google, Github ...) 기능 동작 안함
  password: text('password'), // Auth.js 에 없는 커스텀 필드 추가
  role: userRoles('role').default('USER').notNull(), // Auth.js 에 없는 커스텀 필드 추가
  isTwoFactorEnabled: boolean('isTwoFactorEnabled').default(false),
  // twoFactorConfirmation:
})
export type User = typeof users.$inferSelect

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }), // 관련 user 삭제되면 같이 삭제
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
)

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken')
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable(
  'verificationToken',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    email: text('email').notNull(),
    token: text('token').unique().notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    unq: unique('vt_unique').on(vt.email, vt.token),
  }),
)
export type VerificationTokenInsert = typeof verificationTokens.$inferInsert
export type VerificationToken = typeof verificationTokens.$inferSelect

export const passwordResetTokens = pgTable(
  'passwordResetToken',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    email: text('email').notNull(),
    token: text('token').unique().notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (prt) => ({
    unq: unique('prt_unique').on(prt.email, prt.token),
  }),
)
export type PasswordResetTokenInsert = typeof passwordResetTokens.$inferInsert
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect

export const twoFactorTokens = pgTable(
  'twoFactorTokens',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    email: text('email').notNull(),
    token: text('token').unique().notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (tft) => ({
    unq: unique('tft_unique').on(tft.email, tft.token),
  }),
)
export type TwoFactorTokenInsert = typeof twoFactorTokens.$inferInsert
export type TwoFactorToken = typeof twoFactorTokens.$inferSelect

export const twoFactorConfirmations = pgTable('twoFactorConfirmation', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text('userId')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
})
export type TwoFactorConfirmationsInsert =
  typeof twoFactorConfirmations.$inferInsert
export type TwoFactorConfirmations = typeof twoFactorConfirmations.$inferSelect
