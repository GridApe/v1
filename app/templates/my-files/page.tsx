"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { LayoutGrid, List, MoreVertical, Plus } from "lucide-react"

interface File {
  id: string
  name: string
  size: string
  image: string
}

const initialFiles: File[] = [
  { id: "1", name: "My cv1.pdf", size: "234k", image: "https://dummyimage.com/716x480" },
  { id: "2", name: "My cv2.pdf", size: "234k", image: "https://dummyimage.com/716x480" },
  { id: "3", name: "My cv3.pdf", size: "234k", image: "https://dummyimage.com/716x480" },
]

export default function FileManager() {
  const [files, setFiles] = useState<File[]>(initialFiles)
  const [view, setView] = useState<"grid" | "list">("grid")

  const handleAddFolder = () => {
    const newFolder: File = {
      id: String(files.length + 1),
      name: "New Folder",
      size: "",
      image: "",
    }
    setFiles((prev) => [...prev, newFolder])
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Files</h1>
        <Button>Upload</Button>
      </header>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <Select>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="time">Time</SelectItem>
              <SelectItem value="type">Type</SelectItem>
              <SelectItem value="alphabetically">Alphabetically</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Folder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="untitled">Untitled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={() => setView("grid")}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setView("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button className="mb-6" onClick={handleAddFolder}>
        <Plus className="mr-2 h-4 w-4" /> Add New Folder
      </Button>

      <motion.div
        className={`grid gap-4 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}
        layout
      >
        {files.map((file) => (
          <motion.div key={file.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card>
              <CardContent className="p-4">
                {file.image && (
                  <img
                    src={file.image}
                    alt={file.name}
                    className="w-full h-auto object-cover mb-2 rounded"
                    style={{ maxHeight: '150px', objectFit: 'cover' }} // Control the image size
                  />
                )}
                <h3 className="font-semibold truncate">{file.name}</h3>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-sm text-muted-foreground">{file.size}</span>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
