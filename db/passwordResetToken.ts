import db from '@/db/db'
import { eq } from 'drizzle-orm'
import { PasswordResetToken } from '@/db/schema'

export const findPasswordResetTokenByToken = async (
  token: PasswordResetToken['token'],
) => {
  try {
    return await db.query.passwordResetTokens.findFirst({
      where: (prt) => eq(prt.token, token),
    })
  } catch (e: unknown) {
    return null
  }
}

export const findPasswordResetTokenByEmail = async (
  email: PasswordResetToken['email'],
) => {
  try {
    return await db.query.passwordResetTokens.findFirst({
      where: (prt) => eq(prt.email, email),
    })
  } catch (e: unknown) {
    return null
  }
}
