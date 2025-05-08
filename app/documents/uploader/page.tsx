"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Video, Upload, Key } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function page() {
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [documentTitle, setDocumentTitle] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isClient, setIsClient] = useState(false) // State to check if it's client-side
  const router = useRouter()

  useEffect(() => {
    // This will ensure that the component only runs on the client
    setIsClient(true)
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
      router.push('/documents')
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred."
      toast.error(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  if (!isClient) {
    // Prevent rendering the component until it's mounted on the client-side
    return null
  }

  return (
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
  )
}
