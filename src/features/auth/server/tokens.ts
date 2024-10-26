"use server"

import { db } from "@/lib/db/db"
import { emailTokens, users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

const ONE_HOUR_IN_MS = 3600 * 1000;

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.emailTokens.findFirst({
      where: eq(emailTokens.token, email)
    })
    return verificationToken
  } catch {
    return null
  }
}

export const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomUUID()

  const expires = new Date(new Date().getTime() + ONE_HOUR_IN_MS)

  const existingToken = await getVerificationTokenByEmail(email)

  if (existingToken) {
    await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id))
  }

  const verificationToken = await db
    .insert(emailTokens)
    .values({ email, token, expires })
    .returning()
  return verificationToken
}


export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByEmail(token)
  if (!existingToken) return { error: "Token not found" }
  const hasExpired = new Date(existingToken.expires) < new Date()

  if (hasExpired) return { error: "Token has expired" }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, existingToken.email),
  })
  if (!existingUser) return { error: "Email does not exist" }

  await db
    .update(users)
    .set({
      emailVerified: new Date(),
      email: existingToken.email,
    })
    .where(eq(users.id, existingUser.id))

  await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id))
  return { success: "Email Verified" }
}
