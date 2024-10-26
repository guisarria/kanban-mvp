import Link from "next/link"
import { LogIn } from "lucide-react"

import { auth } from "@/lib/auth/auth"

import { Button } from "../ui/button"
import { ThemeSwitch } from "./theme-switch"
import { UserButton } from "./user-button"

export default async function Nav() {
  const session = await auth()

  return (
    <header className="py-2 w-full border-b border-border px-4">
      <nav className="max-w-6xl mx-auto">
        <ul className="flex justify-between items-center md:gap-8 gap-4">
          <li className="flex flex-1">
            <Link href="/" aria-label="" className="text-lg font-bold">
              Home
            </Link>
          </li>

          {!session ? (
            <li className="flex items-center justify-center gap-x-8">
              <Button variant="secondary" asChild>
                <Link className="flex gap-2" href="/sign-in" prefetch={true}>
                  <LogIn size={16} />
                  <p>Sign In</p>
                </Link>
              </Button>
              <ThemeSwitch />
            </li>
          ) : (
            <li className="flex items-center justify-center">
              <UserButton expires={session?.expires} user={session?.user} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}
