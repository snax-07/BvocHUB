"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Mail, Lock } from "lucide-react"
import { signIn } from "next-auth/react"
import { error } from "console"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function Login() {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  })
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter();
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    const response = await signIn("credentials", {
      email : formState.email,
      password : formState.password,
      redirect : false,
    })
    if(response?.error) toast.error("Invalid Credentails !")
    else {
  toast.success("User logged in Successfully !") 
   router.push('/documents') 
  } 
  }

  // UseEffect to ensure component only renders on the client side to avoid hydration errors
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null // Prevent rendering until component is mounted

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-black px-4 py-12">
      {/* Background effects */}
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute top-60 -left-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur-sm"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-zinc-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-400">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formState.email}
                onChange={handleChange}
                required
                className="border-zinc-800 bg-zinc-900 pl-10 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-zinc-400">
                Password
              </Label>
              <Link href="/forgot-password" className="text-sm font-medium text-purple-400 hover:text-purple-300">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formState.password}
                onChange={handleChange}
                required
                className="border-zinc-800 bg-zinc-900 pl-10 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="group w-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 py-6 text-lg font-medium transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
          >
            Sign In
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-400">
          Don't have an account?{" "}
          <Link href="/register" className="font-medium text-purple-400 hover:text-purple-300">
            Register
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
