"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Video, Upload, Key } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

export default function Admin() {
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [documentTitle, setDocumentTitle] = useState("")
  const [videoTitle, setVideoTitle] = useState("")
  const [des , setDes] = useState("");
  const [isUploading, setIsUploading] = useState(false)

  // Hydration fix - ensure hooks run in the same order
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0])
    }
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0])
    }
  }

  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!documentFile) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("title", documentTitle)
      formData.append("file", documentFile)

      const response = await axios.post("/api/v1/upload/document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      toast.success(response.data.message)
      setDocumentTitle("")
      setDocumentFile(null)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred."
      toast.error(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoFile) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("title", videoTitle)
      formData.append("file", videoFile)
      formData.append("des", des)

      const response = await axios.post("/api/v1/upload/video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (!response.data.status) {
        toast.error(response.data.message)
      } else {
        toast.success(response.data.message)
      }

      setVideoTitle("")
      setVideoFile(null)
      setDes("")
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred."
      toast.error(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  if (!mounted) {
    // Return a placeholder component until the client is mounted
    return <div className="min-h-screen bg-black" />
  }

  return (
    <div className="min-h-screen bg-black px-4 py-12">
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
            <h1 className="text-3xl font-bold text-white md:text-4xl">Admin Dashboard</h1>
            <p className="mt-2 text-zinc-400">Upload and manage content</p>
          </div>

          <Tabs defaultValue="documents" className="w-full">
            <TabsList className="mb-8 grid w-full grid-cols-2 rounded-full border border-zinc-800 bg-zinc-900/50 p-1 backdrop-blur-sm">
              <TabsTrigger
                value="documents"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <FileText className="mr-2 h-4 w-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger
                value="videos"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                <Video className="mr-2 h-4 w-4" />
                Videos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="documents">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
                <h2 className="mb-6 text-xl font-bold text-white">Upload Document</h2>

                <form onSubmit={handleDocumentSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="documentTitle" className="text-zinc-400">Document Title</Label>
                    <Input
                      id="documentTitle"
                      value={documentTitle}
                      onChange={(e) => setDocumentTitle(e.target.value)}
                      placeholder="Enter document title"
                      required
                      className="border-zinc-800 bg-zinc-800 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documentDescription" className="text-zinc-400">Description (Optional)</Label>
                    <Textarea
                      id="documentDescription"
                      placeholder="Enter document description"
                      value={des}
                      onChange={(e) => setDes(e.target.value)}
                      className="border-zinc-800 bg-zinc-800 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documentFile" className="text-zinc-400">Document File (PDF)</Label>
                    <div className="flex items-center gap-4">
                      <div className="group relative flex-1 cursor-pointer rounded-lg border-2 border-dashed border-zinc-700 p-6 text-center hover:border-blue-500">
                        <input
                          id="documentFile"
                          type="file"
                          accept=".pdf"
                          onChange={handleDocumentUpload}
                          className="absolute inset-0 cursor-pointer opacity-0"
                          required
                        />
                        <div className="flex flex-col items-center justify-center">
                          <Upload className="h-8 w-8 text-zinc-500 group-hover:text-blue-500" />
                          <p className="mt-2 text-sm font-medium text-zinc-400 group-hover:text-blue-400">
                            {documentFile ? documentFile.name : "Click to upload or drag and drop"}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">PDF (max. 10MB)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isUploading}
                    className="w-full rounded-full bg-gradient-to-r from-blue-600 to-blue-600 py-6 font-medium hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                  >
                    {isUploading ? "Uploading..." : (
                      <>
                        <Upload className="mr-2 h-5 w-5" />
                        Upload Document
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="videos">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
                <h2 className="mb-6 text-xl font-bold text-white">Upload Video</h2>

                <form onSubmit={handleVideoSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="videoTitle" className="text-zinc-400">Video Title</Label>
                    <Input
                      id="videoTitle"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="Enter video title"
                      required
                      className="border-zinc-800 bg-zinc-800 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoDescription" className="text-zinc-400">Description (Optional)</Label>
                    <Textarea
                      id="videoDescription"
                      placeholder="Enter video description"
                      className="border-zinc-800 bg-zinc-800 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoFile" className="text-zinc-400">Video File</Label>
                    <div className="flex items-center gap-4">
                      <div className="group relative flex-1 cursor-pointer rounded-lg border-2 border-dashed border-zinc-700 p-6 text-center hover:border-purple-500">
                        <input
                          id="videoFile"
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="absolute inset-0 cursor-pointer opacity-0"
                          required
                        />
                        <div className="flex flex-col items-center justify-center">
                          <Upload className="h-8 w-8 text-zinc-500 group-hover:text-purple-500" />
                          <p className="mt-2 text-sm font-medium text-zinc-400 group-hover:text-purple-400">
                            {videoFile ? videoFile.name : "Click to upload or drag and drop"}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">MP4, WebM, etc. (max. 500MB)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isUploading}
                    className="w-full rounded-full bg-gradient-to-r from-purple-600 to-purple-600 py-6 font-medium hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                  >
                    {isUploading ? "Uploading..." : (
                      <>
                        <Upload className="mr-2 h-5 w-5" />
                        Upload Video
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
