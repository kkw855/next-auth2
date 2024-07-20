import { eq } from 'drizzle-orm'

import db from '@/db/db'
import { TwoFactorConfirmations, twoFactorConfirmations } from '@/db/schema'

export const findTwoFactorConfirmationByUserId = async (
  userId: TwoFactorConfirmations['userId'],
) => {
  try {
    return await db.query.twoFactorConfirmations.findFirst({
      where: eq(twoFactorConfirmations.userId, userId),
    })
  } catch {
    return null
  }
}
