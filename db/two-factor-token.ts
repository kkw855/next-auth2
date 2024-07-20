import { eq } from 'drizzle-orm'

import db from '@/db/db'
import { TwoFactorToken, twoFactorTokens } from '@/db/schema'

export const findTwoFactorTokenByToken = async (
  token: TwoFactorToken['token'],
) => {
  try {
    return await db.query.twoFactorTokens.findFirst({
      where: eq(twoFactorTokens.token, token),
    })
  } catch {
    return null
  }
}

export const findTwoFactorTokenByEmail = async (
  email: TwoFactorToken['email'],
) => {
  try {
    return await db.query.twoFactorTokens.findFirst({
      where: eq(twoFactorTokens.email, email),
    })
  } catch {
    return null
  }
}
