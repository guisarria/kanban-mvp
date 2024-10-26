"use server"

import { eq } from "drizzle-orm"

import { generatePasswordResetToken } from "./tokens"
import { sendPasswordResetEmail } from "./email"
import { ResetSchema } from "../schemas/reset-schema"
import { users } from "@/lib/db/schema"
import { actionClient } from "@/lib/safe-action"
import { db } from "@/lib/db/db"


export const reset = actionClient
  .schema(ResetSchema)
  .action(async ({ parsedInput: { email } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    })
    if (!existingUser) {
      return { error: "User not found" }
    }

    const passwordResetToken = await generatePasswordResetToken(email)
    if (!passwordResetToken) {
      return { error: "Token not generated" }
    }

    await sendPasswordResetEmail(
      passwordResetToken[0].email,
      passwordResetToken[0].token
    )

    return { success: "Reset Email Sent" }
  })
