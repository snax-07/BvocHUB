"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FileText, Download, Eye, Loader2, Upload } from "lucide-react"
import { useSession } from "next-auth/react"
import axios from "axios"
import { useRouter } from "next/navigation"

type doc = {
  title: string
  description: string
  url: string
  size: string
  uploader: string
  createdAt: Date
}

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState("")
  const [documents, setDocuments] = useState<doc[]>([])
  const [loading, setLoading] = useState(true) // Track loading state
  const router = useRouter()
  const getDoc = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/v1/snatch/getDoc')
      setDocuments(response.data.docs)
    } catch (error) {
      console.error("Error fetching documents:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDoc()
  }, [])

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-black px-4 py-12">
      {/* Background effects */}
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute top-60 -left-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white md:text-4xl">Document Library</h1>
            <p className="mt-2 text-zinc-400">Browse and access all available documents</p>
          </div>

          <div className="relative gap-2 flex mb-8">
            <Search className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
            <Input
              type="search"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-zinc-800 basis-4/5 bg-zinc-900/80 pl-10 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500"
            />

<Button
            type="submit"
            onClick={() => router.push('/documents/uploader')}
            className="w-full h-[2px] rounded-[2px] basis-1/5  bg-gradient-to-r from-blue-600 to-blue-600 py-5 font-medium text-xs hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
          >
           
                <Upload className="mr-2 h-2 w-2" />
                Upload Document
            
          </Button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            {/* Loading Spinner with Text */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center gap-4">
                  <Loader2 />
                  <span className="text-white text-xl">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800 text-left">
                      <th className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-400">Name</th>
                      <th className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-400">Type</th>
                      <th className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-400">Size</th>
                      <th className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-400">Date</th>
                      <th className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map((doc) => (
                      <motion.tr
                        key={doc.title}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="border-b border-zinc-800 text-white transition-colors hover:bg-zinc-800/50"
                      >
                        <td className="flex items-center gap-3 whitespace-nowrap px-6 py-4">
                          <FileText className="h-6 w-6 text-blue-500" />
                          <div className="d-flex flex-column">
                            <h3>{doc.title}</h3>
                            <p className="text-xs text-zinc-400">Author : {doc.uploader}</p>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">PDF</td>
                        <td className="whitespace-nowrap px-6 py-4">{doc.size} MB</td>
                        <td className="whitespace-nowrap px-6 py-4">{new Date(doc.createdAt).toDateString()}</td>
                        <td className="flex gap-2 whitespace-nowrap px-6 py-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-zinc-700 hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-400"
                            onClick={() => {
                              window.open(`https://docs.google.com/viewer?url=${doc.url}`, '_blank')
                            }}
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-zinc-700 hover:border-purple-500 hover:bg-purple-500/10 hover:text-purple-400"
                            onClick={async () => {
                              const url = `${doc.url}`
                              const response = await fetch(url)
                              const blob = await response.blob()

                              // Create a link to trigger the download
                              const link = document.createElement("a")
                              link.href = URL.createObjectURL(blob)
                              link.download = `${doc.title}.pdf` // Suggested file name
                              document.body.appendChild(link)
                              link.click()
                              document.body.removeChild(link)
                            }}
                          >
                            <Download className="mr-1 h-4 w-4" />
                            Download
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* No documents found */}
            {filteredDocuments.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-zinc-600" />
                <h3 className="mt-4 text-xl font-medium text-white">No documents found</h3>
                <p className="mt-2 text-zinc-400">Try adjusting your search query</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
