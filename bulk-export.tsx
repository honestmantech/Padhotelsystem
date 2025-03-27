"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Download, Loader2 } from "lucide-react"
import { downloadFile, generateCsvContent } from "@/lib/file-utils"

interface BulkExportProps {
  title: string
  description: string
  data: any[]
  fields: { id: string; label: string }[]
  onExport?: (format: string, fields: string[]) => void
}

export function BulkExport({ title, description, data, fields, onExport }: BulkExportProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState("csv")
  const [selectedFields, setSelectedFields] = useState<string[]>(fields.map((field) => field.id))
  const [isOpen, setIsOpen] = useState(false)

  const toggleField = (fieldId: string) => {
    setSelectedFields((prev) => {
      if (prev.includes(fieldId)) {
        return prev.filter((id) => id !== fieldId)
      } else {
        return [...prev, fieldId]
      }
    })
  }

  const selectAllFields = () => {
    setSelectedFields(fields.map((field) => field.id))
  }

  const deselectAllFields = () => {
    setSelectedFields([])
  }

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      toast({
        title: "No Fields Selected",
        description: "Please select at least one field to export.",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    try {
      // Simulate export delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Filter data to only include selected fields
      const filteredData = data.map((item) => {
        const filteredItem: Record<string, any> = {}
        selectedFields.forEach((field) => {
          filteredItem[field] = item[field]
        })
        return filteredItem
      })

      let success = false
      const filename = `${title.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}`

      if (selectedFormat === "csv") {
        const content = generateCsvContent(filteredData)
        success = downloadFile(content, `${filename}.csv`, "text/csv")
      } else if (selectedFormat === "excel") {
        // For Excel, we'll just use CSV with an .xlsx extension for demo
        const content = generateCsvContent(filteredData)
        success = downloadFile(
          content,
          `${filename}.xlsx`,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
      } else if (selectedFormat === "pdf") {
        // In a real app, you would generate a proper PDF
        const content = "PDF export would be implemented here"
        success = downloadFile(content, `${filename}.pdf`, "application/pdf")
      }

      if (success) {
        toast({
          title: "Export Successful",
          description: `${title} has been exported as ${selectedFormat.toUpperCase()}`,
        })

        // Call the onExport callback if provided
        if (onExport) {
          onExport(selectedFormat, selectedFields)
        }

        setIsOpen(false)
      } else {
        throw new Error("Export failed")
      }
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Bulk Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Export Format</Label>
            <RadioGroup value={selectedFormat} onValueChange={setSelectedFormat} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv">CSV</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel">Excel</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf">PDF</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Fields to Export</Label>
              <div className="space-x-2">
                <Button variant="link" size="sm" onClick={selectAllFields} className="h-auto p-0">
                  Select All
                </Button>
                <span className="text-muted-foreground">|</span>
                <Button variant="link" size="sm" onClick={deselectAllFields} className="h-auto p-0">
                  Deselect All
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {fields.map((field) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={selectedFields.includes(field.id)}
                    onCheckedChange={() => toggleField(field.id)}
                  />
                  <Label htmlFor={field.id} className="text-sm">
                    {field.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting || selectedFields.length === 0}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              "Export Data"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

