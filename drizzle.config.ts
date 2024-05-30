import { defineConfig } from 'drizzle-kit'
import { Config, Effect } from 'effect'

import './envConfig'

// 환경 변수 문제 있으면 런타임 에러 그리고 종료
const DATABASE_URL = Effect.runSync(Config.string('DATABASE_URL'))

export default defineConfig({
  dialect: 'postgresql',
  schema: './db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: DATABASE_URL,
  }
})
