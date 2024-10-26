"use client"

import * as React from "react"
import { Half2Icon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

export function ThemeSwitch() {
  const { setTheme, theme } = useTheme()

  return (
    <button
      id="theme-toggle"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="flex items-center justify-center transition-opacity duration-300 hover:opacity-90"
    >
      <Half2Icon className="h-[14px] w-[14px] dark:text-[#D4D4D4] text-[#1c1c1c]" />
    </button>
  )
}
