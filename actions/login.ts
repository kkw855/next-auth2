'use server'

import { AuthError } from 'next-auth'

import { signIn } from '@/auth'
import { findUserByEmail } from '@/db/user'
import { Login } from '@/schemas'
import { generateVerificationToken } from '@/lib/token'
import { sendVerificationEmail } from '@/lib/email'

// Server Action: 비동기 함수로 만들어야 함, only HTTP POST method 만 사용
export const login = async (values: Login) => {
  const validateFields = await Login.safeParseAsync(values)

  if (!validateFields.success)
    return { _tag: 'error', message: 'Invalid fields! ' }

  const { email, password } = validateFields.data

  const existingUser = await findUserByEmail(email)

  // 가입된 사용자가 아니거나 OAuth 로 가입한 사용자(OAuth 는 비밀번호 null)
  if (!existingUser?.password)
    return { _tag: 'error', message: 'Email does not exist!' }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email)

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    )

    return { _tag: 'success', message: 'Confirmation email sent!' }
  }

  try {
    // auth.ts credentials authorize 함수를 호출한다.
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    return { _tag: 'success', message: 'Success' }
  } catch (error) {
    if (error instanceof AuthError) {
      return { _tag: 'error', message: 'Invalid credentials!' }
    }

    return { _tag: 'error', message: 'Something went wrong!' }
  }
}
