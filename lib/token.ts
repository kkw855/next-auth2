import { createId } from '@paralleldrive/cuid2'
import { eq } from 'drizzle-orm'

import {
  passwordResetTokens,
  PasswordResetToken,
  type VerificationToken,
  type VerificationTokenInsert,
  verificationTokens,
} from '@/db/schema'
import db from '@/db/db'
import { findVerificationTokenByEmail } from '@/db/verificationToken'
import { findPasswordResetTokenByEmail } from '@/db/passwordResetToken'

export const generatePasswordResetToken = async (
  email: PasswordResetToken['email'],
) => {
  const token = createId()
  const expires = new Date(new Date().getTime() + 3600 * 1000) // 1시간

  const existingToken = await findPasswordResetTokenByEmail(email)

  if (existingToken) {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.email, email))
  }

  const result = await db
    .insert(passwordResetTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning()

  return result[0]
}

export const generateVerificationToken = async (
  email: VerificationToken['email'],
): Promise<VerificationTokenInsert> => {
  const token = createId()
  const expires = new Date(new Date().getTime() + 3600 * 1000) // 1시간

  const existingToken = await findVerificationTokenByEmail(email)

  // 기존 토큰 delete
  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, existingToken.id))
  }

  // 새로운 토큰 insert
  const result = await db
    .insert(verificationTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning()

  return result[0]
}
