import crypto from 'crypto'
import { createId } from '@paralleldrive/cuid2'
import { eq } from 'drizzle-orm'

import db from '@/db/db'
import {
  passwordResetTokens,
  PasswordResetToken,
  type VerificationToken,
  type VerificationTokenInsert,
  verificationTokens,
  twoFactorTokens,
} from '@/db/schema'
import { findVerificationTokenByEmail } from '@/db/verificationToken'
import { findPasswordResetTokenByEmail } from '@/db/passwordResetToken'
import { findTwoFactorTokenByEmail } from '@/db/two-factor-token'

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString()
  // TODO: Later change to 15 minutes
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await findTwoFactorTokenByEmail(email)

  if (existingToken) {
    await db
      .delete(twoFactorTokens)
      .where(eq(twoFactorTokens.id, existingToken.id))
  }

  const twoFactorToken = await db
    .insert(twoFactorTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning()

  return twoFactorToken[0]
}

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
