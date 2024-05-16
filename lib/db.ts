import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { Config, Effect } from 'effect'

const createDrizzle = Effect.gen(function* () {
  // 환경 변수 문제 있으면 런타임 에러 그리고 종료
  const databaseUrl = yield* Config.string('DATABASE_URL')

  const sql = neon(databaseUrl)
  return drizzle(sql)
})

const db = Effect.runSync(createDrizzle)

export default db