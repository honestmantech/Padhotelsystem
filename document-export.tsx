"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, Download, Loader2 } from "lucide-react"
import { downloadFile, generateCsvContent, generatePdfContent } from "@/lib/file-utils"
import { toast } from "@/components/ui/use-toast"

interface DocumentExportProps {
  documentId: string
  documentName: string
  documentType: "report" | "invoice" | "receipt" | "list"
  data?: any[]
  onExport?: (format: string) => void
}

export function DocumentExport({ documentId, documentName, documentType, data, onExport }: DocumentExportProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<string | null>(null)

  const handleExport = async (format: string) => {
    setIsExporting(true)
    setExportFormat(format)

    try {
      // Simulate export delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      let success = false
      const filename = `${documentName.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}`

      if (format === "pdf") {
        // Generate PDF content
        const content = generatePdfContent(documentName)
        success = downloadFile(content, `${filename}.pdf`, "application/pdf")
      } else if (format === "csv") {
        // Generate CSV content
        const content = data ? generateCsvContent(data) : "No data available"
        success = downloadFile(content, `${filename}.csv`, "text/csv")
      } else if (format === "excel") {
        // For Excel, we'll just use CSV with an .xlsx extension for demo
        const content = data ? generateCsvContent(data) : "No data available"
        success = downloadFile(
          content,
          `${filename}.xlsx`,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
      }

      if (success) {
        toast({
          title: "Export Successful",
          description: `${documentName} has been exported as ${format.toUpperCase()}`,
        })

        // Call the onExport callback if provided
        if (onExport) {
          onExport(format)
        }
      } else {
        throw new Error("Export failed")
      }
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export Failed",
        description: "There was an error exporting your document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
      setExportFormat(null)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting {exportFormat?.toUpperCase()}...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("pdf")} disabled={isExporting}>
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("csv")} disabled={isExporting}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")} disabled={isExporting}>
          <FileText className="mr-2 h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

