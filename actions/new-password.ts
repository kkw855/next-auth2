'use server'

import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

import type { ServerResponse } from '@/types'
import { passwordResetTokens, users } from '@/db/schema'
import db from '@/db/db'
import { findUserByEmail } from '@/db/user'
import { findPasswordResetTokenByToken } from '@/db/passwordResetToken'
import { NewPassword } from '@/schemas'

export const newPassword = async (
  values: NewPassword,
  token: string,
): Promise<ServerResponse> => {
  const validateFields = await NewPassword.safeParseAsync(values)

  if (!validateFields.success) {
    return { _tag: 'error', message: 'Invalid fields!' }
  }

  const { password } = validateFields.data

  const existingToken = await findPasswordResetTokenByToken(token)

  if (!existingToken) {
    return { _tag: 'error', message: 'Invalid token!' }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()
  if (hasExpired) {
    return { _tag: 'error', message: 'Token has expired!' }
  }

  const existingUser = await findUserByEmail(existingToken.email)
  if (!existingUser) {
    return { _tag: 'error', message: 'Email does not exist!' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await db
    .update(users)
    .set({
      password: hashedPassword,
    })
    .where(eq(users.id, existingUser.id))

  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.id, existingToken.id))

  return { _tag: 'success', message: 'Password updated!' }
}
