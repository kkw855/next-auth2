// noinspection ES6UnusedImports

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type JWT } from "next-auth/jwt"
import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { eq } from 'drizzle-orm'
import { safeParse } from 'valibot'
import bcrypt from 'bcryptjs'
import { Config, Effect } from 'effect'

import db from '@/db/db'
import { users, accounts, sessions, verificationTokens, type UserRole } from '@/db/schema'
import { getUserByEmail, getUserById } from '@/db/user'
import { Login } from '@/schemas'

const googleClientId = Effect.runSync(Config.string('GOOGLE_CLIENT_ID'))
const googleSecret = Effect.runSync(Config.string('GOOGLE_CLIENT_SECRET'))
const gitHubClientId = Effect.runSync(Config.string('GITHUB_ID'))
const githubSecret = Effect.runSync(Config.string('GITHUB_SECRET'))

declare global {
  interface User {
    id: string
    name: string
    email: string
    image: string | null
  }
  interface AdapterUser {
    id: string
    name: string
  }
}

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
// credential workflow: authorize -> callback signIn
// OAuth workflow: callback signIn -> linkAccount -> jwt -> session ->
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,                              // 내가 만든 커스텀 테이블을 대신 사용
    accountsTable: accounts,                        // 내가 만든 커스텀 테이블을 대신 사용
    sessionsTable: sessions,                        // Only Database Session 을 사용할 때 필요한 테이블
    verificationTokensTable: verificationTokens,    // Only Magic Link 프로바이더를 사용할 때 필요한 테이블
  }),
  session: { strategy: 'jwt' }, // Auth.js 가 JWT 세션 전략을 사용하도록 변경한다.
  providers: [
    // Credentials Provider 는 Auth.js 가 JWT 세션 전략을 사용할 때만 사용 가능하다. Database 전략으로 사용 불가능.
    Credentials({
      authorize: async (credentials/*, req 요청 객체*/) => {
        console.log('Credentials authorize()')
        const validatedFields = safeParse(Login, credentials)

        if (!validatedFields.success) return null

        const { email, password } = validatedFields.output

        const user = await getUserByEmail(email)

        // 가입하지 않은 사용자, 패스워드가 없는 사용자
        if (!user?.password) return null

        const passwordMatch = await bcrypt.compare(password, user.password)

        return passwordMatch ? user : null
      }
    }),
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleSecret,
    }),
    GitHubProvider({
      clientId: gitHubClientId,
      clientSecret: githubSecret,
    })
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'        // OAuth 로그인 에러 발생했을 때 이동할 페이지(etc 이메일 중복)
  },
  events: {
    async linkAccount({ user }) {
      console.log('events linkAccount()', user)
      await db.update(users).set({
        emailVerified: new Date()
        // TODO: module augment user.id
      }).where(eq(users.id, user.id ?? ''))
    }
  },
  callbacks: {
    async signIn({ user }) {
      console.log('callback signIn()', { user })
      // const existingUser = await getUserById(user.id)
      //
      // if (!existingUser?.emailVerified) return false

      return true
    },

    async jwt({ token, user }){
      if (!token.sub) return token
      
      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      token.role = existingUser.role

      console.log('callback jwt()', { token, user })
      return token
    },
    // jwt 콜백 함수 호출 이후에 session 함수가 호출된다.
    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      
      session.user.role = token.role

      console.log('callback session()', { session, token })
      return session
    }
  }
})