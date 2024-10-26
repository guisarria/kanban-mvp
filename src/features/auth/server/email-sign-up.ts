"use server"

import bcrpyt from "bcrypt"
import { SignUpSchema } from "../schemas/sign-up-schema"
import { eq } from "drizzle-orm"
import { users } from "@/lib/db/schema"
import { db } from "@/lib/db/db"
import { actionClient } from "@/lib/safe-action"
import { generateEmailVerificationToken } from "./tokens"
import { sendVerificationEmail } from "./email"

export const emailSignUp = actionClient
  .schema(SignUpSchema)
  .action(async ({ parsedInput: { email, name, password } }) => {
    // Hash password
    const hashedPassword = await bcrpyt.hash(password, 10)

    // Check existing user
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (existingUser) {
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email)
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        )

        return { success: "Email Confirmation resent" }
      }
      return { error: "Email already in use" }
    }

    // Create new user
    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
    })

    const verificationToken = await generateEmailVerificationToken(email)

    await sendVerificationEmail(
      verificationToken[0].email,
      verificationToken[0].token
    )

    return { success: "Confirmation Email Sent!" }
  })
