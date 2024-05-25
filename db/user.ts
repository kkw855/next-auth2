import type { User } from '@/db/schema'
import db from '@/db/db'

export const getUserByEmail = async (email: string): Promise<User | undefined> =>
  await db.query.users.findFirst({
    where: (user, {eq}) => eq(user.email, email),
  })

// ID 가 Primary key 이기 때문에 속도가 빠르다
export const getUserById = async (id: string): Promise<User | undefined> =>
  await db.query.users.findFirst({
    where: (user, {eq}) => eq(user.id, id),
  })