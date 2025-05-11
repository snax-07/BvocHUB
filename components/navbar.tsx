"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession(); // Add status
  const router = useRouter();

  const logout = async () => {
    await signOut();
    router.push('/')
  };

  // Prevent hydration mismatch by not rendering until session is loaded
  if (status === "loading") return null;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
            <div className="absolute inset-0 flex items-center justify-center text-white">B</div>
          </div>
          <span className="text-xl font-bold text-white">Bvoc HUB</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/documents" className="text-sm text-zinc-400 transition-colors hover:text-white">
            Documents
          </Link>
          <Link href="/videos" className="text-sm text-zinc-400 transition-colors hover:text-white">
            Videos
          </Link>

          {session?.user?.name === 'snax' && (
            <Link href="/admin" className="text-sm text-zinc-400 transition-colors hover:text-white">
              Admin
            </Link>
          )}

          {!session?.user && (
            <>
              <Button asChild variant="outline" className="rounded-full border-zinc-700 hover:bg-zinc-800">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button
                asChild
                className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              >
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}

          {session?.user && (
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="flex items-center justify-center md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-b border-zinc-800 bg-black md:hidden"
          >
            <div className="container mx-auto flex flex-col space-y-4 px-4 py-6">
              <Link href="/documents" className="py-2 text-zinc-400 transition-colors hover:text-white" onClick={() => setIsOpen(false)}>
                Documents
              </Link>
              <Link href="/videos" className="py-2 text-zinc-400 transition-colors hover:text-white" onClick={() => setIsOpen(false)}>
                Videos
              </Link>

              {session?.user?.name === 'snax' && (
                <Link href="/admin" className="text-sm text-zinc-400 transition-colors hover:text-white" onClick={() => setIsOpen(false)}>
                  Admin
                </Link>
              )}

              {!session?.user && (
                <div className="flex flex-col gap-3 pt-4">
                  <Button asChild variant="outline" className="w-full rounded-full border-zinc-700">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild className="w-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      Register
                    </Link>
                  </Button>
                </div>
              )}

              {session?.user && (
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
