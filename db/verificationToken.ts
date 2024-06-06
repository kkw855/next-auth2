import { type VerificationToken } from '@/db/schema'
import db from '@/db/db'

export const findVerificationTokenByToken = async (token: VerificationToken['token']) => {
  try {
    return await db.query.verificationTokens.findFirst({
      where: (vt, { eq }) => eq(vt.token, token)
    })
  } catch (e) {
    return null
  }
}

export const findVerificationTokenByEmail = async (email: VerificationToken['email']) => {
  try {
    return await db.query.verificationTokens.findFirst({
      where: (vt, { eq }) => eq(vt.email, email)
    })
  } catch (e) {
    return null
  }
}
