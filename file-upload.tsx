"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Upload, X, FileText, Check } from "lucide-react"
import { handleFileUpload } from "@/lib/file-utils"

interface FileUploadProps {
  id: string
  label: string
  description?: string
  accept?: string
  maxSize?: number // in MB
  onUpload?: (url: string) => void
}

export function FileUpload({
  id,
  label,
  description,
  accept = "image/*,application/pdf",
  maxSize = 5, // Default 5MB
  onUpload,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: `File size exceeds the maximum limit of ${maxSize}MB.`,
        variant: "destructive",
      })
      return
    }

    setFile(selectedFile)
    setUploadedUrl(null)
  }

  const startUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setProgress(0)

    try {
      const url = await handleFileUpload(file, (progress) => {
        setProgress(progress)
      })

      setUploadedUrl(url)

      toast({
        title: "Upload Successful",
        description: "Your file has been uploaded successfully.",
      })

      if (onUpload) {
        onUpload(url)
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const resetUpload = () => {
    setFile(null)
    setProgress(0)
    setUploadedUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}

      <div className="border rounded-md p-4">
        {!file ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-1">Drag and drop your file here or click to browse</p>
            <p className="text-xs text-muted-foreground mb-4">
              Supports {accept.split(",").join(", ")} up to {maxSize}MB
            </p>
            <Input
              id={id}
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              Select File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              {!isUploading && !uploadedUrl && (
                <Button variant="ghost" size="sm" onClick={resetUpload}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {isUploading && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">Uploading... {progress}%</p>
              </div>
            )}

            {uploadedUrl ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center text-green-600">
                  <Check className="h-4 w-4 mr-2" />
                  <span className="text-sm">Upload complete</span>
                </div>
                <Button variant="outline" size="sm" onClick={resetUpload}>
                  Upload Another
                </Button>
              </div>
            ) : !isUploading ? (
              <Button onClick={startUpload} className="w-full">
                Upload File
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

