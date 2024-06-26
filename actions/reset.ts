'use server'

import { Reset } from '@/schemas'
import { safeParseAsync } from 'valibot'
import { ServerResponse } from '@/types'
import { findUserByEmail } from '@/db/user'
import { generatePasswordResetToken } from '@/lib/token'
import { sendPasswordResetEmail } from '@/lib/email'

export const reset = async (values: Reset): Promise<ServerResponse> => {
  const validateFields = await safeParseAsync(Reset, values)

  if (!validateFields.success) {
    return { _tag: 'error', message: 'Invalid email!' }
  }

  const { email } = validateFields.output
  const existingUser = await findUserByEmail(email)

  if (!existingUser) {
    return { _tag: 'error', message: 'Email not found!' }
  }

  const passwordResetToken = await generatePasswordResetToken(email)
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  )

  return { _tag: 'success', message: 'Reset email sent' }
}
