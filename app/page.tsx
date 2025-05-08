import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Video } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <div className="relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute top-60 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="container relative z-10 mx-auto flex flex-col items-center justify-center px-4 py-32 text-center">
          <div className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-1 text-sm font-medium">
            Next-Gen Learning Platform
          </div>
          <h1 className="mt-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl">
            Future of Education
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-zinc-400">
            Access premium learning materials with our advanced platform. Documents available for all members, exclusive
            video content unlocked with special access keys.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-lg font-medium transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
            >
              <Link href="/register">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-zinc-700 px-8 py-6 text-lg font-medium backdrop-blur-sm hover:bg-zinc-800/50"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur-sm transition-all hover:border-zinc-700 hover:shadow-[0_0_30px_rgba(124,58,237,0.1)]">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl transition-all group-hover:bg-blue-500/20" />
            <BookOpen className="h-12 w-12 text-blue-500" />
            <h2 className="mt-6 text-2xl font-bold text-white">Document Library</h2>
            <p className="mt-4 text-zinc-400">
              Access our comprehensive collection of PDF documents, research papers, and study materials. Available to
              all registered members.
            </p>
            <Button asChild className="mt-6 rounded-full bg-zinc-800 hover:bg-zinc-700">
              <Link href="/documents">
                Browse Documents
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur-sm transition-all hover:border-zinc-700 hover:shadow-[0_0_30px_rgba(236,72,153,0.1)]">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl transition-all group-hover:bg-purple-500/20" />
            <Video className="h-12 w-12 text-purple-500" />
            <h2 className="mt-6 text-2xl font-bold text-white">Premium Video Content</h2>
            <p className="mt-4 text-zinc-400">
              Unlock exclusive video tutorials and lectures with special access keys. Premium content for serious
              learners.
            </p>
            <Button asChild className="mt-6 rounded-full bg-zinc-800 hover:bg-zinc-700">
              <Link href="/videos">
                Access Videos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
