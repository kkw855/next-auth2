import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { Config, Effect } from 'effect'

import * as schema from '@/db/schema'

const createDrizzle = Effect.gen(function* () {
  // 환경 변수 문제 있으면 런타임 에러 그리고 종료
  const databaseUrl = yield* Config.string('DATABASE_URL')

  // @neondatabase/serverless 드라이버 패키지는 serverless 환경을 지원한다.
  // session or interactive transaction 이 필요하면 drizzle-orm/neon-http(HTTP) 대신 drizzle-orm/neon-serverless(WebSockets) 패키지를 사용한다.
  const sql = neon(databaseUrl)
  return drizzle(sql, { schema })
})

const db = Effect.runSync(createDrizzle)

export default db