"use server"

import { eq } from "drizzle-orm"

import bcrypt from "bcrypt"
import { revalidatePath } from "next/cache"
import { actionClient } from "@/lib/safe-action"
import { SettingsSchema } from "../schemas/settings-schema"
import { auth } from "@/lib/auth/auth"
import { db } from "@/lib/db/db"
import { users } from "@/lib/db/schema"

export const settings = actionClient
  .schema(SettingsSchema)
  .action(async ({ parsedInput: values }) => {
    const user = await auth()

    if (!user) {
      return { error: "User not found" }
    }

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.user.id),
    })
    if (!dbUser) {
      return { error: "User not found" }
    }

    if (user.user.isOAuth) {
      values.email = undefined
      values.password = undefined
      values.newPassword = undefined
      values.isTwoFactorEnabled = undefined
    }

    if (values.password && values.newPassword && dbUser.password) {
      const passwordMatch = await bcrypt.compare(values.password, dbUser.password)
      if (!passwordMatch) {
        return { error: "Password does not match" }
      }

      const samePassword = await bcrypt.compare(
        values.newPassword,
        dbUser.password
      )
      if (samePassword) {
        return { error: "New password is the same as the old password" }
      }

      const hashedPassword = await bcrypt.hash(values.newPassword, 10)
      values.password = hashedPassword
      values.newPassword = undefined
    }

    // const updatedUser = await db
    //   .update(users)
    //   .set({
    //     twoFactorEnabled: values.isTwoFactorEnabled,
    //     name: values.name,
    //     email: values.email,
    //     password: values.password,
    //     image: values.image,
    //   })
    //   .where(eq(users.id, dbUser.id))

    try {
      await db
        .update(users)
        .set({
          name: values.name,
          email: values.email,
          password: values.password,
          image: values.image,
          twoFactorEnabled: values.isTwoFactorEnabled, // Update the 2FA status
        })
        .where(eq(users.id, dbUser.id))

      revalidatePath("/dashboard/settings")

      return { success: "Settings updated" }
    } catch (error) {
      return { error: "Failed to update settings" }
    }
  })
