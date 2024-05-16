import { pgTable, text } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const users = pgTable('user', {
  id: text('id').$defaultFn(() => createId()),
  name: text('name')
})