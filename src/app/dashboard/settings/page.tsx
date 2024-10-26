import { redirect } from "next/navigation"
import SettingsCard from "@/features/dashboard/components/settings-card"

import { auth } from "@/lib/auth/auth"

export default async function Settings() {
  const session = await auth()

  if (!session) redirect("/")
  if (session) return <SettingsCard session={session} />
}
