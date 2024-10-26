"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { newVerification } from "../server/tokens"
import { AuthCard } from "./auth-card"
import { FormError } from "./form-error"
import { FormSuccess } from "./form-success"

export const EmailVerificationForm = () => {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const token = useSearchParams().get("token")

  const router = useRouter()

  const handleVerification = useCallback(() => {
    if (success || error) return

    if (!token) {
      setError("No token found")
      return
    }

    newVerification(token).then((data) => {
      if (data.error) {
        setError(data.error)
      }

      if (data.success) {
        setSuccess(data.success)
        router.push("/sign-in")
      }
    })
  }, [])

  useEffect(() => {
    handleVerification()
  }, [])

  return (
    <AuthCard
      backButtonLabel="Back to sign in"
      backButtonHref="/sign-in"
      cardTitle="Verify your account."
    >
      <div className="flex items-center flex-col w-full justify-center">
        <p>{!success && !error ? "Verifying email..." : null}</p>

        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </AuthCard>
  )
}
