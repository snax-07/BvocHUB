"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Video, Play } from "lucide-react"
import axios from "axios"
import { useRouter } from "next/navigation"

type video = {
  title: string
  description: string
  url: string
  uplaoder: string
  duration: number
  createdAt: Date
}

export default function Videos() {
  const [searchQuery, setSearchQuery] = useState("")
  const [videos, setVideos] = useState<video[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleVideoClick = (url: string) => {
    router.push(`/videos/watch?url=${url}`)
  }

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    const fractionalSeconds = (seconds % 1).toFixed(3).slice(2)

    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
    const formattedSeconds = Math.floor(seconds) < 10 ? `0${Math.floor(seconds)}` : `${Math.floor(seconds)}`

    return `${hours > 0 ? hours + ':' : ''}${formattedMinutes}:${formattedSeconds}.${fractionalSeconds}`
  }

  const getVideo = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/v1/snatch/getVideo')
      setVideos(response.data.videos)
    } catch (error) {
      console.error("Failed to fetch videos:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getVideo()
  }, [])

  return (
    <div className="min-h-screen bg-black px-4 py-12 relative">
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute top-60 -left-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white md:text-4xl">Video Library</h1>
            <p className="mt-2 text-zinc-400">Access premium video content with your special keys</p>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
            <Input
              type="search"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-zinc-800 bg-zinc-900/80 pl-10 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {!loading &&
              filteredVideos.map((video) => (
                <motion.div
                  key={video.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm h-full"
                >
                  {/* Video Section */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <video
                      src={video.url}
                      muted
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <Button
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600/80 text-white backdrop-blur-sm transition-all hover:bg-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                        onClick={() => handleVideoClick(video.url)}
                      >
                        <Play className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white backdrop-blur-sm">
                      {formatTime(video.duration)}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-white line-clamp-1">{video.title}</h3>
                      <p className="text-xs text-zinc-300 line-clamp-2">{video.description}</p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-zinc-400">
                      <div className="flex items-center">
                        <Play className="mr-1 h-4 w-4 text-purple-500" />
                        Available to watch
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* Loading or No videos found */}
          {loading ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 py-12 text-center backdrop-blur-sm">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
              <h3 className="mt-4 text-xl font-medium text-white">Loading videos...</h3>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 py-12 text-center backdrop-blur-sm">
              <Video className="h-12 w-12 text-zinc-600" />
              <h3 className="mt-4 text-xl font-medium text-white">No videos found</h3>
              <p className="mt-2 text-zinc-400">Try adjusting your search query</p>
            </div>
          ) : null}
        </motion.div>
      </div>
    </div>
  )
}
