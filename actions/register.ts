'use server'

import { safeParseAsync } from 'valibot'

import { Register } from '@/schemas'
import type { ServerResponse } from '@/types/response'

// Server Action
// 비동기 함수로 만들어야 함, 오직 HTTP POST method 만 사용
export const register = async (values: Register): Promise<ServerResponse> => {
  const validateFields = await safeParseAsync(Register, values)

  return validateFields.success
    ? { _tag: 'success', message: 'Email sent!' }
    : { _tag: 'error', message: 'Invalid register fields' }
}