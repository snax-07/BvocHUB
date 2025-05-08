
import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import { Toaster } from "@/components/ui/sonner"
import { SessionProvider } from "next-auth/react"
const inter = Inter({ subsets: ["latin"] })
import { TooltipProvider } from "@radix-ui/react-tooltip"
export const metadata = {
  title: "Future Learning Platform",
  description: "A futuristic learning platform with document and video sections",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-black`}>
        <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="dark">
         <TooltipProvider>
         <Navbar />
          <main>{children}</main>
          <Toaster />
         </TooltipProvider>
        </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
