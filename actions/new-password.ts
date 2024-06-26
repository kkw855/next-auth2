'use server'

import { NewPassword } from '@/schemas'
import { ServerResponse } from '@/types'
import { safeParseAsync } from 'valibot'
import { findPasswordResetTokenByToken } from '@/db/passwordResetToken'
import { findUserByEmail } from '@/db/user'
import bcrypt from 'bcryptjs'
import { passwordResetTokens, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import db from '@/db/db'

export const newPassword = async (
  values: NewPassword,
  token: string,
): Promise<ServerResponse> => {
  const validateFields = await safeParseAsync(NewPassword, values)

  if (!validateFields.success) {
    return { _tag: 'error', message: 'Invalid fields!' }
  }

  const { password } = validateFields.output

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
