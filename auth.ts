import NextAuth from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'

import db from '@/db/db'
import { users, accounts } from '@/db/schema'

// Auth.js 는 Database, JWT 두 가지 세션 전략을 지원한다. 디폴트는 Database.
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,        // 내가 만든 커스텀 테이블을 대신 사용
    accountsTable: accounts   // 내가 만든 커스텀 테이블을 대신 사용
  }),
  // session: { strategy: 'jwt' }, // Auth.js 가 JWT 세션 전략을 사용하도록 변경한다.
  providers: [],
})