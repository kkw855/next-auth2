'use server'

import type { ServerResponse } from '@/types'
import { Reset } from '@/schemas'
import { findUserByEmail } from '@/db/user'
import { generatePasswordResetToken } from '@/lib/token'
import { sendPasswordResetEmail } from '@/lib/email'

export const reset = async (values: Reset): Promise<ServerResponse> => {
  const validateFields = await Reset.safeParseAsync(values)

  if (!validateFields.success) {
    return { _tag: 'error', message: 'Invalid email!' }
  }

  const { email } = validateFields.data
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
