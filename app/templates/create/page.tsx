"use client"

import { useState, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Toast } from "@/components/ui/toast"
import { Save, Eye, Upload, Download, Undo, Redo } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function EmailTemplateEditor() {
  const emailEditorRef = useRef<EditorRef | null>(null)
  const [templateName, setTemplateName] = useState<string>("")
  const [previewMode, setPreviewMode] = useState<boolean>(false)
  const [jsonData, setJsonData] = useState<string>("")
  const { toast } = useToast()

  const onReady: EmailEditorProps['onReady'] = useCallback((unlayer: { addEventListener: (arg0: string, arg1: () => void) => void }) => {
    // You can listen to any event using unlayer.addEventListener('event', callback)
    unlayer.addEventListener('design:updated', () => {
      console.log('Design updated')
    })
  }, [])

  const saveDesign = useCallback(() => {
    emailEditorRef.current?.editor?.saveDesign((design: string) => {
      console.log('Design JSON:', design)
      setJsonData(JSON.stringify(design, null, 2))
      toast({
        title: "Design Saved",
        description: "Your email template design has been saved.",
      })
      // Here you would typically send this design to your server
    })
  }, [toast])

  const exportHtml = useCallback(() => {
    emailEditorRef.current?.editor?.exportHtml((data) => {
      const { html } = data
      console.log('HTML Output:', html)
      const blob = new Blob([html], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${templateName || "email-template"}.html`
      a.click()
      URL.revokeObjectURL(url)
      toast({
        title: "Template Exported",
        description: "Your email template has been exported as HTML.",
      })
    })
  }, [templateName, toast])

  const togglePreview = useCallback(() => {
    emailEditorRef.current?.editor?.showPreview({
        device: 'desktop',
        
    })
    setPreviewMode((prev) => !prev)
  }, [])

  const loadDesign = useCallback(() => {
    try {
      const design = JSON.parse(jsonData)
      emailEditorRef.current?.editor?.loadDesign(design)
      toast({
        title: "Design Loaded",
        description: "Your email template design has been loaded.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to load design. Please check your JSON data. ${error}`,
        variant: "destructive",
      })
    }
  }, [jsonData, toast])

  const undoAction = useCallback(() => {
    emailEditorRef.current?.editor?.undo()
  }, [])

  const redoAction = useCallback(() => {
    emailEditorRef.current?.editor?.redo()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 p-4 md:p-6 lg:p-8"
    >
      <h1 className="text-2xl md:text-3xl font-bold">Email Template Editor</h1>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Template Editor</CardTitle>
          <CardDescription>Create your email template using drag and drop</CardDescription>
        </CardHeader>
        <CardContent className=" ">
          <EmailEditor
            ref={emailEditorRef}
            onReady={onReady}
            
            style={{ width: '100%' }}
            options={{
              appearance: {
                theme: 'dark',
              },
            }}
          />
        </CardContent>
        <CardFooter className="flex flex-wrap justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline"><Save className="mr-2 h-4 w-4" /> Save Template</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Template</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <Button onClick={saveDesign}>Save Design</Button>
                <Button onClick={exportHtml}>Export HTML</Button>
              </DialogContent>
            </Dialog>
            <Button onClick={togglePreview}>
              <Eye className="mr-2 h-4 w-4" /> {previewMode ? "Edit" : "Preview"}
            </Button>
            <Button onClick={undoAction}><Undo className="mr-2 h-4 w-4" /> Undo</Button>
            <Button onClick={redoAction}><Redo className="mr-2 h-4 w-4" /> Redo</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Load Design</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Load Design</DialogTitle>
                </DialogHeader>
                <Textarea
                  value={jsonData}
                  onChange={(e) => setJsonData(e.target.value)}
                  placeholder="Paste your JSON design data here"
                  className="min-h-[200px]"
                />
                <Button onClick={loadDesign}>Load Design</Button>
              </DialogContent>
            </Dialog>
            <Button onClick={exportHtml}><Download className="mr-2 h-4 w-4" /> Export HTML</Button>
          </div>
        </CardFooter>
      </Card>
      <Toast />
    </motion.div>
  )
}