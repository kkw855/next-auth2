/* eslint-disable @typescript-eslint/no-unused-vars */
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols

import { type JWT } from 'next-auth/jwt'
import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { Config, Effect } from 'effect'

import db from '@/db/db'
import {
  users,
  accounts,
  sessions,
  type UserRole,
  twoFactorConfirmations,
} from '@/db/schema'
import { findUserByEmail, findUserById } from '@/db/user'
import { Login } from '@/schemas'
import { findTwoFactorConfirmationByUserId } from '@/db/two-factor-confirmation'

const googleClientId = Effect.runSync(Config.string('GOOGLE_CLIENT_ID'))
const googleSecret = Effect.runSync(Config.string('GOOGLE_CLIENT_SECRET'))
const gitHubClientId = Effect.runSync(Config.string('GITHUB_ID'))
const githubSecret = Effect.runSync(Config.string('GITHUB_SECRET'))

// TODO: 타입스크립트 Augmentation User. 검색하면 아직 잘 지원 안되는 듯
declare module 'next-auth' {
  interface AdapterUser {
    id: string
    name: string
  }
  interface Session {
    user: {
      role: UserRole
    } & DefaultSession['user'] // To keep the default type
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
  }
}

// Auth.js 는 Database, JWT 두 가지 세션 전략을 지원한다. 디폴트는 Database.
// Credential workflow: authorize -> callback signIn
// OAuth workflow: callback signIn -> linkAccount -> jwt -> session ->
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users, // 내가 만든 커스텀 테이블을 대신 사용
    accountsTable: accounts, // 내가 만든 커스텀 테이블을 대신 사용
    sessionsTable: sessions, // Only Database Session 을 사용할 때 필요한 테이블
    // verificationTokensTable: verificationTokens,    // Only Magic Link 프로바이더를 사용할 때 필요한 테이블
  }),
  session: { strategy: 'jwt' }, // Auth.js 가 JWT 세션 전략을 사용하도록 변경한다.
  providers: [
    // Credentials Provider 는 Auth.js 가 JWT 세션 전략을 사용할 때만 사용 가능하다. Database 전략으로 사용 불가능.
    Credentials({
      name: 'credentials',
      authorize: async (credentials /*, req 요청 객체*/) => {
        console.log('credentials authorize()', credentials)
        const validatedFields = Login.safeParse(Login, credentials)

        if (!validatedFields.success) return null

        const { email, password } = validatedFields.data

        const user = await findUserByEmail(email)

        // 가입하지 않은 사용자, 패스워드가 없는 사용자
        if (!user?.password) return null

        const passwordMatch = await bcrypt.compare(password, user.password)

        return passwordMatch ? user : null
      },
    }),
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleSecret,
    }),
    GitHubProvider({
      clientId: gitHubClientId,
      clientSecret: githubSecret,
    }),
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error', // OAuth 로그인 에러 발생했을 때 이동할 페이지(etc 이메일 중복)
  },
  events: {
    async linkAccount({ user }) {
      console.log('events linkAccount()', user)
      await db
        .update(users)
        .set({
          emailVerified: new Date(),
          // TODO: module augment user.id
        })
        .where(eq(users.id, user.id ?? ''))
    },
  },
  callbacks: {
    // Credentials authorize 함수 이후에 호출
    async signIn({ user, account }) {
      console.log('callback signIn()', { user, account })

      // OAuth 는 이메일 인증 없이 로그인 허용
      if (account?.provider !== 'credentials') return true

      const existingUser = await findUserById(user.id ?? '')

      if (!existingUser?.emailVerified) return false

      // 2FA check
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await findTwoFactorConfirmationByUserId(
          existingUser.id,
        )

        console.log(twoFactorConfirmation)

        if (!twoFactorConfirmation) return false

        // Delete two-factor confirmation for next sign-in
        await db
          .delete(twoFactorConfirmations)
          .where(eq(twoFactorConfirmations.id, twoFactorConfirmation.id))
      }

      return true
    },

    async jwt({ token, user }) {
      if (!token.sub) return token

      const existingUser = await findUserById(token.sub)

      if (!existingUser) return token

      token.role = existingUser.role

      console.log('callback jwt()', { token, user })
      return token
    },
    // jwt 콜백 함수 호출 이후에 session 함수가 호출된다.
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub

      session.user.role = token.role

      console.log('callback session()', { session, token })
      return session
    },
  },
})
