'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'

type Video = {
  url: string
  title: string
  description: string
  uploader: string
  createdAt: string
  duration: number
}

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
  const [recommendedVideos, setRecommendedVideos] = useState<Video[]>([])

  const params = useSearchParams()
  const url = params.get('url')

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true) // Make sure the component is mounted before accessing browser APIs.
  }, [])

  useEffect(() => {
    if (!isMounted || !url) return

    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => setDuration(video.duration)
    const handleTimeUpdate = () => setCurrentTime(video.currentTime)

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)

    const fetchVideoData = async () => {
      try {
        const res = await axios.post('/api/v1/snatch/getByUrl', { url })
        const videoData: Video = res.data.video
        setCurrentVideo(videoData)

        const recommendedRes = await axios.get('/api/v1/snatch/getVideo')
        const allVideos: Video[] = recommendedRes.data.videos
        const filteredVideos = allVideos.filter((v) => v.url !== videoData.url)
        setRecommendedVideos(filteredVideos)

        setIsPlaying(false)
        setCurrentTime(0)
        videoRef.current!.currentTime = 0
      } catch (err) {
        console.error('Error loading video data:', err)
      }
    }

    fetchVideoData()

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [url, isMounted])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    video.paused ? video.play() : video.pause()
    setIsPlaying(!video.paused)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    const video = videoRef.current
    if (video) {
      video.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }

  const skipForward = () => {
    const video = videoRef.current
    if (video) video.currentTime = Math.min(video.currentTime + 10, duration)
  }

  const skipBackward = () => {
    const video = videoRef.current
    if (video) video.currentTime = Math.max(video.currentTime - 10, 0)
  }

  const toggleFullscreen = () => {
    const videoContainer = videoRef.current?.parentElement
    if (!videoContainer) return

    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  if (!isMounted) return null // Don't render until mounted to avoid hydration errors.

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-black px-4 py-8">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-60 -left-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="container mx-auto flex gap-8">
          {/* Video Player */}
          <div className="relative flex-1">
            <Link
              href="/videos"
              className="mb-4 inline-flex items-center gap-2 text-lg font-medium text-white hover:text-gray-300"
            >
              <SkipBack className="h-4 w-4" />
              Back to Videos
            </Link>

            <div
              id="video-container"
              className="relative aspect-video overflow-hidden rounded-2xl bg-black"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => isPlaying && setShowControls(false)}
            >
              <video
                ref={videoRef}
                src={currentVideo?.url}
                className="w-full h-full object-contain bg-black"
                onClick={togglePlay}
              />
              <div
                className="absolute inset-0 z-10 cursor-pointer"
                onClick={togglePlay}
                onDoubleClick={toggleFullscreen}
              />
              {showControls && (
                <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col gap-2 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    onValueChange={([newValue]) => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = newValue
                      }
                      setCurrentTime(newValue)
                    }}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between gap-4 text-white">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={skipBackward}
                        className="h-8 w-8 rounded-full hover:bg-black/50"
                      >
                        <SkipBack className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={togglePlay}
                        className="h-10 w-10 rounded-full bg-black/50 hover:bg-black/60"
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={skipForward}
                        className="h-8 w-8 rounded-full hover:bg-black/50"
                      >
                        <SkipForward className="h-5 w-5" />
                      </Button>
                      <span className="ml-2 text-sm">{formatTime(currentTime)} / {formatTime(duration)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleMute}
                            className="h-8 w-8 rounded-full hover:bg-black/50"
                          >
                            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{isMuted ? 'Unmute' : 'Mute'}</TooltipContent>
                      </Tooltip>
                      <Slider
                        value={[volume]}
                        onValueChange={handleVolumeChange}
                        min={0}
                        max={1}
                        step={0.01}
                        className="w-24"
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleFullscreen}
                            className="h-8 w-8 rounded-full hover:bg-black/50"
                          >
                            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Video Details Section */}
            {currentVideo && (
              <div className="mt-6 text-white space-y-2">
                <h2 className="text-2xl font-semibold">{currentVideo.title}</h2>
                <p className="text-sm text-zinc-400">{currentVideo.description}</p>
                <p className="text-sm">Uploader: <span className="text-zinc-300">{currentVideo.uploader}</span></p>
                <p className="text-sm">Date: {new Date(currentVideo.createdAt).toLocaleDateString()}</p>
                <p className="text-sm">Duration: {formatTime(currentVideo.duration)}</p>
              </div>
            )}
          </div>

          {/* Recommended Videos */}
          <div className="flex flex-col gap-8 w-1/3">
            {recommendedVideos.map((video) => (
              <div
                key={video.url}
                className="group relative bg-zinc-900 rounded-xl overflow-hidden shadow-md"
              >
                <Link href={`/videos/watch?url=${video.url}`}>
                  <video
                    src={video.url}
                    muted
                    className="w-full h-48 object-cover"
                  />
                </Link>
                <div className="p-4 text-white space-y-1">
                  <h3 className="text-lg font-semibold line-clamp-1">{video.title}</h3>
                  <p className="text-sm text-zinc-400 line-clamp-2">{video.description}</p>
                  <p className="text-sm">Uploader: <span className="text-zinc-300">{video.uploader}</span></p>
                  <p className="text-sm">Date: {new Date(video.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm">Duration: {formatTime(video.duration)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
