import type { User } from '@/db/schema'
import db from '@/db/db'

export const getUserByEmail = async (email: string): Promise<User | undefined> =>
  await db.query.users.findFirst({
    where: (user, {eq}) => eq(user.email, email),
  })

export const getUserById = async (id: string): Promise<User | undefined> =>
  await db.query.users.findFirst({
    where: (user, {eq}) => eq(user.id, id),
  })