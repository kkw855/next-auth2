// noinspection ES6UnusedImports

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type JWT } from "next-auth/jwt"
import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { safeParse } from 'valibot'
import bcrypt from 'bcryptjs'

import db from '@/db/db'
import { users, accounts, sessions, verificationTokens, UserRole } from '@/db/schema'
import { Login } from '@/schemas'
import { getUserByEmail, getUserById } from '@/db/user'

declare module 'next-auth' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Session {
    user: {
      role: UserRole
    } & DefaultSession['user'] // To keep the default type
  }
}
declare module 'next-auth/jwt' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface JWT {
    role: UserRole
  }
}

// Auth.js 는 Database, JWT 두 가지 세션 전략을 지원한다. 디폴트는 Database.
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
        const validatedFields = safeParse(Login, credentials)

        if (!validatedFields.success) return null

        const { email, password } = validatedFields.output

        const user = await getUserByEmail(email)

        // 가입하지 않은 사용자
        if (!user) return null

        const passwordMatch = await bcrypt.compare(password, user.password)

        return passwordMatch ? user : null
      }
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/require-await
    async jwt({ token, user }){
      if (!token.sub) return token
      
      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      token.role = existingUser.role

      console.log({ token, user })
      return token
    },
    // jwt 콜백 함수 호출 이후에 session 함수가 호출된다.
    // eslint-disable-next-line @typescript-eslint/require-await
    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      
      session.user.role = token.role

      console.log({ session, token })
      return session
    }
  }
})