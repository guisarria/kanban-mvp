import Link from "next/link"

import { auth } from "@/lib/auth/auth"

import { UserButton } from "./user-button"

const Nav = async () => {
  const session = await auth()

  if (session)
    return (
      <header className="py-8">
        <nav>
          <ul className="flex justify-between items-center md:gap-8 gap-4">
            <li className="flex flex-1">
              <Link href="/" aria-label="logo">
                oii
              </Link>
            </li>

            <li className="relative flex items-center hover:bg-muted">
              <UserButton expires={session?.expires} user={session?.user} />
            </li>
          </ul>
        </nav>
      </header>
    )
}

export { Nav }
