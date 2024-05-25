'use server'

import { AuthError } from 'next-auth'
import { safeParseAsync } from 'valibot'

import { Login } from '@/schemas'

import { signIn } from '@/auth'

// Server Action
// 비동기 함수로 만들어야 함, 오직 HTTP POST method 만 사용
export const login = async (values: Login) => {
  const validateFields = await safeParseAsync(Login, values)

  if (!validateFields.success) return { _tag: 'error', message: 'Invalid fields! '}

  const { email, password } = validateFields.output

  try {
    // auth.ts credentials authorize 함수를 호출한다.
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    return { _tag: 'success', message: 'Email sent!'}
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          // 이메일 or 비밀번호 틀림
          return { _tag: 'error', message: 'Invalid credentials!' }
      }
    }

    return { _tag: 'error', message: 'Something went wrong!' }
  }
}