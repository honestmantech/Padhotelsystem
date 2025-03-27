/**
 * Utility functions for file operations in the hotel management system
 */

// Check if code is running in browser environment
export const isBrowser = () => typeof window !== "undefined"

/**
 * Download a file with the given content, filename, and MIME type
 */
export const downloadFile = (content: string | Blob, filename: string, mimeType: string) => {
  if (!isBrowser()) return false

  // Create a blob if content is a string
  const blob = typeof content === "string" ? new Blob([content], { type: mimeType }) : content

  // Create a URL for the blob
  const url = URL.createObjectURL(blob)

  // Create a temporary link element
  const link = document.createElement("a")
  link.href = url
  link.download = filename

  // Append to body, click, and remove
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up the URL
  URL.revokeObjectURL(url)

  return true
}

/**
 * Generate CSV content from an array of objects
 */
export const generateCsvContent = (data: any[], includeHeaders = true) => {
  if (!data || !data.length) return ""

  // Get headers from the first object
  const headers = Object.keys(data[0])

  // Create CSV rows
  const rows = data.map((item) =>
    headers
      .map((header) => {
        // Handle values that need quotes (commas, quotes, newlines)
        const value = item[header]
        const stringValue = value === null || value === undefined ? "" : String(value)

        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      })
      .join(","),
  )

  // Add headers if requested
  if (includeHeaders) {
    rows.unshift(headers.join(","))
  }

  return rows.join("\n")
}

/**
 * Generate a simple PDF content (placeholder)
 * In a real app, you would use a library like jsPDF or pdfmake
 */
export const generatePdfContent = (title: string) => {
  // This is a placeholder. In a real app, you would generate actual PDF content
  return `%PDF-1.4
1 0 obj
<</Type /Catalog /Pages 2 0 R>>
endobj
2 0 obj
<</Type /Pages /Kids [3 0 R] /Count 1>>
endobj
3 0 obj
<</Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 6 0 R>>
endobj
4 0 obj
<</Font <</F1 5 0 R>>>>
endobj
5 0 obj
<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>
endobj
6 0 obj
<</Length 44>>
stream
BT /F1 24 Tf 100 700 Td (${title}) Tj ET
endstream
endobj
xref
0 7
0000000000 65535 f
0000000009 00000 n
0000000056 00000 n
0000000111 00000 n
0000000212 00000 n
0000000250 00000 n
0000000317 00000 n
trailer
<</Size 7 /Root 1 0 R>>
startxref
406
%%EOF`
}

/**
 * Simulate printing a document
 */
export const printDocument = (content: string, title: string) => {
  if (!isBrowser()) return false

  // Create a new window for printing
  const printWindow = window.open("", "_blank")
  if (!printWindow) {
    console.error("Failed to open print window")
    return false
  }

  // Write content to the window
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          .print-content { margin-top: 20px; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print">
          <button onclick="window.print()">Print</button>
          <button onclick="window.close()">Close</button>
        </div>
        <h1>${title}</h1>
        <div class="print-content">${content}</div>
      </body>
    </html>
  `)

  return true
}

/**
 * Handle file upload
 */
export const handleFileUpload = (file: File, onProgress?: (progress: number) => void): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Simulate file upload with progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      if (onProgress) onProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)

        // In a real app, this would be the URL returned from your file storage service
        const fileUrl = `https://example.com/uploads/${file.name}`
        resolve(fileUrl)
      }
    }, 300)
  })
}

/**
 * Format a date string to a more readable format
 */
export const formatDate = (dateString: string) => {
  if (!dateString) return ""

  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  } catch (error) {
    console.error("Error formatting date:", error)
    return dateString
  }
}

/**
 * Format currency
 */
export const formatCurrency = (amount: number, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

