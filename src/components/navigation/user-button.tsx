"use client"

import { Session } from "next-auth"
import { signOut } from "next-auth/react"

import { Button } from "../ui/button"

const UserButton = ({ user }: Session) => {
  return (
    <div>
      <h1>{user?.email}</h1>
      <Button onClick={() => signOut()}>sign out</Button>
    </div>
  )
}
export { UserButton }
