'use server'

import { safeParseAsync } from 'valibot'
import bcrypt from 'bcryptjs'

import { Register } from '@/schemas'
import type { ServerResponse } from '@/types'
import { users } from '@/db/schema'
import db from '@/db/db'
import { getUserByEmail } from '@/db/user'
import { findVerificationTokenByEmail } from '@/db/verificationToken'
import { generateVerificationToken } from '@/lib/token'
import {sendVerificationEmail} from "@/lib/email";

// Next Server Action: 비동기 함수로 만들어야 함, 오직 HTTP POST method 만 사용
export const register = async (values: Register): Promise<ServerResponse> => {
  const validateFields = await safeParseAsync(Register, values)

  // 유효성 검사
  if (!validateFields.success) return { _tag: 'error', message: 'Invalid fields!' }

  const { name, email, password } = validateFields.output

  // Email 중복 체크
  const existingUser = await getUserByEmail(email)

  if (existingUser) return { _tag: 'error', message: 'Email already in use!' }

  // 비밀번호 암호화
  const hashedPassword = await bcrypt.hash(password, 10)

  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  })

  // 토큰 생성해서 DB 저장
  const verificationToken = await generateVerificationToken(email)
  await sendVerificationEmail(verificationToken.email, verificationToken.token)
  return { _tag: 'success', message: 'Confirmation email sent!' }
}
