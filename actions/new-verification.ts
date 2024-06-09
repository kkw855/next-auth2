'use server'

import {ServerResponse} from "@/types";
import db from "@/db/db";
import {findVerificationTokenByToken} from "@/db/verificationToken";
import {findUserByEmail} from "@/db/user";
import {users, verificationTokens} from "@/db/schema";
import {eq} from "drizzle-orm";

export const newVerification = async (token: string): Promise<ServerResponse> => {
  const existingToken = await findVerificationTokenByToken(token)

  if (!existingToken) {
    return { _tag: 'error', message: 'Token does not exist!' }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()

  if (hasExpired) return { _tag: 'error', message: 'Token has expired!' }

  const existingUser = await findUserByEmail(existingToken.email)

  if (!existingUser) return { _tag: 'error', message: 'Email does not exist!' }

  await db.update(users)
    .set({
      emailVerified: new Date(),
      email: existingToken.email,
    })
    .where(eq(users.id, existingUser.id))

  await db.delete(verificationTokens)
    .where(eq(verificationTokens.id, existingToken.id))

  return { _tag: 'success', message: 'Email verified!'}
}
