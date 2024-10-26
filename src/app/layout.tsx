import { Inter } from "next/font/google"

import "./globals.css"

import Nav from "@/components/navigation/nav"
import { ThemeProvider } from "@/components/providers/theme-provider"

export const experimental_ppr = true

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} overflow-hidden antialiased flex-grow mx-auto`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Nav />
          <main className="max-w-7xl mx-auto border-x h-full flex flex-col justify-center">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
