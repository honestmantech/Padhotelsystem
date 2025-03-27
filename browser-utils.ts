/**
 * Safely executes browser-specific code
 * @param callback Function to execute in browser environment
 */
export const safelyExecuteInBrowser = (callback: () => void) => {
  if (typeof window !== "undefined") {
    callback()
  }
}

/**
 * Safely handles file downloads
 * @param url URL of the file to download
 * @param filename Name to save the file as
 */
export const downloadFile = (url: string, filename: string) => {
  safelyExecuteInBrowser(() => {
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  })
}

/**
 * Safely triggers the browser's print dialog
 * @param selector Optional CSS selector to print specific content
 */
export const printContent = (selector?: string) => {
  safelyExecuteInBrowser(() => {
    if (selector) {
      // Create a printable version with only the selected content
      const printContent = document.querySelector(selector)
      if (printContent) {
        const printWindow = window.open("", "_blank")
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Print</title>
                <style>
                  body { font-family: Arial, sans-serif; }
                  @media print {
                    body { margin: 0; padding: 20px; }
                  }
                </style>
              </head>
              <body>
                ${printContent.innerHTML}
                <script>
                  window.onload = function() { window.print(); window.close(); }
                </script>
              </body>
            </html>
          `)
          printWindow.document.close()
        }
      }
    } else {
      // Print the current page
      window.print()
    }
  })
}

